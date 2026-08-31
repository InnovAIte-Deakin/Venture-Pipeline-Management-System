"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Calendar, Download, Eye, FileText, Search } from "lucide-react"

import type { Report, ReportExportFormat } from "./report-types"

interface ReportsLibraryProps {
  reports: Report[]
  searchQuery: string
  statusFilter: string
  error?: string | null
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPreview: (report: Report) => void
  onExport: (reportId: string, format: ReportExportFormat) => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ReportsLibrary({
  reports,
  searchQuery,
  statusFilter,
  error,
  onSearchChange,
  onStatusChange,
  onPreview,
  onExport,
}: ReportsLibraryProps) {
  const filteredReports = reports.filter((report) => {
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      report.name.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.type.toLowerCase().includes(query)
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-10 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h3 className="font-semibold text-red-900">Unable to load reports</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                aria-label="Search reports"
                placeholder="Search reports by name, description, or type..."
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter reports by status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
            <span>Showing {filteredReports.length} of {reports.length} reports</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange("")
                onStatusChange("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <h3 className="font-semibold">No reports found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the search text or status filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 shrink-0" />
                      <span className="break-words">{report.name}</span>
                      <Badge variant={report.status === "published" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      {report.isScheduled && (
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                          <Calendar className="mr-1 h-3 w-3" />
                          {report.scheduleFrequency}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2 break-words">
                      {report.description} • Last generated {formatDate(report.lastGenerated)}
                    </CardDescription>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                    <Button variant="default" size="sm" onClick={() => onPreview(report)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onExport(report.id, "pdf")}>
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onExport(report.id, "excel")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onExport(report.id, "csv")}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-semibold">Metrics included</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.metrics.length > 0 ? report.metrics.map((metric) => (
                        <Badge key={metric} variant="outline">{metric}</Badge>
                      )) : <span className="text-sm text-muted-foreground">No metrics selected</span>}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="mb-2 font-semibold">Report details</h4>
                    <p className="break-words text-sm text-muted-foreground">
                      Type: {report.type.replace(/-/g, " ")}
                    </p>
                    {report.nextRun && (
                      <p className="text-sm text-muted-foreground">Next run: {formatDate(report.nextRun)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
