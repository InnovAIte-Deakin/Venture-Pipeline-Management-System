import type {
  Dashboard,
  GedsiMetricApiResponseItem,
  Report,
  SectorDistributionSlice,
  UserApiResponseItem,
  VentureApiResponseItem,
  VenturePerformancePoint,
  Widget,
  WorkflowPageAssumedShape,
} from "../types/advanced-reports.types"
import { CHART_COLORS } from "../constants/advanced-reports.constants"

// ---------------------------------------------------------------------------
// Chart-data generators (direct lift of the original module-scope helpers)
// ---------------------------------------------------------------------------

/**
 * Produces a fabricated 6-month trend, NOT real historical data: portfolio
 * totals are multiplied by hand-picked per-month coefficients to fake a
 * growth curve. Ventures do carry real `createdAt` timestamps but they are
 * not used. Preserved exactly — do not treat this as real monthly history.
 */
export function generateVenturePerformanceData(ventures: VentureApiResponseItem[]): VenturePerformancePoint[] {
  if (ventures.length === 0) {
    return [
      { month: "Jan", ventures: 0, funding: 0, success: 0 },
      { month: "Feb", ventures: 0, funding: 0, success: 0 },
      { month: "Mar", ventures: 0, funding: 0, success: 0 },
      { month: "Apr", ventures: 0, funding: 0, success: 0 },
      { month: "May", ventures: 0, funding: 0, success: 0 },
      { month: "Jun", ventures: 0, funding: 0, success: 0 },
    ]
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const totalVentures = ventures.length
  const totalFunding = ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0)
  const successfulVentures = ventures.filter((v) => ["FUNDED", "SERIES_A", "SERIES_B", "SERIES_C"].includes(v.stage)).length
  const successRate = totalVentures > 0 ? (successfulVentures / totalVentures) * 100 : 0

  return months.map((month, index) => ({
    month,
    ventures: Math.max(0, Math.round(totalVentures * (0.6 + index * 0.08))), // Simulated growth trend
    funding: Math.max(0, Math.round(totalFunding * (0.5 + index * 0.1))), // Simulated funding growth
    success: Math.max(0, Math.round(successRate * (0.8 + index * 0.04))), // Simulated success improvement
  }))
}

export interface GedsiCategoryBucket {
  category: string
  target: number
  current: number
  percentage: number
}

/**
 * Dead code, preserved verbatim and never called (matches original). UI
 * labels `Gender/Equity/Disability/Social Inclusion` do not line up 1:1 with
 * the real `GEDSICategory` enum (`GENDER/DISABILITY/SOCIAL_INCLUSION/CROSS_CUTTING`):
 * `Equity` has no backing enum value and remaps `SOCIAL_INCLUSION` metrics
 * into it, while `CROSS_CUTTING` metrics get remapped into `Social
 * Inclusion`. Do not silently "fix" this mapping — confirm the intended
 * taxonomy with product before reviving this function.
 */
export function generateGEDSIMetricsData(gedsiMetrics: GedsiMetricApiResponseItem[]): GedsiCategoryBucket[] {
  const categories = ["Gender", "Equity", "Disability", "Social Inclusion"]

  return categories.map((category) => {
    const categoryMetrics = gedsiMetrics.filter(
      (m) =>
        m.category === category.toUpperCase() ||
        (category === "Equity" && m.category === "SOCIAL_INCLUSION") ||
        (category === "Social Inclusion" && m.category === "CROSS_CUTTING")
    )

    const total = categoryMetrics.length
    const completed = categoryMetrics.filter((m) => ["COMPLETED", "VERIFIED"].includes(m.status)).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { category, target: total, current: completed, percentage }
  })
}

