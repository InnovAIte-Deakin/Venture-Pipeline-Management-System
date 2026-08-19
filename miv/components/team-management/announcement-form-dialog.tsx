"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Announcement, ProjectPriority, TeamMember, CreateAnnouncementInput, UpdateAnnouncementInput } from '@/types/team-management'

const priorities: ProjectPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

interface AnnouncementFormDialogProps {
  open: boolean
  announcement?: Announcement | CreateAnnouncementInput | UpdateAnnouncementInput | null
  members: TeamMember[]
  loading?: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateAnnouncementInput | UpdateAnnouncementInput) => Promise<void>
}

export function AnnouncementFormDialog({
  open,
  announcement,
  members,
  loading = false,
  error,
  onOpenChange,
  onSubmit,
}: AnnouncementFormDialogProps) {
  const [formState, setFormState] = React.useState<CreateAnnouncementInput>({
    title: announcement?.title ?? '',
    content: announcement?.content ?? '',
    priority: announcement?.priority ?? 'MEDIUM',
    isActive: announcement?.isActive ?? true,
    expiresAt: announcement?.expiresAt ?? undefined,
    authorId: 'authorId' in announcement ? announcement.authorId ?? '' : '',
  })

  React.useEffect(() => {
    setFormState({
      title: announcement?.title ?? '',
      content: announcement?.content ?? '',
      priority: announcement?.priority ?? 'MEDIUM',
      isActive: announcement?.isActive ?? true,
      expiresAt: announcement?.expiresAt ?? undefined,
      authorId: 'authorId' in announcement ? announcement.authorId ?? '' : '',
    })
  }, [announcement])

  const handleField = (key: keyof CreateAnnouncementInput, value: CreateAnnouncementInput[keyof CreateAnnouncementInput]) => {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async () => {
    if (announcement && 'id' in announcement) {
      const payload: UpdateAnnouncementInput = {
        title: formState.title,
        content: formState.content,
        priority: formState.priority,
        isActive: formState.isActive,
        expiresAt: formState.expiresAt,
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
          <DialogTitle>{announcement ? 'Edit announcement' : 'New announcement'}</DialogTitle>
          <DialogDescription>{announcement ? 'Update the announcement details.' : 'Create an announcement for the team.'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="announcementTitle">Title</Label>
            <Input
              id="announcementTitle"
              value={formState.title}
              onChange={(e) => handleField('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementContent">Content</Label>
            <Textarea
              id="announcementContent"
              value={formState.content}
              onChange={(e) => handleField('content', e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="announcementPriority">Priority</Label>
              <Select
                value={formState.priority}
                onValueChange={(value) => handleField('priority', value as ProjectPriority)}
              >
                <SelectTrigger id="announcementPriority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementExpiresAt">Expiry date</Label>
              <Input
                id="announcementExpiresAt"
                type="date"
                value={formState.expiresAt ?? ''}
                onChange={(e) => handleField('expiresAt', e.target.value || undefined)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementAuthor">Author</Label>
            <Select
              value={formState.authorId}
              onValueChange={(value) => handleField('authorId', value)}
            >
              <SelectTrigger id="announcementAuthor">
                <SelectValue placeholder="Select author" />
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
          <div className="flex items-center gap-2">
            <input
              id="announcementActive"
              type="checkbox"
              checked={formState.isActive}
              onChange={(e) => handleField('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="announcementActive" className="text-sm text-slate-600 dark:text-slate-300">
              Active announcement
            </label>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {announcement ? 'Save announcement' : 'Create announcement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
