"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  File,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  User,
  XCircle,
} from "lucide-react"
import { ImpactDocumentFilters } from "./ImpactDocumentFilters"
import {
  calculateImpactDocumentStats,
  deleteImpactDocument,
  downloadImpactDocument,
  fetchImpactDocuments,
  filterImpactDocuments,
  getImpactDocumentErrorMessage,
  type ImpactDocument,
  type ImpactDocumentStatus,
  type ImpactDocumentStatusFilter,
  type ImpactDocumentTypeFilter,
  updateImpactDocumentStatus,
} from "@/lib/impact-documents"

type RowAction = "status" | "delete" | "download"

const ACTION_BUTTON_BASE =
  "inline-flex min-h-8 items-center justify-center rounded px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

function formatFileSize(bytes?: number) {
  if (!bytes || bytes <= 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}

function formatDate(date?: string) {
  if (!date) return "Unknown"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return "Unknown"
  return parsed.toLocaleDateString()
}

function formatPerson(person: ImpactDocument["uploadedBy"]) {
  if (!person || typeof person === "string") {
    return { name: "Unknown uploader", email: "No email available" }
  }

  const name = [person.firstName, person.lastName].filter(Boolean).join(" ").trim()
  return {
    name: name || person.email || "Unknown uploader",
    email: person.email || "No email available",
  }
}

function formatVenture(venture: ImpactDocument["venture"]) {
  if (!venture || typeof venture === "string") return "No venture"
  return venture.name || "No venture"
}

function getStatusBadge(status: ImpactDocumentStatus | string) {
  const statusConfig = {
    pending_review: { color: "bg-yellow-100 text-yellow-800", text: "Pending Review", icon: Clock },
    approved: { color: "bg-green-100 text-green-800", text: "Approved", icon: CheckCircle },
    rejected: { color: "bg-red-100 text-red-800", text: "Rejected", icon: XCircle },
    needs_revision: { color: "bg-orange-100 text-orange-800", text: "Needs Revision", icon: AlertCircle },
    unknown: { color: "bg-gray-100 text-gray-700", text: "Unknown", icon: AlertCircle },
  }
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unknown
  const IconComponent = config.icon

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
      <IconComponent className="mr-1 h-3 w-3" aria-hidden="true" />
      {config.text}
    </span>
  )
}

interface DocumentActionsProps {
  document: ImpactDocument
  pendingAction?: RowAction
  onStatusUpdate: (documentId: string, status: ImpactDocumentStatus) => void
  onDelete: (documentId: string) => void
  onDownload: (documentId: string, filename: string) => void
}

