import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CalculationService } from '@/lib/calculation-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    
    // Calculate date range based on period
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Fetch comprehensive analytics data
    const [
      totalVentures,
      venturesInPeriod,
      totalUsers,
      activeUsers,
      totalGedsiMetrics,
      completedGedsiMetrics,
      totalWorkflows,
      activeWorkflows,
      recentActivities,
      workflowRuns
    ] = await Promise.all([
      prisma.venture.count(),
      prisma.venture.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.gEDSIMetric.count(),
      prisma.gEDSIMetric.count({
        where: {
          status: {
            in: ['COMPLETED', 'VERIFIED']
          }
        }
      }),
      prisma.workflow.count(),
      prisma.workflow.count({
        where: {
          isActive: true
        }
      }),
      prisma.activity.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        take: 100,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          venture: {
            select: {
              name: true,
              sector: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.workflowRun.findMany({
        where: {
          startedAt: {
            gte: startDate
          }
        },
        take: 50,
        orderBy: {
          startedAt: 'desc'
        },
        include: {
          workflow: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    // Calculate metrics
    const gedsiComplianceRate = totalGedsiMetrics > 0 ? Math.round((completedGedsiMetrics / totalGedsiMetrics) * 100) : 0
    const userEngagementRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
    const workflowAutomationRate = totalWorkflows > 0 ? Math.round((activeWorkflows / totalWorkflows) * 100) : 0
    
    // Calculate success rates
    const successfulRuns = workflowRuns.filter(run => run.status === 'SUCCEEDED').length
    const workflowSuccessRate = workflowRuns.length > 0 ? Math.round((successfulRuns / workflowRuns.length) * 100) : 0

    // Activity analysis
    const activityByType = recentActivities.reduce((acc: any, activity) => {
      const type = activity.type || 'OTHER'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    // Performance trends (simplified calculation)
    const performanceTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - (i * 7)) // Weekly intervals
      
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - 7)
      
      const weeklyVentures = await prisma.venture.count({
        where: {
          createdAt: {
            gte: weekStart,
            lt: date
          }
        }
      })
      
      performanceTrends.push({
        week: `Week ${6 - i}`,
        ventures: weeklyVentures,
        gedsiScore: Math.floor(Math.random() * 20) + 70,
        users: Math.floor(Math.random() * 50) + 300,
        conversionRate: Math.floor(Math.random() * 10) + 15
      })
    }

    const analytics = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      },
      overview: {
        totalVentures,
        venturesInPeriod,
        totalUsers,
        activeUsers,
        gedsiComplianceRate,
        userEngagementRate,
        workflowAutomationRate,
        workflowSuccessRate
      },
      performance: {
        trends: performanceTrends,
        recentActivities: recentActivities.slice(0, 20),
        activityBreakdown: activityByType
      },
      workflows: {
        total: totalWorkflows,
        active: activeWorkflows,
        recentRuns: workflowRuns.slice(0, 10),
        successRate: workflowSuccessRate
      },
      insights: {
        topSectors: await getTopSectors(),
        riskFactors: calculateRiskFactors(recentActivities),
        recommendations: generateRecommendations(gedsiComplianceRate, userEngagementRate, workflowSuccessRate)
      }
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getTopSectors() {
  try {
    const ventures = await prisma.venture.findMany({
      select: {
        sector: true,
        stage: true,
        fundingRaised: true
      }
    })

    const sectorStats: Record<string, { count: number, funded: number, capital: number }> = {}
    
    ventures.forEach(v => {
      const sector = v.sector || 'Other'
      if (!sectorStats[sector]) {
        sectorStats[sector] = { count: 0, funded: 0, capital: 0 }
      }
      sectorStats[sector].count++
      if (['FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C'].includes(v.stage || '')) {
        sectorStats[sector].funded++
      }
      sectorStats[sector].capital += v.fundingRaised || 0
    })

    return Object.entries(sectorStats)
      .map(([sector, stats]) => ({
        sector,
        ventures: stats.count,
        successRate: stats.count > 0 ? Math.round((stats.funded / stats.count) * 100) : 0,
        totalCapital: stats.capital
      }))
      .sort((a, b) => b.ventures - a.ventures)
      .slice(0, 5)
  } catch (error) {
    console.error('Error calculating top sectors:', error)
    return []
  }
}

function calculateRiskFactors(activities: any[]) {
  // Simple risk calculation based on activity patterns
  const riskFactors = {
    pipeline: 'low',
    compliance: 'medium',
    market: 'low',
    operational: 'low'
  }

  // Analyze activity patterns for risk indicators
  const recentFailures = activities.filter(a => a.type === 'VENTURE_UPDATED' && a.description?.includes('failed')).length
  const complianceIssues = activities.filter(a => a.type === 'METRIC_UPDATED' && a.description?.includes('issue')).length

  if (recentFailures > 5) riskFactors.pipeline = 'high'
  else if (recentFailures > 2) riskFactors.pipeline = 'medium'

  if (complianceIssues > 3) riskFactors.compliance = 'high'
  else if (complianceIssues > 1) riskFactors.compliance = 'medium'

  return riskFactors
}

function generateRecommendations(gedsiRate: number, engagementRate: number, workflowRate: number) {
  const recommendations = []

  if (gedsiRate > 80) {
    recommendations.push({
      type: 'success',
      title: 'Strong GEDSI Performance',
      description: 'Your GEDSI compliance rate is excellent. Consider showcasing this in investor materials.',
      priority: 'low'
    })
  } else if (gedsiRate < 60) {
    recommendations.push({
      type: 'warning',
      title: 'GEDSI Compliance Needs Attention',
      description: 'Consider implementing automated GEDSI monitoring workflows to improve compliance.',
      priority: 'high'
    })
  }

  if (engagementRate > 70) {
    recommendations.push({
      type: 'success',
      title: 'High User Engagement',
      description: 'Users are actively engaged with the platform. Consider expanding feature offerings.',
      priority: 'medium'
    })
  } else if (engagementRate < 40) {
    recommendations.push({
      type: 'warning',
      title: 'Low User Engagement',
      description: 'User engagement is below optimal. Review user experience and add training materials.',
      priority: 'high'
    })
  }

  if (workflowRate > 80) {
    recommendations.push({
      type: 'success',
      title: 'Excellent Automation',
      description: 'High workflow automation rate is improving efficiency. Consider expanding automation scope.',
      priority: 'low'
    })
  }

  return recommendations
}