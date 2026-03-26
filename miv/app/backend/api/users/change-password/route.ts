import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { BACKEND_AUTH_COOKIE, verifyBackendToken } from '@/lib/backend-auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(BACKEND_AUTH_COOKIE)?.value
    const auth = verifyBackendToken(token)

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to change your password.',
        },
        { status: 401 },
      )
    }

    const user = await prisma.user.findUnique({ where: { id: auth.uid } })
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Invalid or expired session.' },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => null)
    const currentPassword = String(body?.currentPassword || '')
    const newPassword = String(body?.newPassword || '')
    const confirmPassword = String(body?.confirmPassword || '')

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', message: 'All password fields are required.' },
        { status: 400 },
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', message: 'New password must be at least 8 characters.' },
        { status: 400 },
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', message: 'Passwords do not match' },
        { status: 400 },
      )
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid password', message: 'Current password is incorrect.' },
        { status: 400 },
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('POST /backend/api/users/change-password error:', error)
    return NextResponse.json(
      { success: false, error: 'Password change failed' },
      { status: 500 },
    )
  }
}
