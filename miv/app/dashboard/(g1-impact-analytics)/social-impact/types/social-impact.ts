export type GedsiCategory = "GENDER" | "DISABILITY" | "SOCIAL_INCLUSION" | "CROSS_CUTTING"
export type GedsiStatus = "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "COMPLETED"

export interface GedsiMetric {
  id: string
  ventureId: string
  metricCode: string
  metricName: string
  category: GedsiCategory
  currentValue: number | null
  targetValue: number | null
  unit: string | null
  status: GedsiStatus
}

export interface SocialImpactVenture {
  id: string
  name: string | null
  sector: string | null
  location: string | null
  stage: string | null
  status: string | null
  teamSize: number | null
  inclusionFocus: string | null
  founderTypes: string | string[] | null
  gedsiMetrics?: GedsiMetric[] | null
  socialImpactScore?: number | null
  totalBeneficiaries?: number | null
  jobsCreated?: number | null
  womenEmpowered?: number | null
  disabilityInclusive?: number | null
  youthEngaged?: number | null
}

export interface VenturesResponse {
  ventures?: SocialImpactVenture[]
  pagination?: { page: number; limit: number; total: number; pages: number }
  isMobile?: boolean
}

export interface SocialImpactTotals {
  totalBeneficiaries: number
  jobsCreated: number
  locationsRepresented: number
  womenEmpowered: number
  disabilityInclusive: number
  youthEngaged: number
}

export interface SocialImpactFilters {
  search: string
  category: string
  status: string
}
