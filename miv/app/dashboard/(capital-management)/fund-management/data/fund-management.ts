import { CapitalCall, Distribution, Fund, LimitedPartner, OperationTask } from "../types/fund-management"

export const funds: Fund[] = [
  {
    id: "fund-1",
    name: "Emerging Ventures Fund I",
    vintage: "2023",
    size: "$450M",
    committedCapital: "$450M",
    calledCapital: "$320M",
    distributedCapital: "$145M",
    netAssetValue: "$225M",
    irr: 18.5,
    tvpi: 1.61,
    dpi: 0.45,
    moic: 1.97,
    status: "active",
    lps: 28,
    investments: 19,
    lastUpdate: "2024-03-07",
    fundManager: "Horizon Ventures",
    fundType: "venture",
    geography: "North America",
    sector: ["SaaS", "HealthTech", "Climate"],
    investmentPeriod: "2023 - 2027",
    fundTerm: "10 years",
    managementFee: 2,
    carriedInterest: 20,
    hurdle: 8,
    catchUp: 50,
    benchmark: "S&P 500 + 5%",
    aum: "$620M",
    dryPowder: "$130M",
    leverage: 1.2,
    esg: true,
    regulatoryStatus: "approved",
    fundAdmin: "FundAdmin Co.",
    auditor: "Grant Thornton",
    legalCounsel: "Baker McKenzie",
    primeBroker: "Goldman Sachs"
  },
  {
    id: "fund-2",
    name: "Growth Equity Fund II",
    vintage: "2021",
    size: "$620M",
    committedCapital: "$620M",
    calledCapital: "$580M",
    distributedCapital: "$410M",
    netAssetValue: "$240M",
    irr: 16.2,
    tvpi: 1.15,
    dpi: 0.70,
    moic: 1.77,
    status: "fundraising",
    lps: 34,
    investments: 27,
    lastUpdate: "2024-03-12",
    fundManager: "Summit Capital",
    fundType: "growth",
    geography: "Europe",
    sector: ["FinTech", "Marketplace"],
    investmentPeriod: "2021 - 2025",
    fundTerm: "12 years",
    managementFee: 1.75,
    carriedInterest: 18,
    hurdle: 7,
    catchUp: 80,
    benchmark: "MSCI Europe + 4%",
    aum: "$840M",
    dryPowder: "$205M",
    leverage: 1.3,
    esg: false,
    regulatoryStatus: "pending",
    fundAdmin: "Capital Partners Ltd.",
    auditor: "Deloitte",
    legalCounsel: "Clifford Chance",
    primeBroker: "JP Morgan"
  }
]

export const limitedPartners: LimitedPartner[] = [
  {
    id: "lp-1",
    name: "Acadia Pension Fund",
    type: "pension",
    commitment: "$120M",
    called: "$85M",
    distributed: "$28M",
    nav: "$38M",
    irr: 14.9,
    tvpi: 1.40,
    dpi: 0.33,
    country: "United States",
    currency: "USD",
    contactPerson: "Maya Carter",
    email: "maya.carter@acadiafunds.com",
    phone: "+1 415 555 0102",
    status: "active",
    investmentDate: "2022-05-10",
    lastCapitalCall: "2024-02-22",
    lastDistribution: "2024-01-15",
    riskRating: "medium",
    kycStatus: "approved",
    accredited: true
  },
  {
    id: "lp-2",
    name: "Pacific Foundation",
    type: "foundation",
    commitment: "$75M",
    called: "$60M",
    distributed: "$20M",
    nav: "$18M",
    irr: 12.7,
    tvpi: 1.30,
    dpi: 0.35,
    country: "Canada",
    currency: "CAD",
    contactPerson: "Eleanor Grant",
    email: "eleanor.grant@pacificfdn.org",
    phone: "+1 604 555 0158",
    status: "active",
    investmentDate: "2022-09-30",
    lastCapitalCall: "2024-03-04",
    lastDistribution: "2024-02-10",
    riskRating: "low",
    kycStatus: "approved",
    accredited: true
  }
]

