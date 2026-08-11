import { STAGE_TO_DISPLAY_STAGE, STAGE_TO_ROUND_TYPE } from "./constants"
import type { InvestmentRound, RiskLevel, Venture } from "./types"

type AIAnalysis = Partial<{
  gedsiScore: number
  gedsiAlignment: number
  impactScore: number
  sustainabilityScore: number
  riskLevel: RiskLevel
  recommendation: string
  keyStrengths: string[]
  areasForImprovement: string[]
}>

function parseObject(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) return value as Record<string, unknown>
  if (typeof value !== "string") return {}
  try {
    const parsed: unknown = JSON.parse(value)
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (typeof value !== "string") return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}

function getGedsiScore(venture: Venture, founderTypes: string[], analysis: AIAnalysis) {
  if (analysis.gedsiScore || analysis.gedsiAlignment) return analysis.gedsiScore || analysis.gedsiAlignment || 75
  let score = 50
  if (founderTypes.includes("women-led")) score += 15
  if (founderTypes.includes("disability-inclusive")) score += 15
  if (founderTypes.includes("rural-focus")) score += 10
  if (founderTypes.includes("indigenous-led")) score += 10
  const focus = venture.inclusionFocus?.toLowerCase() || ""
  if (focus.includes("gender") || focus.includes("women")) score += 10
  if (focus.includes("disability") || focus.includes("accessibility")) score += 10
  if (focus.includes("rural") || focus.includes("community")) score += 10
  return Math.min(score, 100)
}

function getRiskLevel(venture: Venture, gedsiScore: number, analysis: AIAnalysis): RiskLevel {
  if (analysis.riskLevel && ["low", "medium", "high"].includes(analysis.riskLevel)) return analysis.riskLevel
  let score = 0
  if (["INTAKE", "SCREENING"].includes(venture.stage)) score += 30
  else if (venture.stage === "DUE_DILIGENCE") score += 20
  else if (venture.stage === "INVESTMENT_READY") score += 10
  if (gedsiScore < 60) score += 25
  else if (gedsiScore < 80) score += 10
  if (!venture.fundingRaised) score += 15
  else if (venture.fundingRaised < 500000) score += 10
  return score > 40 ? "high" : score > 20 ? "medium" : "low"
}

function getTargetAmount(venture: Venture) {
  const funding = venture.fundingRaised || 0
  const rules: Record<string, [number, number]> = {
    INTAKE: [1.5, 500000], SCREENING: [1.5, 500000], DUE_DILIGENCE: [2, 1000000],
    INVESTMENT_READY: [2.5, 2000000], SEED: [2, 1500000], SERIES_A: [3, 5000000],
    SERIES_B: [2, 15000000], SERIES_C: [1.5, 25000000],
  }
  const [multiplier, minimum] = rules[venture.stage] || [2, 1000000]
  return Math.max(funding * multiplier, minimum)
}

export function ventureToInvestmentRound(venture: Venture): InvestmentRound {
  const founderTypes = parseStringArray(venture.founderTypes)
  const analysis = parseObject(venture.aiAnalysis) as AIAnalysis
  const gedsiScore = getGedsiScore(venture, founderTypes, analysis)
  const target = getTargetAmount(venture)
  const impactFallback = Math.min(gedsiScore + Math.floor(Math.random() * 10), 100)
  const sustainabilityFallback = Math.min(gedsiScore + Math.floor(Math.random() * 10), 100)
  const riskLevel = getRiskLevel(venture, gedsiScore, analysis)
  const statusMap: Record<string, InvestmentRound["status"]> = { ACTIVE: "open", FUNDED: "closed", INACTIVE: "cancelled", ARCHIVED: "cancelled" }

  return {
    id: venture.id, company: venture.name,
    roundType: STAGE_TO_ROUND_TYPE[venture.stage] || "Seed",
    stage: STAGE_TO_DISPLAY_STAGE[venture.stage] || venture.stage,
    targetAmount: `$${(target / 1000000).toFixed(1)}M`,
    raisedAmount: venture.fundingRaised ? `$${(venture.fundingRaised / 1000000).toFixed(1)}M` : "$0",
    closingDate: new Date(venture.updatedAt).toISOString().split("T")[0],
    status: statusMap[venture.status] || "open",
    leadInvestor: "MIV Fund", participants: ["MIV Fund", "Co-investors"],
    valuation: venture.lastValuation ? `$${(venture.lastValuation / 1000000).toFixed(1)}M` : "$5M",
    ownership: Math.floor(Math.random() * 25) + 10, documents: venture._count?.documents || 0,
    lastUpdate: new Date(venture.updatedAt).toLocaleDateString(), location: venture.location, sector: venture.sector,
    gedsiScore, impactScore: analysis.impactScore || impactFallback,
    sustainabilityScore: analysis.sustainabilityScore || sustainabilityFallback,
    founderType: founderTypes,
    inclusionFocus: venture.inclusionFocus || "Inclusive innovation and sustainable development",
    sustainabilityGoals: parseStringArray(venture.gedsiGoals).length ? parseStringArray(venture.gedsiGoals) : ["Social Impact", "Economic Growth", "Innovation"],
    aiInsights: {
      riskLevel,
      recommendation: analysis.recommendation || `Venture shows ${gedsiScore > 80 ? "strong" : "moderate"} GEDSI alignment. ${venture.stage === "FUNDED" ? "Continue monitoring performance." : "Proceed with due diligence."}`,
      keyStrengths: analysis.keyStrengths || [founderTypes.includes("women-led") ? "Women leadership" : "Diverse team", "Market opportunity", venture.inclusionFocus ? "Clear social impact" : "Sector expertise"],
      areasForImprovement: analysis.areasForImprovement || ["Financial sustainability", "Market expansion", "Impact measurement"],
    },
    metrics: {
      jobsCreated: Math.floor(Math.random() * 200) + 50, communitiesServed: Math.floor(Math.random() * 50) + 10,
      womenLeadership: founderTypes.includes("women-led") ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 40) + 30,
      disabilityInclusive: founderTypes.includes("disability-inclusive") || Math.random() > 0.7,
      carbonReduction: Math.floor(Math.random() * 100) + 10,
    },
  }
}
