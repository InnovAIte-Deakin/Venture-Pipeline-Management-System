"use client"

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SummaryCard } from '@/app/dashboard/(g5-platform-operations)/team-management/components/summary-card'
import {
  demoMembers,
  memberSummary,
  type DemoMember,
} from '@/lib/team-management/demo-data'

const statusBadgeClass = (status: DemoMember['status']) => {
  if (status === 'Active') {
    return 'border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
  }
  if (status === 'Away') {
    return 'border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
  }
  return 'border-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
}

const roleOptions = ['All roles', ...Array.from(new Set(demoMembers.map((member) => member.role)))]

export function MembersSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All roles')

  const visibleMembers = useMemo(
    () =>
      demoMembers.filter((member) => {
        const matchesSearch = `${member.name} ${member.role} ${member.project} ${member.responsibilities}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'All roles' || member.role === roleFilter
        return matchesSearch && matchesRole
      }),
    [roleFilter, searchQuery],
  )

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team Members</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          View team members, roles, responsibilities and current project involvement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Members" value={memberSummary.totalMembers} />
        <SummaryCard label="Active Members" value={memberSummary.activeMembers} />
        <SummaryCard label="Team Leads" value={memberSummary.teamLeads} />
        <SummaryCard label="Active Projects" value={memberSummary.activeProjects} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Search members"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <select
          aria-label="Filter by Role"
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 md:w-56 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
        >
          {roleOptions.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                {['Member', 'Role', 'Project', 'Responsibilities', 'Status', 'Last Activity'].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-medium sm:px-6">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {visibleMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-4 font-medium text-slate-900 sm:px-6 dark:text-white">{member.name}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{member.role}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{member.project}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{member.responsibilities}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <Badge className={statusBadgeClass(member.status)}>{member.status}</Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{member.lastActivity}</td>
                </tr>
              ))}
              {visibleMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                    No members match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
