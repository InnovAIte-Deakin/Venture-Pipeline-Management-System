"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Announcement } from '@/app/dashboard/(operations)/team-management/types/team-management'
import { formatDate } from '@/app/dashboard/(operations)/team-management/lib/team-utils'

interface AnnouncementDetailsDialogProps {
  open: boolean
  announcement: Announcement | null
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete?: () => void
  deleting?: boolean
}

export function AnnouncementDetailsDialog({
  open,
  announcement,
  onOpenChange,
  onEdit,
  onDelete,
  deleting = false,
}: AnnouncementDetailsDialogProps) {
  if (!announcement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{announcement.title}</DialogTitle>
          <DialogDescription>{announcement.content}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm text-slate-600 dark:text-slate-400">By {announcement.author.name} • {announcement.author.email}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Created {formatDate(announcement.createdAt)}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Expires {announcement.expiresAt ? formatDate(announcement.expiresAt) : 'Never'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {announcement.priority.toLowerCase()}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {announcement.isActive ? 'Active' : 'Inactive'}
            </Badge>
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
