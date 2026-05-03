import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null)
    if (!rawBody) {
      return NextResponse.json(
        { success: false, message: 'Request body must be valid JSON.' },
        { status: 400 },
      )
    }

    const validation = LoginSchema.safeParse(rawBody)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0]?.message ?? 'Invalid input.' },
        { status: 400 },
      )
    }

    const { email, password } = validation.data

    const payload = await getPayload({ config })

    let result: Awaited<ReturnType<typeof payload.login>>
    try {
      result = await payload.login({
        collection: 'users',
        data: { email: email.toLowerCase(), password },
      })
    } catch (authError: unknown) {
      const msg = authError instanceof Error ? authError.message : ''
      const isInvalidCreds =
        msg.includes('Invalid login attempt') ||
        msg.includes('Incorrect password') ||
        msg.includes('Your account has been locked') ||
        msg.includes('not found')

      if (isInvalidCreds) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password.' },
          { status: 401 },
        )
      }

      // Unexpected error — log and return 500
      console.error('[Login] Unexpected auth error:', authError)
      return NextResponse.json(
        { success: false, message: 'An error occurred during login. Please try again.' },
        { status: 500 },
      )
    }

    if (!result.user || !result.token) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 },
      )
    }

    const isProduction = process.env.NODE_ENV === 'production'

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        role: result.user.role,
      },
    })

    response.cookies.set('payload-token', result.token, {
      httpOnly: true,
      // In dev the frontend proxies /backend/* so the browser sees one origin —
      // 'lax' is correct. In prod, if frontend/backend are on different domains,
      // change to 'none' + secure: true.
      sameSite: 'lax',
      secure: isProduction,
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error: unknown) {
    console.error('[Login] Unhandled error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred during login. Please try again.' },
      { status: 500 },
    )
  }
}

// ─── DELETE /api/auth/login — logout ─────────────────────────────────────────

export async function DELETE(_request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' })
  response.cookies.set('payload-token', '', { maxAge: 0, path: '/' })
  return response
}
