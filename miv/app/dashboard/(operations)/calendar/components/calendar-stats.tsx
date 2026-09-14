import { AlertTriangle, Calendar, CalendarDays, CalendarRange } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalendarAnalytics, CalendarEvent } from "../types/calendar"

export function CalendarStats({ events, analytics }: { events: CalendarEvent[]; analytics: CalendarAnalytics | null }) {
  const summary = analytics?.summary
  const total = summary?.totalEvents ?? events.length
  const upcoming = summary?.upcomingEvents ?? events.filter((event) => event.startDate >= new Date().toISOString().slice(0, 10)).length
  const high = summary?.highPriorityEvents ?? events.filter((event) => event.priority === "high").length
  const today = summary?.todayEvents ?? events.filter((event) => event.startDate === new Date().toISOString().slice(0, 10)).length
  const cards = [
    ["Total Events", total, `${upcoming} upcoming, ${Math.max(total - upcoming, 0)} past`, Calendar],
    ["Today's Events", today, today ? "Events scheduled" : "No events today", CalendarDays],
    ["High Priority", high, `${total ? ((high / total) * 100).toFixed(1) : "0.0"}% of total events`, AlertTriangle],
    ["This Week", summary?.thisWeekEvents ?? 0, "Events this week", CalendarRange],
  ] as const
  return <div className="grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value, detail, Icon]) => <Card key={label}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{label}</CardTitle><Icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{value}</div><p className="text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}</div>
}
