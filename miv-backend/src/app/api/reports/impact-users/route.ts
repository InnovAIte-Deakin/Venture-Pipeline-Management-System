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
    // 1) Check token first
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

    // 2) Init payload only after token exists
    const payload = await getPayload({ config })

    // 3) Verify session and get user
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

    // 4) Count media uploaded by this user
    let totalUploads = 0
    let page = 1

    while (true) {
      const mediaRes = await payload.find({
        collection: 'media',
        limit: 100,
        page,
        depth: 0,
      })

      for (const m of mediaRes.docs as any[]) {
        const uploader = m?.uploader
        const uploaderId =
          typeof uploader === 'string' ? uploader : uploader?.id

        if (String(uploaderId) === String(user.id)) {
          totalUploads += 1
        }
      }

      if (!mediaRes.hasNextPage) break
      page = mediaRes.nextPage ?? page + 1
    }

    const totalMedia = totalUploads

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
        totalUploads,
        totalMedia,
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
    // 1) Check token first
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

    // 2) Init payload only after token exists
    const payload = await getPayload({ config })

    // 3) Verify session and get user
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

    const updateData = {
      first_name: firstName ?? user.first_name,
      last_name: lastName ?? user.last_name,
      email: email ? email.toLowerCase() : user.email,
      role: user.role,
    }

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

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: updateData,
    })

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
