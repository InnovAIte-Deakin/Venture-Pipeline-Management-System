"use client"

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SummaryCard } from '@/app/dashboard/(g5-platform-operations)/team-management/components/summary-card'
import {
  calendarWeekSummary,
  demoCalendarEvents,
  type CalendarEventType,
} from '@/lib/team-management/demo-data'

const typeClass = (type: CalendarEventType) => {
  switch (type) {
    case 'Meeting':
      return 'border-0 bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
    case 'Review':
      return 'border-0 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
    case 'Milestone':
      return 'border-0 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
    case 'Presentation':
      return 'border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
    case 'Code Review':
      return 'border-0 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
    default:
      return 'border-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  }
}

const typeOptions: Array<'All types' | CalendarEventType> = [
  'All types',
  ...Array.from(new Set(demoCalendarEvents.map((event) => event.type))),
]

export function EventsSection() {
  const [typeFilter, setTypeFilter] = useState<'All types' | CalendarEventType>('All types')

  const visibleEvents = useMemo(
    () => demoCalendarEvents.filter((event) => typeFilter === 'All types' || event.type === typeFilter),
    [typeFilter],
  )

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Project Calendar</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          View upcoming meetings, reviews, milestones and project activities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Meetings" value={calendarWeekSummary.meetings} />
        <SummaryCard label="Reviews" value={calendarWeekSummary.reviews} />
        <SummaryCard label="Milestones" value={calendarWeekSummary.milestones} />
        <SummaryCard label="Presentations" value={calendarWeekSummary.presentations} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Events</h3>
          <select
            aria-label="Filter by Event Type"
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 md:w-56 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as 'All types' | CalendarEventType)}
          >
            {typeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        {visibleEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <Card key={event.id} className="py-4 sm:py-6">
                <CardContent className="flex h-full flex-col gap-3 px-4 sm:px-6">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                    <Badge className={typeClass(event.type)}>{event.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{event.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            No upcoming events.
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">This Week</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Meetings</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{calendarWeekSummary.meetings}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Reviews</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{calendarWeekSummary.reviews}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Milestones</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{calendarWeekSummary.milestones}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Presentations</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{calendarWeekSummary.presentations}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
