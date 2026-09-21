import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compactWhere, getPagination, pagination, requirePayloadUser, textSearch } from '../../_lib/payload-api'

const statusMap: Record<string, string> = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
}

const priorityMap: Record<string, string> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  budget: z.number().optional(),
  tags: z.array(z.string()).optional(),
  leadId: z.string().optional(),
  lead: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  members: z.array(z.string()).optional(),
  ventureId: z.string().optional(),
  venture: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { page, limit, searchParams } = getPagination(request, 50)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const leadId = searchParams.get('leadId') || ''

    const projects = await auth.payload.find({
      collection: 'projects',
      where: compactWhere([
        textSearch(['name', 'description'], search),
        status ? { status: { equals: statusMap[status] || status } } : {},
        priority ? { priority: { equals: priorityMap[priority] || priority } } : {},
        leadId ? { lead: { equals: leadId } } : {},
      ]),
      page,
      limit,
      sort: '-updatedAt',
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json({
      projects: projects.docs,
      pagination: pagination(page, limit, projects.totalDocs),
    })
  } catch (error) {
    console.error('Error fetching backend projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const data = projectSchema.parse(await request.json())
    const project = await auth.payload.create({
      collection: 'projects',
      data: {
        name: data.name,
        description: data.description,
        status: data.status ? statusMap[data.status] || data.status : undefined,
        priority: data.priority ? priorityMap[data.priority] || data.priority : undefined,
        dueDate: data.dueDate,
        startDate: data.startDate,
        budget: data.budget,
        tags: data.tags,
        metadata: data.metadata,
        lead: data.leadId || data.lead || auth.user.id,
        members: data.memberIds || data.members,
        venture: data.ventureId || data.venture,
      },
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating backend project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
