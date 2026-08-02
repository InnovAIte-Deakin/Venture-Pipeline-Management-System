import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { WSSAnswer } from '@/types/enums'

// Validation schema for intake submission
const IntakeSubmissionSchema = z.object({
  ventureName_en: z.string().min(1, 'Venture name in English is required'),
  ventureName_km: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  description_en: z.string().optional(),
  description_km: z.string().optional(),

  // WSS (Washington Group Short Set) questions
  wss: z.object({
    seeing: WSSAnswer,
    hearing: WSSAnswer,
    walking: WSSAnswer,
    cognition: WSSAnswer,
    selfCare: WSSAnswer,
    communication: WSSAnswer,
  }),

  // Registration information
  registration: z.object({
    number: z.string().optional(),
    country: z.string().optional(),
    legalType: z.string().optional(),
    yearEstablished: z.number().min(1900).max(2100).optional(),
  }).optional(),

  // Impact areas
  impactAreas: z.array(z.enum(['agri', 'gender', 'climate'])).optional(),

  // Founders
  founders: z.array(z.object({
    fullName: z.string().min(1, 'Founder name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
  })).min(1, 'At least one founder is required'),

  // Financial information
  financials: z.object({
    currency: z.string().optional(),
    lastFYRevenue: z.number().optional(),
    avgMonthlyRevenue: z.number().optional(),
  }).optional(),

  // GEDSI (Gender, Equality, Disability, Social Inclusion)
  gedsi: z.object({
    hasPolicy: z.boolean().optional(),
    notes: z.string().optional(),
  }).optional(),

  // Triage information
  triageTrack: z.enum(['unassigned', 'fast', 'slow']).default('unassigned'),
  triageRationale: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Validate the request body
    const validationResult = IntakeSubmissionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // TODO: city/sector aren't collected by the intake form yet.
    // Using placeholders for now — revisit once the form is updated.
    const venture = await payload.create({
      collection: 'ventures',
      data: {
        name: data.ventureName_en,
        country: data.country,
        city: 'Unspecified',
        sector: 'Unspecified',
        founders: data.founders.map((f) => ({
          fullName: f.fullName,
          email: f.email,
          phone: f.phone || '',
          role: 'founder',
        })),
        triageTrack: data.triageTrack,
        triageRationale: data.triageRationale,
      },
    })

    // Create the intake record, linked to the venture we just created
    const intake = await payload.create({
      collection: 'onboardingIntakes',
      data: {
        venture: venture.id,
        wss: data.wss,
        impactAreas: data.impactAreas,
        founders: data.founders,
        financials: data.financials,
        gedsi: data.gedsi,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Venture application submitted successfully',
      data: {
        intakeId: intake.id,
        ventureId: venture.id,
        ventureName: data.ventureName_en,
        submissionDate: new Date().toISOString(),
        status: 'submitted',
      },
    })

  } catch (error) {
    console.error('Failed to submit intake:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to submit application',
          message: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your application',
      },
      { status: 500 }
    )
  }
}

// GET method to retrieve submission status (optional)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const intakeId = searchParams.get('id')

  if (!intakeId) {
    return NextResponse.json(
      { error: 'Intake ID is required' },
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
        venture: true,
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
      { success: false, error: 'Failed to fetch intake status' },
      { status: 500 }
    )
  }
}