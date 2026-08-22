// app/dashboard/(g1-impact-analytics)/performance-analytics/hooks/use-performance-analytics-derived.ts
//
// T19 - Refactor and Improve Performance Analytics
// Formulas unchanged - pure relocation of the useMemo blocks that were
// inline in page.tsx, so Desktop and Mobile components can share them.

import { useMemo } from "react"
import type { AnalyticsData } from "../types"
import {
  calculateAvgTimeToFunding,
  calculateTimeToFundingChange,
  calculatePlatformGrowth,
} from "../lib/calculations"
import {
  Target, DollarSign, UserCheck, Users, Clock, TrendingUp,
} from "lucide-react"

export function usePerformanceAnalyticsDerived(data: AnalyticsData) {
  const kpiMetrics = useMemo(() => {
    const totalVentures = data.ventures.length
    const fundedVentures = data.ventures.filter(v => ['FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C'].includes(v.stage)).length
    const conversionRate = totalVentures > 0 ? Math.round((fundedVentures / totalVentures) * 100) : 0
    const totalCapital = data.ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0)
    const completedGedsi = data.gedsiMetrics.filter(m => ['COMPLETED', 'VERIFIED'].includes(m.status)).length
    const gedsiCompliance = data.gedsiMetrics.length > 0 ? Math.round((completedGedsi / data.gedsiMetrics.length) * 100) : 0
    const activeUsers = data.users.filter(u => u.isActive !== false).length

    return [
      { title: "Venture Success Rate", value: conversionRate, unit: "%", change: 2.1, trend: "up", icon: Target, color: "text-emerald-600", bgColor: "bg-emerald-50", description: "Ventures that reached funding stage" },
      { title: "Capital Facilitated", value: (totalCapital / 1000000).toFixed(1), unit: "M", change: 0.8, trend: "up", icon: DollarSign, color: "text-blue-600", bgColor: "bg-blue-50", description: "Total funding raised by ventures" },
      { title: "GEDSI Compliance", value: gedsiCompliance, unit: "%", change: 5.2, trend: "up", icon: UserCheck, color: "text-purple-600", bgColor: "bg-purple-50", description: "Average GEDSI metric completion" },
      { title: "Active Users", value: activeUsers, unit: "", change: 12, trend: "up", icon: Users, color: "text-orange-600", bgColor: "bg-orange-50", description: "Currently active platform users" },
      { title: "Avg Time to Funding", value: calculateAvgTimeToFunding(data.ventures), unit: " days", change: calculateTimeToFundingChange(data.ventures), trend: calculateTimeToFundingChange(data.ventures) < 0 ? "down" : "up", icon: Clock, color: "text-teal-600", bgColor: "bg-teal-50", description: "Average time from intake to funding" },
      { title: "Platform Growth", value: calculatePlatformGrowth(data.ventures), unit: "%", change: 0, trend: "up", icon: TrendingUp, color: "text-indigo-600", bgColor: "bg-indigo-50", description: "Month-over-month growth rate" }
    ]
  }, [data])

  const conversionFunnelData = useMemo(() => {
    if (data.ventures.length === 0) return [
      { stage: "Intake", count: 0, percentage: 0, color: "#3b82f6", dropoff: 0 },
      { stage: "Screening", count: 0, percentage: 0, color: "#8b5cf6", dropoff: 0 },
      { stage: "Due Diligence", count: 0, percentage: 0, color: "#f59e0b", dropoff: 0 },
      { stage: "Investment Ready", count: 0, percentage: 0, color: "#10b981", dropoff: 0 },
      { stage: "Funded", count: 0, percentage: 0, color: "#ef4444", dropoff: 0 }
    ]
    const stageCounts = { Intake: 0, Screening: 0, "Due Diligence": 0, "Investment Ready": 0, Funded: 0 }
    data.ventures.forEach(v => {
      const stage = String(v.stage || '').toUpperCase()
      if (stage.includes('INTAKE') || stage.includes('APPLIED')) stageCounts.Intake++
      else if (stage.includes('SCREEN') || stage.includes('REVIEW')) stageCounts.Screening++
      else if (stage.includes('DUE') || stage.includes('DILIGENCE')) stageCounts["Due Diligence"]++
      else if (stage.includes('READY') || stage.includes('APPROVED')) stageCounts["Investment Ready"]++
      else if (stage.includes('FUNDED') || stage.includes('SERIES')) stageCounts.Funded++
      else stageCounts.Screening++
    })
    const total = data.ventures.length
    const colors = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"]
    return Object.entries(stageCounts).map(([stage, count], index) => {
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
      const prevCount = index > 0 ? Object.values(stageCounts)[index - 1] : count
      const dropoff = prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 100) : 0
      return { stage, count, percentage, color: colors[index], dropoff: index > 0 ? dropoff : 0 }
    })
  }, [data.ventures])

  const performanceTrends = useMemo(() => {
    if (data.ventures.length === 0) {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({ month, ventures: 0, funding: 0, gedsiScore: 0, users: 0, conversionRate: 0 }))
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentVentures = data.ventures.length
    const totalFunding = data.ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0)
    const avgGedsiScore = data.ventures.length > 0 ? data.ventures.reduce((sum, v) => sum + (v.gedsiScore || 0), 0) / data.ventures.length : 0
    const currentUsers = data.users.length
    const fundedVentures = data.ventures.filter(v => ['FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C'].includes(v.stage)).length
    const conversionRate = data.ventures.length > 0 ? (fundedVentures / data.ventures.length) * 100 : 0
    return months.map((month, index) => ({
      month,
      ventures: Math.max(0, currentVentures - (5 - index) * 2),
      funding: Math.max(0, totalFunding * (0.6 + index * 0.08)),
      gedsiScore: Math.max(0, avgGedsiScore * (0.8 + index * 0.04)),
      users: Math.max(0, currentUsers * (0.7 + index * 0.05)),
      conversionRate: Math.max(0, conversionRate * (0.8 + index * 0.04))
    }))
  }, [data])

  const sectorPerformance = useMemo(() => {
    const sectorData: Record<string, { ventures: number, funded: number, capital: number }> = {}
    data.ventures.forEach(v => {
      const sector = v.sector || 'Other'
      if (!sectorData[sector]) sectorData[sector] = { ventures: 0, funded: 0, capital: 0 }
      sectorData[sector].ventures++
      if (['FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C'].includes(v.stage)) sectorData[sector].funded++
      sectorData[sector].capital += v.fundingRaised || 0
    })
    return Object.entries(sectorData).map(([sector, stats]) => ({
      sector, ventures: stats.ventures, funded: stats.funded,
      successRate: stats.ventures > 0 ? Math.round((stats.funded / stats.ventures) * 100) : 0,
      capital: stats.capital,
      avgCapital: stats.funded > 0 ? Math.round(stats.capital / stats.funded) : 0
    })).sort((a, b) => b.ventures - a.ventures)
  }, [data.ventures])

  const gedsiCategoryPerformance = useMemo(() => {
    const categoryData: Record<string, { total: number, completed: number }> = {}
    data.gedsiMetrics.forEach(m => {
      const category = m.category || 'OTHER'
      if (!categoryData[category]) categoryData[category] = { total: 0, completed: 0 }
      categoryData[category].total++
      if (['COMPLETED', 'VERIFIED'].includes(m.status)) categoryData[category].completed++
    })
    return Object.entries(categoryData).map(([category, stats]) => ({
      category, total: stats.total, completed: stats.completed,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      color: { GENDER: '#ec4899', DISABILITY: '#3b82f6', SOCIAL_INCLUSION: '#10b981', CROSS_CUTTING: '#f59e0b' }[category] || '#6b7280'
    }))
  }, [data.gedsiMetrics])

  return { kpiMetrics, conversionFunnelData, performanceTrends, sectorPerformance, gedsiCategoryPerformance }
}