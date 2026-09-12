export type PortfolioStageFilter = "all" | "portfolio"
export interface GedsiMetric { id?: string; name?: string; metricName?: string; code?: string; category?: string; unit?: string; status?: string; currentValue?: number | null; targetValue?: number | null }
export interface CapitalActivity { id?: string; type?: string; status?: string }
export interface VentureCounts { documents: number; activities: number; capitalActivities: number }
export interface VentureRecord {
  id: string; name: string; sector?: string | null; stage?: string | null; location?: string | null; status?: string | null
  founderTypes?: string | string[] | null; gedsiGoals?: string | string[] | null; inclusionFocus?: string | null
  createdAt?: string | null; updatedAt?: string | null; revenue?: string | number | null; fundingRaised?: string | number | null
  teamSize?: string | number | null; website?: string | null; pitchSummary?: string | null
  operationalReadiness?: Record<string, unknown> | null; capitalReadiness?: Record<string, unknown> | null
  aiAnalysis?: string | Record<string, unknown> | null; gedsiMetricsSummary?: string | Record<string, unknown> | null
  gedsiMetrics?: GedsiMetric[] | null; capitalActivities?: CapitalActivity[] | null; _count?: Partial<VentureCounts> | null
}
export interface PortfolioInsights { riskLevel: "low" | "medium" | "high"; priority: "urgent" | "high" | "medium" | "low"; nextAction: string; daysUntilAction: number; alerts: string[] }
export interface PortfolioCompany {
  id: string; name: string; sector: string; stage: string; location: string; status: string; founderTypes: string; gedsiGoals: string
  inclusionFocus: string; createdAt: string; updatedAt: string; gedsiMetrics: GedsiMetric[]; capitalActivities: CapitalActivity[]
  _count: VentureCounts; gedsiScore: number; impactScore: number; readinessScore: number; aiInsights: PortfolioInsights
}
export interface PortfolioSummary { totalCompanies: number; avgGedsiScore: number; totalGedsiMetrics: number; totalActivities: number }
export interface VenturesResponse { ventures: VentureRecord[] }
