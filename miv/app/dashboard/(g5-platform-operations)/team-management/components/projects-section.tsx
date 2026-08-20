"use client"

import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DemoProject {
  id: string
  name: string
  lead: string
  status: 'In Progress' | 'In Review' | 'Planning' | 'Completed'
  priority: 'High' | 'Medium' | 'Low'
  progress: number
  dueDate: string
}

const demoProjects: DemoProject[] = [
  { id: 'authentication', name: 'VPMS Authentication', lead: 'Sarah Lee', status: 'In Progress', priority: 'High', progress: 75, dueDate: '28 Aug 2026' },
  { id: 'capital-facilitation', name: 'Capital Facilitation', lead: 'Alex Morgan', status: 'In Review', priority: 'High', progress: 90, dueDate: '24 Aug 2026' },
  { id: 'team-refactor', name: 'Team Management Refactor', lead: 'Priya Shah', status: 'In Progress', priority: 'Medium', progress: 80, dueDate: '26 Aug 2026' },
  { id: 'analytics', name: 'Analytics Dashboard', lead: 'Daniel Kim', status: 'Planning', priority: 'Medium', progress: 35, dueDate: '5 Sep 2026' },
]

const statusClass = (status: DemoProject['status']) => status === 'In Progress' ? 'border-0 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : status === 'In Review' ? 'border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' : status === 'Completed' ? 'border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'border-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
const priorityClass = (priority: DemoProject['priority']) => priority === 'High' ? 'border-0 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : priority === 'Medium' ? 'border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' : 'border-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'

export function ProjectsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const visibleProjects = useMemo(() => demoProjects.filter((project) => {
    const matchesSearch = `${project.name} ${project.lead}`.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && (statusFilter === 'All statuses' || project.status === statusFilter)
  }), [searchQuery, statusFilter])

  return <section className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team Projects</h2><p className="text-sm text-slate-600 dark:text-slate-400">Track current work, ownership and delivery progress.</p><p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Demo interface for Team Management workflow presentation.</p></div><div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"><div className="relative w-full sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-10" placeholder="Search projects" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div><select aria-label="Status Filter" className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option>In Progress</option><option>In Review</option><option>Planning</option><option>Completed</option></select><Button className="w-full sm:w-auto"><Plus className="h-4 w-4" />New Project</Button></div></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Active Projects', '6'], ['In Review', '2'], ['Completed', '9'], ['Team Contributors', '12']].map(([label, value]) => <div key={label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p></div>)}</div>
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="border-b px-4 py-4 sm:px-6"><h3 className="font-semibold text-slate-900 dark:text-white">Projects</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[840px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400"><tr>{['Project', 'Lead', 'Status', 'Priority', 'Progress', 'Due Date', 'Actions'].map((heading) => <th key={heading} className="px-4 py-3 font-medium sm:px-6">{heading}</th>)}</tr></thead><tbody className="divide-y dark:divide-slate-800">{visibleProjects.map((project) => <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50"><td className="px-4 py-4 font-medium text-slate-900 sm:px-6 dark:text-white">{project.name}</td><td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{project.lead}</td><td className="px-4 py-4 sm:px-6"><Badge className={statusClass(project.status)}>{project.status}</Badge></td><td className="px-4 py-4 sm:px-6"><Badge className={priorityClass(project.priority)}>{project.priority}</Badge></td><td className="px-4 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-teal-500" style={{ width: `${project.progress}%` }} /></div><span className="text-xs text-slate-500">{project.progress}%</span></div></td><td className="px-4 py-4 text-slate-600 sm:px-6 dark:text-slate-300">{project.dueDate}</td><td className="px-4 py-4 sm:px-6"><Button variant="ghost" size="sm" aria-label={`View ${project.name}`}><MoreHorizontal className="h-4 w-4" /></Button></td></tr>)}{visibleProjects.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">No demo projects match your search.</td></tr>}</tbody></table></div></div>
  </section>
}