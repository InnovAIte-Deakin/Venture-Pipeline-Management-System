import type { CalendarEvent } from "../types/calendar"

// These tabs narrow the events already filtered by the Calendar API.
export function filterMeetingEvents(events: CalendarEvent[]) {
  return events.filter((event) => ["meeting", "call", "board_meeting", "due_diligence"].includes(event.type))
}

export function filterDeadlineEvents(events: CalendarEvent[]) {
  return events.filter((event) => event.type === "deadline")
}
