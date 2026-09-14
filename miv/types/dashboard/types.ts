import type React from "react"

export type DashboardTimeframe = "24h" | "7d" | "30d" | "90d" | "1y" | "custom" | string

export interface DashboardFilters {
  sector?: string
  stage?: string
  country?: string
}

export interface DashboardVenture {
  id: string
  name?: string | null
  sector?: string | null
  stage?: string | null
  status?: string | null
  location?: string | null
  fundingRaised?: number | null
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
  aiAnalysis?: unknown
  gedsiMetricsSummary?: unknown
  gedsiMetrics?: DashboardGedsiMetric[]
  [key: string]: unknown
}

export interface DashboardGedsiMetric {
  id?: string
  ventureId?: string | null
  category?: string | null
  status?: string | null
  currentValue?: number | null
  targetValue?: number | null
  [key: string]: unknown
}

export interface DashboardIrisMetric {
  code?: string
  name?: string
  description?: string
  unit?: string
  gedsiSuggestion?: string
  [key: string]: unknown
}

export interface DashboardUser {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
  organization?: string | null
  emailVerified?: string | Date | null
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

export interface DashboardDataState {
  ventures: DashboardVenture[]
  gedsiMetrics: DashboardGedsiMetric[]
  irisMetrics: DashboardIrisMetric[]
  users: DashboardUser[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface DashboardGedsiAnalytics {
  averageGedsiScore: number
  gedsiComplianceRate: number
}

export interface DashboardPortfolioSummary {
  totalVentures: number
  totalCapital: number
  successRate: number
  averageCapitalPerVenture: number
  stageDistribution: Record<string, number>
}

export interface DashboardMetricCard {
  title: string
  value: string | number
  change: number
  changeType: "increase" | "decrease" | "neutral"
  icon: React.ReactNode
  color: string
  subtitle?: string
}

export interface DashboardChartWidget {
  id: string
  title: string
  type: "line" | "bar" | "pie" | "area"
  data: Record<string, unknown>[]
  height?: number
  span?: number
  options?: Record<string, unknown>
}

export interface DashboardVentureRow extends Record<string, unknown> {
  id: string
  name: string
  sector: string
  stage: string
  country: string
  gedsiScore: number
  capitalNeeded: string
  status: string
  lastUpdate: string
}

export interface AdvancedFilterValue {
  field: string
  operator: string
  value: unknown
}
