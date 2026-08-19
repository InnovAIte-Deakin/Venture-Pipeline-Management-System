"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Plus } from 'lucide-react'
import { teamApi } from '@/app/dashboard/(g5-platform-operations)/team-management/lib/team-api'
import { ProjectCard } from './project-card'
import { ProjectDetailsDialog } from './project-details-dialog'
import { ProjectFormDialog } from './project-form-dialog'
import { SectionEmptyState } from './section-empty-state'
import { SectionErrorState } from './section-error-state'
import { SectionLoadingState } from './section-loading-state'
import type { Project, TeamMember, UpdateProjectInput } from '@/app/dashboard/(g5-platform-operations)/team-management/types/team-management'

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const loadProjects = async (query = '', status = '') => {
    const requestId = ++requestRef.current
    setLoading(true)
    setError(null)
    try {
      const response = await teamApi.projects.list({ search: query, status, limit: 50 })
      if (requestId !== requestRef.current) return
      setProjects(response.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }

  const loadMembers = async () => {
    try {
      const response = await teamApi.members.list({ limit: 50 })
      setMembers(response.members)
    } catch {
      // Member list is optional for project creation if load fails.
    }
  }

  useEffect(() => {
    loadProjects('', '')
    loadMembers()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProjects(searchQuery, statusFilter)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [searchQuery, statusFilter])

  const visibleProjects = useMemo(() => projects, [projects])

  const openCreate = () => {
    setSelectedProject(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openDetails = (project: Project) => {
    setSelectedProject(project)
    setDetailsOpen(true)
  }

  const handleSubmit = async (payload: UpdateProjectInput) => {
    setSaving(true)
    setFormError(null)
    try {
      if (selectedProject) {
        const updated = await teamApi.projects.update(selectedProject.id, payload)
        setProjects((current) => current.map((project) => (project.id === updated.id ? updated : project)))
      } else {
        const created = await teamApi.projects.create(payload as any)
        setProjects((current) => [created, ...current])
      }
      setFormOpen(false)
      setSelectedProject(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save project')
      throw err
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProject) return
    setDeleting(true)
    try {
      await teamApi.projects.remove(selectedProject.id)
      setProjects((current) => current.filter((project) => project.id !== selectedProject.id))
      setDetailsOpen(false)
      setSelectedProject(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to remove project')
      throw err
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <SectionLoadingState message="Loading projects…" />
  }

  if (error) {
    return <SectionErrorState message={error} onRetry={() => loadProjects(searchQuery, statusFilter)} />
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Projects</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track progress, status, and assignments for active projects.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search projects"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="projectStatusFilter" className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
              Status
            </Label>
            <select
              id="projectStatusFilter"
              className="h-11 rounded-md border border-slate-200 bg-background px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="NOT_STARTED">Not started</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add project
          </Button>
        </div>
      </div>

      {visibleProjects.length === 0 ? (
        <SectionEmptyState
          title="No projects found"
          description="Try adjusting the filters or create a new project."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => openDetails(project)} />
          ))}
        </div>
      )}

      <ProjectFormDialog
        open={formOpen}
        project={selectedProject}
        members={members}
        loading={saving}
        error={formError ?? undefined}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null)
            setFormError(null)
          }
          setFormOpen(open)
        }}
        onSubmit={handleSubmit}
      />

      <ProjectDetailsDialog
        open={detailsOpen}
        project={selectedProject}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProject(null)
          }
          setDetailsOpen(open)
        }}
        onEdit={() => {
          setFormOpen(true)
          setDetailsOpen(false)
        }}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </section>
  )
}
