import type {
  ProjectPriority,
  ProjectStatus,
  TeamEvent,
  TeamMember,
} from '@/app/dashboard/(operations)/team-management/types/team-management'

export const projectStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'Completed'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'NOT_STARTED':
      return 'Not Started'
    case 'ON_HOLD':
      return 'On Hold'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return status
  }
}

export const projectStatusClassName = (status: ProjectStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'NOT_STARTED':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'ON_HOLD':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const priorityClassName = (priority: ProjectPriority) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'LOW':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const formatDate = (date: string | null | undefined) => {
  if (!date) return 'No date set'
  const parsed = new Date(date)
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string | null | undefined, time?: string | null) => {
  if (!date) return 'No date set'
  const parsed = new Date(date)
  const dateString = parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  return time ? `${dateString} at ${time}` : dateString
}

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export const getMemberDisplayName = (member: TeamMember) => member.name || member.email

export const eventLabel = (event: TeamEvent) =>
  `${event.title} • ${formatDateTime(event.date, event.time || undefined)}`
