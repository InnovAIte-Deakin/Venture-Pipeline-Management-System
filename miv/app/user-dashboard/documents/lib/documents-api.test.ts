import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  UserDocumentsApiError,
  deleteUserDocument,
  downloadUserDocument,
  fetchUserDocuments,
} from "./documents-api"

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  })
}

describe("user documents API", () => {
  it("loads documents through the authenticated backend proxy", async () => {
    const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = []
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ input, init })
      return jsonResponse({
        success: true,
        documents: [{
          id: "doc-1",
          filename: "pitch.pdf",
          documentType: "Pitch Deck",
          status: "approved",
          createdAt: "2026-08-01T00:00:00.000Z",
        }],
      })
    }) as typeof fetch

    const documents = await fetchUserDocuments(fetcher)
    assert.equal(documents.length, 1)
    assert.equal(calls[0].input, "/backend/api/documents")
    assert.equal(calls[0].init?.credentials, "include")
  })

  it("encodes the document id when deleting", async () => {
    const calls: Array<RequestInfo | URL> = []
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push(input)
      assert.equal(init?.method, "DELETE")
      return jsonResponse({ success: true })
    }) as typeof fetch

    await deleteUserDocument("doc 1", fetcher)
    assert.equal(calls[0], "/backend/api/documents?id=doc%201")
  })

  it("shows the server message when a download fails", async () => {
    const fetcher = (async () => jsonResponse(
      { success: false, message: "The document file could not be found on the server." },
      { status: 404 },
    )) as typeof fetch

    await assert.rejects(
      () => downloadUserDocument("missing", fetcher),
      (error) => error instanceof UserDocumentsApiError
        && error.message === "The document file could not be found on the server.",
    )
  })
})
