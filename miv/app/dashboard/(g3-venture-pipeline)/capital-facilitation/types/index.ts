export type CapitalRequestStatus =
  "Under Review" | "Approved" | "Pending" | "Rejected";

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
  timeline: TimelineItem[];
  documents: CapitalDocument[];
}

export interface TimelineItem {
  date: string;
  event: string;
}

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

export interface DealPipelineStage {
  name: string;
  deals: number;
  capital: number;
}
