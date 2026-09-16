import type { UserDocumentsController } from "../../hooks/use-user-documents"
import { DocumentsNotice } from "../shared/documents-notice"
import { MobileDocumentList } from "./mobile-document-list"
import { MobileDocumentsHeader } from "./mobile-documents-header"
import { MobileUploadPanel } from "./mobile-upload-panel"

export function UserDocumentsMobile({ controller }: { controller: UserDocumentsController }) {
  return (
    <main
      className="pb-12 pt-1"
      aria-labelledby="documents-mobile-title"
      style={{ fontFamily: '"Hanken Grotesk", Geist, sans-serif' }}
    >
      <MobileDocumentsHeader controller={controller} />

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
