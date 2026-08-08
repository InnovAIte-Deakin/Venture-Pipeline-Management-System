"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TeamEvent, TeamMember, CreateTeamEventInput, UpdateTeamEventInput, EventFrequency, TeamEventRecurrence } from '@/types/team-management'

const recurrenceFrequencies: EventFrequency[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']

interface EventFormDialogProps {
  open: boolean
  event?: TeamEvent | CreateTeamEventInput | UpdateTeamEventInput | null
  members: TeamMember[]
  loading?: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateTeamEventInput | UpdateTeamEventInput) => Promise<void>
}

export function EventFormDialog({
  open,
  event,
  members,
  loading = false,
  error,
  onOpenChange,
  onSubmit,
}: EventFormDialogProps) {
  const [formState, setFormState] = React.useState<CreateTeamEventInput>({
    title: event?.title ?? '',
    description: event?.description ?? undefined,
    date: event?.date ?? '',
    time: event?.time ?? undefined,
    location: event?.location ?? undefined,
    isAllDay: event?.isAllDay ?? false,
    isRecurring: event?.isRecurring ?? false,
    recurrence: event?.recurrence ?? undefined,
    organizerId: 'organizerId' in event ? event.organizerId ?? '' : '',
    attendeeIds: 'attendeeIds' in event ? event.attendeeIds ?? undefined : undefined,
  })

  React.useEffect(() => {
    setFormState({
      title: event?.title ?? '',
      description: event?.description ?? undefined,
      date: event?.date ?? '',
      time: event?.time ?? undefined,
      location: event?.location ?? undefined,
      isAllDay: event?.isAllDay ?? false,
      isRecurring: event?.isRecurring ?? false,
      recurrence: event?.recurrence ?? undefined,
      organizerId: 'organizerId' in event ? event.organizerId ?? '' : '',
      attendeeIds: 'attendeeIds' in event ? event.attendeeIds ?? undefined : undefined,
    })
  }, [event])

  const handleField = (key: keyof CreateTeamEventInput, value: CreateTeamEventInput[keyof CreateTeamEventInput] | TeamEventRecurrence | string[] | undefined) => {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const handleAttendees = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value)
    handleField('attendeeIds', selected)
  }

  const handleSubmit = async () => {
    if (event && 'id' in event) {
      const payload: UpdateTeamEventInput = {
        title: formState.title,
        description: formState.description,
        date: formState.date,
        time: formState.time,
        location: formState.location,
        isAllDay: formState.isAllDay,
        isRecurring: formState.isRecurring,
        recurrence: formState.recurrence,
        attendeeIds: formState.attendeeIds,
      }
      await onSubmit(payload)
      return
    }

    await onSubmit(formState)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit event' : 'Schedule event'}</DialogTitle>
          <DialogDescription>{event ? 'Update event details.' : 'Create a new team event.'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="eventTitle">Title</Label>
            <Input
              id="eventTitle"
              value={formState.title}
              onChange={(e) => handleField('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDescription">Description</Label>
            <Textarea
              id="eventDescription"
              value={formState.description ?? ''}
              onChange={(e) => handleField('description', e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={formState.date}
                onChange={(e) => handleField('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">Time</Label>
              <Input
                id="eventTime"
                type="time"
                value={formState.time ?? ''}
                onChange={(e) => handleField('time', e.target.value)}
                disabled={formState.isAllDay}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formState.isAllDay}
                onCheckedChange={(value) => handleField('isAllDay', Boolean(value))}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">All day event</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formState.isRecurring}
                onCheckedChange={(value) => handleField('isRecurring', Boolean(value))}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">Recurring event</span>
            </div>
          </div>
          {formState.isRecurring ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recurrenceFrequency">Frequency</Label>
                <Select
                  value={formState.recurrence?.frequency ?? ''}
                  onValueChange={(value) =>
                    handleField('recurrence', {
                      ...formState.recurrence,
                      frequency: value as EventFrequency,
                    })
                  }
                >
                  <SelectTrigger id="recurrenceFrequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurrenceFrequencies.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recurrenceInterval">Interval</Label>
                <Input
                  id="recurrenceInterval"
                  type="number"
                  min={1}
                  value={formState.recurrence?.interval?.toString() ?? ''}
                  onChange={(e) =>
                    handleField('recurrence', {
                      ...formState.recurrence,
                      interval: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventOrganizer">Organizer</Label>
              <Select
                value={formState.organizerId}
                onValueChange={(value) => handleField('organizerId', value)}
              >
                <SelectTrigger id="eventOrganizer">
                  <SelectValue placeholder="Select organizer" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventAttendees">Attendees</Label>
              <select
                id="eventAttendees"
                className="h-32 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                multiple
                value={formState.attendeeIds ?? []}
                onChange={handleAttendees}
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventLocation">Location</Label>
            <Input
              id="eventLocation"
              value={formState.location ?? ''}
              onChange={(e) => handleField('location', e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {event ? 'Save event' : 'Schedule event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
