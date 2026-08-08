import { AlertTriangle, Building2, Calendar, Phone, Target, Users, Video, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { CalendarEventType, CalendarPriority, CalendarStatus } from "../types/calendar"

const typeConfig: Record<CalendarEventType, { label: string; className: string; Icon: LucideIcon }> = {
  meeting: { label: "Meeting", className: "bg-blue-100 text-blue-800", Icon: Users },
  call: { label: "Call", className: "bg-green-100 text-green-800", Icon: Phone },
  board_meeting: { label: "Board Meeting", className: "bg-purple-100 text-purple-800", Icon: Building2 },
  due_diligence: { label: "Due Diligence", className: "bg-orange-100 text-orange-800", Icon: Target },
  presentation: { label: "Presentation", className: "bg-pink-100 text-pink-800", Icon: Video },
  deadline: { label: "Deadline", className: "bg-red-100 text-red-800", Icon: AlertTriangle },
  other: { label: "Other", className: "", Icon: Calendar },
}

const priorityClass: Record<CalendarPriority, string> = { high: "bg-red-600 text-white", medium: "bg-yellow-100 text-yellow-800", low: "bg-green-100 text-green-800" }
const statusClass: Record<CalendarStatus, string> = { scheduled: "bg-blue-100 text-blue-800", in_progress: "bg-yellow-100 text-yellow-800", completed: "bg-green-100 text-green-800", cancelled: "bg-red-600 text-white" }

export function titleCase(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) }
export function EventTypeIcon({ type, className = "h-4 w-4" }: { type: CalendarEventType; className?: string }) { const Icon = typeConfig[type].Icon; return <Icon className={className} /> }
export function EventTypeBadge({ type }: { type: CalendarEventType }) { return <Badge variant="outline" className={typeConfig[type].className}>{typeConfig[type].label}</Badge> }
export function PriorityBadge({ priority }: { priority: CalendarPriority }) { return <Badge variant="outline" className={priorityClass[priority]}>{titleCase(priority)}</Badge> }
export function StatusBadge({ status }: { status: CalendarStatus }) { return <Badge variant="outline" className={statusClass[status]}>{titleCase(status)}</Badge> }
