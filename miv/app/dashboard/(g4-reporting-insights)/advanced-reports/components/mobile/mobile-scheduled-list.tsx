import { Calendar, Pause, Settings, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "../../lib/format"
import type { Report } from "../../types/advanced-reports.types"

interface MobileScheduledListProps {
  reports: Report[]
}

/** Scheduled tab, mobile: same data/actions as desktop, stacked vertically. Settings/Pause/Delete stay decorative. */
export function MobileScheduledList({ reports }: MobileScheduledListProps) {
  const scheduledReports = reports.filter((r) => r.isScheduled)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-500" aria-hidden="true" />
          <span>Scheduled Reports</span>
          <Badge variant="outline" className="ml-auto">
            {scheduledReports.length} active
          </Badge>
        </CardTitle>
        <CardDescription>Manage automatically generated reports and their schedules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduledReports.map((report) => (
          <Card key={report.id} className="border-l-4 border-l-blue-500">
            <CardContent className="space-y-2 pt-4">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{report.name}</h4>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {report.scheduleFrequency}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{report.description}</p>
              <div className="flex flex-col gap-1 text-xs text-gray-500">
                <span>Next run: {report.nextRun ? formatDate(report.nextRun) : "Not scheduled"}</span>
                {report.recipients && report.recipients.length > 0 && (
                  <span>
                    {report.recipients.length} recipient{report.recipients.length !== 1 ? "s" : ""}
                  </span>
                )}
                <span>Last: {formatDate(report.lastGenerated)}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" aria-label={`Settings for ${report.name}`}>
                  <Settings className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="sm" aria-label={`Pause ${report.name}`}>
                  <Pause className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="sm" aria-label={`Delete ${report.name}`}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {scheduledReports.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
            <p>No scheduled reports found</p>
            <p className="text-sm">Create a new report with scheduling enabled</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
