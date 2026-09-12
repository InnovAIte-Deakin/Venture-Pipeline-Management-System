// Feature-local types for the Advanced Reports page.
// See ../README.md for the full behavioural analysis this file is derived from.

import type { Dispatch, DragEvent, SetStateAction } from "react"

// ---------------------------------------------------------------------------
// API response types (raw shapes returned by the endpoints this feature calls)
// ---------------------------------------------------------------------------

/** Prisma `VentureStage` enum values, as returned by `/api/ventures`. */
export type VentureStage =
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

/**
 * Fields this feature actually reads from a venture. The real API response
 * includes many more fields (relations, scores, JSON blobs) — intentionally
 * omitted here since nothing in this feature touches them.
 */
export interface VentureApiResponseItem {
  id: string
  sector: string | null
  stage: VentureStage
  fundingRaised: number | null
  createdAt: string
}

export interface VenturesApiResponse {
  ventures: VentureApiResponseItem[]
  pagination: { page: number; limit: number; total: number; pages: number }
  isMobile: boolean
}

/** Prisma `GEDSICategory` enum values, as returned by `/api/gedsi-metrics`. */
export type GEDSICategory = "GENDER" | "DISABILITY" | "SOCIAL_INCLUSION" | "CROSS_CUTTING"

/** Prisma `MetricStatus` enum values, as returned by `/api/gedsi-metrics`. */
export type MetricStatus = "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "COMPLETED"

export interface GedsiMetricApiResponseItem {
  id: string
  category: GEDSICategory
  status: MetricStatus
}