export function generateSectorDistributionData(ventures: VentureApiResponseItem[]): SectorDistributionSlice[] {
  if (ventures.length === 0) {
    return [{ name: "No Data", value: 100, color: "#6B7280" }]
  }

  const sectorCounts = ventures.reduce<Record<string, number>>((acc, venture) => {
    const sector = venture.sector || "Other"
    acc[sector] = (acc[sector] || 0) + 1
    return acc
  }, {})

  return Object.entries(sectorCounts)
    .map(([name, count], index) => ({
      name,
      value: Math.round((count / ventures.length) * 100),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)
}

// ---------------------------------------------------------------------------
// Portfolio / GEDSI / workflow aggregations used when seeding reports
// ---------------------------------------------------------------------------

export interface PortfolioSummary {
  totalFunding: number
  fundedVentures: VentureApiResponseItem[]
  avgFunding: number
  sectors: string[]
  stages: string[]
}

export function calculatePortfolioSummary(ventures: VentureApiResponseItem[]): PortfolioSummary {
  const totalFunding = ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0)
  const fundedVentures = ventures.filter((v) => (v.fundingRaised || 0) > 0)
  const avgFunding = fundedVentures.length > 0 ? totalFunding / fundedVentures.length : 0
  return {
    totalFunding,
    fundedVentures,
    avgFunding,
    sectors: [...new Set(ventures.map((v) => v.sector).filter((s): s is string => Boolean(s)))],
    stages: [...new Set(ventures.map((v) => v.stage).filter(Boolean))],
  }
}

export interface GedsiSummary {
  verifiedGedsiMetrics: GedsiMetricApiResponseItem[]
  categories: string[]
}

export function calculateGedsiSummary(gedsiMetrics: GedsiMetricApiResponseItem[]): GedsiSummary {
  return {
    verifiedGedsiMetrics: gedsiMetrics.filter((m) => m.status === "VERIFIED"),
    categories: [...new Set(gedsiMetrics.map((m) => m.category).filter(Boolean))],
  }
}

/**
 * The real User model/API response has no `lastLogin` field (confirmed
 * against `prisma/schema.prisma` and the `/api/users` route's Prisma
 * `select`). The original code's `u.lastLogin && new Date(u.lastLogin) > ...`
 * check was therefore always falsy for every user, so "active users" always
 * evaluated to 0 regardless of real user activity. Preserved as-is — not a
 * calculation to silently "fix" during extraction.
 */
export function calculateActiveUsers(_users: UserApiResponseItem[]): number {
  return 0
}

export interface WorkflowCounts {
  active: number
  completed: number
}

/**
 * The real `Workflow` Prisma model has `isActive: boolean`, not a `status`
 * field — and `/api/workflows`'s array lives under `results`, not
 * `workflows` (see `use-advanced-reports-data`'s preserved key-mismatch
 * bug). Both bugs compound here: `workflows` is always `[]` by the time it
 * reaches this function, so these counts are always 0 today regardless of
 * real workflow data.
 */
export function calculateWorkflowCounts(workflows: WorkflowPageAssumedShape[]): WorkflowCounts {
  return {
    active: workflows.filter((w) => w.status === "ACTIVE").length,
    completed: workflows.filter((w) => w.status === "COMPLETED").length,
  }
}

// ---------------------------------------------------------------------------
// Seed report / dashboard generation (the 5 hardcoded reports + 1 dashboard
// produced by the original `fetchData` on every load)
// ---------------------------------------------------------------------------

export interface SeedReportsInput {
  /**
   * Ventures/GEDSI-metrics/users state as it stood immediately BEFORE this
   * fetch cycle updated it. The original monolith referenced the React state
   * variable (`ventures`/`gedsiMetrics`/`users`) — not the freshly-parsed
   * array — in report #1/#2/#5's display copy and several filter fields.
   * Because `fetchData` only ever runs once (mount effect, no refetch
   * button existed), that state was always the initial `[]` in practice, so
   * those specific fields always render as zero/empty even when real data
   * loads successfully. This parameter makes that previously-implicit
   * closure bug explicit and reproducible rather than "fixing" it by
   * switching every reference to the freshly-fetched array. See README
   * "Known Remaining Issues".
   */
  staleVentures: VentureApiResponseItem[]
  staleGedsiMetrics: GedsiMetricApiResponseItem[]
  staleUsers: UserApiResponseItem[]
  ventures: VentureApiResponseItem[]
  gedsiMetrics: GedsiMetricApiResponseItem[]
  workflows: WorkflowPageAssumedShape[]
}

export function buildSeedReports(input: SeedReportsInput): Report[] {
  const { staleVentures, staleGedsiMetrics, staleUsers, ventures, gedsiMetrics, workflows } = input

  const { totalFunding, fundedVentures, avgFunding, sectors, stages } = calculatePortfolioSummary(ventures)
  const { verifiedGedsiMetrics } = calculateGedsiSummary(gedsiMetrics)
  const { active: activeWorkflowsCount, completed: completedWorkflowsCount } = calculateWorkflowCounts(workflows)

  return [
    {
      id: "1",
      name: `Venture Performance Report (${staleVentures.length} ventures)`,
      type: "venture-performance",
      description: `Comprehensive analysis of ${staleVentures.length} ventures in the portfolio with detailed performance metrics`,
      lastGenerated: new Date().toISOString(),
      status: "published",
      metrics: ["Total Ventures", "Funding Amount", "Success Rate", "GEDSI Compliance", "Portfolio Diversity"],
      filters: {
        dateRange: "Current",
        sector: "all",
        stage: "all",
        totalVentures: staleVentures.length,
        fundedVentures: fundedVentures.length,
        totalFunding,
        avgFunding,
        sectors,
        stages,
      },
    },
    {
      id: "2",
      name: `GEDSI Impact Assessment (${staleGedsiMetrics.length} metrics)`,
      type: "gedsi-impact",
      description: `Detailed GEDSI metrics analysis across ${staleGedsiMetrics.length} tracked metrics with ${verifiedGedsiMetrics.length} verified`,
      lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "published",
      metrics: ["Gender Distribution", "Equity Metrics", "Disability Inclusion", "Social Impact", "Verification Rate"],
      filters: {
        dateRange: "2024",
        region: "all",
        totalMetrics: staleGedsiMetrics.length,
        verifiedMetrics: verifiedGedsiMetrics.length,
        verificationRate: staleGedsiMetrics.length > 0 ? (verifiedGedsiMetrics.length / staleGedsiMetrics.length) * 100 : 0,
        categories: [...new Set(staleGedsiMetrics.map((m) => m.category).filter(Boolean))],
      },
    },
    {
      id: "3",
      name: "Financial Analytics Dashboard",
      type: "financial-analytics",
      description: `Financial performance and investment analytics with $${totalFunding.toLocaleString()} total funding`,
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: fundedVentures.length > 5 ? "published" : "draft",
      metrics: ["ROI", "Investment Distribution", "Revenue Growth", "Cost Analysis", "Portfolio Valuation"],
      filters: {
        dateRange: "2024",
        investmentType: "all",
        totalFunding,
        avgFunding,
        fundingRounds: fundedVentures.length,
        // `investmentCategory` is not a field on the Venture model; this was
        // always [] in the original code too (filter(Boolean) over undefined).
        investmentCategories: [] as string[],
      },
    },
    {
      id: "4",
      name: `Workflow Efficiency Report (${workflows.length} workflows)`,
      type: "workflow-analysis",
      description: `Analysis of ${workflows.length} workflows with ${activeWorkflowsCount} active and ${completedWorkflowsCount} completed`,
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "published",
      metrics: ["Workflow Completion Rate", "Average Duration", "Success Rate", "Resource Utilization"],
      filters: {
        dateRange: "2024",
        workflowType: "all",
        totalWorkflows: workflows.length,
        activeWorkflows: activeWorkflowsCount,
        completedWorkflows: completedWorkflowsCount,
        completionRate: workflows.length > 0 ? (completedWorkflowsCount / workflows.length) * 100 : 0,
      },
    },
    {
      id: "5",
      name: "User Activity & Engagement Report",
      type: "user-analytics",
      description: `User engagement analysis across ${staleUsers.length} active users with platform usage metrics`,
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "published",
      metrics: ["Active Users", "Login Frequency", "Feature Usage", "User Satisfaction"],
      filters: {
        dateRange: "30d",
        userRole: "all",
        totalUsers: staleUsers.length,
        activeUsers: calculateActiveUsers(staleUsers),
        userRoles: [...new Set(staleUsers.map((u) => u.role).filter(Boolean))],
      },
    },
  ]
}

export function buildSeedDashboards(ventures: VentureApiResponseItem[], gedsiMetrics: GedsiMetricApiResponseItem[]): Dashboard[] {
  const widgets: Widget[] = [
    {
      id: "1",
      type: "chart",
      title: "Venture Performance Trend",
      data: generateVenturePerformanceData(ventures),
      position: { x: 0, y: 0, w: 6, h: 4 },
      config: { type: "line", metrics: ["ventures", "funding"] },
    },
    {
      id: "2",
      type: "metric",
      title: "Total Ventures",
      data: {
        value: ventures.length,
        change: ventures.length > 0 ? "+0%" : "0%",
        trend: ventures.length > 0 ? "up" : "neutral",
      },
      position: { x: 6, y: 0, w: 3, h: 2 },
      config: { format: "number" },
    },
    {
      id: "3",
      type: "metric",
      title: "GEDSI Metrics",
      data: {
        value: gedsiMetrics.length,
        change: gedsiMetrics.length > 0 ? "+0%" : "0%",
        trend: gedsiMetrics.length > 0 ? "up" : "neutral",
      },
      position: { x: 9, y: 0, w: 3, h: 2 },
      config: { format: "number" },
    },
  ]

  return [
    {
      id: "1",
      name: "Executive Dashboard",
      description: "High-level overview for executive decision making based on current portfolio",
      isDefault: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
      widgets,
    },
  ]
}

export function buildFallbackReport(): Report {
  return {
    id: "error-1",
    name: "Error Loading Reports",
    type: "system-error",
    description: "Unable to load reports from database",
    lastGenerated: new Date().toISOString(),
    status: "draft",
    metrics: [],
    filters: {},
  }
}
