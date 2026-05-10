import { NextResponse, NextRequest } from 'next/server'

/**
 * Cache control options for different endpoint types
 */
export interface CacheConfig {
  maxAge?: number // in seconds
  sMaxAge?: number // shared cache max age (for CDN)
  staleWhileRevalidate?: number // serve stale while revalidating
  staleIfError?: number // serve stale if error occurs
  isPublic?: boolean // whether cache is public or private
  revalidate?: boolean // whether to revalidate on each request
}

/**
 * Default cache configurations for different types of endpoints
 */
export const CACHE_CONFIGS = {
  // High-traffic, slowly-changing data
  STATIC: {
    maxAge: 300, // 5 minutes
    sMaxAge: 3600, // 1 hour on CDN
    staleWhileRevalidate: 604800, // 1 week
    isPublic: true,
  } as CacheConfig,

  // Analytics and reporting data
  ANALYTICS: {
    maxAge: 600, // 10 minutes
    sMaxAge: 1800, // 30 minutes on CDN
    staleWhileRevalidate: 86400, // 1 day
    isPublic: false,
  } as CacheConfig,

  // Search results (use private cache)
  SEARCH: {
    maxAge: 60, // 1 minute
    sMaxAge: 300, // 5 minutes on CDN
    staleWhileRevalidate: 3600, // 1 hour
    isPublic: false,
  } as CacheConfig,

  // Dynamic user-specific data
  DYNAMIC: {
    maxAge: 0, // Don't cache
    isPublic: false,
    revalidate: true,
  } as CacheConfig,

  // User data and personal content
  PRIVATE: {
    maxAge: 0, // Don't cache
    isPublic: false,
    revalidate: true,
  } as CacheConfig,
}

/**
 * Generates cache control header string
 */
export function generateCacheHeader(config: CacheConfig): string {
  const parts: string[] = []

  if (config.revalidate) {
    parts.push('no-cache')
  } else if (config.maxAge !== undefined) {
    parts.push(`max-age=${config.maxAge}`)
  }

  if (config.sMaxAge !== undefined) {
    parts.push(`s-maxage=${config.sMaxAge}`)
  }

  if (config.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`)
  }

  if (config.staleIfError !== undefined) {
    parts.push(`stale-if-error=${config.staleIfError}`)
  }

  if (config.isPublic) {
    parts.push('public')
  } else {
    parts.push('private')
  }

  return parts.join(', ')
}

/**
 * Sets cache headers on a NextResponse
 */
export function setCacheHeaders(
  response: NextResponse,
  config: CacheConfig
): NextResponse {
  const cacheHeader = generateCacheHeader(config)
  response.headers.set('Cache-Control', cacheHeader)

  // Add ETag for better cache validation
  response.headers.set('Vary', 'Accept-Encoding, User-Agent')

  return response
}

/**
 * Creates a NextResponse with cache headers already set
 */
export function createCachedResponse<T>(
  data: T,
  config: CacheConfig,
  init?: ResponseInit
): NextResponse {
  const response = NextResponse.json(data, init)
  return setCacheHeaders(response, config)
}

/**
 * Checks if request has conditional headers for cache revalidation
 */
export function hasConditionalHeaders(request: NextRequest): boolean {
  return !!(
    request.headers.get('if-none-match') ||
    request.headers.get('if-modified-since') ||
    request.headers.get('if-unmodified-since')
  )
}

/**
 * Returns 304 Not Modified response
 */
export function createNotModifiedResponse(): NextResponse {
  return new NextResponse(null, { status: 304 })
}
