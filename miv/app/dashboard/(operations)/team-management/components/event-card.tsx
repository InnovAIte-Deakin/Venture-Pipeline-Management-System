import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'
import type { TeamEvent } from '@/app/dashboard/(operations)/team-management/types/team-management'
import { formatDateTime } from '@/app/dashboard/(operations)/team-management/lib/team-utils'

interface EventCardProps {
  event: TeamEvent
  onClick: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{event.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{formatDateTime(event.date, event.time ?? undefined)}</p>
          </div>
          <CalendarDays className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 line-clamp-3">{event.description ?? 'No event description.'}</p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {event.organizer.name}
          </Badge>
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {event._count.attendees} attendees
          </Badge>
          {event.isAllDay ? (
            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">All day</Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
