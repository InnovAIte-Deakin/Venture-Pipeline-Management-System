import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  BACKEND_AUTH_COOKIE,
  buildDisplayName,
  normalizeRole,
  splitDisplayName,
  verifyBackendToken,
} from '@/lib/backend-auth'

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get(BACKEND_AUTH_COOKIE)?.value
  const payload = verifyBackendToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({ where: { id: payload.uid } })
  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid or expired session.' },
        { status: 401 },
      )
    }

    const name = splitDisplayName(user.name)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: name.firstName,
        lastName: name.lastName,
        role: normalizeRole(user.role),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('GET /backend/api/users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid or expired session.' },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => null)
    const firstName = body?.firstName !== undefined ? String(body.firstName).trim() : undefined
    const lastName = body?.lastName !== undefined ? String(body.lastName).trim() : undefined
    const email = body?.email !== undefined ? String(body.email).trim().toLowerCase() : undefined

    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Email taken', message: 'This email is already in use by another account.' },
          { status: 409 },
        )
      }
    }

    const currentName = splitDisplayName(user.name)
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email || user.email,
        name: buildDisplayName(
          firstName !== undefined ? firstName : currentName.firstName,
          lastName !== undefined ? lastName : currentName.lastName,
          user.name,
        ),
      },
    })

    const updatedName = splitDisplayName(updated.name)

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updatedName.firstName,
        lastName: updatedName.lastName,
        role: normalizeRole(updated.role),
      },
    })
  } catch (error) {
    console.error('PATCH /backend/api/users error:', error)
    return NextResponse.json(
      { success: false, error: 'Update failed', message: 'An error occurred while updating your profile.' },
      { status: 500 },
    )
  }
}
