import { calculateGEDSIScore } from "@/lib/gedsi-utils"
import { DEAL_STAGES, PIPELINE_BOARD_STAGES, STAGE_PROBABILITIES } from "../constants/deal-flow.constants"
import type {
  Deal,
  DealInsights,
  DealStage,
  JsonRecord,
  JsonValue,
  PipelineTransition,
  RawVentureData,
  StageGroup,
  SummaryMetrics,
} from "../types/deal-flow.types"

function asRecord(value: JsonValue | undefined | null): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null
}

function asStringArray(value: JsonValue | string[] | string | null | undefined): string[] {
  if (Array.isArray(value)) {
    const items: readonly unknown[] = value
    return items.filter((item): item is string => typeof item === "string")
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
    } catch {
      return []
    }
  }

  return []
}

function truthyObjectValueCount(record: JsonRecord | null | undefined): number {
  if (!record) return 0
  return Object.values(record).filter(Boolean).length
}

function numberFromJson(record: JsonRecord | null, key: string): number {
  const value = record?.[key]
  return typeof value === "number" && !Number.isNaN(value) ? value : 0
}

export function calculateDealGedsiScore(venture: RawVentureData): number {
  if (venture.gedsiMetrics && venture.gedsiMetrics.length > 0) {
    try {
      return calculateGEDSIScore(venture)
    } catch {
      const validMetrics = venture.gedsiMetrics
        .map((metric) => {
          const value = metric.currentValue || metric.value || 0
          return typeof value === "number" && value > 0
            ? Math.min(100, Math.max(0, value > 1 ? (value > 100 ? value / 10 : value) : value * 100))
            : 0
        })
        .filter((score) => score > 0)

      return validMetrics.length > 0
        ? Math.round(validMetrics.reduce((sum, score) => sum + score, 0) / validMetrics.length)
        : Math.floor(Math.random() * 40) + 60
    }
  }

  // Preserves current placeholder fallback; this is intentionally nondeterministic.
  return Math.floor(Math.random() * 40) + 60
}

