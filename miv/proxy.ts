import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Paths that do not require authentication. Each entry matches the exact path or a
// child segment (`p` or `p/...`) — NOT a bare prefix, so `/public` never matches
// `/publications`.
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/favicon.ico',
  // Only the build asset subtrees — NOT all of `/_next`. `/_next/data` deliberately
  // routes through the proxy so a protected page's data route can't leak.
  '/_next/static',
  '/_next/image',
  '/static',
  '/assets',
  '/images',
  '/public',
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

/**
 * Payload signs its auth JWTs (HS256) with a key derived from the secret as
 * `crypto.createHash('sha256').update(secret).digest('hex').slice(0, 32)`
 * (payload@3.49.1). We reproduce that here with Web Crypto so it works whether the
 * proxy runs on the Node or Edge runtime — no Node `crypto` import needed.
 *
 * The frontend must be given the SAME secret as the backend, as a SERVER-side env var
 * `PAYLOAD_SECRET` (never NEXT_PUBLIC_*). Verifying locally means we validate the
 * signature and expiry WITHOUT a network round trip to the backend on every navigation.
 */
let cachedKey: Uint8Array | null = null
async function getPayloadJwtKey(): Promise<Uint8Array | null> {
  if (cachedKey) return cachedKey
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) return null
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  cachedKey = new TextEncoder().encode(hex.slice(0, 32))
  return cachedKey
}

/**
 * True when the token is validly SIGNED and UNEXPIRED. This is a cryptographic check,
 * not an authorization or liveness check: it deliberately does NOT call the backend, so
 * it does NOT detect a session that was logged out / revoked before its `exp` (up to the
 * 7-day token lifetime). That's an accepted trade to avoid a round trip per navigation —
 * the backend still 401s revoked tokens on `/backend/api/*`, so protected data stays
 * guarded even though the page shell may render. Fails CLOSED on anything else — missing
 * secret, bad signature, expired, malformed, or an unexpected error.
 */
async function hasValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false
  try {
    const key = await getPayloadJwtKey()
    if (!key) {
      // Misconfiguration — refuse rather than fall open.
      console.error('[proxy] PAYLOAD_SECRET is not set; failing closed for protected routes.')
      return false
    }
    await jwtVerify(token, key, { algorithms: ['HS256'] }) // throws on bad sig or expiry
    return true
  } catch {
    return false
  }
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const token = req.cookies.get('payload-token')?.value
  const authed = await hasValidSession(token)

  // Send verified users away from the auth pages.
  if (authed && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const dashboardUrl = req.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // Public routes and the marketing root are always allowed.
  if (isPublicPath(pathname) || pathname === '/') {
    return NextResponse.next()
  }

  // Protected route: allow only a verified session; otherwise bounce to login.
  if (authed) {
    return NextResponse.next()
  }

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/auth/login'
  const next = pathname + (search || '')
  loginUrl.search = next ? `?next=${encodeURIComponent(next)}` : ''
  return NextResponse.redirect(loginUrl)
}

// Limit middleware to all routes except static assets and API routes by matcher
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|images|public|api|backend).*)',
  ],
}
