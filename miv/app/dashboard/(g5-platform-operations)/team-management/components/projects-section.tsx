"use client"

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { demoProjects, type DemoProject } from '@/lib/team-management/demo-data'

const statusClass = (status: DemoProject['status']) =>
  status === 'In Progress'
    ? 'border-0 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
    : status === 'In Review'
      ? 'border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
      : status === 'Completed'
        ? 'border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
        : 'border-0 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'

const priorityClass = (priority: DemoProject['priority']) =>
  priority === 'High'
    ? 'border-0 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
    : priority === 'Medium'
      ? 'border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
      : 'border-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'

const statusOptions = ['All statuses', ...Array.from(new Set(demoProjects.map((project) => project.status)))]

export function ProjectsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')

  const visibleProjects = useMemo(
    () =>
      demoProjects.filter((project) => {
        const matchesSearch = `${project.name} ${project.owner}`.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'All statuses' || project.status === statusFilter
        return matchesSearch && matchesStatus
      }),
    [searchQuery, statusFilter],
  )

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Projects</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track current project areas, ownership, progress and implementation status.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Search projects"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <select
          aria-label="Status Filter"
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                {['Project', 'Owner', 'Progress', 'Priority', 'Status', 'Last Updated'].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-medium sm:px-6">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {visibleProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-4 font-medium text-slate-900 sm:px-6 dark:text-white">{project.name}</td>
                  <td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{project.owner}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress} className="h-2 w-24" />
                      <span className="text-xs text-slate-500">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <Badge className={priorityClass(project.priority)}>{project.priority}</Badge>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <Badge className={statusClass(project.status)}>{project.status}</Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{project.lastUpdated}</td>
                </tr>
              ))}
              {visibleProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                    No projects match your search.
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