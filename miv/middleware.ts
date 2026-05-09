import { NextResponse, type NextRequest } from 'next/server'

// Paths that do not require authentication
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/_next',
  '/favicon.ico',
  '/assets',
  '/public',
]

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith('/api/')) return true // never block Next API routes
  if (pathname.startsWith('/_next')) return true // Next.js internals
  if (pathname.startsWith('/static')) return true
  if (pathname.startsWith('/assets')) return true
  if (pathname.startsWith('/images')) return true
  if (pathname.startsWith('/public')) return true
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Simple cookie presence check
  const token = req.cookies.get('payload-token')?.value
  if (token) {
    // Optionally, redirect authenticated users away from auth pages
    if (pathname === '/auth/login' || pathname === '/auth/register') {
      const dashboardUrl = req.nextUrl.clone()
      dashboardUrl.pathname = '/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }
    return NextResponse.next()
  }else {
    if(pathname === '/'){
      return NextResponse.next()
    }
  }

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/auth/login'
  const next = pathname + (search || '')
  loginUrl.search = next ? `?next=${encodeURIComponent(next)}` : ''
  return NextResponse.redirect(loginUrl)
}

// Limit middleware to all routes except static assets by matcher
export const config = {
  matcher: [
    // Run on all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|assets|images|public|api|backend).*)',
  ],
}
