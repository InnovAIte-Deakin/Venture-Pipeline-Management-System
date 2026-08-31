// lib/performance-analytics/calculations.ts
//
// Extracted from app/dashboard/(analytics-insights)/performance-analytics/page.tsx
// T19 - Refactor and Improve Performance Analytics
//
// IMPORTANT: Formulas are unchanged from the original file. This is a pure
// structural extraction (per Guide instructions: "Do not change formulas
// during a structural refactor").

import {
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react"

export interface AnalyticsData {
  ventures: any[]
  gedsiMetrics: any[]
  users: any[]
  analytics: any
}

// ---------------------------------------------------------------------------
// Helper functions for real calculations
// ---------------------------------------------------------------------------

export function calculateAvgTimeToFunding(ventures: any[]): number {
  if (ventures.length === 0) return 0

  const fundedVentures = ventures.filter(v =>
    ['FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C'].includes(v.stage)
  )

  if (fundedVentures.length === 0) return 0

  const totalDays = fundedVentures.reduce((sum, venture) => {
    const createdDate = new Date(venture.createdAt)
    const updatedDate = new Date(venture.updatedAt)
    const daysDiff = Math.floor((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    return sum + daysDiff
  }, 0)

  return Math.round(totalDays / fundedVentures.length)
}

export function calculateTimeToFundingChange(ventures: any[]): number {
  // Would need historical data to calculate real change
  // For now, return 0 to indicate no change data available
  return 0
}

export function calculatePlatformGrowth(ventures: any[]): number {
  if (ventures.length === 0) return 0

  // Calculate growth based on venture creation in last 30 days vs previous 30 days
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentVentures = ventures.filter(v => new Date(v.createdAt) >= thirtyDaysAgo)
  const previousVentures = ventures.filter(v => {
    const date = new Date(v.createdAt)
    return date >= sixtyDaysAgo && date < thirtyDaysAgo
  })

  if (previousVentures.length === 0) return recentVentures.length > 0 ? 100 : 0

  return Math.round(((recentVentures.length - previousVentures.length) / previousVentures.length) * 100)
}

// ---------------------------------------------------------------------------
// Generate AI insights based on real data
// ---------------------------------------------------------------------------

export function generateAIInsights(data: AnalyticsData) {
  const insights = []

  const gedsiCompliance = data.gedsiMetrics.length > 0
    ? Math.round((data.gedsiMetrics.filter(m => ['COMPLETED', 'VERIFIED'].includes(m.status)).length / data.gedsiMetrics.length) * 100)
    : 0

  if (gedsiCompliance >= 75) {
    insights.push({
      title: "Strong GEDSI Performance",
      description: `Your GEDSI compliance rate of ${gedsiCompliance}% is above the MIV target of 75%. Consider showcasing this in investor reports.`,
      icon: CheckCircle,
      iconColor: "text-green-600",
      textColor: "text-green-900",
      descriptionColor: "text-green-700",
      borderColor: "border-green-500"
    })
  } else if (gedsiCompliance > 0) {
    insights.push({
      title: "GEDSI Improvement Needed",
      description: `Your GEDSI compliance rate of ${gedsiCompliance}% is below the MIV target of 75%. Focus on completing pending metrics.`,
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      textColor: "text-yellow-900",
      descriptionColor: "text-yellow-700",
      borderColor: "border-yellow-500"
    })
  }

  const dueDiligenceVentures = data.ventures.filter(v => v.stage === 'DUE_DILIGENCE').length
  if (dueDiligenceVentures > data.ventures.length * 0.3) {
    insights.push({
      title: "Pipeline Bottleneck",
      description: `${dueDiligenceVentures} ventures are in due diligence stage. Consider streamlining the process or adding more resources.`,
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      textColor: "text-yellow-900",
      descriptionColor: "text-yellow-700",
      borderColor: "border-yellow-500"
    })
  }

  // If no specific insights, show general guidance
  if (insights.length === 0) {
    insights.push({
      title: "Ready for Growth",
      description: "Your portfolio is performing well. Continue monitoring metrics and consider expanding outreach.",
      icon: Zap,
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
      descriptionColor: "text-blue-700",
      borderColor: "border-blue-500"
    })
  }

  return insights
}

// ---------------------------------------------------------------------------
// Generate risk assessment based on real data
// ---------------------------------------------------------------------------

export function generateRiskAssessment(data: AnalyticsData) {
  const pipelineRisk = data.ventures.length === 0 ? "High" :
    data.ventures.filter(v => ['INTAKE', 'SCREENING'].includes(v.stage)).length > data.ventures.length * 0.5 ? "Medium" : "Low"

  const complianceRisk = data.gedsiMetrics.length === 0 ? "High" :
    data.gedsiMetrics.filter(m => ['COMPLETED', 'VERIFIED'].includes(m.status)).length / data.gedsiMetrics.length < 0.6 ? "High" :
    data.gedsiMetrics.filter(m => ['COMPLETED', 'VERIFIED'].includes(m.status)).length / data.gedsiMetrics.length < 0.8 ? "Medium" : "Low"

  const marketRisk = data.ventures.length < 5 ? "Medium" : "Low"

  return [{
    title: "Risk Assessment",
    items: [
      {
        label: "Pipeline Risk",
        value: pipelineRisk,
        badgeClass: pipelineRisk === "Low" ? "bg-green-50 text-green-700" :
          pipelineRisk === "Medium" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"
      },
      {
        label: "Compliance Risk",
        value: complianceRisk,
        badgeClass: complianceRisk === "Low" ? "bg-green-50 text-green-700" :
          complianceRisk === "Medium" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"
      },
      {
        label: "Market Risk",
        value: marketRisk,
        badgeClass: marketRisk === "Low" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
      }
    ]
  }]
}

// ---------------------------------------------------------------------------
// Generate optimization opportunities based on real data
// ---------------------------------------------------------------------------

export function generateOptimizationOpportunities(data: AnalyticsData): string[] {
  const opportunities = []

  if (data.ventures.length === 0) return []

  // Analyze sector performance
  const sectorStats = data.ventures.reduce((acc: any, venture) => {
    const sector = venture.sector || 'Other'
    if (!acc[sector]) acc[sector] = { total: 0, funded: 0 }
    acc[sector].total++
    if (['FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C'].includes(venture.stage)) {
      acc[sector].funded++
    }
    return acc
  }, {})

  const bestSector = Object.entries(sectorStats)
    .map(([sector, stats]: [string, any]) => ({
      sector,
      successRate: stats.total > 0 ? (stats.funded / stats.total) * 100 : 0,
      total: stats.total
    }))
    .filter(s => s.total >= 2) // Only sectors with at least 2 ventures
    .sort((a, b) => b.successRate - a.successRate)[0]

  if (bestSector && bestSector.successRate > 50) {
    opportunities.push(`Focus on ${bestSector.sector} sector (${Math.round(bestSector.successRate)}% success rate)`)
  }

  // Analyze geographic distribution
  const locations = data.ventures.reduce((acc: any, venture) => {
    const country = venture.location?.split(',')[1]?.trim() || 'Unknown'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  const topLocation = Object.entries(locations)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]

  if (topLocation && (topLocation[1] as number) >= 2) {
    opportunities.push(`Expand in ${topLocation[0]} market (${topLocation[1]} ventures)`)
  }

  // Time optimization
  const avgTime = calculateAvgTimeToFunding(data.ventures)
  if (avgTime > 30) {
    opportunities.push(`Improve process efficiency (current avg: ${avgTime} days)`)
  }

  return opportunities
}