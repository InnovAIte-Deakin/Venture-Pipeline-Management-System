"use client"

import { calculateGEDSIScore } from "@/lib/gedsi-utils"
import { Badge } from "@/components/ui/badge"
import { Building2, DollarSign, Target, UserCheck } from "lucide-react"
import { calculateGedsiAnalytics, calculateOverallPerformance } from "./dashboard-aggregates"
import { getVentureCountry } from "./dashboard-filters"
import type {
  AdvancedFilterValue,
  DashboardChartWidget,
  DashboardGedsiMetric,
  DashboardMetricCard,
  DashboardVenture,
  DashboardVentureRow,
} from "@/types/dashboard/types"

const STAGE_ORDER = [
  "INTAKE",
  "SCREENING",
  "DIAGNOSTICS",
  "DUE_DILIGENCE",
  "INVESTMENT_READY",
  "CAPITAL_FACILITATION",
  "SEED",
  "SERIES_A",
  "SERIES_B",
  "SERIES_C",
  "FUNDED",
  "EXITED",
]

export function buildDashboardMetrics(
  ventures: DashboardVenture[],
  loading: boolean,
): DashboardMetricCard[] {
  if (loading) {
    return [
      {
        title: "Total Ventures",
        value: "Loading...",
        change: 0,
        changeType: "neutral",
        icon: <Building2 className="h-6 w-6 text-white" />,
        color: "bg-linear-to-br from-blue-500 to-blue-600 shadow-lg",
        subtitle: "Active in pipeline",
      },
      {
        title: "Capital Facilitated",
        value: "Loading...",
        change: 0,
        changeType: "neutral",
        icon: <DollarSign className="h-6 w-6 text-white" />,
        color: "bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg",
        subtitle: "This quarter",
      },
      {
        title: "GEDSI Score",
        value: "Loading...",
        change: 0,
        changeType: "neutral",
        icon: <UserCheck className="h-6 w-6 text-white" />,
        color: "bg-linear-to-br from-purple-500 to-purple-600 shadow-lg",
        subtitle: "Average score",
      },
      {
        title: "Success Rate",
        value: "Loading...",
        change: 0,
        changeType: "neutral",
        icon: <Target className="h-6 w-6 text-white" />,
        color: "bg-linear-to-br from-orange-500 to-orange-600 shadow-lg",
        subtitle: "Deal completion",
      },
    ]
  }

  const totalVentures = ventures.length
  const totalCapital = ventures.reduce((sum, venture) => sum + (venture.fundingRaised || 0), 0)
  const successfulVentures = ventures.filter((venture) =>
    venture.stage ? ["SERIES_A", "SERIES_B", "SERIES_C"].includes(venture.stage) : false,
  )
  const successRate =
    ventures.length > 0 ? Math.round((successfulVentures.length / ventures.length) * 100) : 0
  const gedsiAnalytics = calculateGedsiAnalytics(ventures)

  return [
    {
      title: "Total Ventures",
      value: totalVentures.toString(),
      change: 0,
      changeType: totalVentures > 0 ? "increase" : "neutral",
      icon: <Building2 className="h-6 w-6 text-white" />,
      color: "bg-linear-to-br from-blue-500 to-blue-600 shadow-lg",
      subtitle: "Active in pipeline",
    },
    {
      title: "Capital Facilitated",
      value: `$${(totalCapital / 1000000).toFixed(1)}M`,
      change: 0,
      changeType: totalCapital > 0 ? "increase" : "neutral",
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: "bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg",
      subtitle: "This quarter",
    },
    {
      title: "GEDSI Score",
      value: gedsiAnalytics.averageGedsiScore.toString(),
      change: 0,
      changeType: gedsiAnalytics.averageGedsiScore > 0 ? "increase" : "neutral",
      icon: <UserCheck className="h-6 w-6 text-white" />,
      color: "bg-linear-to-br from-purple-500 to-purple-600 shadow-lg",
      subtitle: "Average score",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      change: 0,
      changeType: successRate > 0 ? "increase" : "neutral",
      icon: <Target className="h-6 w-6 text-white" />,
      color: "bg-linear-to-br from-orange-500 to-orange-600 shadow-lg",
      subtitle: "Deal completion",
    },
  ]
}

