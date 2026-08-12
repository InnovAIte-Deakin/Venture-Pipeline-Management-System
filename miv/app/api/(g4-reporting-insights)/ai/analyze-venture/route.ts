import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { AIServices } from '@/lib/ai-services'
import { IRIS_GEDSI_METRICS } from '@/lib/iris-metrics'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ventureId } = await request.json()
    if (!ventureId) {
      return NextResponse.json({ error: 'Venture ID is required' }, { status: 400 })
    }

    // Get venture data with all related information
    const venture = await prisma.venture.findUnique({
      where: { id: ventureId },
      include: {
        gedsiMetrics: true,
        activities: true,
        documents: true,
      }
    })

    if (!venture) {
      return NextResponse.json({ error: 'Venture not found' }, { status: 404 })
    }

    // AI Analysis using OpenAI
    const analysisPrompt = `
    Analyze this venture for investment readiness and GEDSI alignment:
    
    Venture: ${venture.name}
    Sector: ${venture.sector}
    Location: ${venture.location}
    Founder Types: ${venture.founderTypes}
    Pitch Summary: ${venture.pitchSummary}
    Inclusion Focus: ${venture.inclusionFocus}
    Operational Readiness: ${JSON.stringify(venture.operationalReadiness)}
    Capital Readiness: ${JSON.stringify(venture.capitalReadiness)}
    GEDSI Goals: ${JSON.stringify(venture.gedsiGoals)}
    
    Please provide:
    1. Readiness Score (0-100) based on operational and capital readiness
    2. GEDSI Alignment Score (0-100) based on inclusion focus and founder types
    3. 3-5 specific recommendations for improvement
    4. Suggested IRIS+ GEDSI metrics that would be relevant for this venture
    5. Risk assessment and mitigation strategies
    
    Format the response as JSON with the following structure:
    {
      "readinessScore": number,
      "gedsiAlignment": number,
      "recommendations": [string],
      "suggestedMetrics": [{"code": string, "name": string, "reason": string}],
      "riskAssessment": {"level": string, "risks": [string], "mitigations": [string]}
    }
    `

    const aiAnalysis = await AIServices.generateContent(analysisPrompt)
    
    // Parse AI response
    let analysisResult
    try {
      analysisResult = JSON.parse(aiAnalysis)
    } catch (error) {
      // Fallback analysis if AI response parsing fails
      analysisResult = {
        readinessScore: calculateReadinessScore(venture),
        gedsiAlignment: calculateGEDSIAlignment(venture),
        recommendations: generateRecommendations(venture),
        suggestedMetrics: suggestMetrics(venture),
        riskAssessment: {
          level: 'medium',
          risks: ['Market competition', 'Funding timeline', 'Team scaling'],
          mitigations: ['Strengthen market positioning', 'Diversify funding sources', 'Build advisory board']
        }
      }
    }

    // Update venture with AI analysis
    await prisma.venture.update({
      where: { id: ventureId },
      data: {
        // Store AI analysis results
        aiAnalysis: analysisResult,
        updatedAt: new Date()
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'VENTURE_CREATED',
        title: 'AI Analysis Completed',
        description: `AI analysis completed for ${venture.name} with ${analysisResult.readinessScore}% readiness score`,
        ventureId: ventureId,
        userId: session.user.email as string,
      }
    })

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze venture' },
      { status: 500 }
    )
  }
}

// Helper functions for fallback analysis
function calculateReadinessScore(venture: any): number {
  const operational = venture.operationalReadiness || {}
  const capital = venture.capitalReadiness || {}
  
  const operationalScore = Object.values(operational).filter(Boolean).length / Object.keys(operational).length * 100
  const capitalScore = Object.values(capital).filter(Boolean).length / Object.keys(capital).length * 100
  
  return Math.round((operationalScore + capitalScore) / 2)
}

function calculateGEDSIAlignment(venture: any): number {
  let score = 50 // Base score
  
  // Founder types bonus
  const founderTypes = JSON.parse(venture.founderTypes || '[]')
  if (founderTypes.includes('women-led')) score += 15
  if (founderTypes.includes('disability-inclusive')) score += 15
  if (founderTypes.includes('rural-focus')) score += 10
  if (founderTypes.includes('indigenous-led')) score += 10
  
  // Inclusion focus bonus
  const inclusionFocus = venture.inclusionFocus?.toLowerCase() || ''
  if (inclusionFocus.includes('gender') || inclusionFocus.includes('women')) score += 10
  if (inclusionFocus.includes('disability') || inclusionFocus.includes('accessibility')) score += 10
  if (inclusionFocus.includes('rural') || inclusionFocus.includes('community')) score += 10
  
  return Math.min(score, 100)
}

function generateRecommendations(venture: any): string[] {
  const recommendations = []
  
  const operational = venture.operationalReadiness || {}
  const capital = venture.capitalReadiness || {}
  
  if (!operational.businessPlan) {
    recommendations.push('Develop a comprehensive business plan with market analysis')
  }
  if (!operational.financialProjections) {
    recommendations.push('Create detailed 3-5 year financial projections')
  }
  if (!capital.pitchDeck) {
    recommendations.push('Prepare a professional investor pitch deck')
  }
  if (!capital.financialStatements) {
    recommendations.push('Organize audited or reviewed financial statements')
  }
  
  // Sector-specific recommendations
  if (venture.sector === 'CleanTech') {
    recommendations.push('Obtain environmental impact certifications and compliance documentation')
  }
  if (venture.sector === 'FinTech') {
    recommendations.push('Ensure regulatory compliance and security certifications')
  }
  
  return recommendations.slice(0, 5) // Return top 5 recommendations
}

function suggestMetrics(venture: any): any[] {
  const suggestions = []
  const founderTypes = JSON.parse(venture.founderTypes || '[]')
  const inclusionFocus = venture.inclusionFocus?.toLowerCase() || ''
  
  // Gender-related metrics
  if (founderTypes.includes('women-led') || inclusionFocus.includes('gender')) {
    suggestions.push({
      code: 'OI.1',
      name: 'Number of women-led ventures supported',
      reason: 'Venture has women leadership focus'
    })
  }
  
  // Disability inclusion metrics
  if (founderTypes.includes('disability-inclusive') || inclusionFocus.includes('disability')) {
    suggestions.push({
      code: 'OI.2',
      name: 'Ventures with disability inclusion',
      reason: 'Venture promotes disability inclusion'
    })
  }
  
  // Rural development metrics
  if (founderTypes.includes('rural-focus') || inclusionFocus.includes('rural')) {
    suggestions.push({
      code: 'OI.3',
      name: 'Rural communities served',
      reason: 'Venture focuses on rural development'
    })
  }
  
  // Youth employment metrics
  if (founderTypes.includes('youth-led') || inclusionFocus.includes('youth')) {
    suggestions.push({
      code: 'OI.4',
      name: 'Youth employment created',
      reason: 'Venture involves youth leadership or employment'
    })
  }
  
  // Financial inclusion metrics
  if (venture.sector === 'FinTech' || inclusionFocus.includes('financial')) {
    suggestions.push({
      code: 'OI.6',
      name: 'Financial inclusion achieved',
      reason: 'Venture promotes financial inclusion'
    })
  }
  
  return suggestions
} 