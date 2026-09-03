import type { DocumentListPayload, ImpactDocument, ImpactDocumentStatus, MutationPayload } from "./types"

type Fetcher = typeof fetch

interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export class ImpactDocumentsApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ImpactDocumentsApiError"
    this.status = status
    this.code = code
  }
}

async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || ""

  if (!contentType.includes("application/json")) {
    return undefined
  }

  try {
    return await response.json()
  } catch {
    throw new ImpactDocumentsApiError("The server returned invalid JSON.", response.status)
  }
}

function getApiMessage(status: number, payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    if (typeof record.message === "string" && record.message.trim()) return record.message
    if (typeof record.error === "string" && record.error.trim()) return record.error
  }

  if (status === 401) return "You must be logged in to manage documents."
  if (status === 403) return "You do not have permission to perform this action."
  if (status === 404) return "The requested document could not be found."
  if (status === 400) return "Please check the document details and try again."
  return fallback
}

async function parseJsonResponse<T>(
  response: Response,
  fallbackError: string,
  validate: (payload: unknown) => ApiSuccess<T>,
): Promise<ApiSuccess<T>> {
  const payload = await readJson(response)

  if (!response.ok) {
    throw new ImpactDocumentsApiError(
      getApiMessage(response.status, payload, fallbackError),
      response.status,
      payload && typeof payload === "object" ? String((payload as Record<string, unknown>).error || "") : undefined,
    )
  }

  return validate(payload)
}

function assertDocumentArray(payload: unknown): ApiSuccess<DocumentListPayload> {
  if (
    !payload ||
    typeof payload !== "object" ||
    (payload as Record<string, unknown>).success !== true ||
    !Array.isArray((payload as Record<string, unknown>).documents)
  ) {
    throw new ImpactDocumentsApiError("The server returned an unexpected documents response.", 200)
  }

  return {
    success: true,
    data: { documents: (payload as { documents: ImpactDocument[] }).documents },
  }
}

function assertMutation(payload: unknown): ApiSuccess<MutationPayload> {
  if (!payload || typeof payload !== "object" || (payload as Record<string, unknown>).success !== true) {
    throw new ImpactDocumentsApiError("The server returned an unexpected update response.", 200)
  }

  const record = payload as Record<string, unknown>
  return {
    success: true,
    data: {
      message: typeof record.message === "string" ? record.message : undefined,
      document: record.document && typeof record.document === "object" ? record.document : undefined,
    },
    message: typeof record.message === "string" ? record.message : undefined,
  }
}

export function getImpactDocumentErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ImpactDocumentsApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export async function fetchImpactDocuments(fetcher: Fetcher = fetch): Promise<ImpactDocument[]> {
  const response = await fetcher("/backend/api/documents", {
    credentials: "include",
  })
  const result = await parseJsonResponse(response, "Failed to fetch documents.", assertDocumentArray)
  return result.data.documents
}

export async function updateImpactDocumentStatus(
  documentId: string,
  status: ImpactDocumentStatus,
  notes?: string,
  fetcher: Fetcher = fetch,
): Promise<MutationPayload> {
  const response = await fetcher(`/backend/api/documents/${encodeURIComponent(documentId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status, notes }),
  })

  const result = await parseJsonResponse(response, "Failed to update document status.", assertMutation)
  return result.data
}

export async function deleteImpactDocument(
  documentId: string,
  fetcher: Fetcher = fetch,
): Promise<MutationPayload> {
  const response = await fetcher(`/backend/api/documents?id=${encodeURIComponent(documentId)}`, {
    method: "DELETE",
    credentials: "include",
  })

  const result = await parseJsonResponse(response, "Failed to delete document.", assertMutation)
  return result.data
}

export async function downloadImpactDocument(documentId: string, fetcher: Fetcher = fetch): Promise<Blob> {
  const response = await fetcher(`/backend/api/documents/${encodeURIComponent(documentId)}?download=true`, {
    credentials: "include",
  })

  if (!response.ok) {
    const payload = await readJson(response)
    throw new ImpactDocumentsApiError(
      getApiMessage(response.status, payload, "Failed to download document."),
      response.status,
      payload && typeof payload === "object" ? String((payload as Record<string, unknown>).error || "") : undefined,
    )
  }

  return response.blob()
}
