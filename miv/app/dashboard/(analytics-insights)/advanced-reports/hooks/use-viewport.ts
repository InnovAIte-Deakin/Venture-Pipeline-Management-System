"use client"

import { useEffect, useState } from "react"

/** Matches Tailwind's `lg` breakpoint, mirroring the README's "≥lg desktop / <lg mobile" split. */
const DESKTOP_BREAKPOINT_QUERY = "(min-width: 1024px)"

/**
 * No shared viewport/media-query hook existed anywhere in the repo prior to
 * this refactor (confirmed by search) — this is new, feature-local
 * infrastructure needed to pick a Desktop/Mobile presentation component.
 * Defaults to desktop on first render (matches server render) and corrects
 * after mount, matching common SSR-safe media-query patterns.
 */
export function useViewport(): { isMobile: boolean; isReady: boolean } {
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DESKTOP_BREAKPOINT_QUERY)

    const update = () => {
      setIsMobile(!mediaQueryList.matches)
      setIsReady(true)
    }

    update()
    mediaQueryList.addEventListener("change", update)
    return () => mediaQueryList.removeEventListener("change", update)
  }, [])

  return { isMobile, isReady }
}
