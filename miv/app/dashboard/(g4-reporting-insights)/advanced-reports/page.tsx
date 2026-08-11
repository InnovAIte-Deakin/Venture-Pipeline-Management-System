"use client"

import { RefreshCw } from "lucide-react"
import { AdvancedReportsHeader } from "./components/advanced-reports-header"
import { AdvancedReportsDesktop } from "./components/desktop/advanced-reports-desktop"
import { AdvancedReportsMobile } from "./components/mobile/advanced-reports-mobile"
import { useAdvancedReportsData } from "./hooks/use-advanced-reports-data"
import { useReportBuilder } from "./hooks/use-report-builder"
import { useDashboardBuilder } from "./hooks/use-dashboard-builder"
import { useViewport } from "./hooks/use-viewport"

export default function AdvancedReportsPage() {
  const data = useAdvancedReportsData()
  const reportBuilder = useReportBuilder(data.reports, data.setReports)
  const dashboardBuilder = useDashboardBuilder()
  const { isMobile } = useViewport()

  if (data.requestState.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" aria-hidden="true" />
          <span>Loading reports...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdvancedReportsHeader />

      {isMobile ? (
        <AdvancedReportsMobile
          reports={data.reports}
          dashboards={data.dashboards}
          ventures={data.ventures}
          gedsiMetrics={data.gedsiMetrics}
          reportBuilder={reportBuilder}
          dashboardBuilder={dashboardBuilder}
        />
      ) : (
        <AdvancedReportsDesktop
          reports={data.reports}
          dashboards={data.dashboards}
          ventures={data.ventures}
          gedsiMetrics={data.gedsiMetrics}
          reportBuilder={reportBuilder}
          dashboardBuilder={dashboardBuilder}
        />
      )}
    </div>
  )
}
