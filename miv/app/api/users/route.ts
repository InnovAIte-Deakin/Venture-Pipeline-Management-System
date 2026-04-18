import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'
import { handleApiError } from '@/lib/handle-api-error'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const role = searchParams.get('role')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    if (Number.isNaN(limit) || limit < 1) {
      throw new ApiError('Limit must be a positive number', 400, 'INVALID_LIMIT')
    }

    if (Number.isNaN(page) || page < 1) {
      throw new ApiError('Page must be a positive number', 400, 'INVALID_PAGE')
    }

    const skip = (page - 1) * limit

    const where: any = {}
    if (email) {
      where.email = { contains: email, mode: 'insensitive' }
    }
    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organization: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json(
      successResponse({
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    )
  } catch (error) {
    return handleApiError(error, 'GET /api/users')
  }
}