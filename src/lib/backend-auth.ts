import crypto from 'node:crypto'
import type { UserRole } from '@prisma/client'

export const BACKEND_AUTH_COOKIE = 'payload-token'

export type BackendTokenPayload = {
  uid: string
  email: string
  role: string
  exp: number
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url')
}

function base64urlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8')
}

function getTokenSecret(): string {
  return process.env.NEXTAUTH_SECRET || process.env.PAYLOAD_SECRET || 'dev-insecure-change-me'
}

function signValue(value: string): string {
  return crypto.createHmac('sha256', getTokenSecret()).update(value).digest('base64url')
}

export function issueBackendToken(input: { uid: string; email: string; role: string }, ttlSeconds = 60 * 60 * 24 * 7): string {
  const payload: BackendTokenPayload = {
    uid: input.uid,
    email: input.email,
    role: input.role,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  }

  const encodedPayload = base64urlEncode(JSON.stringify(payload))
  const signature = signValue(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifyBackendToken(token: string | undefined): BackendTokenPayload | null {
  if (!token) return null
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null

  const expected = signValue(encodedPayload)
  if (signature !== expected) return null

  try {
    const payload = JSON.parse(base64urlDecode(encodedPayload)) as BackendTokenPayload
    if (!payload?.uid || !payload?.email || !payload?.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function normalizeRole(role: UserRole | string | null | undefined): string {
  return (role || 'USER').toLowerCase()
}

export function splitDisplayName(name: string | null | undefined): { firstName: string; lastName: string } {
  if (!name) return { firstName: '', lastName: '' }
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

export function buildDisplayName(firstName: string | undefined, lastName: string | undefined, fallback: string | null | undefined): string {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim()
  if (fullName) return fullName
  return fallback || ''
}
