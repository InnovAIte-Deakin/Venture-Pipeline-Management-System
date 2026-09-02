import { Calendar, Download, Edit, Eye, FileText, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "../../lib/format"
import type { Report } from "../../types/advanced-reports.types"

interface MobileReportCardProps {
  report: Report
  onPreview: (report: Report) => void
  onExportClick: (report: Report) => void
}

/**
 * Vertical report card for mobile, no 6-icon row. Export collapses to one
 * button that opens `ExportReportDialog` (format picker); View/Share/Edit
 * stay as a compact icon row and remain decorative, matching desktop.
 */
export function MobileReportCard({ report, onPreview, onExportClick }: MobileReportCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
          <CardTitle className="text-base">{report.name}</CardTitle>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={report.status === "published" ? "default" : "secondary"}>{report.status}</Badge>
          {report.isScheduled && (
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              <Calendar className="mr-1 h-3 w-3" aria-hidden="true" />
              {report.scheduleFrequency}
            </Badge>
          )}
        </div>
        <CardDescription>
          {report.description}
          <span className="mt-1 block text-xs">Last generated {formatDate(report.lastGenerated)}</span>
          {report.isScheduled && report.nextRun && <span className="mt-1 block text-xs text-blue-600">Next run: {formatDate(report.nextRun)}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {report.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {report.metrics.map((metric) => (
              <Badge key={metric} variant="outline">
                {metric}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onExportClick(report)}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Export
          </Button>
          <Button
          variant="outline"
          size="sm"
          aria-label="View Report"
          onClick={() => onPreview(report)}
>
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="sm" aria-label="Share Report">
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="sm" aria-label="Edit Report">
            <Edit className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