export function buildDashboardCharts(
  filteredVentures: DashboardVenture[],
  gedsiMetrics: DashboardGedsiMetric[],
  loading: boolean,
): DashboardChartWidget[] {
  if (loading) {
    return [
      { id: "pipeline-flow", title: "Pipeline Flow Analysis", type: "bar", data: [], span: 2 },
      { id: "regional-distribution", title: "Regional Distribution", type: "pie", data: [] },
      { id: "performance-trends", title: "Performance Trends", type: "line", data: [], span: 2 },
      { id: "gedsi-metrics", title: "GEDSI Metrics", type: "area", data: [] },
    ]
  }

  const pipelineFlow = filteredVentures.reduce<Record<string, number>>((acc, venture) => {
    const stage = String(venture.stage || "UNKNOWN").toUpperCase()
    acc[stage] = (acc[stage] || 0) + 1
    return acc
  }, {})

  const statusByStage = filteredVentures.reduce<Record<string, Record<string, number>>>((acc, venture) => {
    const stage = String(venture.stage || "UNKNOWN").toUpperCase()
    const status = String(venture.status || "ACTIVE").toUpperCase()
    if (!acc[stage]) acc[stage] = {}
    acc[stage][status] = (acc[stage][status] || 0) + 1
    return acc
  }, {})

  const normalizedCounts: Record<string, number> = {}
  Object.entries(pipelineFlow).forEach(([key, value]) => {
    const normalizedKey = key.includes("DIAG") ? "DIAGNOSTICS" : key
    normalizedCounts[normalizedKey] = (normalizedCounts[normalizedKey] || 0) + value
  })

  const uniqueStages = Array.from(new Set([...STAGE_ORDER, ...Object.keys(normalizedCounts)]))
  const uniqueStatuses = Array.from(new Set(Object.values(statusByStage).flatMap((status) => Object.keys(status))))
  const pipelineData = uniqueStages
    .filter((stage) => normalizedCounts[stage] != null)
    .map((stage, index, stages) => {
      const count = normalizedCounts[stage]
      const prevCount = index === 0 ? count : normalizedCounts[stages[index - 1]] || 0
      const conversion = prevCount > 0 ? Math.round((count / prevCount) * 100) : 100
      const delta = index === 0 ? 0 : count - prevCount
      const row: Record<string, unknown> = {
        stage: stage.replaceAll("_", " "),
        ventures: count,
        conversion,
        delta,
      }

      const perStatus = statusByStage[stage] || {}
      uniqueStatuses.forEach((status) => {
        row[status] = perStatus[status] || 0
      })
      return row
    })

  if (pipelineData.length === 0) {
    pipelineData.push({ stage: "No Data", ventures: 0 })
  }

  const regionalData = filteredVentures.reduce<Record<string, number>>((acc, venture) => {
    const country = getVentureCountry(venture)
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  const regionalChartData = Object.entries(regionalData).map(([region, value]) => ({
    region,
    value,
    totalFunding: 0,
    avgFunding: 0,
    stageCount: 0,
    sectorCount: 0,
    percentage: Math.round((value / filteredVentures.length) * 100),
  }))

  if (regionalChartData.length === 0) {
    regionalChartData.push({
      region: "No Data",
      value: 0,
      totalFunding: 0,
      avgFunding: 0,
      stageCount: 0,
      sectorCount: 0,
      percentage: 0,
    })
  }

  const gedsiByCategory = gedsiMetrics.reduce<Record<string, number>>((acc, metric) => {
    const category = metric.category || "Unknown"
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const gedsiChartData = Object.entries(gedsiByCategory).map(([category, count]) => ({
    week: category.replace("_", " "),
    compliance: count,
  }))

  if (gedsiChartData.length === 0) {
    gedsiChartData.push({ week: "No Data", compliance: 0 })
  }

  const overallPerformance = calculateOverallPerformance(filteredVentures, gedsiMetrics)
  const performanceData =
    filteredVentures.length === 0
      ? [
          { month: "Jan", score: 0 },
          { month: "Feb", score: 0 },
          { month: "Mar", score: 0 },
          { month: "Apr", score: 0 },
          { month: "May", score: 0 },
          { month: "Jun", score: 0 },
        ]
      : [
          { month: "Jan", score: Math.round(overallPerformance * 0.75) },
          { month: "Feb", score: Math.round(overallPerformance * 0.82) },
          { month: "Mar", score: Math.round(overallPerformance * 0.88) },
          { month: "Apr", score: Math.round(overallPerformance * 0.92) },
          { month: "May", score: Math.round(overallPerformance * 0.95) },
          { month: "Jun", score: overallPerformance },
        ]

  return [
    {
      id: "pipeline-flow",
      title: "🌊 Venture Flow Intelligence",
      type: "area",
      data: pipelineData.map((item, index, rows) => {
        const ventures = Number(item.ventures) || 0
        const conversion = Number(item.conversion) || 0
        const delta = Number(item.delta) || 0
        const previousVentures = Number(rows[index - 1]?.ventures) || 0
        const healthFactors = [
          conversion >= 80 ? 25 : conversion >= 60 ? 15 : 5,
          ventures > 0 ? 20 : 0,
          delta >= 0 ? 15 : Math.max(0, 15 + delta),
          index === 0 ? 20 : (ventures / previousVentures) * 20 || 10,
          Math.min(20, ventures * 2),
        ]
        const healthScore = Math.round(healthFactors.reduce((sum, factor) => sum + factor, 0))
        const insights = getStageInsights(ventures, conversion, delta)
        const flowVelocity = index > 0 ? Math.round((ventures / previousVentures) * 100 || 0) : 100
        const timeToComplete = Math.round(7 + Math.random() * 21)

        return {
          stage: String(item.stage).replace(/_/g, " "),
          ventures,
          healthScore,
          conversion,
          delta,
          flowVelocity,
          timeToComplete,
          stageStatus: insights.status,
          aiInsight: insights.insight,
          priority: insights.priority,
          stageIndex: index,
          avgDealSize: Math.round(50000 + Math.random() * 200000),
          successProbability: Math.max(20, Math.min(95, conversion + Math.random() * 20 - 10)),
          resourceUtilization: Math.round(60 + Math.random() * 35),
          teamCapacity: Math.round(ventures / Math.max(1, Math.floor(ventures / 5))),
          bottleneckRisk: conversion < 60 ? "High" : conversion < 80 ? "Medium" : "Low",
          nextMilestone:
            index < rows.length - 1
              ? `${String(rows[index + 1]?.stage).replace(/_/g, " ")} (${timeToComplete} days)`
              : "Portfolio Exit",
          kpiTrend: delta >= 0 ? "📈 Improving" : "📉 Needs Attention",
        }
      }),
      options: {
        color: "#6366F1",
        gradient: true,
        smooth: true,
        showDataPoints: true,
        fillOpacity: 0.2,
        strokeWidth: 4,
        palette: ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4"],
        xKey: "stage",
        yKey: "ventures",
        interactive: true,
        tooltipFormatter: (value: unknown, payload: Record<string, unknown> | undefined) => {
          if (!payload) return [`${value} ventures`]

          return [
            `🏢 ${value} Active Ventures`,
            `${payload.stageStatus} (Health: ${payload.healthScore}/100)`,
            `🎯 ${payload.conversion}% Conversion Rate`,
            `⚡ Flow Velocity: ${payload.flowVelocity}%`,
            `⏱️ Avg Time: ${payload.timeToComplete} days`,
            `💰 Avg Deal: $${(Number(payload.avgDealSize) / 1000).toFixed(0)}K`,
            `🎲 Success Probability: ${payload.successProbability}%`,
            `👥 Team Capacity: ${payload.teamCapacity} ventures/person`,
            `⚠️ Bottleneck Risk: ${payload.bottleneckRisk}`,
            `🎯 Next: ${payload.nextMilestone}`,
            `📊 Trend: ${payload.kpiTrend}`,
            "",
            `🤖 AI Insight: ${payload.aiInsight}`,
            "🔍 Click for deep-dive analysis",
          ]
        },
        onDataPointClick: (data: Record<string, unknown>) => {
          console.log("Flow stage clicked:", data)
          const params = new URLSearchParams({
            stage: String(data.stage).toLowerCase().replace(/\s+/g, "-"),
            health: String(data.healthScore),
            priority: String(data.priority),
            insight: encodeURIComponent(String(data.aiInsight)),
          })
          window.location.href = `/dashboard/deal-flow?${params.toString()}`
        },
        customLegend: {
          enabled: true,
          items: [
            { color: "#10B981", label: "🎯 Optimized (80%+ conversion)" },
            { color: "#F59E0B", label: "⚠️ Bottleneck (<60% conversion)" },
            { color: "#EF4444", label: "🚨 Critical (0 ventures)" },
            { color: "#6366F1", label: "🔄 Active (normal flow)" },
          ],
        },
        annotations: pipelineData
          .filter((item) => Number(item.conversion) < 50 || Number(item.ventures) === 0)
          .map((item) => ({
            x: String(item.stage).replace(/_/g, " "),
            y: item.ventures,
            content: Number(item.ventures) === 0 ? "🚨 Empty Stage!" : "⚠️ Bottleneck Alert",
            position: "top",
            style: {
              background: Number(item.ventures) === 0 ? "#FEE2E2" : "#FEF3C7",
              color: Number(item.ventures) === 0 ? "#DC2626" : "#D97706",
              border: `2px solid ${Number(item.ventures) === 0 ? "#DC2626" : "#D97706"}`,
              borderRadius: "8px",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "bold",
            },
          })),
      },
      span: 2,
    },
    {
      id: "regional-distribution",
      title: "Regional Distribution",
      type: "pie",
      data: regionalChartData,
      options: {
        palette: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#84CC16",
          "#F97316",
          "#EC4899",
          "#6366F1",
        ],
        color: "#3B82F6",
        labels: true,
      },
    },
    { id: "performance-trends", title: "Performance Trends", type: "line", data: performanceData, span: 2 },
    { id: "gedsi-metrics", title: "GEDSI Metrics", type: "area", data: gedsiChartData },
  ]
}

export function mapVenturesToTableRows(ventures: DashboardVenture[], loading: boolean): DashboardVentureRow[] {
  if (loading) return []

  return ventures.map((venture) => {
    const gedsiScore = calculateGEDSIScore(venture)

    return {
      id: venture.id,
      name: venture.name || "Unnamed Venture",
      sector: venture.sector || "Unknown",
      stage: venture.stage || "Unknown",
      country: getVentureCountry(venture),
      gedsiScore,
      capitalNeeded: venture.fundingRaised ? `$${(venture.fundingRaised / 1000000).toFixed(1)}M` : "$0",
      status: venture.status || "Unknown",
      lastUpdate: venture.updatedAt ? new Date(venture.updatedAt).toISOString().split("T")[0] : "Unknown",
    }
  })
}

export const ventureTableColumns = [
  {
    key: "name",
    label: "Venture Name",
    sortable: true,
    filterable: true,
    render: (value: unknown, row: Record<string, unknown>) => (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building2 className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">{String(value)}</p>
          <p className="text-xs text-gray-500">{String(row.sector)}</p>
        </div>
      </div>
    ),
  },
  {
    key: "stage",
    label: "Stage",
    sortable: true,
    filterable: true,
    render: (value: unknown) => <Badge variant="outline">{String(value)}</Badge>,
  },
  {
    key: "country",
    label: "Country",
    sortable: true,
    filterable: true,
  },
  {
    key: "gedsiScore",
    label: "GEDSI Score",
    sortable: true,
    render: (value: unknown) => {
      const numValue = Number(value)
      return (
        <div className="flex items-center space-x-2">
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                numValue >= 80 ? "bg-green-500" : numValue >= 60 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${numValue}%` }}
            />
          </div>
          <span className="text-sm font-medium">{numValue}%</span>
        </div>
      )
    },
  },
  {
    key: "capitalNeeded",
    label: "Capital Needed",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (value: unknown) => {
      const strValue = String(value)
      const colors = {
        Active: "bg-green-100 text-green-800",
        Assessment: "bg-yellow-100 text-yellow-800",
        Review: "bg-blue-100 text-blue-800",
        Completed: "bg-gray-100 text-gray-800",
      }
      return (
        <Badge className={colors[strValue as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
          {strValue}
        </Badge>
      )
    },
  },
]

export const ventureFilterFields = [
  {
    key: "name",
    label: "Venture Name",
    type: "text" as const,
    placeholder: "Search by name",
  },
  {
    key: "sector",
    label: "Sector",
    type: "select" as const,
    options: [
      { value: "cleantech", label: "CleanTech" },
      { value: "agriculture", label: "Agriculture" },
      { value: "fintech", label: "FinTech" },
      { value: "healthcare", label: "Healthcare" },
    ],
  },
  {
    key: "stage",
    label: "Stage",
    type: "select" as const,
    options: [
      { value: "pre-seed", label: "Pre-Seed" },
      { value: "seed", label: "Seed" },
      { value: "series-a", label: "Series A" },
      { value: "series-b", label: "Series B" },
    ],
  },
  {
    key: "country",
    label: "Country",
    type: "select" as const,
    options: [
      { value: "cambodia", label: "Cambodia" },
      { value: "vietnam", label: "Vietnam" },
      { value: "thailand", label: "Thailand" },
      { value: "laos", label: "Laos" },
    ],
  },
  {
    key: "gedsiScore",
    label: "GEDSI Score",
    type: "range" as const,
  },
]

export function noopAdvancedFilterChange(_filters: AdvancedFilterValue[]): void {
  // The existing dashboard rendered AdvancedFilters but did not apply its output.
}

function getStageInsights(ventures: number, conversion: number, delta: number) {
  if (ventures === 0) {
    return {
      status: "🚨 Empty",
      insight: "No active ventures - needs immediate attention",
      priority: "critical",
    }
  }
  if (conversion < 50) {
    return {
      status: "⚠️ Bottleneck",
      insight: "Low conversion rate - optimize processes",
      priority: "high",
    }
  }
  if (delta < -2) {
    return {
      status: "📉 Declining",
      insight: "Negative trend - investigate issues",
      priority: "medium",
    }
  }
  if (conversion >= 80) {
    return {
      status: "🎯 Optimized",
      insight: "Excellent performance - replicate success",
      priority: "low",
    }
  }
  return {
    status: "🔄 Active",
    insight: "Normal operations - monitor closely",
    priority: "low",
  }
}
