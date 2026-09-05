import type { PortfolioInsights, VentureRecord } from "../types"

const numeric = (value: string | number | null | undefined) => { const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? ""); return Number.isFinite(parsed) ? parsed : 0 }
const record = (value: VentureRecord["aiAnalysis"]): Record<string, unknown> | null => {
  if (!value) return null
  if (typeof value === "object") return value
  try { const parsed: unknown = JSON.parse(value); return typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : null } catch { return null }
}
export const stringList = (value: string | string[] | null | undefined): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (!value) return []
  try { const parsed: unknown = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [] } catch { return [] }
}
export const calculateGedsiScore = (venture: VentureRecord): number => {
  const analysisScore = record(venture.aiAnalysis)?.gedsiScore
  if (typeof analysisScore === "number" && Number.isFinite(analysisScore)) return Math.max(0, Math.min(Math.round(analysisScore), 100))
  const summary = record(venture.gedsiMetricsSummary)
  const scores = ["womenLeadership", "disabilityInclusion", "accessibilityScore", "diversityScore"].map((key) => summary?.[key]).filter((score): score is number => typeof score === "number" && Number.isFinite(score) && score >= 0)
  if (scores.length) return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  const metrics = (venture.gedsiMetrics ?? []).flatMap(({ currentValue, targetValue }) => typeof currentValue === "number" && typeof targetValue === "number" && targetValue > 0 ? [Math.min(currentValue / targetValue * 100, 100)] : [])
  return metrics.length ? Math.round(metrics.reduce((sum, score) => sum + score, 0) / metrics.length) : 0
}
export const calculateImpactScore = (venture: VentureRecord): number => {
  let score = 40 + Math.min(numeric(venture.revenue) / 100_000, 20) + Math.min(numeric(venture.fundingRaised) / 1_000_000, 15)
  if (numeric(venture.teamSize) > 1) score += Math.min(numeric(venture.teamSize), 10)
  score += Math.min(stringList(venture.gedsiGoals).length * 3, 15)
  const points: Record<string, number> = { "women-led": 8, "disability-inclusive": 8, "rural-focus": 5, "indigenous-led": 6, "youth-led": 4 }
  score += stringList(venture.founderTypes).reduce((sum, type) => sum + (points[type] ?? 0), 0)
  score += Math.min((venture.gedsiMetrics ?? []).filter(({ status }) => status === "VERIFIED" || status === "COMPLETED").length * 2, 10)
  const multiplier: Record<string, number> = { FUNDED: 1.2, SERIES_A: 1.3, SERIES_B: 1.4, SERIES_C: 1.5, EXITED: 1.6 }
  return Math.min(Math.round(score * (multiplier[venture.stage ?? ""] ?? 1)), 100)
}
export const calculateReadinessScore = (venture: VentureRecord): number => {
  let score = 30
  for (const readiness of [venture.operationalReadiness, venture.capitalReadiness]) { const values = Object.values(readiness ?? {}); if (values.length) score += values.filter(Boolean).length / values.length * 35 }
  if (numeric(venture.revenue) > 0) score += 5; if (numeric(venture.teamSize) >= 3) score += 5; if (venture.website) score += 3; if ((venture.pitchSummary?.length ?? 0) > 100) score += 2
  const docs = venture._count?.documents ?? 0; score += docs >= 5 ? 5 : docs >= 3 ? 3 : docs >= 1 ? 1 : 0
  return Math.min(Math.round(score), 100)
}
export const generateAIInsights = (venture: VentureRecord, gedsiScore: number, impactScore: number): PortfolioInsights => {
  const analysis = record(venture.aiAnalysis); const alerts: string[] = []; let priority: PortfolioInsights["priority"] = "medium"; let nextAction = "Continue monitoring performance"; let daysUntilAction = 30
  const risk = typeof analysis?.riskAssessment === "string" ? analysis.riskAssessment.toLowerCase() : ""
  if (risk.includes("high risk") || risk.includes("urgent")) { priority = "urgent"; daysUntilAction = 3 } else if (risk.includes("medium risk")) { priority = "high"; daysUntilAction = 7 }
  if (Array.isArray(analysis?.recommendations) && typeof analysis.recommendations[0] === "string") nextAction = analysis.recommendations[0]
  if (Array.isArray(analysis?.alerts)) alerts.push(...analysis.alerts.filter((item): item is string => typeof item === "string"))
  if (!alerts.length) {
    if (gedsiScore < 60) { priority = "urgent"; nextAction = "Improve GEDSI metrics and inclusion practices"; daysUntilAction = 7; alerts.push("GEDSI score below acceptable threshold") }
    else if (gedsiScore < 75) { priority = "high"; nextAction = "Review and enhance GEDSI integration"; daysUntilAction = 14; alerts.push("GEDSI score needs improvement") }
    else if (impactScore > 85) { priority = "high"; nextAction = "Consider additional investment or expansion support"; daysUntilAction = 14; alerts.push("High impact performance - scaling opportunity") }
    if (!(venture.gedsiMetrics?.length ?? 0)) alerts.push("No GEDSI metrics recorded")
    if (!(venture._count?.capitalActivities ?? 0)) alerts.push("No capital activities recorded")
    if ((venture._count?.documents ?? 0) < 3) alerts.push("Insufficient documentation")
  }
  const docs = venture._count?.documents ?? 0
  const riskLevel: PortfolioInsights["riskLevel"] = gedsiScore > 80 && impactScore > 70 && docs >= 3 ? "low" : gedsiScore < 60 || impactScore < 40 || docs < 2 ? "high" : "medium"
  return { riskLevel, priority, nextAction, daysUntilAction, alerts: alerts.slice(0, 3) }
}
