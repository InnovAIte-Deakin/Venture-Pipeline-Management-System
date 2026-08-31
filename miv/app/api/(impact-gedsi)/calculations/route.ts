/**
 * API endpoint for managing GEDSI and social impact calculations
 * POST /api/calculations - Trigger recalculation for specific ventures or all ventures
 * GET /api/calculations/portfolio - Get aggregated portfolio metrics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { CalculationService, triggerVentureRecalculation, scheduledRecalculationJob } from '@/lib/calculation-service'

const recalculateSchema = z.object({
  ventureId: z.string().optional(), // If not provided, recalculate all ventures
  force: z.boolean().default(false) // Force recalculation even if recently calculated
})

// POST /api/calculations - Trigger recalculation
export async function POST(request: NextRequest) {
  try {
    // Authentication check (disabled for development)
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { ventureId, force } = recalculateSchema.parse(body)

    if (ventureId) {
      // Recalculate specific venture
      await triggerVentureRecalculation(ventureId)
      return NextResponse.json({ 
        message: `Calculations updated for venture ${ventureId}`,
        ventureId 
      })
    } else {
      // Recalculate all ventures
      await scheduledRecalculationJob()
      return NextResponse.json({ 
        message: 'Calculations updated for all ventures' 
      })
    }
  } catch (error) {
    console.error('Error triggering calculations:', error)
    return NextResponse.json(
      { error: 'Failed to trigger calculations' },
      { status: 500 }
    )
  }
}

// GET /api/calculations/portfolio - Get portfolio metrics
export async function GET(request: NextRequest) {
  try {
    const metrics = await CalculationService.getPortfolioMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching portfolio metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio metrics' },
      { status: 500 }
    )
  }
}
