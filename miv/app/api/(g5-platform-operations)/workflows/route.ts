import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.workflow.count(),
    ])

    return NextResponse.json({ results: workflows, total, page, limit })
  } catch (error) {
    console.error('Error listing workflows:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any
    try { body = await request.json() } catch { body = {} }
    const { name, description, definition, createdById } = body
    if (!name || !definition || !createdById) {
      return NextResponse.json({ error: 'name, definition, createdById are required' }, { status: 400 })
    }
    const created = await prisma.workflow.create({
      data: { name, description, definition, createdById },
    })
    return NextResponse.json(created)
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

