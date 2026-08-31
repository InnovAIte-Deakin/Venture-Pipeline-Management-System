import { AlertTriangle, Calendar, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalendarAnalytics, CalendarEvent } from "../types/calendar"
import { eventTypes, priorities, statuses } from "../types/calendar"
import { EventTypeIcon, titleCase } from "../lib/calendar-display-utils"

export function CalendarDistributions({ events, analytics }: { events: CalendarEvent[]; analytics: CalendarAnalytics | null }) {
  const fallback = (key: "type" | "priority" | "status", values: readonly string[]) => values.map((value) => { const count = events.filter((event) => event[key] === value).length; return { value, count, percentage: events.length ? Number(((count / events.length) * 100).toFixed(1)) : 0 } })
  const groups = [
    { title: "Event Type Distribution", Icon: Calendar, items: analytics?.distributions.byType.map(({ type, ...item }) => ({ value: type, ...item })) ?? fallback("type", eventTypes), showIcon: true },
    { title: "Priority Distribution", Icon: AlertTriangle, items: analytics?.distributions.byPriority.map(({ priority, ...item }) => ({ value: priority, ...item })) ?? fallback("priority", priorities) },
    { title: "Status Overview", Icon: CheckCircle, items: analytics?.distributions.byStatus.map(({ status, ...item }) => ({ value: status, ...item })) ?? fallback("status", statuses) },
  ]
  return <div className="grid gap-4 md:grid-cols-3">{groups.map(({ title, Icon, items, showIcon }) => <Card key={title}><CardHeader><CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Icon className="h-5 w-5" />{title}</CardTitle></CardHeader><CardContent><div className="space-y-4">{items.length ? items.map((item) => <div key={item.value} className="flex items-center justify-between gap-3 text-sm"><span className="flex min-w-0 items-center gap-2">{showIcon && <EventTypeIcon type={item.value as (typeof eventTypes)[number]} />}<span className="truncate">{titleCase(item.value)}</span></span><span className="shrink-0 font-medium">{item.count} <span className="font-normal text-muted-foreground">({item.percentage}%)</span></span></div>) : <p className="text-sm text-muted-foreground">No data available.</p>}</div></CardContent></Card>)}</div>
}
