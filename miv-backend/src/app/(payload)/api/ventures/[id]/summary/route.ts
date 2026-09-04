/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  try {
    // 1. Authenticate user
    const { user } = await payload.auth({ headers: _req.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const venture = await (payload as any).findByID({ collection: 'ventures', id })
    if (!venture) {
      return Response.json({ error: 'Venture not found' }, { status: 404 })
    }

    // 2. Access control check
    const isStaff = user.role === 'admin' || user.role === 'miv_analyst'
    const isOwner = venture.founders?.some((f: any) => f.email === user.email)

    if (!isStaff && !isOwner) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const agreements = await (payload as any).find({ collection: 'agreements', where: { venture: { equals: id } }, limit: 10 })
    const intakeId = venture.latestIntake
    const intake = intakeId ? await (payload as any).findByID({ collection: 'onboardingIntakes', id: intakeId }) : null
    const financials = intake?.financials ?? null

    // 3. Clone and apply visibility filtering for non-staff (founder owners)
    const resVenture = { ...venture }
    let resIntake = intake ? { ...intake } : null

    if (!isStaff) {
      // Redact triage track and rationale
      delete resVenture.triageTrack
      delete resVenture.triageRationale
      if (resIntake) {
        delete resIntake.triageTrack
        delete resIntake.triageRationale
      }
    }

    return Response.json({ venture: resVenture, latestIntake: resIntake, agreements: agreements.docs, financials })
  } catch (e: any) {
    console.error('GET summary error:', e)
    return Response.json({ error: e.message }, { status: 404 })
  }
}