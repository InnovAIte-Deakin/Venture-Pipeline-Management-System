"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Project, TeamMember, ProjectStatus, ProjectPriority, UpdateProjectInput } from '@/types/team-management'

interface ProjectFormDialogProps {
  open: boolean
  project?: Project | null
  members: TeamMember[]
  loading?: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UpdateProjectInput) => Promise<void>
}

const statuses: ProjectStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']
const priorities: ProjectPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export function ProjectFormDialog({
  open,
  project,
  members,
  loading = false,
  error,
  onOpenChange,
  onSubmit,
}: ProjectFormDialogProps) {
  const [formValue, setFormValue] = React.useState<UpdateProjectInput>({
    name: project?.name,
    description: project?.description || undefined,
    status: project?.status,
    priority: project?.priority,
    dueDate: project?.dueDate ?? undefined,
    startDate: project?.startDate ?? undefined,
    leadId: project?.lead.id,
    memberIds: project?.members.map((member) => member.id) ?? undefined,
  })

  React.useEffect(() => {
    setFormValue({
      name: project?.name,
      description: project?.description ?? undefined,
      status: project?.status,
      priority: project?.priority,
      dueDate: project?.dueDate ?? undefined,
      startDate: project?.startDate ?? undefined,
      leadId: project?.lead.id,
      memberIds: project?.members.map((member) => member.id) ?? undefined,
    })
  }, [project])

  const handleField = (key: keyof UpdateProjectInput, value: string | string[] | undefined) => {
    setFormValue((current) => ({ ...current, [key]: value }))
  }

  const handleMemberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value)
    handleField('memberIds', selected)
  }

  const handleSubmit = async () => {
    await onSubmit(formValue)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? 'Update project' : 'Create project'}</DialogTitle>
          <DialogDescription>{project ? 'Edit project details.' : 'Fill in the new project information.'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Name</Label>
            <Input
              id="projectName"
              value={formValue.name ?? ''}
              onChange={(event) => handleField('name', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea
              id="projectDescription"
              value={formValue.description ?? ''}
              onChange={(event) => handleField('description', event.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectStatus">Status</Label>
              <Select
                value={formValue.status ?? ''}
                onValueChange={(value) => handleField('status', value as ProjectStatus)}
              >
                <SelectTrigger id="projectStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ').toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectPriority">Priority</Label>
              <Select
                value={formValue.priority ?? ''}
                onValueChange={(value) => handleField('priority', value as ProjectPriority)}
              >
                <SelectTrigger id="projectPriority">
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
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectLead">Project lead</Label>
              <Select
                value={formValue.leadId ?? ''}
                onValueChange={(value) => handleField('leadId', value)}
              >
                <SelectTrigger id="projectLead">
                  <SelectValue placeholder="Select lead" />
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
              <Label htmlFor="projectMembers">Team members</Label>
              <select
                id="projectMembers"
                className="h-32 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                multiple
                value={formValue.memberIds ?? []}
                onChange={handleMemberChange}
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectStartDate">Start date</Label>
              <Input
                id="projectStartDate"
                type="date"
                value={formValue.startDate ?? ''}
                onChange={(event) => handleField('startDate', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDueDate">Due date</Label>
              <Input
                id="projectDueDate"
                type="date"
                value={formValue.dueDate ?? ''}
                onChange={(event) => handleField('dueDate', event.target.value)}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {project ? 'Save project' : 'Create project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
