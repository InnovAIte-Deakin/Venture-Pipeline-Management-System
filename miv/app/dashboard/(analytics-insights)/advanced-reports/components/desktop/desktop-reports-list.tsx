import { BarChart3, Calendar, Download, Edit, Eye, FileText, Filter, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReportFilters } from "../report-filters"
import { ReportSummary } from "../report-summary"
import { formatDate } from "../../lib/format"
import type { ExportFormat, Report, ReportStatusFilter } from "../../types/advanced-reports.types"

interface DesktopReportsListProps {
  reports: Report[]
  filteredReports: Report[]
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: ReportStatusFilter
  onStatusFilterChange: (value: ReportStatusFilter) => void
  onClearFilters: () => void
  onExport: (reportId: string, format: ExportFormat) => void
}

/**
 * Reports tab, desktop: search/filter bar (with the decorative "More
 * Filters" button, unchanged) + the 6-icon-per-row card list. Preserved
 * empty state: an empty `filteredReports` list renders no message today
 * (see README "Loading, Empty, Error, and Success States").
 */
export function DesktopReportsList({
  reports,
  filteredReports,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  onExport,
}: DesktopReportsListProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex-1">
              <ReportFilters searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
              More Filters
            </Button>
          </div>
          <div className="mt-4">
            <ReportSummary filteredCount={filteredReports.length} totalCount={reports.length} onClearFilters={onClearFilters} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                    <span>{report.name}</span>
                    <Badge variant={report.status === "published" ? "default" : "secondary"}>{report.status}</Badge>
                    {report.isScheduled && (
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                        <Calendar className="mr-1 h-3 w-3" aria-hidden="true" />
                        {report.scheduleFrequency}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {report.description} • Last generated {formatDate(report.lastGenerated)}
                    {report.isScheduled && report.nextRun && (
                      <span className="mt-1 block text-xs text-blue-600">
                        Next run: {formatDate(report.nextRun)}
                        {report.recipients && report.recipients.length > 0 && (
                          <span> • {report.recipients.length} recipient{report.recipients.length !== 1 ? "s" : ""}</span>
                        )}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" title="View Report" aria-label="View Report">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="sm" title="Export PDF" aria-label="Export as PDF" onClick={() => onExport(report.id, "pdf")}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="sm" title="Export Excel" aria-label="Export as Excel" onClick={() => onExport(report.id, "excel")}>
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="sm" title="Export CSV" aria-label="Export as CSV" onClick={() => onExport(report.id, "csv")}>
                    <BarChart3 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="sm" title="Share Report" aria-label="Share Report">
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="sm" title="Edit Report" aria-label="Edit Report">
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Metrics Included</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.metrics.map((metric) => (
                      <Badge key={metric} variant="outline">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Filters Applied</h4>
                  <div className="text-sm text-muted-foreground">
                    {Object.entries(report.filters).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
