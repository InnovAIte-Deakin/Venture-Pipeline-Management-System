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
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 font-medium">{notice.message}</p>
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
