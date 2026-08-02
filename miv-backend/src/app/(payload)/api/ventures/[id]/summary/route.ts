/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  try {
    const { id } = await params
    const venture = await (payload as any).findByID({ collection: 'ventures', id })
    const agreements = await (payload as any).find({ collection: 'agreements', where: { venture: { equals: id } }, limit: 10 })
    const intakeId = venture.latestIntake
    const intake = intakeId ? await (payload as any).findByID({ collection: 'onboardingIntakes', id: intakeId }) : null
    const financials = intake?.financials ?? null
    return Response.json({ venture, latestIntake: intake, agreements: agreements.docs, financials })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 404 })
  }
}