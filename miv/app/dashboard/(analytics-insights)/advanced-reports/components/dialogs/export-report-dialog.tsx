"use client"

import { useState } from "react"
import { BarChart3, Download, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ExportFormat } from "../../types/advanced-reports.types"

interface ExportReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportName: string | null
  onExport: (format: ExportFormat) => Promise<void>
}

const EXPORT_OPTIONS: { format: ExportFormat; label: string; icon: typeof Download }[] = [
  { format: "pdf", label: "PDF", icon: Download },
  { format: "excel", label: "Excel", icon: FileText },
  { format: "csv", label: "CSV", icon: BarChart3 },
]

/**
 * Isolates export UI, primarily for mobile (see README "Desktop keeps: the
 * 6-icon inline report-row toolbar" — desktop still exports directly via
 * those buttons; this dialog gives mobile a single "Export" affordance
 * instead of repeating the 6-icon row). Content/format behaviour is
 * unchanged and calls the same `lib/report-export.ts` logic: `pdf`/`excel`
 * download JSON mislabeled with those extensions/MIME types, and `csv` is
 * genuinely CSV-shaped but metadata-only. See README "Export Workflow".
 */
export function ExportReportDialog({ open, onOpenChange, reportName, onExport }: ExportReportDialogProps) {
  const [pendingFormat, setPendingFormat] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setPendingFormat(format)
    setError(null)
    try {
      await onExport(format)
    } catch {
      setError("Export failed. Please try again.")
    } finally {
      setPendingFormat(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>{reportName ? `Choose a format to export "${reportName}".` : "Choose a format to export this report."}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {EXPORT_OPTIONS.map(({ format, label, icon: Icon }) => (
            <Button
              key={format}
              variant="outline"
              className="flex h-20 flex-col items-center justify-center gap-2"
              disabled={pendingFormat !== null}
              onClick={() => handleExport(format)}
              aria-label={`Export as ${label}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs">{pendingFormat === format ? "Exporting…" : label}</span>
            </Button>
          ))}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
