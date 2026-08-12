"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, projectStatusClassName, projectStatusLabel, priorityClassName } from '@/app/dashboard/(g5-platform-operations)/team-management/lib/team-utils'
import type { Project } from '@/app/dashboard/(g5-platform-operations)/team-management/types/team-management'

interface ProjectDetailsDialogProps {
  open: boolean
  project: Project | null
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete?: () => void
  deleting?: boolean
}

export function ProjectDetailsDialog({
  open,
  project,
  onOpenChange,
  onEdit,
  onDelete,
  deleting = false,
}: ProjectDetailsDialogProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.description ?? 'Project details and status.'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className={projectStatusClassName(project.status)}>{projectStatusLabel(project.status)}</Badge>
                <Badge className={priorityClassName(project.priority)}>{project.priority.toLowerCase()}</Badge>
              </div>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">Lead:</span> {project.lead.name}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">Progress:</span> {project.progress}%
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">Start:</span> {formatDate(project.startDate)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">Due:</span> {formatDate(project.dueDate)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">Members:</span>{' '}
                  {project.members.length}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">Tasks:</span>{' '}
                  {project._count.tasks}
                </p>
                {project.venture ? (
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-white">Venture:</span> {project.venture.name}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Team lead</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{project.lead.name} • {project.lead.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Team members</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.members.map((member) => (
                <Badge key={member.id} className="rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {member.name}
                </Badge>
              ))}
            </div>
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
