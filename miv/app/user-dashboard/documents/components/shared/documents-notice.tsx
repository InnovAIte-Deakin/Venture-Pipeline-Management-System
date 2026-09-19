import { AlertCircle, CheckCircle2, X } from "lucide-react"
import type { DocumentNotice } from "../../types/documents.types"

interface DocumentsNoticeProps {
  notice: DocumentNotice
  onDismiss: () => void
}

export function DocumentsNotice({ notice, onDismiss }: DocumentsNoticeProps) {
  const isError = notice.type === "error"
  const Icon = isError ? AlertCircle : CheckCircle2

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border p-4 ${
        isError
          ? "border-secondary/20 bg-secondary/10 text-secondary"
          : "border-success/20 bg-success/10 text-success"
      }`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1">{notice.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        aria-label="Dismiss message"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
