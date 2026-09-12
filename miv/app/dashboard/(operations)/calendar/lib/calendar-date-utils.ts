import { addDays, eachDayOfInterval, endOfWeek, format, isSameDay, isValid, startOfMonth, startOfWeek } from "date-fns"
import type { CalendarEvent } from "../types/calendar"

export interface CalendarDay { date: Date; inMonth: boolean }

export function getMonthDays(month: Date): CalendarDay[] {
  const monthStart = startOfMonth(month)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = addDays(gridStart, 41)
  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({ date, inMonth: date.getMonth() === monthStart.getMonth() }))
}

export function dateKey(date: Date) { return format(date, "yyyy-MM-dd") }

export function groupEventsByDay(events: CalendarEvent[]) {
  const grouped = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(event.startDate)) continue
    const entries = grouped.get(event.startDate) ?? []
    grouped.set(event.startDate, [...entries, event])
  }
  return grouped
}

export function isToday(date: Date) { return isSameDay(date, new Date()) }
export function monthLabel(date: Date) { return isValid(date) ? format(date, "MMMM yyyy") : "" }
export function weekEnd(date: Date) { return endOfWeek(date) }
