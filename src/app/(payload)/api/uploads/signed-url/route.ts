import crypto from 'crypto'

export async function POST(req: Request) {
  const { fileName, contentType, size } = await req.json() as { fileName: string; contentType: string; size: number }
  if (contentType !== 'application/pdf') return Response.json({ error: 'Only PDF allowed' }, { status: 400 })
  if (size > 10 * 1024 * 1024) return Response.json({ error: 'Max 10MB' }, { status: 400 })
  // Mock presigned URL response
  const key = `${Date.now()}-${crypto.randomUUID()}-${fileName}`
  const url = `https://example-bucket.invalid/uploads/${encodeURIComponent(key)}?signature=mock`
  return Response.json({ url, fields: {}, key, contentType, expiresIn: 300 })
}
