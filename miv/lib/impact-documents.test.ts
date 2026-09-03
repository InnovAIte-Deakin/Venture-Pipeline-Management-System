import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  ImpactDocumentsApiError,
  calculateImpactDocumentStats,
  deleteImpactDocument,
  downloadImpactDocument,
  fetchImpactDocuments,
  filterImpactDocuments,
  formatImpactDocumentFileSize,
  formatImpactDocumentUploader,
  formatImpactDocumentVenture,
  updateImpactDocumentStatus,
  type ImpactDocument,
} from "./impact-documents/index"

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  })
}

function createFetch(response: Response, calls: RequestInfo[] = []) {
  return (async (input: RequestInfo) => {
    calls.push(input)
    return response
  }) as typeof fetch
}

const documents: ImpactDocument[] = [
  {
    id: "doc-1",
    filename: "impact-report.pdf",
    documentType: "Impact Reports",
    status: "pending_review",
    filesize: 1024,
    uploadedBy: {
      firstName: "Asha",
      lastName: "Patel",
      email: "asha@example.com",
    },
    venture: { name: "Clean Water Co" },
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "doc-2",
    filename: "financials.xlsx",
    documentType: "Financial Statements",
    status: "approved",
    filesize: 2048,
    uploadedBy: null,
    venture: null,
    createdAt: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "doc-3",
    filename: "deck.pdf",
    documentType: "Pitch Deck",
    status: "rejected",
    uploadedBy: "user-3",
    venture: "venture-3",
    createdAt: "2026-01-04T00:00:00.000Z",
  },
]

describe("impact document filters and stats", () => {
  it("filters by search, type and status without requiring uploader or venture objects", () => {
    assert.deepEqual(
      filterImpactDocuments(documents, {
        searchQuery: "clean water",
        selectedType: "All Types",
        selectedStatus: "All Status",
      }).map((document) => document.id),
      ["doc-1"],
    )

    assert.deepEqual(
      filterImpactDocuments(documents, {
        searchQuery: "financials",
        selectedType: "Financial Statements",
        selectedStatus: "approved",
      }).map((document) => document.id),
      ["doc-2"],
    )
  })

  it("calculates statistics from the full document list", () => {
    assert.deepEqual(calculateImpactDocumentStats(documents), {
      total: 3,
      pending: 1,
      approved: 1,
      rejected: 1,
    })
  })
})

describe("impact document display formatters", () => {
  it("formats file sizes and missing relationship data consistently", () => {
    assert.equal(formatImpactDocumentFileSize(2048), "2 KB")
    assert.equal(formatImpactDocumentVenture(null), "No venture")
    assert.deepEqual(formatImpactDocumentUploader("user-1"), {
      name: "Unknown uploader",
      email: "No email available",
    })
  })
})

describe("impact document API helper", () => {
  it("fetches documents from the Payload backend proxy with credentials", async () => {
    const calls: RequestInfo[] = []
    const fetcher = createFetch(jsonResponse({ success: true, documents }), calls)

    assert.equal((await fetchImpactDocuments(fetcher)).length, 3)
    assert.equal(calls[0], "/backend/api/documents")
  })

  it("patches status updates against the document id endpoint", async () => {
    const calls: RequestInfo[] = []
    const fetcher = (async (input: RequestInfo, init?: RequestInit) => {
      calls.push(input)
      assert.equal(init?.method, "PATCH")
      assert.equal(init?.credentials, "include")
      assert.equal(init?.body, JSON.stringify({ status: "approved" }))
      return jsonResponse({ success: true, message: "Updated" })
    }) as typeof fetch

    const result = await updateImpactDocumentStatus("doc/1", "approved", undefined, fetcher)

    assert.equal(calls[0], "/backend/api/documents/doc%2F1")
    assert.equal(result.message, "Updated")
  })

  it("uses the query-string delete endpoint", async () => {
    const calls: RequestInfo[] = []
    const fetcher = (async (input: RequestInfo, init?: RequestInit) => {
      calls.push(input)
      assert.equal(init?.method, "DELETE")
      assert.equal(init?.credentials, "include")
      return jsonResponse({ success: true })
    }) as typeof fetch

    await deleteImpactDocument("doc 1", fetcher)

    assert.equal(calls[0], "/backend/api/documents?id=doc%201")
  })

  it("surfaces download errors parsed from JSON", async () => {
    const fetcher = createFetch(
      jsonResponse(
        {
          success: false,
          error: "File not found",
          message: "The document file could not be found on the server.",
        },
        { status: 404 },
      ),
    )

    await assert.rejects(
      () => downloadImpactDocument("missing", fetcher),
      (error) =>
        error instanceof ImpactDocumentsApiError &&
        error.status === 404 &&
        error.message === "The document file could not be found on the server.",
    )
  })

  it("rejects unexpected successful response shapes", async () => {
    const fetcher = createFetch(jsonResponse({ success: true, docs: [] }))

    await assert.rejects(
      () => fetchImpactDocuments(fetcher),
      (error) =>
        error instanceof ImpactDocumentsApiError &&
        error.message === "The server returned an unexpected documents response.",
    )
  })
})
