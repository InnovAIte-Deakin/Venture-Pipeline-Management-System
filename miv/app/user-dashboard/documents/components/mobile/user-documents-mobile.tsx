import { FileText, RefreshCw } from "lucide-react"
import type { UserDocumentsController } from "../../hooks/use-user-documents"
import { DocumentsNotice } from "../shared/documents-notice"
import { MobileDocumentList } from "./mobile-document-list"
import { MobileUploadPanel } from "./mobile-upload-panel"

export function UserDocumentsMobile({ controller }: { controller: UserDocumentsController }) {
  return (
    <main className="pb-12 pt-1" aria-labelledby="documents-mobile-title">
      <header className="relative mb-4 overflow-hidden rounded-2xl border border-[#138075]/20 bg-white p-5 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#138075]" />
        <div className="flex items-start justify-between gap-4 pt-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#138075]">Venture workspace</p>
            <h1 id="documents-mobile-title" className="mt-2 text-2xl font-bold text-slate-950">Documents</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Upload files and follow their review status.</p>
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
          <RefreshCw className={`h-4 w-4 ${controller.refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh documents
        </button>
      </header>

      {controller.notice && (
        <div className="mb-4">
          <DocumentsNotice notice={controller.notice} onDismiss={controller.dismissNotice} />
        </div>
      )}

      <div className="mb-4 grid grid-cols-3 gap-2" aria-label="Document summary">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-slate-950">{controller.stats.total}</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">Total</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-amber-800">{controller.stats.pending}</p>
          <p className="mt-0.5 text-[11px] font-medium text-amber-700">Pending</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-emerald-800">{controller.stats.approved}</p>
          <p className="mt-0.5 text-[11px] font-medium text-emerald-700">Approved</p>
        </div>
      </div>

      <MobileUploadPanel controller={controller} />
      <MobileDocumentList controller={controller} />
    </main>
  )
}
