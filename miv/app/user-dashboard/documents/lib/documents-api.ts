import type { DocumentType } from "../constants/documents.constants"
import type { UserDocument } from "../types/documents.types"

type Fetcher = typeof fetch

export class UserDocumentsApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "UserDocumentsApiError"
    this.status = status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) return undefined

  try {
    return await response.json()
  } catch {
    throw new UserDocumentsApiError("The server returned an invalid response.", response.status)
  }
}

function getErrorMessage(response: Response, payload: unknown, fallback: string): string {
  if (isRecord(payload)) {
    if (typeof payload.message === "string" && payload.message.trim()) return payload.message
    if (typeof payload.error === "string" && payload.error.trim()) return payload.error
  }

  if (response.status === 401) return "Sign in again to manage your documents."
  if (response.status === 403) return "You do not have permission to complete this action."
  if (response.status === 404) return "The document could not be found."
  return fallback
}

function parseDocument(value: unknown): UserDocument | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== "string" || typeof value.filename !== "string") return null

  const validStatuses = ["pending_review", "approved", "rejected", "needs_revision"]
  const status = validStatuses.includes(String(value.status))
    ? (value.status as UserDocument["status"])
    : "pending_review"

  return {
    ...value,
    id: value.id,
    filename: value.filename,
    documentType: typeof value.documentType === "string" ? value.documentType : "Other",
    status,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
  }
}

export function getUserDocumentsErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof UserDocumentsApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export async function fetchUserDocuments(fetcher: Fetcher = fetch): Promise<UserDocument[]> {
  const response = await fetcher("/backend/api/documents", { credentials: "include" })
  const payload = await readJson(response)

  if (!response.ok) {
    throw new UserDocumentsApiError(
      getErrorMessage(response, payload, "Documents could not be loaded."),
      response.status,
    )
  }

  if (!isRecord(payload) || payload.success !== true || !Array.isArray(payload.documents)) {
    throw new UserDocumentsApiError("The server returned an unexpected documents response.", response.status)
  }

  return payload.documents.map(parseDocument).filter((document): document is UserDocument => document !== null)
}

export async function uploadUserDocument(
  file: File,
  documentType: DocumentType,
  fetcher: Fetcher = fetch,
): Promise<UserDocument> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("documentType", documentType)

  const response = await fetcher("/backend/api/documents", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
  const payload = await readJson(response)

  if (!response.ok) {
    throw new UserDocumentsApiError(
      getErrorMessage(response, payload, "The document could not be uploaded."),
      response.status,
    )
  }

  const document = isRecord(payload) ? parseDocument(payload.document) : null
  if (!isRecord(payload) || payload.success !== true || !document) {
    throw new UserDocumentsApiError("The server returned an unexpected upload response.", response.status)
  }

  return document
}

export async function deleteUserDocument(documentId: string, fetcher: Fetcher = fetch): Promise<void> {
  const response = await fetcher(`/backend/api/documents?id=${encodeURIComponent(documentId)}`, {
    method: "DELETE",
    credentials: "include",
  })
  const payload = await readJson(response)

  if (!response.ok || !isRecord(payload) || payload.success !== true) {
    throw new UserDocumentsApiError(
      getErrorMessage(response, payload, "The document could not be deleted."),
      response.status,
    )
  }
}

export async function downloadUserDocument(documentId: string, fetcher: Fetcher = fetch): Promise<Blob> {
  const response = await fetcher(
    `/backend/api/documents/${encodeURIComponent(documentId)}?download=true`,
    { credentials: "include" },
  )

  if (!response.ok) {
    const payload = await readJson(response)
    throw new UserDocumentsApiError(
      getErrorMessage(response, payload, "The document could not be downloaded."),
      response.status,
    )
  }

  return response.blob()
}
