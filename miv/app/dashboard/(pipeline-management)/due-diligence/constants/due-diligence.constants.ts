import type { ReportSectionOptions } from "../types/due-diligence.types"

export const DUE_DILIGENCE_CATEGORIES = [
  "Financial",
  "Legal",
  "Technical",
  "Market",
  "Team",
  "Operations",
  "Compliance"
]

export const DD_ITEM_CATEGORIES = [
  "Financial",
  "Legal",
  "Technical",
  "Market"
]

export const DUE_DILIGENCE_STAGES = [
  "Initial Review",
  "Financial Review",
  "Legal Review",
  "Technical Assessment",
  "Market Analysis",
  "Team Assessment",
  "Final Report"
]

export const DEFAULT_ITEMS_PER_PAGE = 10

export const ASSIGNED_ANALYSTS: Record<string, string> = {
  Financial: "Sarah Johnson",
  Legal: "Mike Chen",
  Technical: "David Smith",
  Market: "Lisa Wang",
  Team: "Alex Rodriguez",
  Compliance: "Maria Santos",
  Operations: "John Kim"
}

export const STANDARD_CHECKLIST_TEMPLATES = [
  {
    title: "Financial Statements Review",
    description: "Review audited financial statements and financial projections",
    category: "Financial",
    priority: "high" as const
  },
  {
    title: "Legal Structure Analysis",
    description: "Analyze corporate structure, contracts, and legal obligations",
    category: "Legal",
    priority: "high" as const
  },
  {
    title: "Technology Stack Assessment",
    description: "Evaluate technology architecture and scalability",
    category: "Technical",
    priority: "medium" as const
  },
  {
    title: "Market Size Validation",
    description: "Verify TAM, SAM, and market opportunity analysis",
    category: "Market",
    priority: "medium" as const
  },
  {
    title: "Team Background Assessment",
    description: "Evaluate team composition and key personnel",
    category: "Team",
    priority: "low" as const
  },
  {
    title: "GEDSI Compliance Review",
    description: "Assess GEDSI metrics and inclusion practices",
    category: "Compliance",
    priority: "high" as const
  }
]

export const REPORT_SECTION_OPTIONS: ReportSectionOptions = {
  financial: [
    { id: "executive_summary", label: "Executive Summary", default: true },
    { id: "financial_health", label: "Financial Health Analysis", default: true },
    { id: "gedsi_financial", label: "GEDSI Financial Impact", default: true },
    { id: "investment_readiness", label: "Investment Readiness", default: true },
    { id: "risk_assessment", label: "Risk Assessment", default: true },
    { id: "recommendations", label: "Recommendations", default: true },
    { id: "iris_metrics", label: "IRIS+ Metrics Alignment", default: false },
    { id: "benchmarking", label: "Industry Benchmarking", default: false },
    { id: "scenario_analysis", label: "Scenario Analysis", default: false }
  ],
  legal: [
    { id: "executive_summary", label: "Executive Summary", default: true },
    { id: "corporate_structure", label: "Corporate Structure", default: true },
    { id: "compliance_status", label: "Compliance Status", default: true },
    { id: "intellectual_property", label: "Intellectual Property", default: true },
    { id: "gedsi_legal", label: "GEDSI Legal Framework", default: true },
    { id: "contracts", label: "Contracts & Agreements", default: true },
    { id: "legal_risks", label: "Legal Risks", default: true },
    { id: "recommendations", label: "Recommendations", default: true },
    { id: "regulatory_landscape", label: "Regulatory Landscape", default: false },
    { id: "litigation_history", label: "Litigation History", default: false }
  ],
  technical: [
    { id: "executive_summary", label: "Executive Summary", default: true },
    { id: "technology_architecture", label: "Technology Architecture", default: true },
    { id: "security_assessment", label: "Security Assessment", default: true },
    { id: "accessibility_inclusion", label: "Accessibility & Inclusion", default: true },
    { id: "development_practices", label: "Development Practices", default: true },
    { id: "scalability_analysis", label: "Scalability Analysis", default: true },
    { id: "technical_team", label: "Technical Team Assessment", default: true },
    { id: "technology_risks", label: "Technology Risks", default: true },
    { id: "recommendations", label: "Recommendations", default: true },
    { id: "code_review", label: "Code Quality Review", default: false },
    { id: "infrastructure_audit", label: "Infrastructure Audit", default: false }
  ],
  market: [
    { id: "executive_summary", label: "Executive Summary", default: true },
    { id: "market_opportunity", label: "Market Opportunity", default: true },
    { id: "competitive_landscape", label: "Competitive Landscape", default: true },
    { id: "gedsi_market", label: "GEDSI Market Analysis", default: true },
    { id: "customer_analysis", label: "Customer Analysis", default: true },
    { id: "geographic_expansion", label: "Geographic Expansion", default: true },
    { id: "market_risks", label: "Market Risks", default: true },
    { id: "recommendations", label: "Recommendations", default: true },
    { id: "tam_sam_som", label: "TAM/SAM/SOM Deep Dive", default: false },
    { id: "pricing_strategy", label: "Pricing Strategy Analysis", default: false }
  ]
}
