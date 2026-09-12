import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const [runs, total] = await Promise.all([
      prisma.workflowRun.findMany({
        where: { workflowId: id },
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' },
        include: {
          workflow: {
            select: { name: true }
          }
        }
      }),
      prisma.workflowRun.count({
        where: { workflowId: id }
      })
    ])

    return NextResponse.json({ 
      results: runs, 
      total, 
      page, 
      limit,
      hasMore: skip + runs.length < total
    })
  } catch (error) {
    console.error('Error fetching workflow runs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
