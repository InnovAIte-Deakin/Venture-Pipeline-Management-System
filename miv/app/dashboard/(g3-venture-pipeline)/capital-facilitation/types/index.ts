export type CapitalRequestStatus =
  "Under Review" | "Approved" | "Pending" | "Rejected";

export type CapitalStatus = CapitalRequestStatus;

export interface CapitalRequest {
  id: string;
  venture: string;
  amount: number;
  status: CapitalRequestStatus;
  stage: string;
  progress: number;
  submittedDate: string;
  expectedDecision: string;
  investor: string;
  timeline: CapitalTimelineItem[];
  documents: CapitalDocument[];
}

export interface CapitalTimelineItem {
  date: string;
  event: string;
}

export type TimelineItem = CapitalTimelineItem;

export interface CapitalDocument {
  name: string;
  url: string;
  type: string;
}

export interface InvestorPartner {
  name: string;
  focus: string;
  totalInvested: number;
  activeDeals: number;
  avgTicketSize: string;
  contactPerson: string;
  email: string;
}

export interface VentureDocument {
  name: string;
  url: string;
  type: string;
}

export interface VentureApiItem {
  id: string;
  name: string;
  stage: string;
  fundingRaised?: number | null;
  createdAt?: string | null;
  intakeDate?: string | null;
  screeningDate?: string | null;
  dueDiligenceStart?: string | null;
  fundedAt?: string | null;
  capitalActivities?: unknown[];
  documents?: VentureDocument[];
}

export interface CapitalApiVenture {
  id: string;
  name: string;
  stage?: string | null;
  fundingRaised?: number | null;
  capitalActivities?: unknown[] | null;
  createdAt?: string | null;
  intakeDate?: string | null;
  screeningDate?: string | null;
  dueDiligenceStart?: string | null;
  fundedAt?: string | null;
  documents?: Array<{
    name?: string | null;
    url?: string | null;
    type?: string | null;
  }> | null;
}

export interface CapitalApiResponse {
  ventures?: CapitalApiVenture[] | null;
}

export interface DealPipelineStage {
  name: string;
  deals: number;
  capital: number;
}

export interface PipelineStage extends DealPipelineStage {
  color: string;
}

export interface CapitalMetrics {
  totalCapital: number;
  activeDeals: number;
  successRate: number;
  averageDealSize: number;
}

// Frontend demo record for the Capital Facilitation table (not backend-sourced).
export interface CapitalFacilitationRecord {
  id: string;
  ventureName: string;
  fundingStage: string;
  capitalRequired: number;
  capitalSecured: number;
  fundingGap: number;
  progress: number;
  investorReadiness: string;
  status: string;
}

export interface CapitalFacilitationSummaryCard {
  label: string;
  value: string;
  supportingText: string;
}

export interface CapitalPipelineStageSummary {
  label: string;
  value: string;
}

export interface CapitalRequestRecord {
  id: string;
  ventureName: string;
  requestType: string;
  amountRequested: string;
  fundingStage: string;
  targetClose: string;
  priority: "High" | "Medium" | "Low";
  status: string;
}

export interface CapitalInvestorRecord {
  id: string;
  investorName: string;
  investorType: string;
  sectorInterest: string;
  preferredStage: string;
  indicativeInterest: string;
  engagementStatus: string;
}

export interface FundingPipelineStage {
  label: string;
  value: string;
}

export interface FundingPipelineRecord {
  id: string;
  ventureName: string;
  currentStage: string;
  nextStep: string;
  fundingTarget: string;
  probability: number;
  status: string;
}

export interface DueDiligenceSummaryCard {
  label: string;
  value: string;
}

export interface DueDiligenceRecord {
  id: string;
  ventureName: string;
  financialReview: string;
  legalReview: string;
  businessModel: string;
  impactAssessment: string;
  documentation: string;
  overallStatus: string;
}

export interface InvestmentReadinessRecord {
  id: string;
  ventureName: string;
  pitchDeck: string;
  financialModel: string;
  dataRoom: string;
  legal: string;
  readinessScore: number;
  status: string;
}
