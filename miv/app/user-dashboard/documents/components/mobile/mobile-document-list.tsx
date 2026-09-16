"use client"

import { Download, FileText, Loader2, Trash2 } from "lucide-react"
import type { UserDocumentsController } from "../../hooks/use-user-documents"
import { formatDocumentDate, formatFileSize, getDisplayFilename } from "../../lib/document-formatters"
import type { UserDocument } from "../../types/documents.types"
import { DocumentsEmptyState, DocumentsLoadingState } from "../shared/document-list-state"
import { DocumentStatusBadge } from "../shared/document-status-badge"

export function MobileDocumentList({ controller }: { controller: UserDocumentsController }) {
  const confirmDelete = (document: UserDocument) => {
    if (window.confirm(`Delete ${getDisplayFilename(document.filename)}? This cannot be undone.`)) {
      void controller.removeDocument(document)
    }
  }

  return (
    <section aria-labelledby="mobile-document-list-title">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 id="mobile-document-list-title" className="text-lg font-bold text-slate-950">Your documents</h2>
          <p className="text-xs text-slate-500">Review status and file actions</p>
        </div>
        <span className="rounded-full bg-[#138075]/10 px-2.5 py-1 text-xs font-bold text-[#138075]">
          {controller.documents.length}
        </span>
      </div>

      {controller.loading ? <DocumentsLoadingState /> : controller.documents.length === 0 ? (
        <DocumentsEmptyState />
      ) : (
        <div className="space-y-3">
          {controller.documents.map((document) => {
            const isDeleting = controller.deletingId === document.id
            const isDownloading = controller.downloadingId === document.id

            return (
              <article key={document.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-1 bg-[#138075]" />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A9D8F]/10 text-[#138075]">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold leading-5 text-slate-950">{getDisplayFilename(document.filename)}</h3>
                      <p className="mt-1 text-xs text-slate-500">{document.documentType}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    <div><span className="block text-slate-400">Uploaded</span>{formatDocumentDate(document.createdAt)}</div>
                    <div><span className="block text-slate-400">File details</span>{formatFileSize(document.filesize)} · v{document.version ?? 1}</div>
                  </div>

                  <div className="mt-3"><DocumentStatusBadge status={document.status} /></div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => void controller.downloadDocument(document)}
                      disabled={isDownloading || isDeleting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#138075]/25 px-3 py-2.5 text-sm font-semibold text-[#138075] disabled:opacity-50"
                    >
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(document)}
                      disabled={isDeleting || isDownloading}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
