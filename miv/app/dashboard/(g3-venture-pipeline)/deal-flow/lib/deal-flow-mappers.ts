import { STATUS_MAP, STAGE_MAP } from "../constants/deal-flow.constants"
import {
  calculateDealGedsiScore,
  calculateDealProbability,
  calculateExpectedClose,
  calculateImpactScore,
  calculateReadinessScore,
  generateDealAIInsights,
} from "./deal-flow-calculations"
import type { Deal, DealStage, DealStatus, JsonRecord, JsonValue, RawVentureData } from "../types/deal-flow.types"

function isRecord(value: JsonValue | undefined | null): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function readJsonNumber(value: JsonValue | undefined | null, key: string): number {
  if (!isRecord(value)) return 0
  const raw = value[key]
  return typeof raw === "number" && !Number.isNaN(raw) ? raw : 0
}

export function mapVentureStageToDeal(stage: string | null | undefined): DealStage {
  return STAGE_MAP[stage || ""] || "Intake"
}

export function mapVentureStatusToDeal(status: string | null | undefined): DealStatus {
  return STATUS_MAP[status || ""] || "active"
}

export function parseFounderTypes(founderTypes: RawVentureData["founderTypes"]): string[] {
  if (Array.isArray(founderTypes)) return founderTypes.filter((type): type is string => typeof type === "string")
  try {
    const parsed: unknown = JSON.parse(founderTypes || "[]")
    return Array.isArray(parsed) ? parsed.filter((type): type is string => typeof type === "string") : []
  } catch {
    return []
  }
}

export function parseSustainabilityGoals(stgGoals: JsonValue | undefined): string[] {
  try {
    const goals = Array.isArray(stgGoals)
      ? stgGoals
      : typeof stgGoals === "string"
        ? (JSON.parse(stgGoals) as unknown)
        : []
    return Array.isArray(goals)
      ? goals.filter((goal): goal is string => typeof goal === "string").map((goal) => goal.replace("SDG_", "SDG "))
      : ["Sustainable Development"]
  } catch {
    return ["Sustainable Development"]
  }
}

export function getAssignedTeam(venture: RawVentureData): string[] {
  const team: string[] = []
  if (venture.createdBy?.name) team.push(venture.createdBy.name)
  if (venture.assignedTo?.name) team.push(venture.assignedTo.name)
  if (team.length === 0) team.push("Unassigned")
  return team
}

export function getLastActivity(venture: RawVentureData): string {
  if (venture.updatedAt) {
    const diffMs = Date.now() - new Date(venture.updatedAt).getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return "Less than 1 hour ago"
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return `${Math.floor(diffDays / 7)} weeks ago`
  }
  return "Unknown"
}

export function mapVentureToDeal(venture: RawVentureData): Deal {
  const gedsiScore = calculateDealGedsiScore(venture)
  const impactScore = calculateImpactScore(venture)
  const readinessScore = calculateReadinessScore(venture)
  const aiInsights = generateDealAIInsights(venture, gedsiScore, impactScore)
  const dealStage = mapVentureStageToDeal(venture.stage)
  const summary = venture.gedsiMetricsSummary

  const dealSize = venture.fundingRaised
    ? `$${(venture.fundingRaised / 1000000).toFixed(1)}M`
    : `$${(Math.random() * 5 + 0.5).toFixed(1)}M`

  return {
    id: venture.id,
    company: venture.name || "Unnamed venture",
    stage: dealStage,
    sector: venture.sector || "Technology",
    location: venture.location || "Southeast Asia",
    dealSize,
    probability: calculateDealProbability(venture.stage, gedsiScore, impactScore),
    expectedClose: calculateExpectedClose(venture.stage),
    team: getAssignedTeam(venture),
    lastActivity: getLastActivity(venture),
    status: mapVentureStatusToDeal(venture.status),
    gedsiScore: Math.min(100, Math.max(0, Math.round(gedsiScore))),
    impactScore: Math.min(100, Math.max(15, Math.round(impactScore))),
    readinessScore: Math.round(readinessScore),
    founderType: parseFounderTypes(venture.founderTypes),
    inclusionFocus: venture.inclusionFocus || "Impact-focused venture",
    sustainabilityGoals: parseSustainabilityGoals(venture.stgGoals),
    aiInsights,
    metrics: {
      jobsCreated: venture.jobsCreated || readJsonNumber(summary, "jobsCreated") || 0,
      communitiesServed: venture.totalBeneficiaries || readJsonNumber(summary, "communityImpact") || 0,
      womenLeadership: venture.womenEmpowered || readJsonNumber(summary, "womenLeadership") || 0,
      disabilityInclusive: (venture.disabilityInclusive || readJsonNumber(summary, "disabilityInclusion") || 0) > 0,
    },
  }
}

export function mapVenturesToDeals(ventures: RawVentureData[]): Deal[] {
  return ventures.map(mapVentureToDeal)
}
