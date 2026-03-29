import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  const payload = await getPayload({ config })
  const lookups = await (payload as any).findGlobal({ slug: 'lookups' })
  return Response.json(lookups)
}
