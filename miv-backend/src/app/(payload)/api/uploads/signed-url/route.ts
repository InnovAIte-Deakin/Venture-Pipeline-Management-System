import crypto from 'crypto'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  try {
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileName, contentType, size } = await req.json() as { fileName: string; contentType: string; size: number }
    if (contentType !== 'application/pdf') return Response.json({ error: 'Only PDF allowed' }, { status: 400 })
    if (size > 10 * 1024 * 1024) return Response.json({ error: 'Max 10MB' }, { status: 400 })
    // Mock presigned URL response
    const key = `${Date.now()}-${crypto.randomUUID()}-${fileName}`
    const url = `https://example-bucket.invalid/uploads/${encodeURIComponent(key)}?signature=mock`
    return Response.json({ url, fields: {}, key, contentType, expiresIn: 300 })
  } catch (e: any) {
    return Response.json({ error: e.message ?? 'Invalid request' }, { status: 400 })
  }
}

