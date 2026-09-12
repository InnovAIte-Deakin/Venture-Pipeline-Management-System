"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DEFAULT_ITEMS_PER_PAGE } from "../constants/due-diligence.constants"
import { filterSortPaginateItems } from "../lib/due-diligence-filters"
import {
  generateChecklistFromVentures,
  groupItemsByVenture,
  mapVenturesToDueDiligenceItems
} from "../lib/due-diligence-mappers"
import {
  downloadReport,
  generateCustomizedReportContent,
  getDefaultReportSections
} from "../lib/due-diligence-reports"
import type {
  ChecklistItem,
  DateRange,
  DueDiligenceItem,
  DueDiligenceVenture,
  DueDiligenceViewMode,
  ReportSections,
  SortOrder,
  UseDueDiligenceResult,
  VentureDD
} from "../types/due-diligence.types"

export function useDueDiligence(): UseDueDiligenceResult {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [isReportConfigOpen, setIsReportConfigOpen] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<string>("")
  const [reportSections, setReportSections] = useState<ReportSections>({})
  const [selectedVenture, setSelectedVenture] = useState<string>("all")
  const [reportFormat, setReportFormat] = useState<string>("pdf")
  const [isNewDDDialogOpen, setIsNewDDDialogOpen] = useState(false)
  const [dueDiligenceItems, setDueDiligenceItems] = useState<DueDiligenceItem[]>([])
  const [venturesDDs, setVenturesDDs] = useState<VentureDD[]>([])
  const [ventures, setVentures] = useState<DueDiligenceVenture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<DueDiligenceViewMode>("ventures")
  const [selectedVentureForDetails, setSelectedVentureForDetails] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)
  const [selectedItem, setSelectedItem] = useState<DueDiligenceItem | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" })
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])

  const fetchDueDiligenceData = useCallback(async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/ventures?limit=100")
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const venturesData = (data.ventures || []) as DueDiligenceVenture[]

      console.log(`ðŸ“Š Found ${venturesData.length} ventures for due diligence`)

      setVentures(venturesData)

      const transformedItems = mapVenturesToDueDiligenceItems(venturesData)
      setDueDiligenceItems(transformedItems)

      const ventureGroups = groupItemsByVenture(transformedItems, venturesData)
      setVenturesDDs(ventureGroups)

      const generatedChecklistItems = generateChecklistFromVentures(venturesData)
      setChecklistItems(generatedChecklistItems)

      console.log(`âœ… Successfully loaded ${transformedItems.length} due diligence items from ${venturesData.length} ventures`)
      console.log(`âœ… Generated ${generatedChecklistItems.length} checklist items`)
    } catch (err) {
      console.error("âŒ Error fetching due diligence data:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to load due diligence data: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchDueDiligenceData()
  }, [fetchDueDiligenceData])

  const {
    filteredItems,
    paginatedItems,
    totalPages,
    startIndex,
    endIndex
  } = useMemo(() => filterSortPaginateItems(dueDiligenceItems, {
    searchTerm,
    selectedCategory,
    selectedStage,
    selectedStatus,
    selectedPriority,
    dateRange,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage
  }), [
    currentPage,
    dateRange,
    dueDiligenceItems,
    itemsPerPage,
    searchTerm,
    selectedCategory,
    selectedPriority,
    selectedStage,
    selectedStatus,
    sortBy,
    sortOrder
  ])

  const handleViewItem = (item: DueDiligenceItem) => {
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleEditItem = (item: DueDiligenceItem) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  const handleCommentItem = (item: DueDiligenceItem) => {
    alert(`Opening comments for ${item.company} - ${item.category} review`)
  }

  const handleMoreActions = (item: DueDiligenceItem) => {
    const actions = [
      "Assign to team member",
      "Change priority",
      "Update due date",
      "Archive item",
      "Duplicate for other venture"
    ]
    const selectedAction = prompt(`Choose action for ${item.company}:\n${actions.map((action, index) => `${index + 1}. ${action}`).join("\n")}`)
    if (selectedAction) {
      alert(`Action selected: ${actions[parseInt(selectedAction) - 1] || "Invalid selection"}`)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewVentureDetails = (ventureName: string) => {
    setSelectedVentureForDetails(ventureName)
    setViewMode("items")
    setSearchTerm(ventureName)
    setCurrentPage(1)
  }

  const handleBackToVentures = () => {
    setSelectedVentureForDetails(null)
    setViewMode("ventures")
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedStage("all")
    setSelectedStatus("all")
    setSelectedPriority("all")
    setDateRange({ from: "", to: "" })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedStage("all")
    setSelectedStatus("all")
    setSelectedPriority("all")
    setDateRange({ from: "", to: "" })
  }

  const openReportConfig = (reportType: string) => {
    setSelectedReportType(reportType)
    setReportSections(getDefaultReportSections(reportType))
    setIsReportConfigOpen(true)
  }

  const generateCustomReport = async () => {
    setGeneratingReport(selectedReportType)
    setIsReportConfigOpen(false)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const reportContent = generateCustomizedReportContent(selectedReportType, reportSections, selectedVenture, reportFormat)
      const filename = `${selectedReportType}-dd-report-${new Date().toISOString().split("T")[0]}.${reportFormat === "pdf" ? "pdf" : "txt"}`

      downloadReport(reportContent, filename, reportFormat)
    } catch (error) {
      console.error("Report generation failed:", error)
    } finally {
      setGeneratingReport(null)
    }
  }

  const handleNewDueDiligence = () => {
    setIsNewDDDialogOpen(true)
  }

  return {
    ventures,
    dueDiligenceItems,
    venturesDDs,
    checklistItems,
    loading,
    error,
    fetchDueDiligenceData,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStage,
    setSelectedStage,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    showAdvancedFilters,
    setShowAdvancedFilters,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    selectedVentureForDetails,
    setSelectedVentureForDetails,
    currentPage,
    itemsPerPage,
    selectedItem,
    selectedItems,
    setSelectedItems,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isNewDDDialogOpen,
    setIsNewDDDialogOpen,
    isReportConfigOpen,
    setIsReportConfigOpen,
    selectedReportType,
    reportSections,
    setReportSections,
    selectedVenture,
    setSelectedVenture,
    reportFormat,
    setReportFormat,
    generatingReport,
    filteredItems,
    paginatedItems,
    totalPages,
    startIndex,
    endIndex,
    handleViewItem,
    handleEditItem,
    handleCommentItem,
    handleMoreActions,
    handlePageChange,
    handleViewVentureDetails,
    handleBackToVentures,
    handleNewDueDiligence,
    openReportConfig,
    generateCustomReport,
    clearFilters
  }
}
