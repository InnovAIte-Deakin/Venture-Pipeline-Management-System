import type {
  Announcement,
  CreateAnnouncementInput,
  CreateProjectInput,
  CreateTeamEventInput,
  CreateTeamMemberInput,
  Project,
  TeamEvent,
  TeamMember,
  TeamPagination,
  TeamEventRecurrence,
  UpdateAnnouncementInput,
  UpdateProjectInput,
  UpdateTeamEventInput,
  UpdateTeamMemberInput,
} from '@/app/dashboard/(g5-platform-operations)/team-management/types/team-management'

export class ApiError extends Error {
  public readonly status: number
  public readonly payload: unknown

  constructor(message: string, status: number, payload?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

const isJsonResponse = (contentType: string | null) =>
  contentType?.includes('application/json')

const buildQueryString = (params?: Record<string, string | number | boolean | undefined>) => {
  if (!params) {
    return ''
  }

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    searchParams.append(key, String(value))
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

const parseJson = async (response: Response) => {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')
  if (!isJsonResponse(contentType)) {
    return null
  }

  return response.json()
}

interface RequestOptions<B> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  queryParams?: Record<string, string | number | boolean | undefined>
  body?: B
}

const request = async <T, B = unknown>(
  path: string,
  { method = 'GET', queryParams, body }: RequestOptions<B> = {},
): Promise<T> => {
  const queryString = buildQueryString(queryParams)
  const url = `${path}${queryString}`
  const headers: HeadersInit = {}
  const init: RequestInit = { method, headers }

  if (body !== undefined && method !== 'GET') {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }

  const response = await fetch(url, init)
  const parsed = await parseJson(response)

  if (!response.ok) {
    const errorMessage =
      parsed && typeof parsed === 'object' && 'error' in parsed
        ? String((parsed as any).error)
        : response.statusText || 'Request failed'
    throw new ApiError(errorMessage, response.status, parsed)
  }

  return parsed as T
}

export const teamApi = {
  members: {
    list: (queryParams?: { search?: string; role?: string; limit?: number; page?: number }) =>
      request<{ members: TeamMember[]; pagination: TeamPagination }>('/api/team/members', {
        method: 'GET',
        queryParams,
      }),
    create: (body: CreateTeamMemberInput) =>
      request<TeamMember>('/api/team/members', { method: 'POST', body }),
    update: (id: string, body: UpdateTeamMemberInput) =>
      request<TeamMember>(`/api/team/members/${id}`, { method: 'PUT', body }),
  },
  projects: {
    list: (queryParams?: {
      search?: string
      status?: string
      priority?: string
      leadId?: string
      limit?: number
      page?: number
    }) =>
      request<{ projects: Project[]; pagination: TeamPagination }>('/api/team/projects', {
        method: 'GET',
        queryParams,
      }),
    create: (body: CreateProjectInput) =>
      request<Project>('/api/team/projects', { method: 'POST', body }),
    update: (id: string, body: UpdateProjectInput) =>
      request<Project>(`/api/team/projects/${id}`, { method: 'PUT', body }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/team/projects/${id}`, { method: 'DELETE' }),
  },
  events: {
    list: (queryParams?: {
      search?: string
      organizerId?: string
      attendeeId?: string
      startDate?: string
      endDate?: string
      limit?: number
      page?: number
    }) =>
      request<{ events: TeamEvent[]; pagination: TeamPagination }>('/api/team/events', {
        method: 'GET',
        queryParams,
      }),
    create: (body: CreateTeamEventInput) =>
      request<TeamEvent>('/api/team/events', { method: 'POST', body }),
    update: (id: string, body: UpdateTeamEventInput) =>
      request<TeamEvent>(`/api/team/events/${id}`, { method: 'PUT', body }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/team/events/${id}`, { method: 'DELETE' }),
  },
  announcements: {
    list: (queryParams?: {
      search?: string
      priority?: string
      isActive?: boolean
      authorId?: string
      limit?: number
      page?: number
    }) =>
      request<{ announcements: Announcement[]; pagination: TeamPagination }>('/api/team/announcements', {
        method: 'GET',
        queryParams,
      }),
    create: (body: CreateAnnouncementInput) =>
      request<Announcement>('/api/team/announcements', { method: 'POST', body }),
    update: (id: string, body: UpdateAnnouncementInput) =>
      request<Announcement>(`/api/team/announcements/${id}`, { method: 'PUT', body }),
    remove: (id: string) =>
      request<{ message: string }>(`/api/team/announcements/${id}`, { method: 'DELETE' }),
  },
}
