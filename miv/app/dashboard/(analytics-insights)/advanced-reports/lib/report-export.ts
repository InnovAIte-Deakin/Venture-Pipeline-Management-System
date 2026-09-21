import type { ExportFormat, Report } from "../types/advanced-reports.types"

export interface ExportPayload {
  filename: string
  mimeType: string
  content: string
}

/**
 * Pure export-payload builder, lifted from the original `exportReport`.
 *
 * `pdf`/`excel` are simulated: the downloaded bytes are plain JSON text
 * wearing a `.pdf`/`.xlsx` filename and matching MIME type (original
 * comments: "In real app, generate PDF/Excel"). `csv` is genuinely
 * CSV-shaped but only a single header+row of report metadata — no metric
 * values or chart series. Preserved exactly; do not present PDF/Excel as
 * real exports without adding a real generator, which is out of scope here.
 */
export function prepareExportPayload(report: Report, format: ExportFormat): ExportPayload {
  const exportData = {
    reportName: report.name,
    reportType: report.type,
    description: report.description,
    lastGenerated: report.lastGenerated,
    status: report.status,
    metrics: report.metrics,
    filters: report.filters,
    exportedAt: new Date().toISOString(),
    format,
  }

  const safeName = report.name.replace(/[^a-zA-Z0-9]/g, "_")

  switch (format) {
    case "pdf":
      return {
        filename: `${safeName}.pdf`,
        mimeType: "application/pdf",
        content: JSON.stringify(exportData, null, 2), // In real app, generate PDF
      }
    case "excel":
      return {
        filename: `${safeName}.xlsx`,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        content: JSON.stringify(exportData, null, 2), // In real app, generate Excel
      }
    case "csv":
      return {
        filename: `${safeName}.csv`,
        mimeType: "text/csv",
        content: `Report Name,Type,Description,Last Generated,Status\n"${report.name}","${report.type}","${report.description}","${report.lastGenerated}","${report.status}"`,
      }
  }
}

/** Browser-only download side effect — the one place in this feature allowed to touch `document`/`URL`/Blob. */
export function downloadExportPayload(payload: ExportPayload): void {
  const blob = new Blob([payload.content], { type: payload.mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = payload.filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
