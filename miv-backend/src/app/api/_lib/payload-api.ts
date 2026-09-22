import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export type AuthContext = {
  payload: any
  user: any
}

export async function requirePayloadUser(request: NextRequest): Promise<AuthContext | NextResponse> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  return { payload, user }
}

export function getPagination(request: NextRequest, defaultLimit = 50) {
  const { searchParams } = new URL(request.url)
  const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10)
  const requestedLimit = Number.parseInt(searchParams.get('limit') || String(defaultLimit), 10)
  const page = Number.isNaN(requestedPage) ? 1 : Math.max(1, requestedPage)
  const limit = Number.isNaN(requestedLimit) ? defaultLimit : Math.max(1, Math.min(200, requestedLimit))

  return { page, limit, searchParams }
}

export function pagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  }
}

export function textSearch(fields: string[], value: string) {
  if (!value) return {}

  return {
    or: fields.map((field) => ({
      [field]: {
        like: value,
      },
    })),
  }
}

export function compactWhere(parts: Array<Record<string, unknown>>) {
  const filtered = parts.filter((part) => Object.keys(part).length > 0)

  if (filtered.length === 0) return {}
  if (filtered.length === 1) return filtered[0]

  return { and: filtered }
}

export function relationId(value: unknown) {
  if (!value) return value
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in value) return (value as { id: string }).id
  return value
}

export function userSummary(user: any) {
  if (!user) return user

  return {
    id: user.id,
    name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || user.email,
    email: user.email,
    role: user.role,
    image: user.image,
  }
}

export function withCount(doc: any, counts: Record<string, number> = {}) {
  return {
    ...doc,
    _count: counts,
  }
}
