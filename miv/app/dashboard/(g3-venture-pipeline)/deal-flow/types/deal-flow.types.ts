import type { Dispatch, SetStateAction } from "react"

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
export type JsonRecord = { [key: string]: JsonValue }

export type RawVentureStage =
  | "INTAKE"
  | "SCREENING"
  | "DUE_DILIGENCE"
  | "INVESTMENT_READY"
  | "FUNDED"
  | "EXITED"
  | "SEED"
  | "SERIES_A"
  | "SERIES_B"
  | "SERIES_C"
  | string

export type RawVentureStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED" | string

export type DealStage =
  | "Intake"
  | "Screening"
  | "Due Diligence"
  | "Investment Ready"
  | "Funded"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Exited"

export type DealStatus = "active" | "paused" | "closed" | "lost"
export type DealRiskLevel = "low" | "medium" | "high"
export type ViewMode = "overview" | "pipeline" | "impact" | "insights"
export type SortField = "api-order"
export type SortDirection = "none" | "asc" | "desc"

export interface SortState {
  field: SortField
  direction: SortDirection
}

export interface RawUserSummary {
  name?: string | null
  email?: string | null
}

export interface RawGedsIMetric {
  id?: string
  metricCode?: string
  metricName?: string
  category?: string
  targetValue?: number | null
  currentValue?: number | null
  value?: number | null
  unit?: string
  status?: string
}

export interface RawVentureMetrics {
  jobsCreated?: number | null
  communitiesServed?: number | null
  disabilityInclusive?: boolean | null
}

export interface RawVentureData {
  id: string
  name?: string | null
  description?: string | null
  sector?: string | null
  location?: string | null
  stage?: RawVentureStage | null
  status?: RawVentureStatus | null
  updatedAt?: string | Date | null
  fundingRaised?: number | null
  revenue?: number | null
  teamSize?: number | string | null
  founderTypes?: string | string[] | null
  inclusionFocus?: string | null
  stgGoals?: JsonValue
  gedsiGoals?: JsonValue
  sustainabilityGoals?: JsonValue
  gedsiMetrics?: RawGedsIMetric[]
  gedsiMetricsSummary?: JsonValue
  aiAnalysis?: JsonValue
  operationalReadiness?: JsonRecord | null
  capitalReadiness?: JsonRecord | null
  totalBeneficiaries?: number | null
  jobsCreated?: number | null
  womenEmpowered?: number | null
  disabilityInclusive?: number | null
  metrics?: RawVentureMetrics | null
  createdBy?: RawUserSummary | null
  assignedTo?: RawUserSummary | null
}

export interface VentureApiResponse {
  ventures?: RawVentureData[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  isMobile?: boolean
  error?: string
}

export interface DealInsights {
  riskLevel: DealRiskLevel
  recommendation: string
  keyStrengths: string[]
  areasForImprovement: string[]
}

export interface DealMetrics {
  jobsCreated: number
  communitiesServed: number
  womenLeadership: number
  disabilityInclusive: boolean
}

export interface Deal {
  id: string
  company: string
  stage: DealStage
  sector: string
  location: string
  dealSize: string
  probability: number
  expectedClose: string
  team: string[]
  lastActivity: string
  status: DealStatus
  gedsiScore: number
  impactScore: number
  readinessScore: number
  founderType: string[]
  inclusionFocus: string
  sustainabilityGoals: string[]
  aiInsights: DealInsights
  metrics: DealMetrics
}

export interface DealFlowFilters {
  searchTerm: string
  selectedStage: DealStage | "all"
  selectedSector: string
  selectedStatus: DealStatus | "all"
  selectedFounderType: string
}

export interface DealFormData {
  company: string
  dealSize: string
  sector: string
  location: string
  stage: DealStage | ""
  expectedClose: string
  inclusionFocus: string
  founderTypes: string[]
  gedsiScore: string
  impactScore: string
  readinessScore: string
  jobsCreated: string
  communitiesServed: string
  womenLeadership: string
  disabilityInclusive: "true" | "false" | ""
  teamMembers: string
}

export interface SummaryMetrics {
  totalDeals: number
  activeDeals: number
  totalValue: number
  avgGedsiScore: number
  avgImpactScore: number
  totalJobsCreated: number
  totalCommunitiesServed: number
  womenLedDeals: number
  disabilityInclusiveDeals: number
  fundedDeals: number
  successRate: string
}

export interface PipelineTransition {
  from: DealStage
  to: DealStage
  rate: string
  deals: number
}

export interface StageGroup {
  stage: DealStage
  deals: Deal[]
  nextStageDeals: Deal[]
  conversionRate: string | null
  isBottleneck: boolean
  isHighConversion: boolean
  recentMovements: number
}

export interface StageDealsDialogState {
  open: boolean
  stage: DealStage | ""
  deals: Deal[]
}

export interface DealFlowActions {
  refreshDeals: () => Promise<void>
  setFilters: Dispatch<SetStateAction<DealFlowFilters>>
  setActiveView: (view: ViewMode) => void
  setSelectedStageForFilter: (stage: DealStage | null) => void
  setHoveredStage: (stage: DealStage | null) => void
  handleViewDeal: (deal: Deal) => void
  handleEditDeal: (deal: Deal) => void
  handleAddNewDeal: () => void
  handleExportPipeline: () => Promise<void>
  handleStageClick: (stage: DealStage, stageDeals: Deal[]) => void
  handleStageFilter: (stage: DealStage) => void
  closeViewDialog: (open: boolean) => void
  closeEditDialog: (open: boolean) => void
  closeAddDealDialog: (open: boolean) => void
  setStageDealsDialog: Dispatch<SetStateAction<StageDealsDialogState>>
}

export interface DealFlowState {
  rawVentures: RawVentureData[]
  deals: Deal[]
  filteredDeals: Deal[]
  stageGroups: StageGroup[]
  summary: SummaryMetrics
  bottlenecks: PipelineTransition[]
  highPerformers: PipelineTransition[]
  filters: DealFlowFilters
  sort: SortState
  activeView: ViewMode
  selectedDeal: Deal | null
  loading: boolean
  error: string | null
  isExporting: boolean
  selectedStageForFilter: DealStage | null
  hoveredStage: DealStage | null
  dialogs: {
    viewOpen: boolean
    editOpen: boolean
    addOpen: boolean
    stageDeals: StageDealsDialogState
  }
  actions: DealFlowActions
}
