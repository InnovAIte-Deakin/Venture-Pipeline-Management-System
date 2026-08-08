"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Plus } from 'lucide-react'
import { teamApi } from '@/lib/team-management/team-api'
import { MemberCard } from './member-card'
import { MemberDetailsDialog } from './member-details-dialog'
import { MemberFormDialog } from './member-form-dialog'
import { SectionEmptyState } from './section-empty-state'
import { SectionErrorState } from './section-error-state'
import { SectionLoadingState } from './section-loading-state'
import type { TeamMember, TeamMemberRole, UpdateTeamMemberInput } from '@/types/team-management'

const roles: TeamMemberRole[] = [
  'ADMIN',
  'MANAGER',
  'ANALYST',
  'USER',
  'VENTURE_MANAGER',
  'GEDSI_ANALYST',
  'CAPITAL_FACILITATOR',
  'EXTERNAL_STAKEHOLDER',
]

export function MembersSection() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const loadMembers = async (query = '') => {
    const requestId = ++requestRef.current
    setLoading(true)
    setError(null)
    try {
      const response = await teamApi.members.list({ search: query, limit: 50 })
      if (requestId !== requestRef.current) return
      setMembers(response.members)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers('')
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadMembers(searchQuery)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const visibleMembers = useMemo(
    () => members,
    [members],
  )

  const openCreate = () => {
    setSelectedMember(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openDetails = (member: TeamMember) => {
    setSelectedMember(member)
    setDetailsOpen(true)
  }

  const handleSubmit = async (payload: UpdateTeamMemberInput) => {
    setSaving(true)
    setFormError(null)
    try {
      if (selectedMember) {
        const updated = await teamApi.members.update(selectedMember.id, payload)
        setMembers((current) => current.map((member) => (member.id === updated.id ? updated : member)))
      } else {
        const created = await teamApi.members.create(payload as any)
        setMembers((current) => [created, ...current])
      }
      setFormOpen(false)
      setSelectedMember(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save member')
      throw err
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <SectionLoadingState message="Loading members…" />
  }

  if (error) {
    return <SectionErrorState message={error} onRetry={() => loadMembers(searchQuery)} />
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team Members</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Search, add, and edit your core team members.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search members"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add member
          </Button>
        </div>
      </div>

      {visibleMembers.length === 0 ? (
        <SectionEmptyState
          title="No members found"
          description="Try a different search term or add a new team member."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleMembers.map((member) => (
            <MemberCard key={member.id} member={member} onClick={() => openDetails(member)} />
          ))}
        </div>
      )}

      <MemberFormDialog
        open={formOpen}
        member={selectedMember}
        roles={roles}
        loading={saving}
        error={formError ?? undefined}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMember(null)
            setFormError(null)
          }
          setFormOpen(open)
        }}
        onSubmit={handleSubmit}
      />

      <MemberDetailsDialog
        open={detailsOpen}
        member={selectedMember}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMember(null)
          }
          setDetailsOpen(open)
        }}
      />
    </section>
  )
}
