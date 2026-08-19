"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/team-management/team-utils'
import type { TeamEvent } from '@/types/team-management'

interface EventDetailsDialogProps {
  open: boolean
  event: TeamEvent | null
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete?: () => void
  deleting?: boolean
}

export function EventDetailsDialog({
  open,
  event,
  onOpenChange,
  onEdit,
  onDelete,
  deleting = false,
}: EventDetailsDialogProps) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>{event.description ?? 'Event details and schedule.'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">When</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{formatDateTime(event.date, event.time ?? undefined)}</p>
            {event.location ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Location: {event.location}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {event.isAllDay ? 'All day' : 'Timed'}
              </Badge>
              {event.isRecurring ? <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Recurring</Badge> : null}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Organizer</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{event.organizer.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{event.organizer.email}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Attendees</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {event.attendees.map((attendee) => (
              <Badge key={attendee.id} className="rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {attendee.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          {onDelete ? (
            <Button variant="destructive" onClick={onDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
