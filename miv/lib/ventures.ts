export const VENTURE_STAGES = [
  "INTAKE",
  "SCREENING",
  "DUE_DILIGENCE",
  "INVESTMENT_READY",
  "FUNDED",
  "EXITED",
  "SEED",
  "SERIES_A",
  "SERIES_B",
  "SERIES_C",
] as const

export const VENTURE_STATUSES = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const

export type VentureStage = (typeof VENTURE_STAGES)[number]
export type VentureStatus = (typeof VENTURE_STATUSES)[number]
export type VentureFilterValue = "all" | string

export interface VentureUserSummary {
  name?: string
  email?: string
}

export interface VentureRecord {
  id: string
  name: string
  description?: string | null
  pitchSummary?: string | null
  sector?: string | null
  location?: string | null
  stage?: VentureStage | string | null
  status?: VentureStatus | string | null
  fundingRaised?: number | null
  fundingAmount?: number | null
  teamSize?: number | string | null
  foundingYear?: number | null
  foundedYear?: number | null
  gedsiScore?: number | null
  createdAt?: string
  updatedAt?: string
  createdBy?: VentureUserSummary | null
  assignedTo?: VentureUserSummary | null
  _count?: {
    documents?: number | null
    activities?: number | null
    capitalActivities?: number | null
  } | null
}

export interface VenturesApiResponse {
  ventures: VentureRecord[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  isMobile?: boolean
}

export interface VentureFiltersState {
  search: string
  status: VentureFilterValue
  stage: VentureFilterValue
  sector: VentureFilterValue
}

export interface VentureSummary {
  totalVentures: number
  totalFunding: number
  totalTeamMembers: number
  averageGedsiScore: number
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export class VentureApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = "VentureApiError"
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const readErrorMessage = async (response: Response) => {
  try {
    const payload: unknown = await response.json()
    if (isRecord(payload) && typeof payload.error === "string") {
      return payload.error
    }
    if (isRecord(payload) && typeof payload.message === "string") {
      return payload.message
    }
  } catch {
    const text = await response.text().catch(() => "")
    if (text.trim()) {
      return text.trim()
    }
  }

  return `Venture request failed with status ${response.status}`
}

export const requestVentures = async (fetcher: Fetcher = fetch): Promise<VenturesApiResponse> => {
  const response = await fetcher("/api/ventures?limit=100", { credentials: "include" })

  if (!response.ok) {
    throw new VentureApiError(await readErrorMessage(response), response.status)
  }

  const payload: unknown = await response.json()
  const ventures = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.ventures)
      ? payload.ventures
      : null

  if (!ventures) {
    throw new VentureApiError("The ventures API returned an invalid response.")
  }

  if (!ventures.every(isRecord)) {
    throw new VentureApiError("The ventures API returned malformed venture records.")
  }