export function calculateImpactScore(venture: RawVentureData): number {
  let score = 0
  const maxScore = 100

  let leadershipScore = 0
  try {
    const founderTypes = Array.isArray(venture.founderTypes)
      ? venture.founderTypes
      : JSON.parse(venture.founderTypes || "[]")

    if (Array.isArray(founderTypes)) {
      if (founderTypes.includes("women-led")) leadershipScore += 10
      if (founderTypes.includes("disability-inclusive")) leadershipScore += 8
      if (founderTypes.includes("indigenous-led")) leadershipScore += 7
      if (founderTypes.includes("youth-led")) leadershipScore += 5
      if (founderTypes.includes("lgbtq-led")) leadershipScore += 5
    }
  } catch {
    const ventureText = `${venture.name || ""} ${venture.description || ""}`.toLowerCase()
    if (ventureText.includes("women") || ventureText.includes("female")) leadershipScore += 8
    if (ventureText.includes("disability") || ventureText.includes("accessible")) leadershipScore += 6
    if (ventureText.includes("youth") || ventureText.includes("young")) leadershipScore += 4
  }
  score += Math.min(leadershipScore, 25)

  let socialImpactScore = 0
  const inclusionFocus = (venture.inclusionFocus || "").toLowerCase()

  if (
    inclusionFocus.includes("rural") ||
    inclusionFocus.includes("underserved") ||
    inclusionFocus.includes("remote") ||
    inclusionFocus.includes("community")
  ) {
    socialImpactScore += 8
  }

  if (
    inclusionFocus.includes("low-income") ||
    inclusionFocus.includes("poverty") ||
    inclusionFocus.includes("financial inclusion") ||
    inclusionFocus.includes("microfinance")
  ) {
    socialImpactScore += 8
  }

  if (
    inclusionFocus.includes("healthcare") ||
    inclusionFocus.includes("medical") ||
    inclusionFocus.includes("health access")
  ) {
    socialImpactScore += 7
  }

  if (
    inclusionFocus.includes("education") ||
    inclusionFocus.includes("learning") ||
    inclusionFocus.includes("skills development")
  ) {
    socialImpactScore += 7
  }

  const inclusionAreas = [
    inclusionFocus.includes("gender"),
    inclusionFocus.includes("disability"),
    inclusionFocus.includes("rural"),
    inclusionFocus.includes("youth"),
    inclusionFocus.includes("education"),
    inclusionFocus.includes("healthcare"),
  ].filter(Boolean).length

  if (inclusionAreas >= 3) socialImpactScore += 5
  score += Math.min(socialImpactScore, 30)

  let metricsScore = 0
  if (venture.gedsiMetrics && venture.gedsiMetrics.length > 0) {
    const totalMetrics = venture.gedsiMetrics.length
    const verifiedMetrics = venture.gedsiMetrics.filter(
      (metric) => metric.status === "VERIFIED" || metric.status === "COMPLETED",
    ).length

    metricsScore += Math.min(totalMetrics * 2, 12)
    if (verifiedMetrics > 0) {
      const verificationRate = verifiedMetrics / totalMetrics
      metricsScore += Math.round(verificationRate * 8)
    }
  }
  score += Math.min(metricsScore, 20)

  let sdgScore = 0
  try {
    const goals = asStringArray(venture.gedsiGoals || venture.sustainabilityGoals || "[]")
    if (goals.length > 0) {
      sdgScore += Math.min(goals.length * 2, 10)
      const highImpactSDGs = goals.filter((goal) => {
        const lowerGoal = goal.toLowerCase()
        return (
          lowerGoal.includes("gender equality") ||
          lowerGoal.includes("decent work") ||
          lowerGoal.includes("reduced inequalities") ||
          lowerGoal.includes("sustainable cities") ||
          lowerGoal.includes("climate action")
        )
      })
      sdgScore += Math.min(highImpactSDGs.length * 2, 5)
    }
  } catch {
    if (venture.sector?.toLowerCase().includes("cleantech") || venture.sector?.toLowerCase().includes("sustainability")) {
      sdgScore += 6
    }
    if (inclusionFocus.length > 0) sdgScore += 4
  }
  score += Math.min(sdgScore, 15)

  let evidenceScore = 0
  // This intentionally preserves the old formula, even though mapped metrics use top-level venture fields.
  const jobsCreated = venture.metrics?.jobsCreated || 0
  if (jobsCreated > 0) evidenceScore += Math.min(Math.floor(jobsCreated / 10), 4)

  const communities = venture.metrics?.communitiesServed || 0
  if (communities > 0) evidenceScore += Math.min(Math.floor(communities / 5), 3)

  if (venture.metrics?.disabilityInclusive) evidenceScore += 3
  score += Math.min(evidenceScore, 10)

  const sectorMultipliers: Record<string, number> = {
    healthcare: 1.1,
    education: 1.1,
    agriculture: 1.05,
    fintech: 1.05,
    cleantech: 1.05,
    default: 1.0,
  }
  const sector = venture.sector?.toLowerCase() || ""
  const multiplier =
    Object.entries(sectorMultipliers).find(([key]) => sector.includes(key))?.[1] || sectorMultipliers.default

  score = Math.round(score * multiplier)
  return Math.max(15, Math.min(score, maxScore))
}

export function calculateReadinessScore(venture: RawVentureData): number {
  let score = 60
  score += truthyObjectValueCount(venture.operationalReadiness) * 5
  score += truthyObjectValueCount(venture.capitalReadiness) * 3
  return Math.min(score, 100)
}

export function calculateDealProbability(stage: string | null | undefined, gedsiScore: number, impactScore: number): number {
  let baseProbability = STAGE_PROBABILITIES[stage || ""] || 30
  if (gedsiScore > 80) baseProbability += 10
  if (impactScore > 85) baseProbability += 5
  return Math.min(baseProbability, 100)
}

export function calculateExpectedClose(stage: string | null | undefined): string {
  const daysFromNow = (() => {
    switch (stage) {
      case "INTAKE":
        return Math.random() * 180 + 120
      case "SCREENING":
        return Math.random() * 120 + 90
      case "DUE_DILIGENCE":
        return Math.random() * 90 + 30
      case "INVESTMENT_READY":
        return Math.random() * 60 + 15
      default:
        return Math.random() * 90 + 30
    }
  })()

  const closeDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return closeDate.toISOString().split("T")[0]
}

