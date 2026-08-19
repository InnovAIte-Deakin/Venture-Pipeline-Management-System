"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TeamMember, TeamMemberRole, UpdateTeamMemberInput } from '@/types/team-management'

interface MemberFormDialogProps {
  open: boolean
  member?: TeamMember | null
  roles: TeamMemberRole[]
  loading?: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UpdateTeamMemberInput) => Promise<void>
}

export function MemberFormDialog({
  open,
  member,
  roles,
  loading = false,
  error,
  onOpenChange,
  onSubmit,
}: MemberFormDialogProps) {
  const [formState, setFormState] = React.useState<UpdateTeamMemberInput>({})

  React.useEffect(() => {
    if (member) {
      setFormState({
        name: member.name,
        email: member.email,
        role: member.role,
        organization: member.organization ?? undefined,
      })
    } else {
      setFormState({})
    }
  }, [member])

  const handleChange = (field: keyof UpdateTeamMemberInput, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async () => {
    await onSubmit(formState)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit team member' : 'Add team member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Update the member details.' : 'Create a new team member.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="memberName">Name</Label>
            <Input
              id="memberName"
              value={formState.name ?? ''}
              onChange={(event) => handleChange('name', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memberEmail">Email</Label>
            <Input
              id="memberEmail"
              type="email"
              value={formState.email ?? ''}
              onChange={(event) => handleChange('email', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memberRole">Role</Label>
            <Select
              value={formState.role ?? ''}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger id="memberRole">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace('_', ' ').toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="memberOrganization">Organization</Label>
            <Input
              id="memberOrganization"
              value={formState.organization ?? ''}
              onChange={(event) => handleChange('organization', event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {member ? 'Save changes' : 'Create member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
