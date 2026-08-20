"use client"

import { useMemo, useState } from 'react'
import { Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface DemoMember {
  id: string
  name: string
  role: string
  team: string
  status: 'Active' | 'Inactive'
  lastActivity: string
}

const demoMembers: DemoMember[] = [
  { id: 'alex-morgan', name: 'Alex Morgan', role: 'Frontend Developer', team: 'Frontend', status: 'Active', lastActivity: 'Today' },
  { id: 'sarah-lee', name: 'Sarah Lee', role: 'Team Lead', team: 'Frontend', status: 'Active', lastActivity: 'Yesterday' },
  { id: 'daniel-kim', name: 'Daniel Kim', role: 'UI/UX Designer', team: 'Design', status: 'Active', lastActivity: '2 days ago' },
  { id: 'priya-shah', name: 'Priya Shah', role: 'Frontend Developer', team: 'Frontend', status: 'Active', lastActivity: 'Today' },
  { id: 'michael-chen', name: 'Michael Chen', role: 'QA Contributor', team: 'Quality', status: 'Inactive', lastActivity: '5 days ago' },
]

const badgeClass = 'border-0 bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'

export function MembersSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All roles')
  const visibleMembers = useMemo(() => demoMembers.filter((member) => {
    const matchesSearch = `${member.name} ${member.role} ${member.team}`.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && (roleFilter === 'All roles' || member.role === roleFilter)
  }), [roleFilter, searchQuery])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team Members</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage team access, roles and participation.</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Demo interface for Team Management workflow presentation.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search team members"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <select aria-label="Filter by Role" className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option>All roles</option>
            <option>Frontend Developer</option>
            <option>Team Lead</option>
            <option>UI/UX Designer</option>
            <option>QA Contributor</option>
          </select>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Total Members', '12'], ['Active Members', '10'], ['Team Leads', '3'], ['Frontend Contributors', '5']].map(([label, value]) => <div key={label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p></div>)}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b px-4 py-4 sm:px-6"><Filter className="h-4 w-4 text-teal-600" /><h3 className="font-semibold text-slate-900 dark:text-white">Team Members</h3></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400"><tr>{['Name', 'Role', 'Team', 'Status', 'Last Activity', 'Actions'].map((heading) => <th key={heading} className="px-4 py-3 font-medium sm:px-6">{heading}</th>)}</tr></thead><tbody className="divide-y dark:divide-slate-800">{visibleMembers.map((member) => <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-4 font-medium text-slate-900 sm:px-6 dark:text-white">{member.name}</td><td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{member.role}</td><td className="px-4 py-4 sm:px-6"><Badge className={badgeClass}>{member.team}</Badge></td><td className="px-4 py-4 sm:px-6"><Badge className={member.status === 'Active' ? badgeClass : 'border-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}>{member.status}</Badge></td><td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{member.lastActivity}</td><td className="px-4 py-4 sm:px-6"><Button variant="ghost" size="sm" aria-label={`View ${member.name}`}><MoreHorizontal className="h-4 w-4" /></Button></td></tr>)}{visibleMembers.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No demo members match your search.</td></tr>}</tbody></table></div>
      </div>
    </section>
  )
}
