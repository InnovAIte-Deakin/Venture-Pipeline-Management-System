import type { IrisMetricsResponse } from "../types/iris-metrics.types"

type FetchIrisMetricsParams = {
  query: string
  limit: number
  signal?: AbortSignal
}

export async function fetchIrisMetrics({
  query,
  limit,
  signal,
}: FetchIrisMetricsParams): Promise<IrisMetricsResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  })

  const trimmedQuery = query.trim()

  if (trimmedQuery) {
    params.set("q", trimmedQuery)
  }

  const response = await fetch(`/api/iris/metrics?${params.toString()}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}
