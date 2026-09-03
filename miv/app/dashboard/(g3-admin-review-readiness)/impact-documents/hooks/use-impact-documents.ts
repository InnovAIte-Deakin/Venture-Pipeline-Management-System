"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  calculateImpactDocumentStats,
  deleteImpactDocument,
  downloadImpactDocument,
  fetchImpactDocuments,
  filterImpactDocuments,
  getImpactDocumentErrorMessage,
  updateImpactDocumentStatus,
  type ImpactDocument,
  type ImpactDocumentRowAction,
  type ImpactDocumentStatus,
  type ImpactDocumentStatusFilter,
  type ImpactDocumentTypeFilter,
} from "@/lib/impact-documents"

function triggerBrowserDownload(blob: Blob, filename: string) {
  let url: string | undefined

  try {
    url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    if (url) window.URL.revokeObjectURL(url)
  }
}

export function useImpactDocuments() {
  const [documents, setDocuments] = useState<ImpactDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<ImpactDocumentTypeFilter>("All Types")
  const [selectedStatus, setSelectedStatus] = useState<ImpactDocumentStatusFilter>("All Status")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pendingActions, setPendingActions] = useState<Record<string, ImpactDocumentRowAction | undefined>>({})

  const filteredDocuments = useMemo(
    () => filterImpactDocuments(documents, { searchQuery, selectedType, selectedStatus }),
    [documents, searchQuery, selectedType, selectedStatus],
  )

  const stats = useMemo(() => calculateImpactDocumentStats(documents), [documents])

  const setRowAction = useCallback((documentId: string, action?: ImpactDocumentRowAction) => {
    setPendingActions((current) => {
      const next = { ...current }
      if (action) next[documentId] = action
      else delete next[documentId]
      return next
    })
  }, [])

  const refreshDocuments = useCallback(async () => {
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

  const updateStatus = useCallback(
    async (documentId: string, newStatus: ImpactDocumentStatus) => {
      try {
        setRowAction(documentId, "status")
        setError("")
        setSuccess("")
        await updateImpactDocumentStatus(documentId, newStatus)
        setSuccess("Document status updated successfully.")
        await refreshDocuments()
      } catch (err) {
        console.error("Status update error:", err)
        setError(getImpactDocumentErrorMessage(err, "An error occurred while updating status."))
      } finally {
        setRowAction(documentId)
      }
    },
    [refreshDocuments, setRowAction],
  )

  const deleteDocument = useCallback(
    async (documentId: string) => {
      if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
        return
      }

      try {
        setRowAction(documentId, "delete")
        setError("")
        setSuccess("")
        await deleteImpactDocument(documentId)
        setSuccess("Document deleted successfully.")
        await refreshDocuments()
      } catch (err) {
        console.error("Delete error:", err)
        setError(getImpactDocumentErrorMessage(err, "An error occurred while deleting the document."))
      } finally {
        setRowAction(documentId)
      }
    },
    [refreshDocuments, setRowAction],
  )

  const downloadDocument = useCallback(
    async (documentId: string, filename: string) => {
      try {
        setRowAction(documentId, "download")
        setError("")
        setSuccess("")
        const blob = await downloadImpactDocument(documentId)
        triggerBrowserDownload(blob, filename)
      } catch (err) {
        console.error("Download error:", err)
        setError(getImpactDocumentErrorMessage(err, "An error occurred while downloading the document."))
      } finally {
        setRowAction(documentId)
      }
    },
    [setRowAction],
  )

  useEffect(() => {
    refreshDocuments()
  }, [refreshDocuments])

  return {
    documents,
    filteredDocuments,
    stats,
    loading,
    error,
    success,
    pendingActions,
    filters: {
      searchQuery,
      selectedType,
      selectedStatus,
      setSearchQuery,
      setSelectedType,
      setSelectedStatus,
    },
    actions: {
      refreshDocuments,
      updateStatus,
      deleteDocument,
      downloadDocument,
      dismissError: () => setError(""),
      dismissSuccess: () => setSuccess(""),
    },
  }
}
