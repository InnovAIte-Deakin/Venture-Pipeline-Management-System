/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const ctx = await (payload as any).getRequestContext(req)
  const user = ctx?.user as any
  if (!user || (user.role !== 'miv_analyst' && user.role !== 'admin')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { track, rationale } = body as { track: 'fast' | 'slow'; rationale?: string }
  if (!['fast', 'slow'].includes(track)) return Response.json({ error: 'Invalid track' }, { status: 400 })
  const venture = await (payload as any).update({ collection: 'ventures', id, data: { triageTrack: track, triageRationale: rationale } })
  await (payload as any).create({ collection: 'activityLogs', data: { action: 'venture.assignTrack', entity: 'venture', entityId: id, metadata: { track, rationale }, timestamp: new Date().toISOString() } })
  return Response.json({ ok: true, ventureId: venture.id, triageTrack: venture.triageTrack })
}