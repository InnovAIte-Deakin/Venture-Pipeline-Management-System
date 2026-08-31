export type FundStatus =
  | "fundraising"
  | "active"
  | "closed"
  | "winding_down"
  | "liquidated"

export type FundType = "venture" | "growth" | "buyout" | "impact" | "debt"

export type LPType =
  | "pension"
  | "endowment"
  | "foundation"
  | "insurance"
  | "sovereign"
  | "family_office"
  | "fund_of_funds"
  | "corporate"
  | "individual"

export type CapitalCallStatus = "pending" | "in_progress" | "completed" | "overdue"
export type DistributionStatus = "announced" | "paid" | "pending" | "processing"

export interface Fund {
  id: string
  name: string
  vintage: string
  size: string
  committedCapital: string
  calledCapital: string
  distributedCapital: string
  netAssetValue: string
  irr: number
  tvpi: number
  dpi: number
  moic: number
  status: FundStatus
  lps: number
  investments: number
  lastUpdate: string
  fundManager: string
  fundType: FundType
  geography: string
  sector: string[]
  investmentPeriod: string
  fundTerm: string
  managementFee: number
  carriedInterest: number
  hurdle: number
  catchUp: number
  benchmark: string
  aum: string
  dryPowder: string
  leverage: number
  esg: boolean
  regulatoryStatus: string
  fundAdmin: string
  auditor: string
  legalCounsel: string
  primeBroker: string
}

export interface LimitedPartner {
  id: string
  name: string
  type: LPType
  commitment: string
  called: string
  distributed: string
  nav: string
  irr: number
  tvpi: number
  dpi: number
  country: string
  currency: string
  contactPerson: string
  email: string
  phone: string
  status: "active" | "defaulted" | "transferred" | "withdrawn"
  investmentDate: string
  lastCapitalCall: string
  lastDistribution: string
  riskRating: "low" | "medium" | "high"
  kycStatus: "approved" | "pending" | "expired"
  accredited: boolean
}

export interface CapitalCall {
  id: string
  fundId: string
  fundName: string
  callNumber: string
  amount: string
  dueDate: string
  status: CapitalCallStatus
  lpsResponded: number
  totalLps: number
  lastUpdate: string
  purpose?: string
  investments?: string[]
  expenses?: string
  interestRate?: number
  gracePeriod?: string
  defaultPenalty?: number
  wireInstructions?: boolean
  noticeDate?: string
  remindersSent?: number
  documentsGenerated?: boolean
}

export interface Distribution {
  id: string
  fundId: string
  fundName: string
  distributionNumber: string
  amount: string
  date: string
  type: "dividend" | "exit" | "refinancing" | "return_of_capital" | "other"
  status: DistributionStatus
  lpsPaid: number
  totalLps: number
  lastUpdate: string
  source?: string
  sourceVentures?: string[]
  taxImplications?: string
  withholding?: number
  currency?: string
  exchangeRate?: number
  paymentMethod?: "wire" | "check" | "ach"
  taxReporting?: boolean
  k1Generated?: boolean
  recordDate?: string
  exDate?: string
}

export interface OperationTask {
  id: string
  title: string
  type?: string
  priority?: "HIGH" | "MEDIUM" | "LOW"
  dueDate?: string
  assignee?: { name: string }
}

export interface FundManagementPayload {
  funds: Fund[]
  limitedPartners: LimitedPartner[]
  capitalCalls: CapitalCall[]
  distributions: Distribution[]
  operationTasks: OperationTask[]
  reports: Array<{ id: string; name: string; type?: string; generatedAt?: string }>
  ventures?: Array<{ id: string; name: string; documents?: any[] }>
}
