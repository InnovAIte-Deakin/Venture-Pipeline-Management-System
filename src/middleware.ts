import { NextRequest, NextResponse } from 'next/server'

function getAllowedOrigin(req: NextRequest): string | null {
  const requestOrigin = req.headers.get('origin')
  const envOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
  const allowed = envOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  if (!requestOrigin) return null
  return allowed.includes(requestOrigin) ? requestOrigin : null
}

function buildCorsHeaders(origin: string | null) {
  const headers = new Headers()
  if (origin) headers.set('Access-Control-Allow-Origin', origin)
  // Must be true to allow cookies on cross-origin requests
  headers.set('Access-Control-Allow-Credentials', 'true')
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept',
  )
  headers.set('Vary', 'Origin')
  return headers
}

export function middleware(req: NextRequest) {
  // Apply CORS only to API routes (configured in matcher below)
  const origin = getAllowedOrigin(req)

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: buildCorsHeaders(origin),
    })
  }

  const res = NextResponse.next()
  const headers = buildCorsHeaders(origin)
  headers.forEach((value, key) => res.headers.set(key, value))
  return res
}

export const config = {
  matcher: ['/api/:path*'],
}
