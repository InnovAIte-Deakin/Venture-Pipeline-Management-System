import { NextRequest, NextResponse } from 'next/server'

type RateLimitOptions = {
  key: string
  limit: number
  windowMs: number
}

type RateLimitStore = Map<string, number[]>

declare global {
  var __rateLimitStore: RateLimitStore | undefined
}

export function rateLimit(request: NextRequest, options: RateLimitOptions): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const storeKey = `${options.key}:${ip}`

  // In memory per instance limiter
  // On Vercel this resets on cold starts and is not shared across instances
  const store =
    globalThis.__rateLimitStore || (globalThis.__rateLimitStore = new Map<string, number[]>())

  const now = Date.now()

  const recentRequests = (store.get(storeKey) || []).filter(
    (timestamp) => now - timestamp < options.windowMs,
  )

  if (recentRequests.length >= options.limit) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests',
      },
      { status: 429 },
    )
  }

  recentRequests.push(now)
  store.set(storeKey, recentRequests)

  return null
}
