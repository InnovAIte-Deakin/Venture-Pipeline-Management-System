import type { CalendarEvent } from "../types/calendar"
import { CalendarEventCard } from "./calendar-event-card"

export function CalendarEventList({ events, emptyMessage = "No events found." }: { events: CalendarEvent[]; emptyMessage?: string }) {
  if (!events.length) return <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">{emptyMessage}</div>
  return <div className="space-y-4">{events.map((event) => <CalendarEventCard key={event.id} event={event} />)}</div>
}
