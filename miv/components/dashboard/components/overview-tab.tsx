"use client"

import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { downloadDashboardCharts } from "@/lib/dashboard/dashboard-export"
import type { DashboardChartWidget, DashboardMetricCard, DashboardTimeframe, DashboardVenture } from "@/types/dashboard/types"
import { DashboardErrorBanner } from "./dashboard-error-banner"
import { DashboardLoadingState } from "./dashboard-loading-state"

interface OverviewTabProps {
  error: string | null
  loading: boolean
  metrics: DashboardMetricCard[]
  charts: DashboardChartWidget[]
  ventures: DashboardVenture[]
  selectedTimeframe: DashboardTimeframe
  onTimeframeChange: (timeframe: string) => void
  onOpenFilters: () => void
}

export function OverviewTab({
  error,
  loading,
  metrics,
  charts,
  ventures,
  selectedTimeframe,
  onTimeframeChange,
  onOpenFilters,
}: OverviewTabProps) {
  return (
    <>
      {error && <DashboardErrorBanner message={error} />}

      {loading ? (
        <DashboardLoadingState message="Loading dashboard data..." />
      ) : (
        <AnalyticsDashboard
          title="Pipeline Overview"
          metrics={metrics}
          charts={charts}
          ventures={ventures}
          timeRange={selectedTimeframe}
          onTimeRangeChange={onTimeframeChange}
          customizable
          onOpenFilters={onOpenFilters}
          onExport={({ charts: exportCharts }) => {
            try {
              downloadDashboardCharts(exportCharts)
            } catch (error) {
              console.error("Export failed:", error)
            }
          }}
        />
      )}
    </>
  )
}
