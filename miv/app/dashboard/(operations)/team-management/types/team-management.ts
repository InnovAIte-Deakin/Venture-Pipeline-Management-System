export type TeamMemberRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'ANALYST'
  | 'USER'
  | 'VENTURE_MANAGER'
  | 'GEDSI_ANALYST'
  | 'CAPITAL_FACILITATOR'
  | 'EXTERNAL_STAKEHOLDER'

export type ProjectStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED'

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type EventFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface TeamMember {
  id: string
  name: string
  role: TeamMemberRole
  email: string
  organization?: string | null
  image?: string | null
  emailVerified?: string | null
  createdAt: string
  updatedAt: string
  ledProjects: Array<{ id: string; name: string; status: ProjectStatus }>
  projectMemberships: Array<{ id: string; name: string; status: ProjectStatus }>
  assignedTasks: Array<{ id: string; name: string; status: string; dueDate?: string | null }>
  _count: {
    ledProjects: number
    projectMemberships: number
    assignedTasks: number
  }
}

export interface TeamMemberMinimal {
  id: string
  name: string
  email: string
  role: TeamMemberRole
  organization?: string | null
  image?: string | null
}

export interface CreateTeamMemberInput {
  name: string
  email: string
  role: TeamMemberRole
  organization?: string
  phone?: string
  skills?: string[]
  bio?: string
  image?: string
}

export interface UpdateTeamMemberInput {
  name?: string
  email?: string
  role?: TeamMemberRole
  organization?: string
  image?: string
}

export interface Project {
  id: string
  name: string
  description?: string | null
  status: ProjectStatus
  priority: ProjectPriority
  progress: number
  dueDate?: string | null
  startDate?: string | null
  completedAt?: string | null
  lead: TeamMemberMinimal
  members: TeamMemberMinimal[]
  venture?: {
    id: string
    name: string
    sector: string
  } | null
  _count: {
    tasks: number
    members: number
  }
}

export interface CreateProjectInput {
  name: string
  description?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  dueDate?: string
  startDate?: string
  budget?: number
  tags?: string[]
  leadId: string
  memberIds?: string[]
  ventureId?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  progress?: number
  dueDate?: string
  startDate?: string
  completedAt?: string
  budget?: number
  tags?: string[]
  leadId?: string
  memberIds?: string[]
  ventureId?: string
}

export interface TeamEventRecurrence {
  frequency?: EventFrequency
  interval?: number
  endDate?: string
  count?: number
}

export interface TeamEvent {
  id: string
  title: string
  description?: string | null
  date: string
  time?: string | null
  location?: string | null
  isAllDay: boolean
  isRecurring: boolean
  recurrence?: TeamEventRecurrence | null
  createdAt: string
  updatedAt: string
  organizer: TeamMemberMinimal
  attendees: TeamMemberMinimal[]
  _count: {
    attendees: number
  }
}

export interface CreateTeamEventInput {
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  isAllDay?: boolean
  isRecurring?: boolean
  recurrence?: TeamEventRecurrence
  organizerId: string
  attendeeIds?: string[]
}

export interface UpdateTeamEventInput {
  title?: string
  description?: string
  date?: string
  time?: string
  location?: string
  isAllDay?: boolean
  isRecurring?: boolean
  recurrence?: TeamEventRecurrence
  attendeeIds?: string[]
}

export interface Announcement {
  id: string
  title: string
  content: string
  priority: ProjectPriority
  isActive: boolean
  expiresAt?: string | null
  createdAt: string
  updatedAt: string
  author: TeamMemberMinimal
}

export interface CreateAnnouncementInput {
  title: string
  content: string
  priority?: ProjectPriority
  isActive?: boolean
  expiresAt?: string
  authorId: string
}

export interface UpdateAnnouncementInput {
  title?: string
  content?: string
  priority?: ProjectPriority
  isActive?: boolean
  expiresAt?: string
}

export interface TeamPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export type PaginatedResponse<K extends string, T> = {
  pagination: TeamPagination
} & Record<K, T>