export interface GedsiMetricsApiResponse {
  metrics: GedsiMetricApiResponseItem[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

/** Prisma `UserRole` enum values, as returned by `/api/users`. */
export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "ANALYST"
  | "USER"
  | "VENTURE_MANAGER"
  | "GEDSI_ANALYST"
  | "CAPITAL_FACILITATOR"
  | "EXTERNAL_STAKEHOLDER"

/**
 * NOTE: the real `User` model/API response has no `lastLogin` field. The
 * original page nonetheless read `u.lastLogin`, which was therefore always
 * `undefined` — see `calculateActiveUsers` in `lib/report-calculations.ts`.
 * That (nonexistent) field is intentionally NOT declared here.
 */
export interface UserApiResponseItem {
  id: string
  name: string | null
  email: string
  role: UserRole
}

export interface UsersApiResponse {
  users: UserApiResponseItem[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

/**
 * Real shape of `GET /api/analytics`. This feature fetches it but — per a
 * confirmed, preserved bug — never successfully reads from it (the original
 * code expected a top-level `analytics` array that does not exist on this
 * response). Documented in full for honesty/future use; only the discard
 * behaviour is reproduced today.
 */
export interface AnalyticsApiResponse {
  period: string
  dateRange: { start: string; end: string }
  overview: {
    totalVentures: number
    venturesInPeriod: number
    totalUsers: number
    activeUsers: number
    gedsiComplianceRate: number
    userEngagementRate: number
    workflowAutomationRate: number
    workflowSuccessRate: number
  }
  isMobile: boolean
  performance: {
    trends: { week: string; ventures: number; gedsiScore: number; users: number; conversionRate: number }[]
    activityBreakdown: Record<string, number>
  }
  workflows: {
    total: number
    active: number
    successRate: number
  }
  insights: {
    topSectors: { sector: string; ventures: number; successRate: number; totalCapital: number }[]
  }
}

/**
 * The real `GET /api/workflows` response — array is under `results`, and
 * each workflow has `isActive: boolean`, not `status`.
 */
export interface WorkflowApiResponseItem {
  id: string
  name: string
  isActive: boolean
}

export interface WorkflowsApiResponse {
  results: WorkflowApiResponseItem[]
  total: number
  page: number
  limit: number
}

/**
 * Shape the ORIGINAL page code assumed workflows had (`.status`), which does
 * not match the real `Workflow` model (no `status` field — see
 * `WorkflowApiResponseItem`/`isActive` above). Kept as its own type so the
 * mismatch is visible at the type level instead of silently coerced away.
 * The array this type describes is always empty in practice (see the
 * `/api/workflows` key-mismatch bug preserved in `use-advanced-reports-data`).
 */
export interface WorkflowPageAssumedShape {
  status?: "ACTIVE" | "COMPLETED" | string
}

// ---------------------------------------------------------------------------
// Domain / presentation types (this feature's own vocabulary — UI-only,
// not backed by any Prisma model or persisted enum)
// ---------------------------------------------------------------------------

export type ReportTypeValue =
  | "venture-performance"
  | "gedsi-impact"
  | "financial-analytics"
  | "workflow-analysis"
  | "user-analytics"
  | "geographic-distribution"
  | "sector-analysis"
  | "compliance-report"
  | "risk-assessment"
  | "custom"
  /** Set only by the fatal-fetch-failure fallback report; not a selectable generator option. */
  | "system-error"

export type ReportStatus = "draft" | "published" | "archived"

export type ReportStatusFilter = "all" | ReportStatus

export type ChartType = "bar" | "line" | "pie" | "area"

export type ScheduleFrequency = "daily" | "weekly" | "monthly" | "quarterly"

export type ExportFormat = "pdf" | "excel" | "csv"

/**
 * Mirrors the original `dateRange` state's actual runtime shape: the two
 * native date inputs set `from`/`to` independently via
 * `setDateRange(prev => ({ ...prev, from: ... }))`, so a partially-filled
 * value (only `from` or only `to` set) is a real, reachable state — not a
 * mistake to "fix" by making both fields required.
 */
export interface ReportDateRange {
  from?: Date
  to?: Date
}

/** Heterogeneous bag of report metadata/filter values — genuinely mixed-shape today (strings, numbers, arrays, nested objects). */
export type ReportFilters = Record<string, unknown>

export interface Report {
  id: string
  name: string
  type: ReportTypeValue | string
  description: string
  lastGenerated: string
  status: ReportStatus
  metrics: string[]
  filters: ReportFilters
  schedule?: string
  isScheduled?: boolean
  scheduleFrequency?: ScheduleFrequency
  nextRun?: string
  recipients?: string[]
  autoGenerate?: boolean
}

/** Alias for the report object produced by `generateReport` — same shape as a seeded `Report`, since the original workflow never diverges the two. */
export type GeneratedReport = Report

export type WidgetType = "chart" | "metric" | "table" | "list"

export interface WidgetPosition {
  x: number
  y: number
  w: number
  h: number
}

export interface VenturePerformancePoint {
  month: string
  ventures: number
  funding: number
  success: number
}

export interface SectorDistributionSlice {
  name: string
  value: number
  color: string
}

export interface DashboardMetricWidgetData {
  value: number
  change: string
  trend: "up" | "down" | "neutral"
}

/** Chart widgets carry one of the two real chart-data shapes this feature produces; canvas-dropped widgets carry an empty object (no real data is ever attached to them — preserved limitation). */
export type WidgetData = VenturePerformancePoint[] | SectorDistributionSlice[] | DashboardMetricWidgetData | Record<string, never>

export type WidgetConfig = Record<string, unknown>

export interface Widget {
  id: string
  type: WidgetType
  title: string
  data: WidgetData
  position: WidgetPosition
  config: WidgetConfig
}

/** The dashboard-builder canvas's dropped-widget list — same shape as `Widget`; named separately to match how the builder talks about it. */
export type DashboardLayoutItem = Widget

export interface Dashboard {
  id: string
  name: string
  description: string
  widgets: Widget[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface AvailableWidgetDefinition {
  id: string
  type: WidgetType
  title: string
  description: string
  iconName: AvailableWidgetIconName
}

export type AvailableWidgetIconName = "BarChart3" | "LineChart" | "PieChart" | "AreaChart" | "FileText" | "AlertTriangle"

export interface ReportTypeOption {
  value: ReportTypeValue
  label: string
  iconName: ReportTypeIconName
}

export type ReportTypeIconName =
  | "TrendingUp"
  | "Users"
  | "DollarSign"
  | "Target"
  | "Globe"
  | "BarChart3"
  | "CheckCircle"
  | "AlertTriangle"
  | "FileText"

export interface ChartTypeOption {
  value: ChartType
  label: string
  iconName: "BarChart3" | "LineChart" | "PieChart" | "AreaChart"
}

// ---------------------------------------------------------------------------
// Report-builder form state
// ---------------------------------------------------------------------------

export interface ReportConfiguration {
  reportName: string
  reportDescription: string
  selectedReportType: ReportTypeValue | ""
  selectedChartType: ChartType | ""
  dateRange: ReportDateRange | null
  selectedMetrics: string[]
  selectedFilters: ReportFilters
  isScheduled: boolean
  scheduleFrequency: ScheduleFrequency
  reportRecipients: string[]
}

export interface ReportListFilterState {
  searchQuery: string
  statusFilter: ReportStatusFilter
}

// ---------------------------------------------------------------------------
// Loading / error / dialog state
// ---------------------------------------------------------------------------

export interface AdvancedReportsRequestState {
  isLoading: boolean
  /** True only when the outer fetch cycle threw (fatal failure) — the one error case the original code distinguished. Per-endpoint non-2xx responses degrade silently and are not tracked here (see README "Loading, Empty, Error, and Success States"). */
  hasFatalError: boolean
}

export interface ScheduleDialogState {
  isOpen: boolean
  reportId: string | null
}

export interface ExportDialogState {
  isOpen: boolean
  reportId: string | null
}

// ---------------------------------------------------------------------------
// Hook return types
// ---------------------------------------------------------------------------

export interface UseAdvancedReportsDataResult {
  reports: Report[]
  setReports: Dispatch<SetStateAction<Report[]>>
  dashboards: Dashboard[]
  setDashboards: Dispatch<SetStateAction<Dashboard[]>>
  ventures: VentureApiResponseItem[]
  gedsiMetrics: GedsiMetricApiResponseItem[]
  users: UserApiResponseItem[]
  requestState: AdvancedReportsRequestState
  refetch: () => void
}

export interface UseReportBuilderResult {
  configuration: ReportConfiguration
  setReportName: (value: string) => void
  setReportDescription: (value: string) => void
  setSelectedReportType: (value: ReportTypeValue | "") => void
  setSelectedChartType: (value: ChartType | "") => void
  setDateRangeFrom: (value: Date) => void
  setDateRangeTo: (value: Date) => void
  toggleMetric: (metric: string, checked: boolean) => void
  setIsScheduled: (value: boolean) => void
  setScheduleFrequency: (value: ScheduleFrequency) => void
  setReportRecipients: (value: string[]) => void
  isValid: boolean
  generateReport: () => void
  exportReport: (reportId: string, format: ExportFormat) => Promise<void>
}

export interface UseDashboardBuilderResult {
  isDashboardBuilderOpen: boolean
  setIsDashboardBuilderOpen: (value: boolean) => void
  draggedWidget: string | null
  dashboardLayout: DashboardLayoutItem[]
  handleDragStart: (widgetId: string) => void
  handleDragOver: (event: DragEvent) => void
  handleDrop: (event: DragEvent, targetPosition: WidgetPosition) => void
  addWidgetByTap: (widgetId: string) => void
  removeWidget: (widgetId: string) => void
  moveWidget: (widgetId: string, direction: "up" | "down") => void
  clearLayout: () => void
}
