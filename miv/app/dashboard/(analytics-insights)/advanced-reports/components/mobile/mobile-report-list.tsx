"use client"

import { useState } from "react"
import { MobileFilterSheet } from "./mobile-filter-sheet"
import { MobileReportCard } from "./mobile-report-card"
import { ExportReportDialog } from "../dialogs/export-report-dialog"
import { ReportSummary } from "../report-summary"
import type { ExportFormat, Report, ReportStatusFilter } from "../../types/advanced-reports.types"

interface MobileReportListProps {
  reports: Report[]
  filteredReports: Report[]
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: ReportStatusFilter
  onStatusFilterChange: (value: ReportStatusFilter) => void
  onClearFilters: () => void
  onPreview: (report: Report) => void
  onExport: (reportId: string, format: ExportFormat) => Promise<void>
}

/**
 * Reports tab, mobile: filter Sheet trigger instead of an inline row, and
 * vertical `MobileReportCard`s instead of the desktop 6-icon toolbar list.
 * Same empty-state gap as desktop preserved (no message for a
 * zero-result filtered list).
 */
export function MobileReportList({
  reports,
  filteredReports,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
    onStatusFilterChange,
  onClearFilters,
  onPreview,
  onExport,
}: MobileReportListProps) {
  const [exportTarget, setExportTarget] = useState<Report | null>(null)

  return (
    <div className="space-y-4">
      <MobileFilterSheet
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        resultCount={filteredReports.length}
      />
      <ReportSummary filteredCount={filteredReports.length} totalCount={reports.length} onClearFilters={onClearFilters} />

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <MobileReportCard
        key={report.id}
        report={report}
        onPreview={onPreview}
        onExportClick={setExportTarget}
/>
        ))}
      </div>

      <ExportReportDialog
        open={exportTarget !== null}
        onOpenChange={(open) => {
          if (!open) setExportTarget(null)
        }}
        reportName={exportTarget?.name ?? null}
        onExport={async (format) => {
          if (exportTarget) await onExport(exportTarget.id, format)
        }}
      />
    </div>
  )
}
