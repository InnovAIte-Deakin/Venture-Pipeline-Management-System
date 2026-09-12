"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DesktopReportGenerator } from "./desktop-report-generator"
import { DesktopReportsList } from "./desktop-reports-list"
import { DesktopScheduledList } from "./desktop-scheduled-list"
import { DesktopDashboardBuilder } from "./desktop-dashboard-builder"
import { DesktopAnalytics } from "./desktop-analytics"
import { filterReports } from "../../lib/report-filters"
import type {
  Dashboard,
  ExportFormat,
  GedsiMetricApiResponseItem,
  Report,
  ReportStatusFilter,
  UseDashboardBuilderResult,
  UseReportBuilderResult,
  VentureApiResponseItem,
} from "../../types/advanced-reports.types"

interface AdvancedReportsDesktopProps {
  reports: Report[]
  dashboards: Dashboard[]
  ventures: VentureApiResponseItem[]
  gedsiMetrics: GedsiMetricApiResponseItem[]
  reportBuilder: UseReportBuilderResult
  dashboardBuilder: UseDashboardBuilderResult
}

/** Tab shell + layout for ≥1024px, preserving the original's 4-column tab list and wide multi-column grids. */
export function AdvancedReportsDesktop({ reports, dashboards, ventures, gedsiMetrics, reportBuilder, dashboardBuilder }: AdvancedReportsDesktopProps) {
  const [activeTab, setActiveTab] = useState("reports")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>("all")

  const filteredReports = filterReports(reports, { searchQuery, statusFilter })

  const handleExport = (reportId: string, format: ExportFormat) => {
    void reportBuilder.exportReport(reportId, format)
  }

  return (
    <div className="space-y-6">
      <DesktopReportGenerator builder={reportBuilder} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <DesktopReportsList
            reports={reports}
            filteredReports={filteredReports}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={() => {
              setSearchQuery("")
              setStatusFilter("all")
            }}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <DesktopScheduledList reports={reports} />
        </TabsContent>

        <TabsContent value="dashboards" className="space-y-6">
          <DesktopDashboardBuilder dashboards={dashboards} builder={dashboardBuilder} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DesktopAnalytics reports={reports} dashboards={dashboards} ventures={ventures} gedsiMetrics={gedsiMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
