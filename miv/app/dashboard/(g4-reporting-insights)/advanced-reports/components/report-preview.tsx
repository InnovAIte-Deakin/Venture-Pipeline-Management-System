"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Download, FileText, Share2 } from "lucide-react"

import type { Report, ReportExportFormat } from "./report-types"

interface ReportPreviewProps {
  report: Report
  onBack: () => void
  onExport: (reportId: string, format: ReportExportFormat) => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not specified"
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "None"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export function ReportPreview({ report, onBack, onExport }: ReportPreviewProps) {
  const shareReport = async () => {
    const shareData = { title: report.name, text: report.description }
    if (navigator.share) {
      await navigator.share(shareData)
      return
    }
    await navigator.clipboard.writeText(`${report.name}\n${report.description}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" className="w-fit" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to reports
        </Button>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <Button variant="outline" onClick={shareReport}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => onExport(report.id, "pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="break-words text-2xl sm:text-3xl">{report.name}</CardTitle>
              <CardDescription className="mt-2 break-words text-sm sm:text-base">
                {report.description}
              </CardDescription>
            </div>
            <Badge className="w-fit capitalize" variant={report.status === "published" ? "default" : "secondary"}>
              {report.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Report type</p>
              <p className="mt-2 break-words font-semibold capitalize">{report.type.replace(/-/g, " ")}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last generated</p>
              <p className="mt-2 font-semibold">{formatDate(report.lastGenerated)}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Metrics</p>
              <p className="mt-2 font-semibold">{report.metrics.length}</p>
            </div>
          </div>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Report summary
            </h2>
            <div className="rounded-lg border bg-muted/30 p-4 sm:p-6">
              <p className="leading-7 text-muted-foreground">
                This preview summarises the selected report configuration and impact metrics. Final values depend on the connected venture, GEDSI, user, analytics, and workflow data sources.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-blue-600" />
              Metrics included
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.metrics.length > 0 ? report.metrics.map((metric) => (
                <Badge key={metric} variant="outline" className="px-3 py-1">{metric}</Badge>
              )) : <p className="text-sm text-muted-foreground">No metrics were selected for this report.</p>}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Filters applied</h2>
            {Object.keys(report.filters).length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(report.filters).map(([key, value]) => (
                  <div key={key} className="min-w-0 rounded-lg border p-3">
                    <p className="break-words text-xs font-medium uppercase tracking-wide text-muted-foreground">{key}</p>
                    <p className="mt-1 break-words text-sm">{displayValue(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No filters were applied.</p>
            )}
          </section>

          <div className="grid grid-cols-1 gap-2 border-t pt-6 sm:grid-cols-3">
            <Button variant="outline" onClick={() => onExport(report.id, "pdf")}>
              <Download className="mr-2 h-4 w-4" />PDF
            </Button>
            <Button variant="outline" onClick={() => onExport(report.id, "excel")}>
              <FileText className="mr-2 h-4 w-4" />Excel
            </Button>
            <Button variant="outline" onClick={() => onExport(report.id, "csv")}>
              <BarChart3 className="mr-2 h-4 w-4" />CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
