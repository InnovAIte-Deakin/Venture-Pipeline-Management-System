import { NextRequest } from 'next/server'

/**
 * Detects if the request is from a mobile device based on User-Agent
 * and request headers
 */
export function detectMobileUserAgent(request?: NextRequest | Request): boolean {
  if (!request) return false

  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  
  // Mobile device patterns
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /opera mini/i,
    /mob/i,
    /mobile/i,
    /touch/i,
  ]

  // Check if user agent matches mobile patterns
  return mobilePatterns.some(pattern => pattern.test(userAgent))
}

/**
 * Gets a flag indicating whether the request is from mobile
 * Can be used to optimize data sent to mobile clients
 */
export function getMobileFlag(request?: NextRequest | Request): {
  isMobile: boolean
  userAgent: string
} {
  const userAgent = request?.headers.get('user-agent') || 'unknown'
  const isMobile = detectMobileUserAgent(request)

  return {
    isMobile,
    userAgent,
  }
}

/**
 * Optimizes response data for mobile clients
 * Returns smaller payload with essential fields only
 */
export function optimizeDataForMobile<T extends Record<string, any>>(
  data: T[],
  isMobile: boolean,
  fieldsToKeep?: (keyof T)[]
): T[] | Partial<T>[] {
  if (!isMobile || !data.length) {
    return data
  }

  // If specific fields are provided, keep only those
  if (fieldsToKeep && fieldsToKeep.length > 0) {
    return data.map(item => {
      const optimized: Partial<T> = {}
      fieldsToKeep.forEach(field => {
        optimized[field] = item[field]
      })
      return optimized
    })
  }

  // Otherwise, remove heavy fields commonly found in objects
  return data.map(item => {
    const optimized = { ...item }
    
    // Remove or reduce large nested structures
    const heavyFields = ['description', 'metadata', 'activities', 'documents', 'gedsiMetrics']
    heavyFields.forEach(field => {
      if (field in optimized) {
        delete optimized[field]
      }
    })
    
    return optimized
  })
}
