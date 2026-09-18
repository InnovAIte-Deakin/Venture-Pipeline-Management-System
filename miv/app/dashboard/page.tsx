"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { WorkflowDashboardTab } from "@/components/dashboard/workflow-dashboard-tab"
import { AnalyticsTab } from "@/components/dashboard/components/analytics-tab"
import { DashboardFilterDialog } from "@/components/dashboard/components/dashboard-filter-dialog"
import { OverviewTab } from "@/components/dashboard/components/overview-tab"
import { ReportsTab } from "@/components/dashboard/components/reports-tab"
import { VenturesTab } from "@/components/dashboard/components/ventures-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toast"
import { useEnterpriseDashboardData } from "@/hooks/dashboard/use-enterprise-dashboard-data"
import { calculateGedsiAnalytics } from "@/lib/dashboard/dashboard-aggregates"
import { filterDashboardVentures } from "@/lib/dashboard/dashboard-filters"
import {
  buildDashboardCharts,
  buildDashboardMetrics,
  mapVenturesToTableRows,
} from "@/lib/dashboard/dashboard-mappers"
import type { DashboardFilters } from "@/types/dashboard/types"
import { BarChart3, Building2, FileText, Grid3X3, Workflow } from "lucide-react"

export default function EnterpriseDashboard() {
  const { addToast } = useToast()
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [activeView, setActiveView] = useState("overview")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<DashboardFilters>({})

  const handleDataLoadError = useCallback(() => {
    addToast({
      type: "error",
      title: "Data Loading Error",
      description: "Failed to load dashboard data. Using sample data instead.",
    })
  }, [addToast])

  const { ventures, gedsiMetrics, loading, error } = useEnterpriseDashboardData({
    onError: handleDataLoadError,
  })

  const addWorkflowToast = useCallback(
    (toast: { type: string; title: string; description: string }) => {
      const type = ["success", "error", "info", "warning"].includes(toast.type)
        ? (toast.type as "success" | "error" | "info" | "warning")
        : "info"
      addToast({ ...toast, type })
    },
    [addToast],
  )

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dashboard.filters")
      if (raw) {
        const parsed = JSON.parse(raw)
        setFilters(parsed || {})
      }
    } catch {}
  }, [])

  const filteredVentures = useMemo(
    () => filterDashboardVentures(ventures, selectedTimeframe, filters),
    [filters, selectedTimeframe, ventures],
  )
  const gedsiAnalytics = useMemo(() => calculateGedsiAnalytics(ventures), [ventures])
  const analyticsMetrics = useMemo(
    () => buildDashboardMetrics(ventures, loading),
    [loading, ventures],
  )
  const analyticsCharts = useMemo(
    () => buildDashboardCharts(filteredVentures, gedsiMetrics, loading),
    [filteredVentures, gedsiMetrics, loading],
  )
  const venturesData = useMemo(
    () => mapVenturesToTableRows(filteredVentures, loading),
    [filteredVentures, loading],
  )

  return (
    <>
      <main className="min-w-0 flex-1 space-y-4 overflow-x-hidden bg-transparent sm:space-y-6">
        <Tabs value={activeView} onValueChange={setActiveView} className="min-w-0 space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-0">
            <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
              <TabsList className="grid h-auto min-w-[520px] grid-cols-5 bg-white/80 dark:bg-slate-800/80 shadow rounded-lg mb-0 relative sm:mb-4 sm:w-full">
                <TabsTrigger value="overview" className="flex min-h-10 items-center space-x-2 px-3">
                  <Grid3X3 className="h-4 w-4 shrink-0" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="ventures" className="flex min-h-10 items-center space-x-2 px-3">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>Ventures</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex min-h-10 items-center space-x-2 px-3">
                  <BarChart3 className="h-4 w-4 shrink-0" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex min-h-10 items-center space-x-2 px-3">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>Reports</span>
                </TabsTrigger>
                <TabsTrigger value="workflows" className="flex min-h-10 items-center space-x-2 px-3">
                  <Workflow className="h-4 w-4 shrink-0" />
                  <span>Workflows</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab
              error={error}
              loading={loading}
              metrics={analyticsMetrics}
              charts={analyticsCharts}
              ventures={ventures}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
              onOpenFilters={() => setShowFilters(true)}
            />
          </TabsContent>

          <TabsContent value="ventures" className="space-y-6">
            <VenturesTab loading={loading} venturesData={venturesData} addToast={addToast} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab
              loading={loading}
              ventures={ventures}
              gedsiMetrics={gedsiMetrics}
              analyticsMetrics={analyticsMetrics}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsTab
              loading={loading}
              ventures={ventures}
              gedsiMetrics={gedsiMetrics}
              gedsiAnalytics={gedsiAnalytics}
              analyticsMetrics={analyticsMetrics}
            />
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <WorkflowDashboardTab loading={loading} addToast={addWorkflowToast} />
          </TabsContent>
        </Tabs>
      </main>

      <DashboardFilterDialog
        open={showFilters}
        filters={filters}
        onOpenChange={setShowFilters}
        onApply={setFilters}
        onReset={() => setFilters({})}
      />
    </>
  )
}
