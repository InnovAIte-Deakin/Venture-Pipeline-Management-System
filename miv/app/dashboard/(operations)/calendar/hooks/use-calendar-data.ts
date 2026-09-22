"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getCalendarAnalytics, getCalendarEvents } from "../api/calendar-api"
import type { CalendarAnalytics, CalendarEvent, CalendarFilters } from "../types/calendar"

export function useCalendarData(filters: CalendarFilters) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [analytics, setAnalytics] = useState<CalendarAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const analyticsLoaded = useRef(false)

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const eventsPromise = getCalendarEvents(filters, signal)
      const analyticsPromise = analyticsLoaded.current
        ? Promise.resolve(null)
        : getCalendarAnalytics(signal).catch((analyticsError) => {
            if (!(analyticsError instanceof DOMException && analyticsError.name === "AbortError")) {
              console.error("Error loading calendar analytics:", analyticsError)
            }
            return null
          })
      const [eventsData, analyticsData] = await Promise.all([eventsPromise, analyticsPromise])
      setEvents(eventsData.events ?? [])
      if (analyticsData) {
        setAnalytics(analyticsData)
        analyticsLoaded.current = true
      }
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return
      console.error("Error loading calendar data:", caught)
      setError(caught instanceof Error ? caught.message : "Failed to load calendar data")
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => void load(controller.signal), filters.search ? 300 : 0)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [filters.search, load])

  return { events, analytics, loading, error, retry: () => void load() }
}
