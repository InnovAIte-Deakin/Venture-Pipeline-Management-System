import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const runs = await prisma.workflowRun.findMany({
      take: limit,
      orderBy: { startedAt: 'desc' },
      include: {
        workflow: {
          select: { name: true, id: true }
        }
      }
    })

    return NextResponse.json({ 
      results: runs,
      total: runs.length
    })
  } catch (error) {
    console.error('Error fetching recent workflow runs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
