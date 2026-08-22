// app/dashboard/(g1-impact-analytics)/performance-analytics/page.tsx
//
// T19 - Refactor and Improve Performance Analytics
// Thin wrapper: owns data-fetching + derived calculations (shared by both
// views), then renders the Desktop or Mobile component based on viewport.

"use client"

import { usePerformanceAnalyticsData } from "./hooks/use-performance-analytics-data"
import { usePerformanceAnalyticsDerived } from "./hooks/use-performance-analytics-derived"
import { useIsMobile } from "./hooks/use-is-mobile"
import { PerformanceAnalyticsDesktop } from "./components/desktop/performance-analytics-desktop"
import { PerformanceAnalyticsMobile } from "./components/mobile/performance-analytics-mobile"
import { RefreshCw } from "lucide-react"

export default function PerformanceAnalytics() {
  const {
    data,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    realTimeEnabled,
    setRealTimeEnabled,
    loadAnalyticsData,
  } = usePerformanceAnalyticsData()

  const {
    kpiMetrics,
    conversionFunnelData,
    performanceTrends,
    sectorPerformance,
    gedsiCategoryPerformance,
  } = usePerformanceAnalyticsDerived(data)

  const isMobile = useIsMobile()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading advanced analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  const sharedProps = {
    data,
    selectedPeriod,
    setSelectedPeriod,
    realTimeEnabled,
    setRealTimeEnabled,
    loadAnalyticsData,
    kpiMetrics,
    conversionFunnelData,
    performanceTrends,
    sectorPerformance,
    gedsiCategoryPerformance,
  }

  return isMobile
    ? <PerformanceAnalyticsMobile {...sharedProps} />
    : <PerformanceAnalyticsDesktop {...sharedProps} />
}