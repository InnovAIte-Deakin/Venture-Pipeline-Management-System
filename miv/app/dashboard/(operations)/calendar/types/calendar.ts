export const eventTypes = ["meeting", "call", "board_meeting", "due_diligence", "presentation", "deadline", "other"] as const
export const priorities = ["high", "medium", "low"] as const
export const statuses = ["scheduled", "in_progress", "completed", "cancelled"] as const
export const eventViews = ["all", "upcoming", "past"] as const

export type CalendarEventType = (typeof eventTypes)[number]
export type CalendarPriority = (typeof priorities)[number]
export type CalendarStatus = (typeof statuses)[number]
export type CalendarEventView = (typeof eventViews)[number]

export interface CalendarEvent {
  id: string
  title: string
  description: string
  type: CalendarEventType
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  attendees: string[]
  organizer: string
  status: CalendarStatus
  priority: CalendarPriority
  company?: string
  dealId?: string
  notes?: string
  lastUpdate: string
}

export interface DistributionItem {
  count: number
  percentage: number
}

export interface CalendarAnalytics {
  summary: {
    totalEvents: number
    todayEvents: number
    thisWeekEvents: number
    upcomingEvents: number
    highPriorityEvents: number
    growthRate: number
    avgAttendeesPerEvent: number
    avgMeetingsPerWeek: number
  }
  distributions: {
    byType: Array<DistributionItem & { type: CalendarEventType }>
    byPriority: Array<DistributionItem & { priority: CalendarPriority }>
    byStatus: Array<DistributionItem & { status: CalendarStatus }>
  }
}

export interface CalendarEventsResponse {
  events: CalendarEvent[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export interface CalendarFilters {
  search: string
  type: CalendarEventType | "all"
  priority: CalendarPriority | "all"
  status: CalendarStatus | "all"
  view: CalendarEventView
}
