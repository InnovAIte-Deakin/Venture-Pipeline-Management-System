import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'
import { handleApiError } from '@/lib/handle-api-error'

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  organization: z.string().min(1).optional(),
})

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession().catch(() => null)
    const email = session?.user?.email || null

    let user
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organization: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    } else {
      user = await prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organization: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    }

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
    }

    return NextResponse.json(successResponse(user))
  } catch (error) {
    return handleApiError(error, 'GET /api/users/me')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, organization } = updateProfileSchema.parse(body)

    const session = await getServerSession().catch(() => null)
    const email: string | null = session?.user?.email || null

    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findFirst()

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name, organization },
    })

    return NextResponse.json(
      successResponse(
        {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          organization: updated.organization,
        },
        'Profile updated successfully'
      )
    )
  } catch (error) {
    return handleApiError(error, 'PUT /api/users/me')
  }
}