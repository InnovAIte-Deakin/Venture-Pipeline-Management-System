"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Mail, Award, Briefcase } from 'lucide-react'
import { formatDate, getInitials } from '@/app/dashboard/(operations)/team-management/lib/team-utils'
import type { TeamMember } from '@/app/dashboard/(operations)/team-management/types/team-management'

interface MemberDetailsDialogProps {
  open: boolean
  member: TeamMember | null
  onOpenChange: (open: boolean) => void
}

export function MemberDetailsDialog({ open, member, onOpenChange }: MemberDetailsDialogProps) {
  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              {member.image ? (
                <AvatarImage src={member.image} alt={member.name} />
              ) : (
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <DialogTitle>{member.name}</DialogTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
            </div>
          </div>
          <DialogDescription>{member.organization || 'Team member profile'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Contact</span>
            </div>
            <p>{member.email}</p>
            <p>{formatDate(member.createdAt)}</p>
            {member.emailVerified ? <p className="text-sm text-emerald-500">Email verified</p> : null}
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Award className="h-4 w-4" />
              <span className="font-medium">Activity</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{member._count.ledProjects}</p>
                <p>Led projects</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{member._count.projectMemberships}</p>
                <p>Memberships</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{member._count.assignedTasks}</p>
                <p>Active tasks</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Leading</h3>
            {member.ledProjects.length > 0 ? (
              <ul className="space-y-2 pt-2">
                {member.ledProjects.map((project) => (
                  <li key={project.id} className="text-sm text-slate-700 dark:text-slate-300">
                    • {project.name} ({project.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No leading projects yet.</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Memberships</h3>
            {member.projectMemberships.length > 0 ? (
              <ul className="space-y-2 pt-2">
                {member.projectMemberships.map((project) => (
                  <li key={project.id} className="text-sm text-slate-700 dark:text-slate-300">
                    • {project.name} ({project.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No project memberships yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
