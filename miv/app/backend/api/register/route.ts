import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  BACKEND_AUTH_COOKIE,
  buildDisplayName,
  issueBackendToken,
  normalizeRole,
  splitDisplayName,
} from '@/lib/backend-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const firstName = String(body?.firstName || '').trim()
    const lastName = String(body?.lastName || '').trim()
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (!firstName || !lastName || !email || password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Invalid registration data' },
        { status: 400 },
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with that email already exists.' },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        name: buildDisplayName(firstName, lastName, null),
        passwordHash,
        role: 'USER',
      },
    })

    const role = normalizeRole(user.role)
    const token = issueBackendToken({ uid: user.id, email: user.email, role })
    const name = splitDisplayName(user.name)

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: name.firstName,
          lastName: name.lastName,
          role,
        },
      },
      { status: 201 },
    )

    response.cookies.set(BACKEND_AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('POST /backend/api/register error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create account. Please try again.' },
      { status: 500 },
    )
  }
}
