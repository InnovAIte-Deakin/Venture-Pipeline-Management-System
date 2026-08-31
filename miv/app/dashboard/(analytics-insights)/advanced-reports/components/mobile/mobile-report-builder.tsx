"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { REPORT_ICON_MAP } from "../report-icons"
import { ScheduleReportDialog } from "../dialogs/schedule-report-dialog"
import type { UseReportBuilderResult } from "../../types/advanced-reports.types"
import { AVAILABLE_METRICS, CHART_TYPES, REPORT_TYPES } from "../../constants/advanced-reports.constants"

interface MobileReportBuilderProps {
  builder: UseReportBuilderResult
  onGenerated: () => void
}

const STEPS = ["Report type", "Date range", "Metrics & chart", "Review", "Generate"] as const

/**
 * Step-based Quick Report Generator for mobile — one section visible at a
 * time instead of the desktop's all-at-once 4-column form, per README
 * "Mobile Layout". Shares the exact same `useReportBuilder` state/actions as
 * desktop; only the interaction model differs.
 */
export function MobileReportBuilder({ builder, onGenerated }: MobileReportBuilderProps) {
  const [step, setStep] = useState(0)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const { configuration } = builder

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleGenerate = () => {
    builder.generateReport()
    setStep(0)
    onGenerated()
  }

  const selectedReportTypeOption = REPORT_TYPES.find((t) => t.value === configuration.selectedReportType)

  return (
    <Card className="border-2 border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-900">
          <FileText className="h-5 w-5" aria-hidden="true" />
          <span>Quick Report Generator</span>
        </CardTitle>
        <CardDescription className="text-blue-700">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile-report-name" className="mb-2 block text-sm font-medium text-gray-700">
                Report Name
              </Label>
              <Input id="mobile-report-name" placeholder="Enter report name" value={configuration.reportName} onChange={(e) => builder.setReportName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="mobile-report-type" className="mb-2 block text-sm font-medium text-gray-700">
                Report Type
              </Label>
              <Select value={configuration.selectedReportType} onValueChange={(value) => builder.setSelectedReportType(value as typeof configuration.selectedReportType)}>
                <SelectTrigger id="mobile-report-type">
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
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile-date-from" className="mb-2 block text-sm font-medium text-gray-700">
                From
              </Label>
              <Input
                id="mobile-date-from"
                type="date"
                value={configuration.dateRange?.from ? configuration.dateRange.from.toISOString().split("T")[0] : ""}
                onChange={(e) => builder.setDateRangeFrom(new Date(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="mobile-date-to" className="mb-2 block text-sm font-medium text-gray-700">
                To
              </Label>
              <Input
                id="mobile-date-to"
                type="date"
                value={configuration.dateRange?.to ? configuration.dateRange.to.toISOString().split("T")[0] : ""}
                onChange={(e) => builder.setDateRangeTo(new Date(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="mobile-report-description" className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </Label>
              <Input
                id="mobile-report-description"
                placeholder="Enter report description"
                value={configuration.reportDescription}
                onChange={(e) => builder.setReportDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile-chart-type" className="mb-2 block text-sm font-medium text-gray-700">
                Chart Type
              </Label>
              <Select value={configuration.selectedChartType} onValueChange={(value) => builder.setSelectedChartType(value as typeof configuration.selectedChartType)}>
                <SelectTrigger id="mobile-chart-type">
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
              <span className="mb-2 block text-sm font-medium text-gray-700">Select Metrics</span>
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-3">
                {AVAILABLE_METRICS.map((metric) => (
                  <div key={metric} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-${metric}`}
                      checked={configuration.selectedMetrics.includes(metric)}
                      onCheckedChange={(checked) => builder.toggleMetric(metric, !!checked)}
                    />
                    <Label htmlFor={`mobile-${metric}`} className="text-xs">
                      {metric}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="rounded-md border bg-white p-3 text-sm">
              <div className="mb-1 font-medium">{configuration.reportName || `${selectedReportTypeOption?.label ?? "Untitled"} Report`}</div>
              <div className="text-muted-foreground">{configuration.reportDescription || "No description"}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {configuration.selectedMetrics.length === 0 && <span className="text-xs text-muted-foreground">No metrics selected</span>}
              {configuration.selectedMetrics.map((metric) => (
                <Badge key={metric} variant="outline">
                  {metric}
                </Badge>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setIsScheduleDialogOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              {configuration.isScheduled ? `Scheduled: ${configuration.scheduleFrequency}` : "Schedule Report…"}
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Ready to generate your report with the settings above.</p>
            <Button onClick={handleGenerate} disabled={!builder.isValid} className="w-full bg-blue-600 text-white hover:bg-blue-700" size="lg">
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              Generate Report
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="ghost" onClick={goBack} disabled={step === 0} aria-label="Previous step">
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button variant="ghost" onClick={goNext} disabled={step === 0 && !builder.isValid} aria-label="Next step">
              Next
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          )}
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