  return {
    ventures: ventures.map(normalizeVenture),
    pagination: isRecord(payload) && isRecord(payload.pagination)
      ? {
          page: Number(payload.pagination.page ?? 1),
          limit: Number(payload.pagination.limit ?? ventures.length),
          total: Number(payload.pagination.total ?? ventures.length),
          pages: Number(payload.pagination.pages ?? 1),
        }
      : undefined,
    isMobile: isRecord(payload) && typeof payload.isMobile === "boolean" ? payload.isMobile : undefined,
  }
}

export const normalizeVenture = (value: Record<string, unknown>): VentureRecord => ({
  id: String(value.id ?? ""),
  name: String(value.name ?? "Untitled venture"),
  description: asOptionalString(value.description),
  pitchSummary: asOptionalString(value.pitchSummary),
  sector: asOptionalString(value.sector),
  location: asOptionalString(value.location),
  stage: asOptionalString(value.stage),
  status: asOptionalString(value.status),
  fundingRaised: asOptionalNumber(value.fundingRaised),
  fundingAmount: asOptionalNumber(value.fundingAmount),
  teamSize: asOptionalNumber(value.teamSize) ?? asOptionalString(value.teamSize),
  foundingYear: asOptionalNumber(value.foundingYear),
  foundedYear: asOptionalNumber(value.foundedYear),
  gedsiScore: asOptionalNumber(value.gedsiScore),
  createdAt: asOptionalString(value.createdAt) ?? undefined,
  updatedAt: asOptionalString(value.updatedAt) ?? undefined,
  createdBy: isRecord(value.createdBy) ? toUserSummary(value.createdBy) : null,
  assignedTo: isRecord(value.assignedTo) ? toUserSummary(value.assignedTo) : null,
  _count: isRecord(value._count)
    ? {
        documents: asOptionalNumber(value._count.documents),
        activities: asOptionalNumber(value._count.activities),
        capitalActivities: asOptionalNumber(value._count.capitalActivities),
      }
    : null,
})

export const filterVentures = (ventures: VentureRecord[], filters: VentureFiltersState) => {
  const search = filters.search.trim().toLowerCase()

  return ventures.filter((venture) => {
    const haystack = [
      venture.name,
      getVentureDescription(venture),
      venture.sector,
      venture.location,
      venture.createdBy?.name,
      venture.createdBy?.email,
      venture.assignedTo?.name,
      venture.assignedTo?.email,
    ]
      .map((value) => asText(value, "").toLowerCase())
      .join(" ")

    const matchesSearch = !search || haystack.includes(search)
    const matchesStatus = filters.status === "all" || venture.status === filters.status
    const matchesStage = filters.stage === "all" || venture.stage === filters.stage
    const matchesSector = filters.sector === "all" || asText(venture.sector, "").toLowerCase() === filters.sector.toLowerCase()

    return matchesSearch && matchesStatus && matchesStage && matchesSector
  })
}

export const summarizeVentures = (ventures: VentureRecord[]): VentureSummary => {
  const totalGedsiScore = ventures.reduce((sum, venture) => sum + getGedsiScore(venture), 0)

  return {
    totalVentures: ventures.length,
    totalFunding: ventures.reduce((sum, venture) => sum + getFundingAmount(venture), 0),
    totalTeamMembers: ventures.reduce((sum, venture) => sum + getTeamSize(venture), 0),
    averageGedsiScore: ventures.length > 0 ? Math.round(totalGedsiScore / ventures.length) : 0,
  }
}

export const getUniqueSectors = (ventures: VentureRecord[]) =>
  Array.from(new Set(ventures.map((venture) => asText(venture.sector, "").trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  )

export const hasActiveVentureFilters = (filters: VentureFiltersState) =>
  Boolean(filters.search.trim()) || filters.status !== "all" || filters.stage !== "all" || filters.sector !== "all"

export const getVentureDetailsPath = (ventureId: string) => `/dashboard/ventures/${ventureId}`

export const asText = (value: string | null | undefined, fallback = "Not specified") => value?.trim() || fallback

export const getVentureDescription = (venture: VentureRecord) => asText(venture.description || venture.pitchSummary, "")

export const getFundingAmount = (venture: VentureRecord) => Number(venture.fundingRaised ?? venture.fundingAmount ?? 0)

export const getTeamSize = (venture: VentureRecord) => Number(venture.teamSize ?? 0)

export const getFoundedYear = (venture: VentureRecord) => venture.foundingYear ?? venture.foundedYear ?? "N/A"

export const getGedsiScore = (venture: VentureRecord) => Math.max(0, Math.min(100, Number(venture.gedsiScore ?? 0)))

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const formatLabel = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")

const asOptionalString = (value: unknown) => (typeof value === "string" ? value : null)

const asOptionalNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value)
  }

  return null
}

const toUserSummary = (value: Record<string, unknown>): VentureUserSummary => ({
  name: asOptionalString(value.name) ?? undefined,
  email: asOptionalString(value.email) ?? undefined,
})
