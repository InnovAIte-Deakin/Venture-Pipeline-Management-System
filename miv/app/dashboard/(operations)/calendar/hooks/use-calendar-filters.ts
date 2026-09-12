"use client"

import { useState } from "react"
import type { CalendarEventType, CalendarEventView, CalendarFilters, CalendarPriority, CalendarStatus } from "../types/calendar"

export function useCalendarFilters() {
  const [filters, setFilters] = useState<CalendarFilters>({ search: "", type: "all", priority: "all", status: "all", view: "upcoming" })
  return {
    filters,
    setSearch: (search: string) => setFilters((current) => ({ ...current, search })),
    setType: (type: CalendarEventType | "all") => setFilters((current) => ({ ...current, type })),
    setPriority: (priority: CalendarPriority | "all") => setFilters((current) => ({ ...current, priority })),
    setStatus: (status: CalendarStatus | "all") => setFilters((current) => ({ ...current, status })),
    setView: (view: CalendarEventView) => setFilters((current) => ({ ...current, view })),
  }
}
