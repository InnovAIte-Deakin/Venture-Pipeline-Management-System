export interface PortfolioCompany {
  id: string
  name: string
  sector: string
  stage: string
  location: string
  status: string
  founderTypes: string
  gedsiGoals: string
  inclusionFocus: string
  createdAt: string
  updatedAt: string
  gedsiMetrics: any[]
  capitalActivities: any[]
  _count: {
    documents: number
    activities: number
    capitalActivities: number
  }
  // Calculated fields
  gedsiScore?: number
  impactScore?: number
  readinessScore?: number
  aiInsights?: {
    riskLevel: "low" | "medium" | "high"
    priority: "urgent" | "high" | "medium" | "low"
    nextAction: string
    daysUntilAction: number
    alerts: string[]
  }
}
