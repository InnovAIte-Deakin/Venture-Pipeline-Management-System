import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  BACKEND_AUTH_COOKIE,
  issueBackendToken,
  normalizeRole,
  splitDisplayName,
} from '@/lib/backend-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const role = normalizeRole(user.role)
    const token = issueBackendToken({ uid: user.id, email: user.email, role })
    const name = splitDisplayName(user.name)

    const response = NextResponse.json({
      success: true,
      message: 'Authentication Passed',
      user: {
        id: user.id,
        email: user.email,
        role,
        firstName: name.firstName,
        lastName: name.lastName,
      },
    })

    response.cookies.set(BACKEND_AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('POST /backend/api/users/login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 },
    )
  }
}
