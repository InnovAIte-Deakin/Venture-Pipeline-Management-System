"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Plus } from 'lucide-react'
import { teamApi } from '@/app/dashboard/(g5-platform-operations)/team-management/lib/team-api'
import { EventCard } from './event-card'
import { EventDetailsDialog } from './event-details-dialog'
import { EventFormDialog } from './event-form-dialog'
import { SectionEmptyState } from './section-empty-state'
import { SectionErrorState } from './section-error-state'
import { SectionLoadingState } from './section-loading-state'
import type { TeamEvent, TeamMember, UpdateTeamEventInput } from '@/app/dashboard/(g5-platform-operations)/team-management/types/team-management'

export function EventsSection() {
  const [events, setEvents] = useState<TeamEvent[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const loadEvents = async (query = '') => {
    const requestId = ++requestRef.current
    setLoading(true)
    setError(null)
    try {
      const response = await teamApi.events.list({ search: query, startDate: new Date().toISOString().split('T')[0], limit: 50 })
      if (requestId !== requestRef.current) return
      setEvents(response.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }

  const loadMembers = async () => {
    try {
      const response = await teamApi.members.list({ limit: 50 })
      setMembers(response.members)
    } catch {
      // ignore member load errors for events section
    }
  }

  useEffect(() => {
    loadEvents('')
    loadMembers()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadEvents(searchQuery)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const visibleEvents = useMemo(() => events, [events])

  const openCreate = () => {
    setSelectedEvent(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openDetails = (event: TeamEvent) => {
    setSelectedEvent(event)
    setDetailsOpen(true)
  }

  const handleSubmit = async (payload: UpdateTeamEventInput) => {
    setFormError(null)
    try {
      if (selectedEvent) {
        const updated = await teamApi.events.update(selectedEvent.id, payload)
        setEvents((current) => current.map((event) => (event.id === updated.id ? updated : event)))
      } else {
        const created = await teamApi.events.create(payload as any)
        setEvents((current) => [created, ...current])
      }
      setFormOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save event')
      throw err
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    setDeleting(true)
    try {
      await teamApi.events.remove(selectedEvent.id)
      setEvents((current) => current.filter((event) => event.id !== selectedEvent.id))
      setDetailsOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete event')
      throw err
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <SectionLoadingState message="Loading events…" />
  }

  if (error) {
    return <SectionErrorState message={error} onRetry={() => loadEvents(searchQuery)} />
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Events</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Schedule and manage upcoming team events.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search events"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New event
          </Button>
        </div>
      </div>

      {visibleEvents.length === 0 ? (
        <SectionEmptyState
          title="No events found"
          description="Try a different search or create a new event."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => openDetails(event)} />
          ))}
        </div>
      )}

      <EventFormDialog
        open={formOpen}
        event={selectedEvent ?? undefined}
        members={members}
        loading={false}
        error={formError ?? undefined}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null)
            setFormError(null)
          }
          setFormOpen(open)
        }}
        onSubmit={handleSubmit}
      />

      <EventDetailsDialog
        open={detailsOpen}
        event={selectedEvent}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null)
          }
          setDetailsOpen(open)
        }}
        onEdit={() => {
          setFormOpen(true)
          setDetailsOpen(false)
        }}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </section>
  )
}
