"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DEFAULT_FILTERS, DEFAULT_SORT } from "../constants/deal-flow.constants"
import { calculateSummaryMetrics, getPipelinePerformance, groupDealsByStage } from "../lib/deal-flow-calculations"
import { downloadDealFlowCsv } from "../lib/deal-flow-export"
import { filterDeals, sortDeals } from "../lib/deal-flow-filters"
import { mapVenturesToDeals } from "../lib/deal-flow-mappers"
import type {
  Deal,
  DealFlowFilters,
  DealFlowState,
  DealStage,
  RawVentureData,
  StageDealsDialogState,
  VentureApiResponse,
  ViewMode,
} from "../types/deal-flow.types"

export function useDealFlow(): DealFlowState {
  const [rawVentures, setRawVentures] = useState<RawVentureData[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [filters, setFilters] = useState<DealFlowFilters>(DEFAULT_FILTERS)
  const [sort] = useState(DEFAULT_SORT)
  const [activeView, setActiveView] = useState<ViewMode>("overview")
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStageForFilter, setSelectedStageForFilter] = useState<DealStage | null>(null)
  const [hoveredStage, setHoveredStage] = useState<DealStage | null>(null)
  const [stageDealsDialog, setStageDealsDialog] = useState<StageDealsDialogState>({
    open: false,
    stage: "",
    deals: [],
  })

  const refreshDeals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/ventures?limit=100")
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as VentureApiResponse
      const ventures = data.ventures || []
      setRawVentures(ventures)
      setDeals(mapVenturesToDeals(ventures))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to load deals: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshDeals()
  }, [refreshDeals])

  const filteredDeals = useMemo(() => sortDeals(filterDeals(deals, filters), sort), [deals, filters, sort])
  const summary = useMemo(() => calculateSummaryMetrics(deals), [deals])
  const stageGroups = useMemo(() => groupDealsByStage(deals), [deals])
  const { bottlenecks, highPerformers } = useMemo(() => getPipelinePerformance(deals), [deals])

  const handleViewDeal = useCallback((deal: Deal) => {
    setSelectedDeal(deal)
    setViewOpen(true)
  }, [])

  const handleEditDeal = useCallback((deal: Deal) => {
    setSelectedDeal(deal)
    setEditOpen(true)
  }, [])

  const handleAddNewDeal = useCallback(() => {
    setAddOpen(true)
  }, [])

  const handleExportPipeline = useCallback(async () => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 2000))
      downloadDealFlowCsv(filteredDeals)
    } catch (err) {
      console.error("Export failed:", err)
    } finally {
      setIsExporting(false)
    }
  }, [filteredDeals])

  const handleStageClick = useCallback((stage: DealStage, stageDeals: Deal[]) => {
    setStageDealsDialog({ open: true, stage, deals: stageDeals })
  }, [])

  const handleStageFilter = useCallback(
    (stage: DealStage) => {
      if (selectedStageForFilter === stage) {
        setSelectedStageForFilter(null)
        setFilters((current) => ({ ...current, selectedStage: "all" }))
      } else {
        setSelectedStageForFilter(stage)
        setFilters((current) => ({ ...current, selectedStage: stage }))
      }
    },
    [selectedStageForFilter],
  )

  return {
    rawVentures,
    deals,
    filteredDeals,
    stageGroups,
    summary,
    bottlenecks,
    highPerformers,
    filters,
    sort,
    activeView,
    selectedDeal,
    loading,
    error,
    isExporting,
    selectedStageForFilter,
    hoveredStage,
    dialogs: {
      viewOpen,
      editOpen,
      addOpen,
      stageDeals: stageDealsDialog,
    },
    actions: {
      refreshDeals,
      setFilters,
      setActiveView,
      setSelectedStageForFilter,
      setHoveredStage,
      handleViewDeal,
      handleEditDeal,
      handleAddNewDeal,
      handleExportPipeline,
      handleStageClick,
      handleStageFilter,
      closeViewDialog: setViewOpen,
      closeEditDialog: setEditOpen,
      closeAddDealDialog: setAddOpen,
      setStageDealsDialog,
    },
  }
}
