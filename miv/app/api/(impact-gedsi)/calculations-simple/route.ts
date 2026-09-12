/**
 * Simplified API endpoint for testing calculations
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/calculations-simple/portfolio - Get basic portfolio metrics
export async function GET(request: NextRequest) {
  try {
    const ventures = await prisma.venture.findMany({
      select: {
        id: true,
        name: true,
        sector: true,
        fundingRaised: true,
        teamSize: true,
        gedsiScore: true,
        socialImpactScore: true,
        gedsiComplianceRate: true,
        totalBeneficiaries: true,
        jobsCreated: true,
        womenEmpowered: true,
        disabilityInclusive: true,
        youthEngaged: true,
        calculatedAt: true
      }
    })

    const totalVentures = ventures.length
    
    if (totalVentures === 0) {
      return NextResponse.json({
        totalVentures: 0,
        totalBeneficiaries: 0,
        totalJobsCreated: 0,
        totalWomenEmpowered: 0,
        totalDisabilityInclusive: 0,
        totalYouthEngaged: 0,
        averageGEDSIScore: 0,
        averageSocialImpactScore: 0,
        averageComplianceRate: 0,
        message: 'No ventures found'
      })
    }

    const totals = ventures.reduce((acc, venture) => ({
      totalBeneficiaries: acc.totalBeneficiaries + (venture.totalBeneficiaries || 0),
      totalJobsCreated: acc.totalJobsCreated + (venture.jobsCreated || 0),
      totalWomenEmpowered: acc.totalWomenEmpowered + (venture.womenEmpowered || 0),
      totalDisabilityInclusive: acc.totalDisabilityInclusive + (venture.disabilityInclusive || 0),
      totalYouthEngaged: acc.totalYouthEngaged + (venture.youthEngaged || 0),
      gedsiScoreSum: acc.gedsiScoreSum + (venture.gedsiScore || 0),
      socialImpactScoreSum: acc.socialImpactScoreSum + (venture.socialImpactScore || 0),
      complianceRateSum: acc.complianceRateSum + (venture.gedsiComplianceRate || 0)
    }), {
      totalBeneficiaries: 0,
      totalJobsCreated: 0,
      totalWomenEmpowered: 0,
      totalDisabilityInclusive: 0,
      totalYouthEngaged: 0,
      gedsiScoreSum: 0,
      socialImpactScoreSum: 0,
      complianceRateSum: 0
    })

    return NextResponse.json({
      totalVentures,
      totalBeneficiaries: totals.totalBeneficiaries,
      totalJobsCreated: totals.totalJobsCreated,
      totalWomenEmpowered: totals.totalWomenEmpowered,
      totalDisabilityInclusive: totals.totalDisabilityInclusive,
      totalYouthEngaged: totals.totalYouthEngaged,
      averageGEDSIScore: Math.round(totals.gedsiScoreSum / totalVentures),
      averageSocialImpactScore: Math.round(totals.socialImpactScoreSum / totalVentures),
      averageComplianceRate: Math.round(totals.complianceRateSum / totalVentures),
      message: 'Portfolio metrics calculated successfully'
    })
  } catch (error) {
    console.error('Error fetching portfolio metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio metrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/calculations-simple - Simple calculation trigger
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { ventureId } = body

    if (ventureId) {
      // For now, just return success for specific venture
      return NextResponse.json({ 
        message: `Calculation would be triggered for venture ${ventureId}`,
        ventureId,
        status: 'success'
      })
    } else {
      // For now, just return success for all ventures
      return NextResponse.json({ 
        message: 'Calculation would be triggered for all ventures',
        status: 'success'
      })
    }
  } catch (error) {
    console.error('Error triggering calculations:', error)
    return NextResponse.json(
      { error: 'Failed to trigger calculations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
