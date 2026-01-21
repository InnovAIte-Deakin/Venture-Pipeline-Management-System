import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

// Schema for password change
const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// POST /api/users/change-password - Change password for current user
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to change your password.',
        },
        { status: 401 },
      )
    }

    // Verify the token and get the user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired session.',
        },
        { status: 401 },
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = ChangePasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 },
      )
    }

    const { currentPassword, newPassword } = validation.data

    // Verify current password by attempting to login
    try {
      await payload.login({
        collection: 'users',
        data: {
          email: user.email,
          password: currentPassword,
        },
      })
    } catch (_err) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid password',
          message: 'Current password is incorrect.',
        },
        { status: 400 },
      )
    }

    // Update the password
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: newPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Password change failed',
        message: 'An error occurred while changing your password.',
      },
      { status: 500 },
    )
  }
}
