import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  compactWhere,
  getPagination,
  pagination,
  relationId,
  requirePayloadUser,
  userSummary,
} from '../_lib/payload-api'

const categoryMap: Record<string, string> = {
  GENDER: 'gender',
  DISABILITY: 'disability',
  SOCIAL_INCLUSION: 'social_inclusion',
  CROSS_CUTTING: 'cross_cutting',
}

const statusMap: Record<string, string> = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  VERIFIED: 'verified',
  COMPLETED: 'completed',
}

const createMetricSchema = z.object({
  ventureId: z.string().min(1, 'Venture ID is required'),
  metricCode: z.string().min(1, 'Metric code is required'),
  metricName: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  targetValue: z.number().min(0),
  currentValue: z.number().min(0).default(0),
  unit: z.string().optional(),
  notes: z.string().optional(),
})

function normalizeMetric(metric: any) {
  return {
    ...metric,
    ventureId: relationId(metric.venture),
    createdById: relationId(metric.createdBy),
    createdBy: userSummary(metric.createdBy),
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { page, limit, searchParams } = getPagination(request, 50)
    const ventureId = searchParams.get('ventureId') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''

    const where = compactWhere([
      ventureId ? { venture: { equals: ventureId } } : {},
      category ? { category: { equals: categoryMap[category] || category } } : {},
      status ? { status: { equals: statusMap[status] || status } } : {},
    ])

    const metrics = await auth.payload.find({
      collection: 'gedsiMetrics',
      where,
      page,
      limit,
      sort: '-createdAt',
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json({
      metrics: metrics.docs.map(normalizeMetric),
      pagination: pagination(page, limit, metrics.totalDocs),
    })
  } catch (error) {
    console.error('Error fetching backend GEDSI metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const body = createMetricSchema.parse(await request.json())
    const catalog = await auth.payload.find({
      collection: 'irisMetricCatalog',
      where: { code: { equals: body.metricCode } },
      limit: 1,
      overrideAccess: false,
      user: auth.user,
    })
    const catalogMetric = catalog.docs[0]

    const metric = await auth.payload.create({
      collection: 'gedsiMetrics',
      data: {
        venture: body.ventureId,
        metricCode: body.metricCode,
        metricName: body.metricName || catalogMetric?.name || body.metricCode,
        category: categoryMap[body.category] || body.category,
        targetValue: body.targetValue,
        currentValue: body.currentValue,
        unit: body.unit || catalogMetric?.unit || 'units',
        notes: body.notes,
        createdBy: auth.user.id,
      },
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json(normalizeMetric(metric), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating backend GEDSI metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
