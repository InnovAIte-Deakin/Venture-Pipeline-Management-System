"use client"

import { Download, FileText, Loader2, Trash2 } from "lucide-react"
import type { UserDocumentsController } from "../../hooks/use-user-documents"
import { formatDocumentDate, formatFileSize, getDisplayFilename } from "../../lib/document-formatters"
import type { UserDocument } from "../../types/documents.types"
import { DocumentsEmptyState, DocumentsLoadingState } from "../shared/document-list-state"
import { DocumentStatusBadge } from "../shared/document-status-badge"

export function DesktopDocumentList({ controller }: { controller: UserDocumentsController }) {
  const confirmDelete = (document: UserDocument) => {
    if (window.confirm(`Delete ${getDisplayFilename(document.filename)}? This cannot be undone.`)) {
      void controller.removeDocument(document)
    }
  }

  return (
    <section aria-labelledby="desktop-document-list-title">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 id="desktop-document-list-title" className="text-xl font-bold text-slate-950">Your documents</h2>
          <p className="mt-1 text-sm text-slate-500">Track review status and manage uploaded files.</p>
        </div>
        <span className="rounded-full bg-[#138075]/10 px-3 py-1 text-xs font-bold text-[#138075]">
          {controller.documents.length} files
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
              <article key={document.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#138075]/30 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2A9D8F]/10 text-[#138075]">
                    <FileText className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-950" title={getDisplayFilename(document.filename)}>
                      {getDisplayFilename(document.filename)}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span>{document.documentType}</span><span aria-hidden="true">•</span>
                      <span>{formatFileSize(document.filesize)}</span><span aria-hidden="true">•</span>
                      <span>v{document.version ?? 1}</span><span aria-hidden="true">•</span>
                      <span>{formatDocumentDate(document.createdAt)}</span>
                    </div>
                    <div className="mt-2"><DocumentStatusBadge status={document.status} /></div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void controller.downloadDocument(document)}
                      disabled={isDownloading || isDeleting}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#138075]/25 px-3 py-2 text-sm font-semibold text-[#138075] transition hover:bg-[#138075]/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(document)}
                      disabled={isDeleting || isDownloading}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
