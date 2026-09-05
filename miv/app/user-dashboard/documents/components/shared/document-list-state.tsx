import { FileText, Loader2 } from "lucide-react"

export function DocumentsLoadingState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#138075]" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-slate-600">Loading your documents...</p>
    </div>
  )
}

export function DocumentsEmptyState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#2A9D8F]/40 bg-white p-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2A9D8F]/10 text-[#138075]">
        <FileText className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-semibold text-slate-900">No documents yet</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Select a document type and upload your first venture document.
      </p>
    </div>
  )
}
