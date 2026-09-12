export type RoundStatus = "open" | "closing" | "closed" | "cancelled"
export type RiskLevel = "low" | "medium" | "high"

export interface InvestmentRound {
  id: string
  company: string
  roundType: string
  stage: string
  targetAmount: string
  raisedAmount: string
  closingDate: string
  status: RoundStatus
  leadInvestor: string
  participants: string[]
  valuation: string
  ownership: number
  documents: number
  lastUpdate: string
  gedsiScore: number
  impactScore: number
  sustainabilityScore: number
  founderType: string[]
  inclusionFocus: string
  sustainabilityGoals: string[]
  aiInsights: {
    riskLevel: RiskLevel
    recommendation: string
    keyStrengths: string[]
    areasForImprovement: string[]
  }
  metrics: {
    jobsCreated: number
    communitiesServed: number
    womenLeadership: number
    disabilityInclusive: boolean
    carbonReduction: number
  }
  location: string
  sector: string
}

export interface Venture {
  id: string
  name: string
  sector: string
  location: string
  stage: string
  status: string
  contactEmail: string
  pitchSummary?: string
  inclusionFocus?: string
  founderTypes: string
  revenue?: number
  fundingRaised?: number
  lastValuation?: number
  gedsiGoals?: unknown
  aiAnalysis?: unknown
  createdAt: string
  updatedAt: string
  gedsiMetrics: unknown[]
  capitalActivities: unknown[]
  _count: { documents: number; activities: number; capitalActivities: number }
}

export interface RoundFiltersState {
  searchTerm: string
  roundType: string
  stage: string
  status: string
  sector: string
  founderType: string
}

export interface InvestmentRoundSummary {
  totalRounds: number
  openRounds: number
  closedRounds: number
  totalTargetAmount: number
  totalRaisedAmount: number
  raisedPercentage: number
  avgGedsiScore: number
  avgImpactScore: number
  avgSustainabilityScore: number
  totalJobsCreated: number
  totalCommunitiesServed: number
  totalCarbonReduction: number
  avgWomenLeadership: number
  womenLedRounds: number
  womenLedPercentage: number
  disabilityInclusiveRounds: number
  disabilityInclusivePercentage: number
}
