export type CatalogItem = {
  code: string
  name: string
  description?: string
  unit?: string
  gedsiSuggestion?: string
}

export type IrisMetricsResponse = {
  results: CatalogItem[]
  total: number
  limit: number
}
