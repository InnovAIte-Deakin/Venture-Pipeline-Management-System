"use client"

import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type {
  ChartType,
  Report,
  ReportDateRange,
  ReportTypeValue,
  ScheduleFrequency,
  UseReportBuilderResult,
} from "../types/advanced-reports.types"
import { DEFAULT_REPORT_CONFIGURATION, REPORT_TYPES } from "../constants/advanced-reports.constants"
import { isReportConfigurationValid } from "../lib/report-validation"
import { getNextRunTime } from "../lib/report-scheduling"
import { downloadExportPayload, prepareExportPayload } from "../lib/report-export"

/**
 * Owns every Quick Report Generator field, `generateReport`, and
 * `exportReport`. Both desktop and mobile generator components consume this
 * one hook so behaviour — including "metadata only, no real content" and
 * "lost on page refresh" — stays identical across platforms.
 */
export function useReportBuilder(reports: Report[], setReports: Dispatch<SetStateAction<Report[]>>): UseReportBuilderResult {
  const [reportName, setReportName] = useState(DEFAULT_REPORT_CONFIGURATION.reportName)
  const [reportDescription, setReportDescription] = useState(DEFAULT_REPORT_CONFIGURATION.reportDescription)
  const [selectedReportType, setSelectedReportType] = useState<ReportTypeValue | "">(DEFAULT_REPORT_CONFIGURATION.selectedReportType)
  const [selectedChartType, setSelectedChartType] = useState<ChartType | "">(DEFAULT_REPORT_CONFIGURATION.selectedChartType)
  const [dateRange, setDateRange] = useState<ReportDateRange | null>(DEFAULT_REPORT_CONFIGURATION.dateRange)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(DEFAULT_REPORT_CONFIGURATION.selectedMetrics)
  const [selectedFilters] = useState<Record<string, unknown>>(DEFAULT_REPORT_CONFIGURATION.selectedFilters)
  const [isScheduled, setIsScheduled] = useState(DEFAULT_REPORT_CONFIGURATION.isScheduled)
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>(DEFAULT_REPORT_CONFIGURATION.scheduleFrequency)
  const [reportRecipients, setReportRecipients] = useState<string[]>(DEFAULT_REPORT_CONFIGURATION.reportRecipients)

  const toggleMetric = (metric: string, checked: boolean) => {
    setSelectedMetrics((prev) => (checked ? [...prev, metric] : prev.filter((m) => m !== metric)))
  }

  const generateReport = () => {
    if (!selectedReportType) return

    const reportType = REPORT_TYPES.find((t) => t.value === selectedReportType)
    const reportNameToUse = reportName.trim() || `${reportType?.label} Report`
    const reportDescToUse = reportDescription.trim() || `Generated ${selectedReportType} report with custom parameters`

    const newReport: Report = {
      id: Date.now().toString(),
      name: reportNameToUse,
      type: selectedReportType,
      description: reportDescToUse,
      lastGenerated: new Date().toISOString(),
      status: "draft",
      metrics: selectedMetrics.length > 0 ? selectedMetrics : reportType?.label ? [reportType.label] : [],
      filters: {
        dateRange,
        metrics: selectedMetrics,
        chartType: selectedChartType,
        customFilters: selectedFilters,
        generatedBy: "user",
        ...selectedFilters,
      },
      isScheduled,
      scheduleFrequency: isScheduled ? scheduleFrequency : undefined,
      nextRun: isScheduled ? getNextRunTime(scheduleFrequency).toISOString() : undefined,
      recipients: reportRecipients.length > 0 ? reportRecipients : undefined,
      autoGenerate: isScheduled,
    }

    setReports((prev) => [newReport, ...prev])

    setSelectedReportType("")
    setSelectedChartType("")
    setDateRange(null)
    setSelectedMetrics([])
    setReportName("")
    setReportDescription("")
    setIsScheduled(false)
    setScheduleFrequency("weekly")
    setReportRecipients([])
  }

  const exportReport = async (reportId: string, format: "pdf" | "excel" | "csv") => {
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    try {
      const payload = prepareExportPayload(report, format)
      downloadExportPayload(payload)
      console.log(`✅ Exported report ${reportId} as ${format}`)
    } catch (error) {
      console.error(`❌ Failed to export report ${reportId}:`, error)
    }
  }

  return {
    configuration: {
      reportName,
      reportDescription,
      selectedReportType,
      selectedChartType,
      dateRange,
      selectedMetrics,
      selectedFilters,
      isScheduled,
      scheduleFrequency,
      reportRecipients,
    },
    setReportName,
    setReportDescription,
    setSelectedReportType,
    setSelectedChartType,
    setDateRangeFrom: (value: Date) => setDateRange((prev) => ({ ...prev, from: value })),
    setDateRangeTo: (value: Date) => setDateRange((prev) => ({ ...prev, to: value })),
    toggleMetric,
    setIsScheduled,
    setScheduleFrequency,
    setReportRecipients,
    isValid: isReportConfigurationValid(selectedReportType),
    generateReport,
    exportReport,
  }
}
