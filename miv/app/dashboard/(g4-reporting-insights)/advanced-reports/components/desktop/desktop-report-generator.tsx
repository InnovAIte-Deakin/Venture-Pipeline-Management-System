"use client"

import { useState } from "react"
import { Calendar, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { REPORT_ICON_MAP } from "../report-icons"
import { ScheduleReportDialog } from "../dialogs/schedule-report-dialog"
import type { UseReportBuilderResult } from "../../types/advanced-reports.types"
import { AVAILABLE_METRICS, CHART_TYPES, REPORT_TYPES } from "../../constants/advanced-reports.constants"

interface DesktopReportGeneratorProps {
  builder: UseReportBuilderResult
}

/**
 * "Quick Report Generator" card, desktop layout: all basic fields visible
 * side-by-side (`md:grid-cols-2 lg:grid-cols-4`), matching the original.
 * Scheduling is isolated into `ScheduleReportDialog` (see README "Scheduling
 * and Export") instead of an inline collapsible section.
 */
export function DesktopReportGenerator({ builder }: DesktopReportGeneratorProps) {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const { configuration } = builder

  return (
    <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-900">
          <FileText className="h-5 w-5" aria-hidden="true" />
          <span>Quick Report Generator</span>
        </CardTitle>
        <CardDescription className="text-blue-700">
          Create comprehensive reports with custom parameters, metrics, and visualizations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="report-name" className="mb-2 block text-sm font-medium text-gray-700">
              Report Name
            </Label>
            <Input id="report-name" placeholder="Enter report name" value={configuration.reportName} onChange={(e) => builder.setReportName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="report-type" className="mb-2 block text-sm font-medium text-gray-700">
              Report Type
            </Label>
            <Select value={configuration.selectedReportType} onValueChange={(value) => builder.setSelectedReportType(value as typeof configuration.selectedReportType)}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Choose report type" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => {
                  const Icon = REPORT_ICON_MAP[type.iconName]
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="chart-type" className="mb-2 block text-sm font-medium text-gray-700">
              Chart Type
            </Label>
            <Select value={configuration.selectedChartType} onValueChange={(value) => builder.setSelectedChartType(value as typeof configuration.selectedChartType)}>
              <SelectTrigger id="chart-type">
                <SelectValue placeholder="Choose chart type" />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => {
                  const Icon = REPORT_ICON_MAP[type.iconName]
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-gray-700">Date Range</span>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor="date-from" className="sr-only">
                  From date
                </Label>
                <Input
                  id="date-from"
                  placeholder="From"
                  type="date"
                  value={configuration.dateRange?.from ? configuration.dateRange.from.toISOString().split("T")[0] : ""}
                  onChange={(e) => builder.setDateRangeFrom(new Date(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="date-to" className="sr-only">
                  To date
                </Label>
                <Input
                  id="date-to"
                  placeholder="To"
                  type="date"
                  value={configuration.dateRange?.to ? configuration.dateRange.to.toISOString().split("T")[0] : ""}
                  onChange={(e) => builder.setDateRangeTo(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="report-description" className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </Label>
          <Input
            id="report-description"
            placeholder="Enter report description"
            value={configuration.reportDescription}
            onChange={(e) => builder.setReportDescription(e.target.value)}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Select Metrics</span>
          <div className="grid max-h-32 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-3 md:grid-cols-3 lg:grid-cols-4">
            {AVAILABLE_METRICS.map((metric) => (
              <div key={metric} className="flex items-center space-x-2">
                <Checkbox
                  id={metric}
                  checked={configuration.selectedMetrics.includes(metric)}
                  onCheckedChange={(checked) => builder.toggleMetric(metric, !!checked)}
                />
                <Label htmlFor={metric} className="text-xs">
                  {metric}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" onClick={() => setIsScheduleDialogOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
            {configuration.isScheduled ? `Scheduled: ${configuration.scheduleFrequency}` : "Schedule Report…"}
          </Button>
          <Button onClick={builder.generateReport} disabled={!builder.isValid} className="bg-blue-600 px-8 text-white hover:bg-blue-700" size="lg">
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            Generate Report
          </Button>
        </div>
      </CardContent>

      <ScheduleReportDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        isScheduled={configuration.isScheduled}
        onIsScheduledChange={builder.setIsScheduled}
        scheduleFrequency={configuration.scheduleFrequency}
        onScheduleFrequencyChange={builder.setScheduleFrequency}
        reportRecipients={configuration.reportRecipients}
        onReportRecipientsChange={builder.setReportRecipients}
      />
    </Card>
  )
}
