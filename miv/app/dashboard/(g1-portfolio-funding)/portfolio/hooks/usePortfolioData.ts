"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import type { PortfolioCompany } from "../types"
import { fetchVentures } from "../lib/portfolioApi"
import { filterCompanies, isPortfolioVenture, mapVentureToPortfolioCompany, summarisePortfolio } from "../lib/portfolioData"
import { downloadPortfolioCsv } from "../lib/portfolioExport"

export function usePortfolioData() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFounderType, setSelectedFounderType] = useState("all")
  const [selectedStageFilter, setSelectedStageFilter] = useState("portfolio")
  const [selectedCompany, setSelectedCompany] = useState<PortfolioCompany | null>(null)
  const [selectedActionCompany, setSelectedActionCompany] = useState<PortfolioCompany | null>(null)
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([])
  const [totalVenturesCount, setTotalVenturesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPortfolio = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setError(null)
    try {
      const ventures = await fetchVentures(signal)
      if (signal?.aborted) return
      setTotalVenturesCount(ventures.length)
      setPortfolioCompanies(ventures.filter((venture) => isPortfolioVenture(venture, selectedStageFilter)).map(mapVentureToPortfolioCompany))
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return
      setError(cause instanceof Error ? cause.message : "An unexpected error occurred")
      setPortfolioCompanies([])
    } finally { if (!signal?.aborted) setLoading(false) }
  }, [selectedStageFilter])

  useEffect(() => { const controller = new AbortController(); void loadPortfolio(controller.signal); return () => controller.abort() }, [loadPortfolio])
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key !== "Escape") return; if (selectedActionCompany) setSelectedActionCompany(null); else setSelectedCompany(null) }
    if (selectedCompany || selectedActionCompany) document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [selectedCompany, selectedActionCompany])

  const filteredCompanies = useMemo(() => filterCompanies(portfolioCompanies, searchTerm, selectedFounderType), [portfolioCompanies, searchTerm, selectedFounderType])
  const summary = useMemo(() => summarisePortfolio(portfolioCompanies), [portfolioCompanies])
  const handleExportPortfolio = useCallback(async () => { setIsExporting(true); try { downloadPortfolioCsv(filteredCompanies); toast.success("Portfolio CSV exported") } catch { toast.error("Portfolio export failed") } finally { setIsExporting(false) } }, [filteredCompanies])
  const executeAction = useCallback(async (actionType: string, company: PortfolioCompany) => { toast.info(`${actionType} selected for ${company.name}`, { description: "This action needs a connected workflow before it can be submitted." }); setSelectedActionCompany(null) }, [])

  return {
    loading, error, isExporting, portfolioCompanies, filteredCompanies, totalVenturesCount, ...summary,
    searchTerm, selectedStageFilter, selectedFounderType, selectedCompany, selectedActionCompany,
    isActionDialogOpen: selectedActionCompany !== null,
    setSearchTerm, setSelectedStageFilter, setSelectedFounderType,
    fetchPortfolioCompanies: () => loadPortfolio(), handleExportPortfolio,
    handleViewCompany: setSelectedCompany, handleCloseDialog: () => setSelectedCompany(null),
    handleTakeAction: setSelectedActionCompany, handleCloseActionDialog: () => setSelectedActionCompany(null), executeAction,
  }
}
