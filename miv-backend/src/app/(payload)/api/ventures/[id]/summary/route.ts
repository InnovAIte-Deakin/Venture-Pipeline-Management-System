/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(_req: Request, { params }: { params: any }) {
  const payload = await getPayload({ config })
  try {
    // 1. Authenticate the caller.
    const { user } = await payload.auth({ headers: _req.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // 2. Every Local API read below runs with overrideAccess:false + the authenticated
    // user, so the collection/field access rules (#77) enforce this instead of a
    // hand-rolled check:
    //   - venture ownership: founderOwnVenturesRead scopes founders to their own venture
    //     (resolved via the founders collection by session email), so a non-owner founder
    //     gets a Forbidden here rather than a manual 403;
    //   - field visibility: staff-only fields (triageTrack/triageRationale) and the
    //     admin-only disability fields (wss.*, disabilityFlag) are stripped automatically
    //     for founders — no manual redaction, and WSS is no longer returned to founders.
    const access = { overrideAccess: false as const, user }

    let venture: any
    try {
      venture = await (payload as any).findByID({ collection: 'ventures', id, ...access })
    } catch (e: any) {
      const forbidden = e?.status === 403 || /forbidden/i.test(e?.message ?? '')
      return Response.json(
        { error: forbidden ? 'Forbidden' : 'Venture not found' },
        { status: forbidden ? 403 : 404 },
      )
    }
    if (!venture) {
      return Response.json({ error: 'Venture not found' }, { status: 404 })
    }

    const agreements = await (payload as any).find({
      collection: 'agreements',
      where: { venture: { equals: id } },
      limit: 10,
      ...access,
    })

    const intakeId = venture.latestIntake
    let intake: any = null
    if (intakeId) {
      // A founder may read their own venture's intake; disability fields are field-stripped.
      try {
        intake = await (payload as any).findByID({ collection: 'onboardingIntakes', id: intakeId, ...access })
      } catch {
        intake = null
      }
    }
    const financials = intake?.financials ?? null

    return Response.json({
      venture,
      latestIntake: intake,
      agreements: agreements.docs,
      financials,
    })
  } catch (e: any) {
    console.error('GET summary error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
