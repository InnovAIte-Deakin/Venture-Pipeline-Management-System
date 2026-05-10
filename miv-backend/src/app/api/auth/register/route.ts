import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import type { User } from '@/payload-types'

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const RegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// ─── POST /api/auth/register ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null)
    if (!rawBody) {
      return NextResponse.json(
        { success: false, message: 'Request body must be valid JSON.' },
        { status: 400 },
      )
    }

    const parsed = RegisterSchema.safeParse(rawBody)
    if (!parsed.success) {
      const message =
        parsed.error.errors[0]?.message ?? 'Invalid registration data.'
      return NextResponse.json(
        { success: false, message },
        { status: 400 },
      )
    }

    const { firstName, lastName, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase()

    const payload = await getPayload({ config })

    // Duplicate email check
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      return NextResponse.json(
        { success: false, message: 'An account with that email already exists.' },
        { status: 409 },
      )
    }

    // Create user — role defaults to 'founder' for new self-registrations
    const user = (await payload.create({
      collection: 'users',
      data: {
        first_name: firstName,
        last_name: lastName,
        email: normalizedEmail,
        password,
        role: 'founder',
      },
    })) as User

    // Immediately log the user in to obtain an auth token
    const auth = await payload.login({
      collection: 'users',
      data: { email: normalizedEmail, password },
    })

    const isProduction = process.env.NODE_ENV === 'production'

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      },
      { status: 201 },
    )

    if (auth?.token) {
      response.cookies.set('payload-token', auth.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        maxAge: AUTH_COOKIE_MAX_AGE,
        path: '/',
      })
    }

    return response
  } catch (error: unknown) {
    console.error('[Register] Unhandled error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create account. Please try again.' },
      { status: 500 },
    )
  }
}
