import type { DealStage, DealStatus, RawVentureStage } from "../types/deal-flow.types"

export const DEAL_STAGES = [
  "Intake",
  "Screening",
  "Due Diligence",
  "Investment Ready",
  "Funded",
  "Series A",
  "Series B",
  "Series C",
  "Exited",
] as const satisfies readonly DealStage[]

export const PIPELINE_BOARD_STAGES = DEAL_STAGES.slice(0, 6) as DealStage[]

export const SECTORS = [
  "CleanTech",
  "Agriculture",
  "FinTech",
  "Healthcare",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Services",
  "Technology",
] as const

export const FOUNDER_TYPES = [
  "women-led",
  "youth-led",
  "disability-inclusive",
  "rural-focus",
  "indigenous-led",
  "refugee-led",
  "veteran-led",
] as const

export const DEAL_STATUSES = ["active", "paused", "closed", "lost"] as const satisfies readonly DealStatus[]

export const STAGE_MAP: Record<string, DealStage> = {
  INTAKE: "Intake",
  SCREENING: "Screening",
  DUE_DILIGENCE: "Due Diligence",
  INVESTMENT_READY: "Investment Ready",
  FUNDED: "Funded",
  SEED: "Funded",
  SERIES_A: "Series A",
  SERIES_B: "Series B",
  SERIES_C: "Series C",
  EXITED: "Exited",
}

export const STATUS_MAP: Record<string, DealStatus> = {
  ACTIVE: "active",
  INACTIVE: "paused",
  ARCHIVED: "closed",
}

export const STAGE_PROBABILITIES: Record<string, number> = {
  INTAKE: 20,
  SCREENING: 35,
  DUE_DILIGENCE: 65,
  INVESTMENT_READY: 85,
  FUNDED: 100,
  SEED: 80,
  SERIES_A: 85,
  SERIES_B: 90,
  SERIES_C: 95,
}

export const DEFAULT_FILTERS = {
  searchTerm: "",
  selectedStage: "all",
  selectedSector: "all",
  selectedStatus: "all",
  selectedFounderType: "all",
} as const

export const DEFAULT_SORT = {
  field: "api-order",
  direction: "none",
} as const

export const EXPORT_COLUMNS = [
  "Company",
  "Stage",
  "Sector",
  "Deal Size",
  "GEDSI Score",
  "Impact Score",
  "Location",
  "Inclusion Focus",
] as const

export function isKnownRawStage(stage: string | null | undefined): stage is RawVentureStage {
  return typeof stage === "string"
}
