import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

// Schema for profile update
const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Valid email is required').optional(),
})

// GET /api/users - Get current authenticated user
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to access this resource.',
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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user',
        message: 'An error occurred while fetching user data.',
      },
      { status: 500 },
    )
  }
}

// PATCH /api/users - Update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to update your profile.',
        },
        { status: 401 },
      )
    }

    // Verify the token and get the user
    const { user: authUser } = await payload.auth({ headers: request.headers })

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired session.',
        },
        { status: 401 },
      )
    }

    // Fetch the full user record to get all required fields
    const user = await payload.findByID({
      collection: 'users',
      id: authUser.id,
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'Authenticated user does not exist.',
        },
        { status: 404 },
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = ProfileUpdateSchema.safeParse(body)
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

    const { firstName, lastName, email } = validation.data

    // Build update data - include all required fields to prevent validation errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      first_name: firstName ?? user.first_name,
      last_name: lastName ?? user.last_name,
      email: email ? email.toLowerCase() : user.email,
      role: user.role, // Preserve existing role
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await payload.find({
        collection: 'users',
        where: {
          email: { equals: email.toLowerCase() },
          id: { not_equals: user.id },
        },
        limit: 1,
      })

      if (existingUser.docs.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email taken',
            message: 'This email is already in use by another account.',
          },
          { status: 409 },
        )
      }
    }

    // Update the user (allow users to update their own profile)
    const updatedUser = (await payload.update({
      collection: 'users',
      id: user.id,
      data: updateData,
    })) as any

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Update failed',
        message: 'An error occurred while updating your profile.',
      },
      { status: 500 },
    )
  }
}
