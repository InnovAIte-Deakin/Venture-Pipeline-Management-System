"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { calculateSummary, filterInvestmentRounds } from "@/app/dashboard/(capital-management)/investment-rounds/libs/calculations"
import type { InvestmentRound, RoundFiltersState, Venture } from "@/app/dashboard/(capital-management)/investment-rounds/libs/types"
import { ventureToInvestmentRound } from "@/app/dashboard/(capital-management)/investment-rounds/libs/venture-to-round"

const initialFilters: RoundFiltersState = { searchTerm: "", roundType: "all", stage: "all", status: "all", sector: "all", founderType: "all" }

export function useInvestmentRounds() {
  const [rounds, setRounds] = useState<InvestmentRound[]>([])
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/ventures?limit=100")
      if (!response.ok) throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      const data: { ventures?: Venture[] } = await response.json()
      setRounds((data.ventures || []).map(ventureToInvestmentRound))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to fetch investment rounds")
      setRounds([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const filteredRounds = useMemo(() => filterInvestmentRounds(rounds, filters), [rounds, filters])
  const summary = useMemo(() => calculateSummary(rounds), [rounds])
  const setFilter = useCallback(<K extends keyof RoundFiltersState>(key: K, value: RoundFiltersState[K]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }, [])

  return { rounds, filteredRounds, filters, setFilter, summary, loading, error, refresh }
}
