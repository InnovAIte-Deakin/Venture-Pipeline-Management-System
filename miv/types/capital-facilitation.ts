export type CapitalStatus = "Under Review" | "Approved" | "Pending" | "Rejected"

export interface CapitalTimelineItem {
  date: string
  event: string
}

export interface CapitalDocument {
  name: string
  url: string
  type: string
}

export interface CapitalRequest {
  id: string
  venture: string
  amount: number
  status: CapitalStatus
  stage: string
  progress: number
  submittedDate: string
  expectedDecision: string
  investor: string
  timeline: CapitalTimelineItem[]
  documents: CapitalDocument[]
}

export interface InvestorPartner {
  name: string
  focus: string
  totalInvested: number
  activeDeals: number
  avgTicketSize: string
  contactPerson: string
  email: string
}

export interface PipelineStage {
  name: string
  deals: number
  capital: number
  color: string
}

export interface CapitalMetrics {
  totalCapital: number
  activeDeals: number
  successRate: number
  averageDealSize: number
}

export interface CapitalApiVenture {
  id: string
  name: string
  stage?: string | null
  fundingRaised?: number | null
  capitalActivities?: unknown[] | null
  createdAt?: string | null
  intakeDate?: string | null
  screeningDate?: string | null
  dueDiligenceStart?: string | null
  fundedAt?: string | null
  documents?: Array<{
    name?: string | null
    url?: string | null
    type?: string | null
  }> | null
}

export interface CapitalApiResponse {
  ventures?: CapitalApiVenture[] | null
}

// Frontend demo record for the Capital Facilitation table (not backend-sourced).
export interface CapitalFacilitationRecord {
  id: string
  ventureName: string
  fundingStage: string
  capitalRequired: number
  capitalSecured: number
  fundingGap: number
  progress: number
  investorReadiness: string
  status: string
}

export interface CapitalFacilitationSummaryCard {
  label: string
  value: string
  supportingText: string
}

export interface CapitalPipelineStageSummary {
  label: string
  value: string
}