export function generateDealAIInsights(venture: RawVentureData, gedsiScore: number, impactScore: number): DealInsights {
  const keyStrengths: string[] = []
  const areasForImprovement: string[] = []
  let riskLevel: DealInsights["riskLevel"] = "medium"
  let recommendation = "Continue monitoring and provide targeted support"

  if (gedsiScore >= 85) {
    keyStrengths.push("Exceptional GEDSI leadership and governance structure")
    keyStrengths.push("Strong compliance with IRIS+ GEDSI standards")
    riskLevel = "low"
  } else if (gedsiScore >= 70) {
    keyStrengths.push("Good GEDSI foundation with clear leadership commitment")
  } else if (gedsiScore < 50) {
    areasForImprovement.push("GEDSI integration requires fundamental restructuring")
    areasForImprovement.push("Implement IRIS+ OI.16 GEDSI policy adoption")
    riskLevel = "high"
  }

  if (impactScore >= 90) {
    keyStrengths.push("Outstanding multi-dimensional social impact across all IRIS+ categories")
    keyStrengths.push("Verified metrics demonstrate measurable community outcomes")
    recommendation = "Premium impact venture - fast-track for investment committee"
    riskLevel = "low"
  } else if (impactScore >= 75) {
    keyStrengths.push("Strong social impact with verified IRIS+ metrics implementation")
    keyStrengths.push("Clear SDG alignment and measurable community benefits")
    recommendation = "High-potential impact venture - recommend due diligence advancement"
  } else if (impactScore >= 60) {
    keyStrengths.push("Solid impact foundation with room for metric enhancement")
    areasForImprovement.push("Expand IRIS+ metrics tracking and verification (OI.15-18)")
    recommendation = "Moderate impact potential - provide metrics development support"
  } else if (impactScore < 45) {
    areasForImprovement.push("Critical impact deficiency - requires comprehensive restructuring")
    areasForImprovement.push("Implement basic IRIS+ framework (OI.1-14) before advancement")
    areasForImprovement.push("Establish clear SDG alignment and measurement systems")
    recommendation = "High-risk venture - intensive impact development required"
    riskLevel = "high"
  }

  try {
    const founderTypes = asStringArray(venture.founderTypes)
    if (founderTypes.includes("women-led")) keyStrengths.push("Women-led venture aligns with IRIS+ OI.1 objectives")
    if (founderTypes.includes("disability-inclusive")) {
      keyStrengths.push("Disability-inclusive leadership supports IRIS+ OI.6 compliance")
    }
    if (founderTypes.includes("indigenous-led")) keyStrengths.push("Indigenous leadership enhances IRIS+ OI.11 social inclusion")
    if (founderTypes.includes("youth-led")) keyStrengths.push("Youth leadership supports IRIS+ OI.12 generational inclusion")
    if (founderTypes.length === 0) areasForImprovement.push("Diversify leadership to enhance GEDSI representation")
  } catch {
    areasForImprovement.push("Clarify founder demographic information for IRIS+ compliance")
  }

  const summary = asRecord(venture.gedsiMetricsSummary)
  const jobsCreated = venture.metrics?.jobsCreated || numberFromJson(summary, "jobsCreated")
  const communities = venture.metrics?.communitiesServed || numberFromJson(summary, "communitiesServed")

  if (jobsCreated > 50) keyStrengths.push(`Significant employment impact: ${jobsCreated} jobs created`)
  else if (jobsCreated > 0) keyStrengths.push(`Positive employment impact: ${jobsCreated} jobs created`)
  else areasForImprovement.push("Establish job creation metrics and tracking systems")

  if (communities > 10) keyStrengths.push(`Broad community reach: ${communities} communities served`)
  else if (communities > 0) keyStrengths.push(`Community impact: ${communities} communities served`)
  else areasForImprovement.push("Develop community impact measurement and tracking")

  if ((venture.revenue || 0) > 1000000) keyStrengths.push("Proven revenue generation capability")
  if (Number(venture.teamSize || 0) > 20) keyStrengths.push("Experienced and scalable team structure")

  if (!venture.operationalReadiness?.businessPlan) areasForImprovement.push("Business plan requires updating and completion")
  if (!venture.capitalReadiness?.dueDiligence) areasForImprovement.push("Due diligence documentation incomplete")

  const combinedScore = (gedsiScore + impactScore) / 2
  if (combinedScore >= 85) {
    recommendation = "Exceptional GEDSI+Impact alignment - recommend immediate advancement to investment committee"
    riskLevel = "low"
  } else if (combinedScore >= 70) {
    recommendation = "Strong GEDSI+Impact foundation - proceed with standard due diligence"
    riskLevel = "low"
  } else if (combinedScore >= 55) {
    recommendation = "Moderate potential - provide targeted IRIS+ framework support before advancement"
    riskLevel = "medium"
  } else {
    recommendation = "Requires comprehensive GEDSI+Impact development - consider intensive support program"
    riskLevel = "high"
    areasForImprovement.push("Establish baseline IRIS+ metrics before re-evaluation")
  }

  return {
    riskLevel,
    recommendation,
    keyStrengths: keyStrengths.length > 0 ? keyStrengths.slice(0, 5) : ["Emerging opportunity with development potential"],
    areasForImprovement:
      areasForImprovement.length > 0 ? areasForImprovement.slice(0, 4) : ["Continue current progress and metrics development"],
  }
}

