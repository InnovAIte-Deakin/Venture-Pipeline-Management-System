import { FileText, RefreshCw } from "lucide-react"
import type { UserDocumentsController } from "../../hooks/use-user-documents"

export function MobileDocumentsHeader({ controller }: { controller: UserDocumentsController }) {
  return (
    <header className="relative mb-4 overflow-hidden rounded-2xl border border-[#138075]/20 bg-white p-5 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[#138075]" />
      <div className="flex items-start justify-between gap-4 pt-1">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#138075]">
            Venture workspace
          </p>
          <h1 id="documents-mobile-title" className="mt-2 text-2xl font-bold text-slate-950">
            Documents
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload files and follow their review status.
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2A9D8F]/10 text-[#138075]">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <button
        type="button"
        onClick={() => void controller.refresh()}
        disabled={controller.refreshing || controller.loading}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#138075] disabled:opacity-50"
      >
        <RefreshCw
          className={`h-4 w-4 ${controller.refreshing ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        Refresh documents
      </button>
    </header>
  )
}
