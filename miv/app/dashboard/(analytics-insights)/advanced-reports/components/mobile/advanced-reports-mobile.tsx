"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileReportBuilder } from "./mobile-report-builder"
import { MobileReportList } from "./mobile-report-list"
import { MobileScheduledList } from "./mobile-scheduled-list"
import { MobileDashboardList } from "./mobile-dashboard-list"
import { MobileAnalytics } from "./mobile-analytics"
import { ReportPreview } from "../report-preview"
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

interface AdvancedReportsMobileProps {
  reports: Report[]
  dashboards: Dashboard[]
  ventures: VentureApiResponseItem[]
  gedsiMetrics: GedsiMetricApiResponseItem[]
  reportBuilder: UseReportBuilderResult
  dashboardBuilder: UseDashboardBuilderResult
}

/** Step/tab shell for <1024px: step-based generator, compact tab bar, vertical single-column content, no horizontal page scrolling. */
export function AdvancedReportsMobile({ reports, dashboards, ventures, gedsiMetrics, reportBuilder, dashboardBuilder }: AdvancedReportsMobileProps) {
  const [activeTab, setActiveTab] = useState("reports")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const filteredReports = filterReports(reports, { searchQuery, statusFilter })

  const handleExport = async (reportId: string, format: ExportFormat) => {
  await reportBuilder.exportReport(reportId, format)
}

if (selectedReport) {
  return (
    <ReportPreview
      report={selectedReport}
      onBack={() => setSelectedReport(null)}
      onExport={handleExport}
    />
  )
}

return (
    <div className="space-y-6">
      <MobileReportBuilder builder={reportBuilder} onGenerated={() => setActiveTab("reports")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 text-xs">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <MobileReportList
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
  onPreview={setSelectedReport}
  onExport={handleExport}
/>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <MobileScheduledList reports={reports} />
        </TabsContent>

        <TabsContent value="dashboards" className="space-y-4">
          <MobileDashboardList dashboards={dashboards} builder={dashboardBuilder} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <MobileAnalytics reports={reports} dashboards={dashboards} ventures={ventures} gedsiMetrics={gedsiMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
