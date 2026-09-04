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

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isStaff = user.role === 'admin' || user.role === 'miv_analyst'
    
    // Find the intake
    const intake = await (payload as any).findByID({ collection: 'onboardingIntakes', id })
    if (!intake) {
      return Response.json({ error: 'Intake not found' }, { status: 404 })
    }

    // Owner check: if founder, verify their email matches one of the founders in the intake
    if (!isStaff) {
      const isOwner = intake.founders?.some((f: any) => f.email === user.email)
      if (!isOwner) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return Response.json({
      success: true,
      data: {
        intakeId: id,
        status: 'submitted',
        submissionDate: intake.createdAt
      }
    })
  } catch (e: any) {
    console.error('GET intake error:', e)
    const isNotFound = e.name === 'CastError' || e.message?.toLowerCase().includes('not found') || e.status === 404
    return Response.json({ error: e.message ?? 'Internal error' }, { status: isNotFound ? 404 : 500 })
  }
}