export function calculateSummaryMetrics(deals: Deal[]): SummaryMetrics {
  const totalDeals = deals.length
  const activeDeals = deals.filter((deal) => deal.status === "active").length
  const totalValue = deals.reduce((sum, deal) => {
    const value = Number.parseFloat(deal.dealSize.replace(/[^0-9.]/g, ""))
    return sum + (Number.isNaN(value) ? 0 : value)
  }, 0)

  const avgGedsiScore =
    totalDeals > 0
      ? Math.min(
          100,
          Math.max(
            0,
            deals.reduce((sum, deal) => sum + Math.min(100, Math.max(0, deal.gedsiScore)), 0) / totalDeals,
          ),
        )
      : 0

  const avgImpactScore =
    totalDeals > 0
      ? Math.min(
          100,
          Math.max(
            0,
            deals.reduce((sum, deal) => sum + Math.min(100, Math.max(0, deal.impactScore)), 0) / totalDeals,
          ),
        )
      : 0

  const totalJobsCreated = deals.reduce((sum, deal) => sum + Math.max(0, deal.metrics.jobsCreated), 0)
  const totalCommunitiesServed = deals.reduce((sum, deal) => sum + Math.max(0, deal.metrics.communitiesServed), 0)
  const womenLedDeals = deals.filter((deal) => deal.founderType.includes("women-led")).length
  const disabilityInclusiveDeals = deals.filter((deal) => deal.metrics.disabilityInclusive).length
  const fundedDeals = deals.filter((deal) => ["Funded", "Series A", "Series B", "Series C"].includes(deal.stage)).length

  return {
    totalDeals,
    activeDeals,
    totalValue,
    avgGedsiScore,
    avgImpactScore,
    totalJobsCreated,
    totalCommunitiesServed,
    womenLedDeals,
    disabilityInclusiveDeals,
    fundedDeals,
    successRate: totalDeals > 0 ? ((fundedDeals / totalDeals) * 100).toFixed(1) : "0.0",
  }
}

export function getStageDealsForMovement(deals: Deal[], fromStage: DealStage, toStage: DealStage): number {
  const fromDeals = deals.filter((deal) => deal.stage === fromStage)
  const toDeals = deals.filter((deal) => deal.stage === toStage)
  return Math.min(fromDeals.length, toDeals.length, 3)
}

export function groupDealsByStage(deals: Deal[]): StageGroup[] {
  return PIPELINE_BOARD_STAGES.map((stage, index) => {
    const stageDeals = deals.filter((deal) => deal.stage === stage)
    const nextStage = DEAL_STAGES[index + 1]
    const nextStageDeals = nextStage ? deals.filter((deal) => deal.stage === nextStage) : []
    const conversionRate = nextStage && stageDeals.length > 0 ? ((nextStageDeals.length / stageDeals.length) * 100).toFixed(0) : null
    const recentMovements = index > 0 ? getStageDealsForMovement(deals, DEAL_STAGES[index - 1], stage) : 0

    return {
      stage,
      deals: stageDeals,
      nextStageDeals,
      conversionRate,
      isBottleneck: stageDeals.length > 0 && conversionRate !== null && Number.parseFloat(conversionRate) < 30,
      isHighConversion: conversionRate !== null && Number.parseFloat(conversionRate) > 70,
      recentMovements,
    }
  })
}

export function getPipelinePerformance(deals: Deal[]): {
  bottlenecks: PipelineTransition[]
  highPerformers: PipelineTransition[]
} {
  const bottlenecks: PipelineTransition[] = []
  const highPerformers: PipelineTransition[] = []

  for (let i = 0; i < PIPELINE_BOARD_STAGES.slice(0, 5).length; i += 1) {
    const currentStage = DEAL_STAGES[i]
    const nextStage = DEAL_STAGES[i + 1]
    const currentDeals = deals.filter((deal) => deal.stage === currentStage)
    const nextDeals = deals.filter((deal) => deal.stage === nextStage)

    if (currentDeals.length > 0 && nextDeals.length > 0) {
      const conversionRate = (nextDeals.length / currentDeals.length) * 100
      if (conversionRate < 30 && currentDeals.length > 2) {
        bottlenecks.push({ from: currentStage, to: nextStage, rate: conversionRate.toFixed(0), deals: currentDeals.length })
      } else if (conversionRate > 70) {
        highPerformers.push({ from: currentStage, to: nextStage, rate: conversionRate.toFixed(0), deals: currentDeals.length })
      }
    }
  }

  return { bottlenecks, highPerformers }
}
