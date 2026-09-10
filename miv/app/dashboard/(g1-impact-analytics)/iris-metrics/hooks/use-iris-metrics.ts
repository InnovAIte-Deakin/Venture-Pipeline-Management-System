import { useEffect, useState } from "react"

import { fetchIrisMetrics } from "../lib/iris-metrics.api"
import {
  DEFAULT_RESULT_LIMIT,
  SEARCH_DEBOUNCE_MS,
} from "../lib/iris-metrics.constants"
import type { CatalogItem } from "../types/iris-metrics.types"

export function useIrisMetrics() {
  const [query, setQueryState] = useState("")
  const [items, setItems] = useState<CatalogItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [limit, setLimitState] = useState(DEFAULT_RESULT_LIMIT)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState("")
  const [retryKey, setRetryKey] = useState(0)

  const setQuery = (value: string) => {
    setQueryState(value)
    setPage(1)
  }

  const setLimit = (value: number) => {
    setLimitState(value)
    setPage(1)
  }

  const retry = () => {
    setRetryKey((currentKey) => currentKey + 1)
  }

  useEffect(() => {
    const controller = new AbortController()

    async function loadMetrics() {
      setLoading(true)
      setError("")

      try {
        const data = await fetchIrisMetrics({
          query,
          limit,
          page,
          signal: controller.signal,
        })

        setItems(data.results || [])
        setTotal(data.total || data.results?.length || 0)
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setItems([])
          setTotal(0)
          setTotalPages(1)
          setError("Unable to load IRIS metrics. Please try again.")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    const timeoutId = window.setTimeout(loadMetrics, SEARCH_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [query, limit, page, retryKey])

  return {
    query,
    setQuery,
    items,
    total,
    loading,
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    error,
    retry,
  }
}
