"use client"

import { useMemo, useState } from "react"
import { startOfMonth } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCalendarData } from "../hooks/use-calendar-data"
import { useCalendarFilters } from "../hooks/use-calendar-filters"
import { CalendarDistributions } from "./calendar-distributions"
import { CalendarErrorState } from "./calendar-error-state"
import { CalendarEventList } from "./calendar-event-list"
import { CalendarFilters } from "./calendar-filters"
import { CalendarHeader } from "./calendar-header"
import { CalendarLoadingState } from "./calendar-loading-state"
import { CalendarMonthView } from "./calendar-month-view"
import { CalendarStats } from "./calendar-stats"

export function CalendarPageContent() {
  const filterState = useCalendarFilters()
  const { events, analytics, loading, error, retry } = useCalendarData(filterState.filters)
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const meetings = useMemo(() => events.filter((event) => ["meeting", "call", "board_meeting", "due_diligence"].includes(event.type)), [events])
  const deadlines = useMemo(() => events.filter((event) => event.type === "deadline"), [events])
  if (loading) return <CalendarLoadingState />
  if (error) return <CalendarErrorState error={error} retry={retry} />
  return <div className="min-w-0 space-y-6 overflow-x-clip"><CalendarHeader /><CalendarStats events={events} analytics={analytics} /><CalendarDistributions events={events} analytics={analytics} /><Tabs defaultValue="events" className="min-w-0 space-y-4"><div className="w-full overflow-x-auto pb-1"><TabsList className="inline-flex min-w-max"><TabsTrigger value="events">Events</TabsTrigger><TabsTrigger value="calendar">Calendar View</TabsTrigger><TabsTrigger value="meetings">Meetings</TabsTrigger><TabsTrigger value="deadlines">Deadlines</TabsTrigger></TabsList></div><TabsContent value="events" className="space-y-4"><CalendarFilters {...filterState} /><CalendarEventList events={events} /></TabsContent><TabsContent value="calendar"><CalendarMonthView events={events} month={month} setMonth={setMonth} /></TabsContent><TabsContent value="meetings"><ListPanel title="Meetings" description="Focus on meetings and calls"><CalendarEventList events={meetings} emptyMessage="No meetings found." /></ListPanel></TabsContent><TabsContent value="deadlines"><ListPanel title="Deadlines" description="Track important deadlines and due dates"><CalendarEventList events={deadlines} emptyMessage="No deadlines found." /></ListPanel></TabsContent></Tabs></div>
}

function ListPanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent>{children}</CardContent></Card> }
