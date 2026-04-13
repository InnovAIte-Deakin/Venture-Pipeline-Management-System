import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { WSSAnswer } from '@/types/enums'

const IntakeSubmissionSchema = z.object({
  ventureName_en: z.string().min(1, 'Venture name in English is required'),
  ventureName_km: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  description_en: z.string().optional(),
  description_km: z.string().optional(),
  wss: z.object({
    seeing: WSSAnswer,
    hearing: WSSAnswer,
    walking: WSSAnswer,
    cognition: WSSAnswer,
    selfCare: WSSAnswer,
    communication: WSSAnswer,
  }),
  registration: z.object({
    number: z.string().optional(),
    country: z.string().optional(),
    legalType: z.string().optional(),
    yearEstablished: z.number().min(1900).max(2100).optional(),
  }).optional(),
  impactAreas: z.array(z.enum(['agri', 'gender', 'climate'])).optional(),
  founders: z.array(
    z.object({
      fullName: z.string().min(1, 'Founder name is required'),
      email: z.string().email('Valid email is required'),
      phone: z.string().optional(),
    })
  ).min(1, 'At least one founder is required'),
  financials: z.object({
    currency: z.string().optional(),
    lastFYRevenue: z.number().optional(),
    avgMonthlyRevenue: z.number().optional(),
  }).optional(),
  gedsi: z.object({
    hasPolicy: z.boolean().optional(),
    notes: z.string().optional(),
  }).optional(),
  triageTrack: z.enum(['unassigned', 'fast', 'slow']).default('unassigned'),
  triageRationale: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    let body

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'BadRequest',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      )
    }

    const validationResult = IntakeSubmissionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationFailed',
          message: 'Please check the submitted form fields',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const data = validationResult.data

    let intake

    try {
      intake = await payload.create({
        collection: 'onboardingIntakes',
        data: {
          ventureName_en: data.ventureName_en,
          ventureName_km: data.ventureName_km,
          country: data.country,
          wss: data.wss,
          registration: data.registration,
          impactAreas: data.impactAreas,
          founders: data.founders,
          financials: data.financials,
          gedsi: data.gedsi,
          triageTrack: data.triageTrack,
          triageRationale: data.triageRationale,
        },
      })
    } catch (createError) {
      console.error('Failed to create onboarding intake:', createError)

      return NextResponse.json(
        {
          success: false,
          error: 'CreateFailed',
          message: 'Unable to submit venture application right now.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Venture application submitted successfully',
        data: {
          intakeId: intake.id,
          ventureName: data.ventureName_en,
          submissionDate: new Date().toISOString(),
          status: 'submitted',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to submit intake:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'InternalServerError',
        message: 'An unexpected error occurred while processing your application',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const intakeId = searchParams.get('id')

  if (!intakeId) {
    return NextResponse.json(
      {
        success: false,
        error: 'MissingIntakeId',
        message: 'Intake ID is required',
      },
      { status: 400 }
    )
  }

  try {
    const payload = await getPayload({ config })

    const intake = await payload.findByID({
      collection: 'onboardingIntakes',
      id: intakeId,
      select: {
        id: true,
        ventureName_en: true,
        country: true,
        triageTrack: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: intake,
    })
  } catch (error) {
    console.error('Failed to fetch intake:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'FetchFailed',
        message: 'Unable to fetch intake status',
      },
      { status: 500 }
    )
  }
}