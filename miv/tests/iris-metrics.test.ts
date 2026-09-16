import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { fetchIrisMetrics } from "../app/dashboard/(impact-gedsi)/iris-metrics/lib/iris-metrics.api"

describe("IRIS metrics API helper", () => {
  it("sends trimmed search query, limit and page to the API", async () => {
    const originalFetch = globalThis.fetch
    const controller = new AbortController()
    let requestedUrl = ""
    let requestedSignal: AbortSignal | null | undefined

    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input)
      requestedSignal = init?.signal

      return Response.json({
        results: [],
        total: 0,
        totalPages: 1,
      })
    }

    try {
      await fetchIrisMetrics({
        query: "  education  ",
        limit: 50,
        page: 2,
        signal: controller.signal,
      })

      assert.equal(
        requestedUrl,
        "/api/iris/metrics?limit=50&page=2&q=education",
      )
      assert.equal(requestedSignal, controller.signal)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it("does not include q when the search query is empty", async () => {
    const originalFetch = globalThis.fetch
    let requestedUrl = ""

    globalThis.fetch = async (input) => {
      requestedUrl = String(input)

      return Response.json({
        results: [],
        total: 0,
        totalPages: 1,
      })
    }

    try {
      await fetchIrisMetrics({
        query: "   ",
        limit: 100,
        page: 1,
      })

      assert.equal(
        requestedUrl,
        "/api/iris/metrics?limit=100&page=1",
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it("throws an error when the API request fails", async () => {
    const originalFetch = globalThis.fetch

    globalThis.fetch = async () =>
      new Response(null, { status: 500 })

    try {
      await assert.rejects(
        () =>
          fetchIrisMetrics({
            query: "",
            limit: 50,
            page: 1,
          }),
        /Request failed with status 500/,
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
