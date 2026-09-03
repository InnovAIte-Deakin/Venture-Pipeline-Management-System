import { Building2, Calendar, File, Loader2, User } from "lucide-react"
import {
  formatImpactDocumentDate,
  formatImpactDocumentFileSize,
  formatImpactDocumentUploader,
  formatImpactDocumentVenture,
  type ImpactDocument,
  type ImpactDocumentRowAction,
  type ImpactDocumentStatus,
} from "@/lib/impact-documents"
import { DocumentActions } from "./document-actions"
import { DocumentStatusBadge } from "./document-status-badge"

interface DocumentListProps {
  documents: ImpactDocument[]
  loading: boolean
  pendingActions: Record<string, ImpactDocumentRowAction | undefined>
  onStatusUpdate: (documentId: string, status: ImpactDocumentStatus) => void
  onDelete: (documentId: string) => void
  onDownload: (documentId: string, filename: string) => void
}

function DocumentIdentity({ document }: { document: ImpactDocument }) {
  return (
    <div className="flex min-w-0 items-start">
      <File className="mr-3 mt-0.5 h-10 w-10 shrink-0 text-blue-500" aria-hidden="true" />
      <div className="min-w-0">
        <div className="break-words text-sm font-medium text-gray-900">{document.filename}</div>
        <div className="mt-1 text-xs text-gray-500">
          {document.documentType} • {formatImpactDocumentFileSize(document.filesize)}
        </div>
      </div>
    </div>
  )
}

function UploaderDetails({ document }: { document: ImpactDocument }) {
  const uploader = formatImpactDocumentUploader(document.uploadedBy)

  return (
    <div className="flex min-w-0 items-start">
      <User className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
      <div className="min-w-0">
        <div className="break-words text-sm font-medium text-gray-900">{uploader.name}</div>
        <div className="mt-1 break-words text-xs text-gray-500">{uploader.email}</div>
      </div>
    </div>
  )
}

function VentureDetails({ document }: { document: ImpactDocument }) {
  const venture = formatImpactDocumentVenture(document.venture)

  if (venture === "No venture") {
    return <span className="text-xs text-gray-500">No venture</span>
  }

  return (
    <div className="flex min-w-0 items-start">
      <Building2 className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
      <span className="break-words text-sm text-gray-900">{venture}</span>
    </div>
  )
}

function UploadDate({ document }: { document: ImpactDocument }) {
  return (
    <div className="flex items-center">
      <Calendar className="mr-2 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
      <span className="text-sm text-gray-900">{formatImpactDocumentDate(document.createdAt)}</span>
    </div>
  )
}

function DocumentTable({
  documents,
  pendingActions,
  onStatusUpdate,
  onDelete,
  onDownload,
}: Omit<DocumentListProps, "loading">) {
  const headings = ["Document", "Uploaded By", "Venture", "Status", "Upload Date", "Actions"]

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-[920px] divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headings.map((heading) => (
              <th
                key={heading}
                className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  heading === "Actions" ? "text-right" : "text-left"
                }`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {documents.map((document) => (
            <tr key={document.id} className="hover:bg-gray-50">
              <td className="w-[28%] px-4 py-4 align-top">
                <DocumentIdentity document={document} />
              </td>
              <td className="w-[22%] px-4 py-4 align-top">
                <UploaderDetails document={document} />
              </td>
              <td className="w-[16%] px-4 py-4 align-top">
                <VentureDetails document={document} />
              </td>
              <td className="w-[14%] px-4 py-4 align-top">
                <DocumentStatusBadge status={document.status} />
              </td>
              <td className="w-[11%] px-4 py-4 align-top">
                <UploadDate document={document} />
              </td>
              <td className="w-[9%] px-4 py-4 align-top text-right">
                <DocumentActions
                  document={document}
                  pendingAction={pendingActions[document.id]}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onDelete}
                  onDownload={onDownload}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MobileDocumentList({
  documents,
  pendingActions,
  onStatusUpdate,
  onDelete,
  onDownload,
}: Omit<DocumentListProps, "loading">) {
  return (
    <div className="divide-y divide-gray-200 md:hidden">
      {documents.map((document) => {
        const venture = formatImpactDocumentVenture(document.venture)
        return (
          <article key={document.id} className="px-4 py-5">
            <div className="mb-3 flex min-w-0 items-start gap-3">
              <File className="mt-0.5 h-9 w-9 shrink-0 text-blue-500" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h3 className="break-words text-sm font-semibold text-gray-900">{document.filename}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {document.documentType} • {formatImpactDocumentFileSize(document.filesize)}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <UploaderDetails document={document} />
              <div className="flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                <p className="break-words text-gray-900">{venture}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <DocumentStatusBadge status={document.status} />
                <span className="inline-flex items-center text-sm text-gray-900">
                  <Calendar className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                  {formatImpactDocumentDate(document.createdAt)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <DocumentActions
                document={document}
                pendingAction={pendingActions[document.id]}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDelete}
                onDownload={onDownload}
              />
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function DocumentList({
  documents,
  loading,
  pendingActions,
  onStatusUpdate,
  onDelete,
  onDownload,
}: DocumentListProps) {
  if (loading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" aria-hidden="true" />
        <p className="text-gray-500">Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="py-12 text-center">
        <File className="mx-auto mb-4 h-16 w-16 text-gray-300" aria-hidden="true" />
        <p className="text-gray-500">No documents found</p>
      </div>
    )
  }

  return (
    <>
      <DocumentTable
        documents={documents}
        pendingActions={pendingActions}
        onStatusUpdate={onStatusUpdate}
        onDelete={onDelete}
        onDownload={onDownload}
      />
      <MobileDocumentList
        documents={documents}
        pendingActions={pendingActions}
        onStatusUpdate={onStatusUpdate}
        onDelete={onDelete}
        onDownload={onDownload}
      />
    </>
  )
}
