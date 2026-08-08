"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { SocialImpactVenture, VenturesResponse } from "../types/social-impact"

export async function requestSocialImpactData(
  signal?: AbortSignal,
  request: typeof fetch = fetch,
): Promise<SocialImpactVenture[]> {
  const response = await request("/api/ventures?limit=100", { signal })
  if (!response.ok) throw new Error(`Unable to load social impact data (${response.status})`)
  const data = await response.json() as VenturesResponse
  if (data.ventures !== undefined && !Array.isArray(data.ventures)) {
    throw new Error("The ventures API returned an invalid response")
  }
  return data.ventures ?? []
}

export function useSocialImpactData() {
  const [ventures, setVentures] = useState<SocialImpactVenture[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  const load = useCallback(async (refresh = false) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    if (refresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const data = await requestSocialImpactData(controller.signal)
      if (mountedRef.current && !controller.signal.aborted) setVentures(data)
    } catch (caught) {
      if (mountedRef.current && !controller.signal.aborted) {
        setError(caught instanceof Error ? caught.message : "Unable to load social impact data")
      }
    } finally {
      if (mountedRef.current && !controller.signal.aborted) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    void load()
    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [load])

  return { ventures, loading, refreshing, error, refresh: () => load(true), retry: () => load() }
}
