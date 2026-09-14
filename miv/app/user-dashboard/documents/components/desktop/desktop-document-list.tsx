"use client"

import { Download, File, Loader2, Trash2 } from "lucide-react"
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
    <section
      className="rounded-lg border border-border bg-card p-6 shadow-sm"
      aria-labelledby="desktop-document-list-title"
    >
      <h2 id="desktop-document-list-title" className="mb-4 text-xl font-semibold text-foreground">
        Your Documents
      </h2>

      {controller.loading ? (
        <DocumentsLoadingState />
      ) : controller.documents.length === 0 ? (
        <DocumentsEmptyState />
      ) : (
        <div className="space-y-3">
          {controller.documents.map((document) => {
            const isDeleting = controller.deletingId === document.id
            const isDownloading = controller.downloadingId === document.id

            return (
              <article
                key={document.id}
                className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex min-w-0 flex-1 items-start space-x-3">
                    <File className="h-10 w-10 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-foreground" title={getDisplayFilename(document.filename)}>
                        {getDisplayFilename(document.filename)}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {document.documentType}
                        </span>
                        <span aria-hidden="true">•</span>
                        <span>{formatFileSize(document.filesize)}</span>
                        <span aria-hidden="true">•</span>
                        <span>v{document.version ?? 1}</span>
                        <span aria-hidden="true">•</span>
                        <span>{formatDocumentDate(document.createdAt)}</span>
                      </div>
                      <div className="mt-2">
                        <DocumentStatusBadge status={document.status} />
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex shrink-0 items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => void controller.downloadDocument(document)}
                      disabled={isDownloading || isDeleting}
                      className="flex items-center gap-1 rounded bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(document)}
                      disabled={isDeleting || isDownloading}
                      className="flex items-center gap-1 rounded bg-secondary/10 px-3 py-1.5 text-sm text-secondary transition-colors hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-50"
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
