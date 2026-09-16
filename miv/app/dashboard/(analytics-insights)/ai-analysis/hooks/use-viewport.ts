"use client"

import { useEffect, useState } from "react"

const DESKTOP_BREAKPOINT_QUERY = "(min-width: 1024px)"

/** Selects the feature-local desktop or mobile presentation at Tailwind's lg breakpoint. */
export function useViewport() {
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT_QUERY)

    const updateViewport = () => {
      setIsMobile(!mediaQuery.matches)
      setIsReady(true)
    }

    updateViewport()
    mediaQuery.addEventListener("change", updateViewport)

    return () => mediaQuery.removeEventListener("change", updateViewport)
  }, [])

  return { isMobile, isReady }
}
