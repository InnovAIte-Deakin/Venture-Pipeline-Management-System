"use client"

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  demoAnnouncements,
  demoCommunicationUpdates,
  type DemoAnnouncement,
} from '@/lib/team-management/demo-data'

const announcementStatusClass = (status: DemoAnnouncement['status']) =>
  status === 'Active'
    ? 'border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
    : status === 'Pending'
      ? 'border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
      : 'border-0 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'

export function AnnouncementsSection() {
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const statusOptions = ['All statuses', ...Array.from(new Set(demoAnnouncements.map((item) => item.status)))]

  const visibleAnnouncements = useMemo(
    () => demoAnnouncements.filter((item) => statusFilter === 'All statuses' || item.status === statusFilter),
    [statusFilter],
  )

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team Communication</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Keep track of project discussions, announcements and recent team updates.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Updates</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoCommunicationUpdates.map((update) => (
            <Card key={update.id} className="py-4 sm:py-6">
              <CardContent className="flex h-full flex-col gap-2 px-4 sm:px-6">
                <p className="font-semibold text-slate-900 dark:text-white">{update.title}</p>
                <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">{update.message}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{update.meta}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Announcements</h3>
          <select
            aria-label="Filter by Status"
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 md:w-56 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y dark:divide-slate-800">
            {visibleAnnouncements.map((announcement) => (
              <div key={announcement.id} className="flex flex-col gap-2 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium text-slate-900 dark:text-white">{announcement.title}</p>
                  <Badge className={announcementStatusClass(announcement.status)}>{announcement.status}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{announcement.message}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {announcement.author} • {announcement.date}
                </p>
              </div>
            ))}
            {visibleAnnouncements.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-500">No communication updates available.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