function DocumentActions({
  document,
  pendingAction,
  onStatusUpdate,
  onDelete,
  onDownload,
}: DocumentActionsProps) {
  const disabled = Boolean(pendingAction)
  const isDownloading = pendingAction === "download"

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
        {isDownloading ? (
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

export default function ImpactDocumentsPage() {
  const [documents, setDocuments] = useState<ImpactDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<ImpactDocumentTypeFilter>("All Types")
  const [selectedStatus, setSelectedStatus] = useState<ImpactDocumentStatusFilter>("All Status")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pendingActions, setPendingActions] = useState<Record<string, RowAction | undefined>>({})

  const filteredDocuments = useMemo(
    () => filterImpactDocuments(documents, { searchQuery, selectedType, selectedStatus }),
    [documents, searchQuery, selectedType, selectedStatus],
  )

  const stats = useMemo(() => calculateImpactDocumentStats(documents), [documents])

  const setRowAction = useCallback((documentId: string, action?: RowAction) => {
    setPendingActions((current) => {
      const next = { ...current }
      if (action) next[documentId] = action
      else delete next[documentId]
      return next
    })
  }, [])

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      setDocuments(await fetchImpactDocuments())
    } catch (err) {
      console.error("Failed to fetch documents:", err)
      setError(getImpactDocumentErrorMessage(err, "Failed to fetch documents."))
    } finally {
      setLoading(false)
    }
  }, [])

  const handleStatusUpdate = async (documentId: string, newStatus: ImpactDocumentStatus) => {
    try {
      setRowAction(documentId, "status")
      setError("")
      setSuccess("")
      await updateImpactDocumentStatus(documentId, newStatus)
      setSuccess("Document status updated successfully.")
      await fetchDocuments()
    } catch (err) {
      console.error("Status update error:", err)
      setError(getImpactDocumentErrorMessage(err, "An error occurred while updating status."))
    } finally {
      setRowAction(documentId)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    try {
      setRowAction(documentId, "delete")
      setError("")
      setSuccess("")
      await deleteImpactDocument(documentId)
      setSuccess("Document deleted successfully.")
      await fetchDocuments()
    } catch (err) {
      console.error("Delete error:", err)
      setError(getImpactDocumentErrorMessage(err, "An error occurred while deleting the document."))
    } finally {
      setRowAction(documentId)
    }
  }

  const handleDownload = async (documentId: string, filename: string) => {
    let url: string | undefined

    try {
      setRowAction(documentId, "download")
      setError("")
      setSuccess("")
      const blob = await downloadImpactDocument(documentId)
      url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Download error:", err)
      setError(getImpactDocumentErrorMessage(err, "An error occurred while downloading the document."))
    } finally {
      if (url) window.URL.revokeObjectURL(url)
      setRowAction(documentId)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                Impact Documents Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                Review and manage documents uploaded by venture founders
              </p>
            </div>
            <button
              type="button"
              onClick={fetchDocuments}
              disabled={loading}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="Document statistics">
          {[
            { label: "Total Documents", value: stats.total, icon: FileText, color: "text-blue-500" },
            { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-500" },
            { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-500" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex min-w-0 items-center">
                  <Icon className={`mr-3 h-8 w-8 shrink-0 ${stat.color}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="break-words text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {error && (
          <div className="mb-6 flex items-start rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
            <AlertCircle className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
            <p className="min-w-0 flex-1 break-words text-sm text-red-800 sm:text-base">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="ml-3 rounded text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              <XCircle className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start rounded-lg border border-green-200 bg-green-50 p-4" role="status">
            <CheckCircle className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
            <p className="min-w-0 flex-1 break-words text-sm text-green-800 sm:text-base">{success}</p>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
              className="ml-3 rounded text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              <XCircle className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}

        <ImpactDocumentFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          onSearchQueryChange={setSearchQuery}
          onSelectedTypeChange={setSelectedType}
          onSelectedStatusChange={setSelectedStatus}
        />

        <section className="overflow-hidden rounded-lg bg-white shadow-sm" aria-labelledby="impact-documents-heading">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <h2 id="impact-documents-heading" className="text-lg font-semibold text-gray-900">
              Documents ({filteredDocuments.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" aria-hidden="true" />
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="py-12 text-center">
              <File className="mx-auto mb-4 h-16 w-16 text-gray-300" aria-hidden="true" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-[920px] divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-[28%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Document
                      </th>
                      <th className="w-[22%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Uploaded By
                      </th>
                      <th className="w-[16%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Venture
                      </th>
                      <th className="w-[14%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="w-[11%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Upload Date
                      </th>
                      <th className="w-[9%] px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredDocuments.map((doc) => {
                      const uploader = formatPerson(doc.uploadedBy)
                      const venture = formatVenture(doc.venture)
                      return (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 align-top">
                            <div className="flex min-w-0 items-start">
                              <File className="mr-3 mt-0.5 h-10 w-10 shrink-0 text-blue-500" aria-hidden="true" />
                              <div className="min-w-0">
                                <div className="break-words text-sm font-medium text-gray-900">{doc.filename}</div>
                                <div className="mt-1 text-xs text-gray-500">
                                  {doc.documentType} • {formatFileSize(doc.filesize)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex min-w-0 items-start">
                              <User className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                              <div className="min-w-0">
                                <div className="break-words text-sm font-medium text-gray-900">{uploader.name}</div>
                                <div className="mt-1 break-words text-xs text-gray-500">{uploader.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            {venture !== "No venture" ? (
                              <div className="flex min-w-0 items-start">
                                <Building2 className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                                <span className="break-words text-sm text-gray-900">{venture}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">No venture</span>
                            )}
                          </td>
                          <td className="px-4 py-4 align-top">{getStatusBadge(doc.status)}</td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                              <span className="text-sm text-gray-900">{formatDate(doc.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top text-right">
                            <DocumentActions
                              document={doc}
                              pendingAction={pendingActions[doc.id]}
                              onStatusUpdate={handleStatusUpdate}
                              onDelete={handleDelete}
                              onDownload={handleDownload}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-gray-200 md:hidden">
                {filteredDocuments.map((doc) => {
                  const uploader = formatPerson(doc.uploadedBy)
                  const venture = formatVenture(doc.venture)
                  return (
                    <article key={doc.id} className="px-4 py-5">
                      <div className="mb-3 flex min-w-0 items-start gap-3">
                        <File className="mt-0.5 h-9 w-9 shrink-0 text-blue-500" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-semibold text-gray-900">{doc.filename}</h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {doc.documentType} • {formatFileSize(doc.filesize)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="break-words font-medium text-gray-900">{uploader.name}</p>
                            <p className="break-words text-xs text-gray-500">{uploader.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                          <p className="break-words text-gray-900">{venture}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          {getStatusBadge(doc.status)}
                          <span className="inline-flex items-center text-sm text-gray-900">
                            <Calendar className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                            {formatDate(doc.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <DocumentActions
                          document={doc}
                          pendingAction={pendingActions[doc.id]}
                          onStatusUpdate={handleStatusUpdate}
                          onDelete={handleDelete}
                          onDownload={handleDownload}
                        />
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
