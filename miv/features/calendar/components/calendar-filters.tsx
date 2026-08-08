import { Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { eventTypes, priorities, statuses, type CalendarEventType, type CalendarEventView, type CalendarFilters as Filters, type CalendarPriority, type CalendarStatus } from "../types/calendar"
import { titleCase } from "../lib/calendar-display-utils"

interface Props { filters: Filters; setSearch(value: string): void; setType(value: CalendarEventType | "all"): void; setPriority(value: CalendarPriority | "all"): void; setStatus(value: CalendarStatus | "all"): void; setView(value: CalendarEventView): void }
export function CalendarFilters({ filters, setSearch, setType, setPriority, setStatus, setView }: Props) {
  const select = (label: string, value: string, values: readonly string[], onChange: (value: never) => void) => <div className="min-w-0 space-y-2"><label className="text-sm font-medium">{label}</label><Select value={value} onValueChange={onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All {label.toLowerCase() === "view" ? "events" : `${label.toLowerCase()}s`}</SelectItem>{values.map((item) => <SelectItem key={item} value={item}>{titleCase(item)}</SelectItem>)}</SelectContent></Select></div>
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters & Search</CardTitle></CardHeader><CardContent><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><div className="min-w-0 space-y-2"><label htmlFor="calendar-search" className="text-sm font-medium">Search</label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="calendar-search" placeholder="Search events..." value={filters.search} onChange={(event) => setSearch(event.target.value)} className="pl-10" /></div></div>{select("Event Type", filters.type, eventTypes, setType)}{select("Priority", filters.priority, priorities, setPriority)}{select("Status", filters.status, statuses, setStatus)}{select("View", filters.view, ["upcoming", "past"], setView)}</div></CardContent></Card>
}
