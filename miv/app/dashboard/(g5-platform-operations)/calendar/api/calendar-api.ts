import type { CalendarAnalytics, CalendarEventsResponse, CalendarFilters } from "../types/calendar"

async function parseResponse<T>(response: Response, message: string): Promise<T> {
  if (!response.ok) throw new Error(message)
  return response.json() as Promise<T>
}

export async function getCalendarEvents(filters: CalendarFilters, signal?: AbortSignal) {
  const params = new URLSearchParams({ limit: "100" })
  if (filters.search.trim()) params.set("search", filters.search.trim())
  if (filters.type !== "all") params.set("type", filters.type)
  if (filters.priority !== "all") params.set("priority", filters.priority)
  if (filters.status !== "all") params.set("status", filters.status)
  if (filters.view !== "all") params.set("view", filters.view)
  return parseResponse<CalendarEventsResponse>(await fetch(`/api/calendar/events?${params}`, { signal }), "Failed to fetch events")
}

export async function getCalendarAnalytics(signal?: AbortSignal) {
  return parseResponse<CalendarAnalytics>(await fetch("/api/calendar/analytics?period=30", { signal }), "Failed to fetch calendar analytics")
}
