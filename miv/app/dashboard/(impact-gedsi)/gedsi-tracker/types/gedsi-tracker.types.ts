export type GedsiCategory = "Gender" | "Disability" | "Social Inclusion" | "Cross-cutting"

export type GedsiMetricStatus = "Not Started" | "In Progress" | "Verified" | "Overdue"

export interface GEDSIMetric {
  id: string
  ventureId: string
  ventureName: string
  metricCode: string
  metricName: string
  category: GedsiCategory
  targetValue: number
  currentValue: number
  unit: string
  status: GedsiMetricStatus
  verificationDate?: string
  notes?: string
  lastUpdated: string
}

export interface Venture {
  id: string
  name: string
  sector: string
  location: string
  gedsiScore: number
  status: string
  founderTypes: string[]
  inclusionFocus?: string
  washingtonShortSet?: unknown
  socialImpactScore?: number | null
  gedsiComplianceRate?: number | null
  totalBeneficiaries?: number | null
  jobsCreated?: number | null
  womenEmpowered?: number | null
  disabilityInclusive?: number | null
  youthEngaged?: number | null
  calculatedAt?: string | null
}

export interface GedsiOverviewStats {
  total: number
  verified: number
  inProgress: number
  overdue: number
  completionRate: number
}

export interface GedsiCategoryStats {
  category: GedsiCategory
  total: number
  verified: number
  completionRate: number
}

export interface GedsiVenturePerformance {
  ventureId: string
  ventureName: string
  totalMetrics: number
  verifiedMetrics: number
  completionRate: number
}

export interface GedsiInsightSummary {
  trendAnalysis?: string
  recommendations?: string
  riskAlerts?: string
}

export interface GedsiTrackerState {
  metrics: GEDSIMetric[]
  ventures: Venture[]
  loading: boolean
  selectedVenture: string
  setSelectedVenture: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedStatus: string
  setSelectedStatus: (value: string) => void
  showAddMetric: boolean
  setShowAddMetric: (value: boolean) => void
  aiInsights: GedsiInsightSummary | null
  isExporting: boolean
  exportData: () => void
  filteredMetrics: GEDSIMetric[]
  overviewStats: GedsiOverviewStats
  categoryStats: GedsiCategoryStats[]
  venturePerformance: GedsiVenturePerformance[]
  handleAddMetric: (metricData: Partial<GEDSIMetric>) => Promise<void>
  handleUpdateMetric: (metricId: string, updates: Partial<GEDSIMetric>) => Promise<void>
}
