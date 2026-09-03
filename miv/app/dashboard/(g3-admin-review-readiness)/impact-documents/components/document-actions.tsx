import { AlertCircle, CheckCircle, Download, Loader2, Trash2, XCircle } from "lucide-react"
import type { ImpactDocument, ImpactDocumentRowAction, ImpactDocumentStatus } from "@/lib/impact-documents"

const ACTION_BUTTON_BASE =
  "inline-flex min-h-8 items-center justify-center rounded px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

interface DocumentActionsProps {
  document: ImpactDocument
  pendingAction?: ImpactDocumentRowAction
  onStatusUpdate: (documentId: string, status: ImpactDocumentStatus) => void
  onDelete: (documentId: string) => void
  onDownload: (documentId: string, filename: string) => void
}

export function DocumentActions({
  document,
  pendingAction,
  onStatusUpdate,
  onDelete,
  onDownload,
}: DocumentActionsProps) {
  const disabled = Boolean(pendingAction)

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onDownload(document.id, document.filename)}
        disabled={disabled}
        aria-label={`Download ${document.filename}`}
        title={`Download ${document.filename}`}
        className={`${ACTION_BUTTON_BASE} bg-blue-50 text-blue-600 hover:bg-blue-100`}
      >
        {pendingAction === "download" ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="mr-1 h-3 w-3" aria-hidden="true" />
        )}
        Download
      </button>

      {document.status === "pending_review" && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onStatusUpdate(document.id, "approved")}
            disabled={disabled}
            aria-label={`Approve ${document.filename}`}
            title={`Approve ${document.filename}`}
            className={`${ACTION_BUTTON_BASE} bg-green-50 text-green-600 hover:bg-green-100`}
          >
            <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onStatusUpdate(document.id, "rejected")}
            disabled={disabled}
            aria-label={`Reject ${document.filename}`}
            title={`Reject ${document.filename}`}
            className={`${ACTION_BUTTON_BASE} bg-red-50 text-red-600 hover:bg-red-100`}
          >
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onStatusUpdate(document.id, "needs_revision")}
            disabled={disabled}
            aria-label={`Request revision for ${document.filename}`}
            title={`Request revision for ${document.filename}`}
            className={`${ACTION_BUTTON_BASE} bg-orange-50 text-orange-600 hover:bg-orange-100`}
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => onDelete(document.id)}
        disabled={disabled}
        aria-label={`Delete ${document.filename}`}
        title={`Delete ${document.filename}`}
        className={`${ACTION_BUTTON_BASE} bg-red-50 text-red-600 hover:bg-red-100`}
      >
        {pendingAction === "delete" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