export const capitalCalls: CapitalCall[] = [
  {
    id: "call-1",
    fundId: "fund-1",
    fundName: "Emerging Ventures Fund I",
    callNumber: "Call 3",
    amount: "$52M",
    dueDate: "2024-04-15",
    status: "pending",
    lpsResponded: 18,
    totalLps: 28,
    lastUpdate: "2024-03-18",
    purpose: "Follow-on investment in AI-enabled health portfolio",
    investments: ["HealthTech Series B", "AI Diagnostics"],
    expenses: "$180k",
    interestRate: 0.0,
    gracePeriod: "15 days",
    defaultPenalty: 2,
    wireInstructions: true,
    noticeDate: "2024-03-25",
    remindersSent: 1,
    documentsGenerated: true
  },
  {
    id: "call-2",
    fundId: "fund-2",
    fundName: "Growth Equity Fund II",
    callNumber: "Call 4",
    amount: "$48M",
    dueDate: "2024-05-01",
    status: "in_progress",
    lpsResponded: 25,
    totalLps: 34,
    lastUpdate: "2024-03-21",
    purpose: "New investments in marketplace and SaaS growth companies",
    investments: ["Marketplace Expansion", "SaaS Scale-up"],
    expenses: "$95k",
    interestRate: 0.0,
    gracePeriod: "10 days",
    defaultPenalty: 1.5,
    wireInstructions: true,
    noticeDate: "2024-03-29",
    remindersSent: 2,
    documentsGenerated: false
  }
]

export const distributions: Distribution[] = [
  {
    id: "dist-1",
    fundId: "fund-1",
    fundName: "Emerging Ventures Fund I",
    distributionNumber: "Dist 1",
    amount: "$32M",
    date: "2024-02-14",
    type: "exit",
    status: "paid",
    lpsPaid: 28,
    totalLps: 28,
    lastUpdate: "2024-02-25",
    source: "Portfolio Exit",
    sourceVentures: ["AI Diagnostics"],
    taxImplications: "Standard withholding",
    withholding: 0.25,
    currency: "USD",
    paymentMethod: "wire",
    taxReporting: true,
    k1Generated: true,
    recordDate: "2024-01-30",
    exDate: "2024-02-01"
  },
  {
    id: "dist-2",
    fundId: "fund-2",
    fundName: "Growth Equity Fund II",
    distributionNumber: "Dist 1",
    amount: "$18M",
    date: "2024-03-05",
    type: "dividend",
    status: "processing",
    lpsPaid: 22,
    totalLps: 34,
    lastUpdate: "2024-03-18",
    source: "Quarterly Revenue Share",
    sourceVentures: ["SaaS Scale-up"],
    taxImplications: "No withholding",
    paymentMethod: "ach",
    taxReporting: false,
    k1Generated: false,
    recordDate: "2024-02-20",
    exDate: "2024-02-25"
  }
]

export const operationTasks: OperationTask[] = [
  {
    id: "task-1",
    title: "Review LP 2024 reporting package",
    type: "REPORT",
    priority: "HIGH",
    dueDate: "2024-04-05",
    assignee: { name: "Jonas" }
  },
  {
    id: "task-2",
    title: "Finalize capital call notice for Fund II",
    type: "CALL",
    priority: "MEDIUM",
    dueDate: "2024-04-10",
    assignee: { name: "Lina" }
  }
]

export const reports = [
  {
    id: "report-1",
    name: "March Performance Summary",
    type: "performance",
    generatedAt: "2024-03-28"
  }
]

export const documents = [
  {
    id: "doc-1",
    name: "Fund I K-1 Statement",
    type: "K-1",
    uploadedAt: "2024-03-01",
    ventureName: "Emerging Ventures Fund I"
  }
]
