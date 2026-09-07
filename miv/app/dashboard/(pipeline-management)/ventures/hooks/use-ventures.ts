"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import {
  filterVentures,
  getUniqueSectors,
  requestVentures,
  summarizeVentures,
  type VentureFiltersState,
  type VentureRecord,
} from "@/lib/ventures"

const defaultFilters: VentureFiltersState = {
  search: "",
  status: "all",
  stage: "all",
  sector: "all",
}

export function useVentures() {
  const [ventures, setVentures] = useState<VentureRecord[]>([])
  const [filters, setFilters] = useState<VentureFiltersState>(defaultFilters)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadVentures = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const data = await requestVentures()
      setVentures(data.ventures)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load ventures."
      setError(message)
      setVentures([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadVentures()
  }, [loadVentures])

  const filteredVentures = useMemo(() => filterVentures(ventures, filters), [ventures, filters])
  const summary = useMemo(() => summarizeVentures(ventures), [ventures])
  const sectors = useMemo(() => getUniqueSectors(ventures), [ventures])

  return {
    error,
    filteredVentures,
    filters,
    loading,
    refresh: () => loadVentures({ refresh: true }),
    refreshing,
    retry: () => loadVentures(),
    sectors,
    setFilters,
    summary,
    ventures,
  }
}
