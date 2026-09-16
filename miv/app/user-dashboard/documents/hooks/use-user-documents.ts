"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { DocumentType } from "../constants/documents.constants"
import {
  deleteUserDocument,
  downloadUserDocument,
  fetchUserDocuments,
  getUserDocumentsErrorMessage,
  uploadUserDocument,
} from "../lib/documents-api"
import { calculateDocumentStats, getDisplayFilename } from "../lib/document-formatters"
import { validateUploadSelection } from "../lib/documents-validation"
import type { DocumentNotice, UserDocument } from "../types/documents.types"

export function useUserDocuments() {
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [selectedType, setSelectedTypeState] = useState<DocumentType | "">("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<DocumentNotice | null>(null)

  const loadDocuments = useCallback(async (showInitialLoader = false) => {
    if (showInitialLoader) setLoading(true)
    else setRefreshing(true)

    try {
      setDocuments(await fetchUserDocuments())
    } catch (error) {
      setNotice({
        type: "error",
        message: getUserDocumentsErrorMessage(error, "Documents could not be loaded."),
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadDocuments(true)
  }, [loadDocuments])

  const setSelectedType = useCallback((value: string) => {
    setSelectedTypeState(value as DocumentType | "")
    setNotice(null)
  }, [])

  const handleFiles = useCallback(
    async (files: File[]) => {
      setNotice(null)

      if (!selectedType) {
        setNotice({ type: "error", message: "Select a document type before choosing a file." })
        return
      }

      const validation = validateUploadSelection(files, selectedType)

      if (!validation.ok) {
        setNotice({ type: "error", message: validation.message })
        return
      }

      setUploading(true)
      try {
        const uploadedDocument = await uploadUserDocument(files[0], selectedType)
        setDocuments((current) => [uploadedDocument, ...current])
        setSelectedTypeState("")
        setNotice({ type: "success", message: "Document uploaded and sent for review." })
      } catch (error) {
        setNotice({
          type: "error",
          message: getUserDocumentsErrorMessage(error, "The document could not be uploaded."),
        })
      } finally {
        setUploading(false)
      }
    },
    [selectedType],
  )

  const removeDocument = useCallback(async (document: UserDocument) => {
    setDeletingId(document.id)
    setNotice(null)

    try {
      await deleteUserDocument(document.id)
      setDocuments((current) => current.filter((item) => item.id !== document.id))
      setNotice({ type: "success", message: `${getDisplayFilename(document.filename)} was deleted.` })
    } catch (error) {
      setNotice({
        type: "error",
        message: getUserDocumentsErrorMessage(error, "The document could not be deleted."),
      })
    } finally {
      setDeletingId(null)
    }
  }, [])

  const downloadDocument = useCallback(async (document: UserDocument) => {
    setDownloadingId(document.id)
    setNotice(null)

    try {
      const blob = await downloadUserDocument(document.id)
      const url = window.URL.createObjectURL(blob)
      const link = window.document.createElement("a")
      link.href = url
      link.download = getDisplayFilename(document.filename)
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setNotice({
        type: "error",
        message: getUserDocumentsErrorMessage(error, "The document could not be downloaded."),
      })
    } finally {
      setDownloadingId(null)
    }
  }, [])

  const stats = useMemo(() => calculateDocumentStats(documents), [documents])

  return {
    documents,
    stats,
    selectedType,
    loading,
    refreshing,
    uploading,
    deletingId,
    downloadingId,
    notice,
    setSelectedType,
    handleFiles,
    removeDocument,
    downloadDocument,
    refresh: () => loadDocuments(false),
    dismissNotice: () => setNotice(null),
  }
}

export type UserDocumentsController = ReturnType<typeof useUserDocuments>
