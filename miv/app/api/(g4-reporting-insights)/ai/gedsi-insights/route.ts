import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { AIServices } from '@/lib/ai-services'

export async function GET(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession()
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Fetch all GEDSI metrics and ventures for analysis
    const metrics = await prisma.gEDSIMetric.findMany({
      include: {
        venture: {
          select: {
            name: true,
            sector: true,
            location: true,
            founderTypes: true,
            gedsiGoals: true,
          }
        }
      }
    })

    const ventures = await prisma.venture.findMany({
      select: {
        id: true,
        name: true,
        sector: true,
        location: true,
        founderTypes: true,
        gedsiGoals: true,
        createdAt: true,
      }
    })

    // Calculate basic statistics
    const totalMetrics = metrics.length
    const verifiedMetrics = metrics.filter(m => m.status === 'VERIFIED').length
    const inProgressMetrics = metrics.filter(m => m.status === 'IN_PROGRESS').length
    const overdueMetrics = metrics.filter(m => m.status === 'NOT_STARTED').length
    const completionRate = totalMetrics > 0 ? (verifiedMetrics / totalMetrics) * 100 : 0

    // Category analysis
    const categoryStats = ['GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING'].map(category => {
      const categoryMetrics = metrics.filter(m => m.category === category)
      const verified = categoryMetrics.filter(m => m.status === 'VERIFIED').length
      const total = categoryMetrics.length
      return {
        category,
        total,
        verified,
        completionRate: total > 0 ? (verified / total) * 100 : 0
      }
    })

    // Venture performance analysis
    const venturePerformance = ventures.map(venture => {
      const ventureMetrics = metrics.filter(m => m.ventureId === venture.id)
      const verified = ventureMetrics.filter(m => m.status === 'VERIFIED').length
      const total = ventureMetrics.length
      return {
        ventureId: venture.id,
        ventureName: venture.name,
        totalMetrics: total,
        verifiedMetrics: verified,
        completionRate: total > 0 ? (verified / total) * 100 : 0
      }
    }).sort((a, b) => b.completionRate - a.completionRate)

    // AI Analysis using OpenAI
    const analysisPrompt = `
    Analyze this GEDSI (Gender Equality, Disability, and Social Inclusion) data for insights:
    
    Total Metrics: ${totalMetrics}
    Verified: ${verifiedMetrics}
    In Progress: ${inProgressMetrics}
    Overdue: ${overdueMetrics}
    Overall Completion Rate: ${completionRate.toFixed(1)}%
    
    Category Performance:
    ${categoryStats.map(stat => `${stat.category}: ${stat.completionRate.toFixed(1)}% (${stat.verified}/${stat.total})`).join('\n')}
    
    Top Performing Ventures:
    ${venturePerformance.slice(0, 5).map(v => `${v.ventureName}: ${v.completionRate.toFixed(1)}%`).join('\n')}
    
    Venture Details:
    ${ventures.map(v => `${v.name} (${v.sector}): ${JSON.parse(v.founderTypes || '[]').join(', ')}`).join('\n')}
    
    Please provide:
    1. Trend Analysis: What patterns do you see in GEDSI performance?
    2. Recommendations: 3-5 specific actionable recommendations for improvement
    3. Risk Alerts: Any concerning trends or metrics that need attention
    
    Format as JSON:
    {
      "trendAnalysis": "string",
      "recommendations": ["string"],
      "riskAlerts": "string"
    }
    `

    let aiInsights
    try {
      const aiResponse = await AIServices.generateContent(analysisPrompt)
      aiInsights = JSON.parse(aiResponse)
    } catch (error) {
      // Fallback insights if AI analysis fails
      aiInsights = generateFallbackInsights(metrics, ventures, categoryStats, venturePerformance)
    }

    // Calculate additional insights
    const insights = {
      ...aiInsights,
      statistics: {
        totalMetrics,
        verifiedMetrics,
        inProgressMetrics,
        overdueMetrics,
        completionRate,
        averageMetricsPerVenture: ventures.length > 0 ? (totalMetrics / ventures.length).toFixed(1) : 0
      },
      categoryStats,
      topPerformers: venturePerformance.slice(0, 5),
      recentActivity: await getRecentActivity(),
      trends: calculateTrends(metrics)
    }

    return NextResponse.json(insights)

  } catch (error) {
    console.error('Error generating GEDSI insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

function generateFallbackInsights(metrics: any[], ventures: any[], categoryStats: any[], venturePerformance: any[]) {
  const completionRate = metrics.length > 0 ? 
    (metrics.filter(m => m.status === 'Verified').length / metrics.length) * 100 : 0

  let trendAnalysis = 'GEDSI metrics show steady progress across all categories.'
  let recommendations = [
    'Focus on completing overdue metrics to improve overall completion rate',
    'Implement regular metric verification processes',
    'Provide additional support to ventures with low completion rates'
  ]
  let riskAlerts = 'No immediate risks detected.'

  if (completionRate < 50) {
    trendAnalysis = 'GEDSI metrics completion rate is below target, requiring immediate attention.'
    recommendations = [
      'Prioritize verification of in-progress metrics',
      'Implement weekly metric review sessions',
      'Provide additional resources to struggling ventures',
      'Set up automated reminders for overdue metrics'
    ]
    riskAlerts = 'Low completion rate may impact impact measurement and reporting.'
  }

  const overdueCount = metrics.filter(m => m.status === 'Overdue').length
  if (overdueCount > 0) {
    riskAlerts = `${overdueCount} metrics are overdue and require immediate attention.`
  }

  return {
    trendAnalysis,
    recommendations,
    riskAlerts
  }
}

async function getRecentActivity() {
  const activities = await prisma.activity.findMany({
    where: {
      type: {
        in: ['METRIC_ADDED', 'METRIC_UPDATED', 'VENTURE_CREATED']
      }
    },
    include: {
      venture: {
        select: { name: true }
      },
      user: {
        select: { name: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  return activities.map(activity => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    ventureName: 'Sample Venture',
    userName: 'Sample User',
    createdAt: activity.createdAt
  }))
}

function calculateTrends(metrics: any[]) {
  // Group metrics by month for trend analysis
  const monthlyData = metrics.reduce((acc, metric) => {
    const month = new Date(metric.createdAt).toISOString().slice(0, 7) // YYYY-MM
    if (!acc[month]) {
      acc[month] = { total: 0, verified: 0, inProgress: 0, overdue: 0 }
    }
    acc[month].total++
    acc[month][metric.status.toLowerCase().replace(' ', '')]++
    return acc
  }, {})

  const trendData = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
    month,
    total: data.total,
    verified: data.verified,
    inProgress: data.inProgress,
    overdue: data.overdue,
    completionRate: data.total > 0 ? (data.verified / data.total) * 100 : 0
  })).sort((a, b) => a.month.localeCompare(b.month))

  return trendData
} 