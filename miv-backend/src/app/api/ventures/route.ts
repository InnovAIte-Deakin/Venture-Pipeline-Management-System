import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  compactWhere,
  getPagination,
  pagination,
  relationId,
  requirePayloadUser,
  textSearch,
  userSummary,
  withCount,
} from '../_lib/payload-api'

const createVentureSchema = z.object({
  name: z.string().min(1, 'Venture name is required'),
  sector: z.string().min(1, 'Sector is required'),
  location: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  website: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  description: z.string().optional(),
  pitchSummary: z.string().optional(),
  inclusionFocus: z.string().optional(),
  founderTypes: z.union([z.string(), z.array(z.string())]).optional(),
  teamSize: z.union([z.number(), z.string()]).optional(),
  foundingYear: z.union([z.number(), z.string()]).optional(),
  targetMarket: z.string().optional(),
  revenueModel: z.string().optional(),
  operationalReadiness: z.record(z.any()).optional(),
  capitalReadiness: z.record(z.any()).optional(),
  gedsiGoals: z.any().optional(),
  washingtonShortSet: z.record(z.any()).optional(),
  disabilityInclusion: z.record(z.any()).optional(),
  challenges: z.string().optional(),
  supportNeeded: z.string().optional(),
  timeline: z.string().optional(),
})

const teamSizeMap: Record<string, number> = {
  '1-2': 1,
  '3-5': 3,
  '6-10': 6,
  '11-20': 11,
  '21-50': 21,
  '50+': 50,
}

function normalizeVenture(doc: any) {
  return {
    ...doc,
    createdById: relationId(doc.createdBy),
    assignedToId: relationId(doc.assignedTo),
    createdBy: userSummary(doc.createdBy),
    assignedTo: userSummary(doc.assignedTo),
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { page, limit, searchParams } = getPagination(request, 10)
    const search = searchParams.get('search') || ''
    const sector = searchParams.get('sector') || ''
    const stage = searchParams.get('stage') || ''
    const status = searchParams.get('status') || ''

    const where = compactWhere([
      textSearch(['name', 'sector', 'location', 'country', 'city'], search),
      sector ? { sector: { equals: sector } } : {},
      stage ? { stage: { equals: stage } } : {},
      status ? { status: { equals: status } } : {},
    ])

    const ventures = await auth.payload.find({
      collection: 'ventures',
      where,
      page,
      limit,
      sort: '-createdAt',
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    const docs = ventures.docs.map((venture: any) =>
      withCount(normalizeVenture(venture), {
        documents: 0,
        activities: 0,
        capitalActivities: 0,
      }),
    )

    return NextResponse.json({
      ventures: docs,
      pagination: pagination(page, limit, ventures.totalDocs),
      isMobile: false,
    })
  } catch (error) {
    console.error('Error fetching backend ventures:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const data = createVentureSchema.parse(body)
    const teamSize =
      typeof data.teamSize === 'string' ? teamSizeMap[data.teamSize] : data.teamSize
    const foundingYear =
      typeof data.foundingYear === 'string' ? Number.parseInt(data.foundingYear, 10) : data.foundingYear

    const venture = await auth.payload.create({
      collection: 'ventures',
      data: {
        ...data,
        founderTypes: Array.isArray(data.founderTypes) ? data.founderTypes.join(', ') : data.founderTypes,
        teamSize: Number.isNaN(teamSize) ? undefined : teamSize,
        foundingYear: Number.isNaN(foundingYear) ? undefined : foundingYear,
        createdBy: auth.user.id,
      },
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json(normalizeVenture(venture), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating backend venture:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
