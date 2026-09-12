import type { Dispatch, SetStateAction } from "react"

export type DueDiligencePriority = "high" | "medium" | "low"

export type DueDiligenceStatus = "not_started" | "in_progress" | "completed" | "blocked"

export type DueDiligenceViewMode = "ventures" | "items"

export type SortOrder = "asc" | "desc"

export type ReportSections = Record<string, boolean>

export type DateRange = {
  from: string
  to: string
}

export interface DueDiligenceItem {
  id: string
  company: string
  stage: string
  category: string
  assignedTo: string
  dueDate: string
  completion: number
  priority: DueDiligencePriority
  status: DueDiligenceStatus
  lastUpdated: string
  documents: number
  comments: number
}

export interface VentureDD {
  ventureId: string
  ventureName: string
  overallProgress: number
  overallStatus: DueDiligenceStatus
  priority: DueDiligencePriority
  leadAnalyst: string
  dueDate: string
  lastActivity: string
  categories: Record<string, DueDiligenceItem>
  totalDocuments: number
  totalComments: number
  riskLevel: DueDiligencePriority
  gedsiScore?: number
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  category: string
  completed: boolean
  assignedTo: string
  dueDate: string
  priority: DueDiligencePriority
}

export interface VenturePerson {
  name?: string | null
}

export interface VentureCounts {
  documents?: number
  activities?: number
}

export interface VentureOperationalReadiness {
  legalStructure?: boolean | null
  businessPlan?: boolean | null
  [key: string]: unknown
}

export interface DueDiligenceVenture {
  id: string
  name: string
  stage?: string | null
  assignedTo?: VenturePerson | null
  createdBy?: VenturePerson | null
  _count?: VentureCounts | null
  createdAt?: string | null
  updatedAt?: string | null
  revenue?: number | null
  fundingRaised?: unknown
  lastValuation?: unknown
  operationalReadiness?: VentureOperationalReadiness | null
  contactEmail?: string | null
  contactPhone?: string | null
  website?: string | null
  teamSize?: number | null
  pitchSummary?: string | null
  targetMarket?: string | null
  revenueModel?: string | null
  gedsiMetrics?: unknown[] | null
  gedsiScore?: number | null
  inclusionFocus?: unknown
  founderTypes?: unknown
  aiAnalysis?: unknown
  gedsiMetricsSummary?: unknown
  [key: string]: unknown
}

export interface DueDiligenceFilters {
  searchTerm: string
  selectedCategory: string
  selectedStage: string
  selectedStatus: string
  selectedPriority: string
  dateRange: DateRange
  sortBy: string
  sortOrder: SortOrder
  currentPage: number
  itemsPerPage: number
}

export interface PaginatedDueDiligenceItems {
  filteredItems: DueDiligenceItem[]
  paginatedItems: DueDiligenceItem[]
  totalPages: number
  startIndex: number
  endIndex: number
}

export interface ReportSectionOption {
  id: string
  label: string
  default: boolean
}

export type ReportType = "financial" | "legal" | "technical" | "market"

export type ReportSectionOptions = Record<ReportType, ReportSectionOption[]>

export interface UseDueDiligenceResult {
  ventures: DueDiligenceVenture[]
  dueDiligenceItems: DueDiligenceItem[]
  venturesDDs: VentureDD[]
  checklistItems: ChecklistItem[]
  loading: boolean
  error: string | null
  fetchDueDiligenceData: () => Promise<void>
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  selectedCategory: string
  setSelectedCategory: Dispatch<SetStateAction<string>>
  selectedStage: string
  setSelectedStage: Dispatch<SetStateAction<string>>
  selectedStatus: string
  setSelectedStatus: Dispatch<SetStateAction<string>>
  selectedPriority: string
  setSelectedPriority: Dispatch<SetStateAction<string>>
  showAdvancedFilters: boolean
  setShowAdvancedFilters: Dispatch<SetStateAction<boolean>>
  dateRange: DateRange
  setDateRange: Dispatch<SetStateAction<DateRange>>
  sortBy: string
  setSortBy: Dispatch<SetStateAction<string>>
  sortOrder: SortOrder
  setSortOrder: Dispatch<SetStateAction<SortOrder>>
  viewMode: DueDiligenceViewMode
  setViewMode: Dispatch<SetStateAction<DueDiligenceViewMode>>
  selectedVentureForDetails: string | null
  setSelectedVentureForDetails: Dispatch<SetStateAction<string | null>>
  currentPage: number
  itemsPerPage: number
  selectedItem: DueDiligenceItem | null
  selectedItems: string[]
  setSelectedItems: Dispatch<SetStateAction<string[]>>
  isViewDialogOpen: boolean
  setIsViewDialogOpen: Dispatch<SetStateAction<boolean>>
  isEditDialogOpen: boolean
  setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>
  isNewDDDialogOpen: boolean
  setIsNewDDDialogOpen: Dispatch<SetStateAction<boolean>>
  isReportConfigOpen: boolean
  setIsReportConfigOpen: Dispatch<SetStateAction<boolean>>
  selectedReportType: string
  reportSections: ReportSections
  setReportSections: Dispatch<SetStateAction<ReportSections>>
  selectedVenture: string
  setSelectedVenture: Dispatch<SetStateAction<string>>
  reportFormat: string
  setReportFormat: Dispatch<SetStateAction<string>>
  generatingReport: string | null
  filteredItems: DueDiligenceItem[]
  paginatedItems: DueDiligenceItem[]
  totalPages: number
  startIndex: number
  endIndex: number
  handleViewItem: (item: DueDiligenceItem) => void
  handleEditItem: (item: DueDiligenceItem) => void
  handleCommentItem: (item: DueDiligenceItem) => void
  handleMoreActions: (item: DueDiligenceItem) => void
  handlePageChange: (page: number) => void
  handleViewVentureDetails: (ventureName: string) => void
  handleBackToVentures: () => void
  handleNewDueDiligence: () => void
  openReportConfig: (reportType: string) => void
  generateCustomReport: () => Promise<void>
  clearFilters: () => void
}
