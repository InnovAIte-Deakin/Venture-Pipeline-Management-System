import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { ApiError } from '@/lib/api-error'
import { errorResponse } from '@/lib/api-response'

export function handleApiError(error: unknown, context: string) {
  console.error(`[API ERROR] ${context}:`, error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      errorResponse(error.message, error.code, error.details),
      { status: error.statusCode }
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      errorResponse('Validation failed', 'VALIDATION_ERROR', error.flatten()),
      { status: 400 }
    )
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      errorResponse(
        'Database request failed',
        `PRISMA_${error.code}`,
        error.meta
      ),
      { status: 400 }
    )
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      errorResponse('Invalid database query', 'DATABASE_VALIDATION_ERROR'),
      { status: 400 }
    )
  }

  const message =
    error instanceof Error ? error.message : 'Unexpected internal server error'

  return NextResponse.json(
    errorResponse(message, 'INTERNAL_SERVER_ERROR'),
    { status: 500 }
  )
}