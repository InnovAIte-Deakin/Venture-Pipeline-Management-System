import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPagination, requirePayloadUser, textSearch } from '../_lib/payload-api'

const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  definition: z.record(z.any()),
  createdById: z.string().optional(),
  createdBy: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { page, limit, searchParams } = getPagination(request, 20)
    const search = searchParams.get('search') || ''
    const workflows = await auth.payload.find({
      collection: 'workflows',
      where: textSearch(['name', 'description'], search),
      page,
      limit,
      sort: '-updatedAt',
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json({
      results: workflows.docs,
      total: workflows.totalDocs,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error listing backend workflows:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const data = workflowSchema.parse(await request.json())
    const workflow = await auth.payload.create({
      collection: 'workflows',
      data: {
        name: data.name,
        description: data.description,
        definition: data.definition,
        isActive: data.isActive,
        createdBy: data.createdById || data.createdBy || auth.user.id,
      },
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json(workflow, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating backend workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
