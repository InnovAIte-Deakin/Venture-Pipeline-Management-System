"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Plus } from 'lucide-react'
import { teamApi } from '@/lib/team-management/team-api'
import { AnnouncementCard } from './announcement-card'
import { AnnouncementDetailsDialog } from './announcement-details-dialog'
import { AnnouncementFormDialog } from './announcement-form-dialog'
import { SectionEmptyState } from './section-empty-state'
import { SectionErrorState } from './section-error-state'
import { SectionLoadingState } from './section-loading-state'
import type { Announcement, TeamMember, UpdateAnnouncementInput } from '@/types/team-management'

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const loadAnnouncements = async (query = '') => {
    const requestId = ++requestRef.current
    setLoading(true)
    setError(null)
    try {
      const response = await teamApi.announcements.list({ search: query, isActive: true, limit: 50 })
      if (requestId !== requestRef.current) return
      setAnnouncements(response.announcements)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load announcements')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }

  const loadMembers = async () => {
    try {
      const response = await teamApi.members.list({ limit: 50 })
      setMembers(response.members)
    } catch {
      // ignore member fetch issues for announcement creation
    }
  }

  useEffect(() => {
    loadAnnouncements('')
    loadMembers()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAnnouncements(searchQuery)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const visibleAnnouncements = useMemo(() => announcements, [announcements])

  const openCreate = () => {
    setSelectedAnnouncement(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openDetails = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setDetailsOpen(true)
  }

  const handleSubmit = async (payload: UpdateAnnouncementInput) => {
    setFormError(null)
    try {
      if (selectedAnnouncement) {
        const updated = await teamApi.announcements.update(selectedAnnouncement.id, payload)
        setAnnouncements((current) => current.map((announcement) => (announcement.id === updated.id ? updated : announcement)))
      } else {
        const created = await teamApi.announcements.create(payload as any)
        setAnnouncements((current) => [created, ...current])
      }
      setFormOpen(false)
      setSelectedAnnouncement(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save announcement')
      throw err
    }
  }

  const handleDelete = async () => {
    if (!selectedAnnouncement) return
    setDeleting(true)
    try {
      await teamApi.announcements.remove(selectedAnnouncement.id)
      setAnnouncements((current) => current.filter((announcement) => announcement.id !== selectedAnnouncement.id))
      setDetailsOpen(false)
      setSelectedAnnouncement(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete announcement')
      throw err
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <SectionLoadingState message="Loading announcements…" />
  }

  if (error) {
    return <SectionErrorState message={error} onRetry={() => loadAnnouncements(searchQuery)} />
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Announcements</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Create and manage announcements across the team.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search announcements"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New announcement
          </Button>
        </div>
      </div>

      {visibleAnnouncements.length === 0 ? (
        <SectionEmptyState
          title="No announcements found"
          description="Create a new announcement to keep the team informed."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} onClick={() => openDetails(announcement)} />
          ))}
        </div>
      )}

      <AnnouncementFormDialog
        open={formOpen}
        announcement={selectedAnnouncement ?? undefined}
        members={members}
        loading={false}
        error={formError ?? undefined}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAnnouncement(null)
            setFormError(null)
          }
          setFormOpen(open)
        }}
        onSubmit={handleSubmit}
      />

      <AnnouncementDetailsDialog
        open={detailsOpen}
        announcement={selectedAnnouncement}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAnnouncement(null)
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
