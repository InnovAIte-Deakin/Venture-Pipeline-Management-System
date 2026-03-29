/**
 * API endpoint to seed initial calculations for all ventures
 * This should be run once after implementing the centralized calculation system
 * to populate calculated fields for existing ventures
 */

import { NextRequest, NextResponse } from 'next/server'
import { CalculationService } from '@/lib/calculation-service'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting calculation seeding for all ventures...')
    
    // Trigger calculation for all ventures
    await CalculationService.updateAllVentureCalculations()
    
    // Get portfolio metrics to verify calculations
    const portfolioMetrics = await CalculationService.getPortfolioMetrics()
    
    console.log('Calculation seeding completed successfully')
    
    return NextResponse.json({
      message: 'Successfully calculated and stored metrics for all ventures',
      portfolioMetrics
    })
  } catch (error) {
    console.error('Error seeding calculations:', error)
    return NextResponse.json(
      { error: 'Failed to seed calculations' },
      { status: 500 }
    )
  }
}
