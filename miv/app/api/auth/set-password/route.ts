import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { ApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'
import { handleApiError } from '@/lib/handle-api-error'

export const runtime = 'nodejs'

const setPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = setPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
    }

    const hash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash },
    })

    return NextResponse.json(
      successResponse(
        { email: user.email },
        'Password set successfully'
      )
    )
  } catch (error) {
    return handleApiError(error, 'POST /api/auth/set-password')
  }
}