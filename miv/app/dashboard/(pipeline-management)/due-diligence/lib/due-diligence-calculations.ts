import { calculateGEDSIScore } from "@/lib/gedsi-utils"
import type { DueDiligenceItem, DueDiligenceVenture } from "../types/due-diligence.types"

export function calculateAverageCompletionTime(ventures: DueDiligenceVenture[]): number {
  if (ventures.length === 0) return 0

  const completedVentures = ventures.filter((venture) =>
    ["FUNDED", "SERIES_A", "SERIES_B", "SERIES_C", "EXITED"].includes(venture.stage || "")
  )

  if (completedVentures.length === 0) return 0

  const totalDays = completedVentures.reduce((sum, venture) => {
    const createdDate = new Date(venture.createdAt || "")
    const updatedDate = new Date(venture.updatedAt || "")
    const daysDiff = Math.floor((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    return sum + daysDiff
  }, 0)

  return Math.round(totalDays / completedVentures.length)
}

export function calculateCompletionTimeProgress(ventures: DueDiligenceVenture[]): number {
  const avgTime = calculateAverageCompletionTime(ventures)
  if (avgTime === 0) return 0

  const targetDays = 30
  const progress = Math.max(0, Math.min(100, ((targetDays - avgTime) / targetDays) * 100 + 50))
  return Math.round(progress)
}

export function calculateOnTimeCompletionRate(ventures: DueDiligenceVenture[]): number {
  if (ventures.length === 0) return 0

  const dueDiligenceVentures = ventures.filter((venture) =>
    ["DUE_DILIGENCE", "INVESTMENT_READY", "FUNDED", "SERIES_A", "SERIES_B", "SERIES_C"].includes(venture.stage || "")
  )

  if (dueDiligenceVentures.length === 0) return 0

  const onTimeVentures = dueDiligenceVentures.filter((venture) => {
    const createdDate = new Date(venture.createdAt || "")
    const updatedDate = new Date(venture.updatedAt || "")
    const daysDiff = Math.floor((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 45
  })

  return Math.round((onTimeVentures.length / dueDiligenceVentures.length) * 100)
}

export function calculateAverageGEDSIScore(ventures: DueDiligenceVenture[]): number {
  if (ventures.length === 0) return 0

  const venturesWithScores = ventures.filter((venture) => venture.gedsiScore != null && venture.gedsiScore > 0)

  if (venturesWithScores.length === 0) {
    const calculatedScores = ventures.map((venture) => calculateGEDSIScore(venture)).filter((score) => score > 0)
    if (calculatedScores.length === 0) return 0
    return Math.round(calculatedScores.reduce((sum, score) => sum + score, 0) / calculatedScores.length)
  }

  return Math.round(venturesWithScores.reduce((sum, venture) => sum + (venture.gedsiScore || 0), 0) / venturesWithScores.length)
}

export function calculateCategoryCompletion(venture: DueDiligenceVenture, category: string): number {
  let completion = 0

  switch (category) {
    case "Financial":
      if (venture.revenue) completion += 25
      if (venture.fundingRaised) completion += 25
      if (venture.lastValuation) completion += 25
      if ((venture._count?.documents || 0) >= 2) completion += 25
      break

    case "Legal":
      if (venture.operationalReadiness?.legalStructure) completion += 50
      if ((venture._count?.documents || 0) >= 1) completion += 30
      if (venture.contactEmail && venture.contactPhone) completion += 20
      break

    case "Technical":
      if (venture.operationalReadiness?.businessPlan) completion += 30
      if (venture.website) completion += 20
      if (venture.teamSize && venture.teamSize > 3) completion += 30
      if (venture.pitchSummary && venture.pitchSummary.length > 100) completion += 20
      break

    case "Market":
      if (venture.targetMarket) completion += 30
      if (venture.revenueModel) completion += 30
      if (venture.revenue && venture.revenue > 0) completion += 40
      break

    case "Compliance":
      if ((venture.gedsiMetrics?.length || 0) > 0) completion += 40
      if (venture.gedsiScore && venture.gedsiScore > 70) completion += 30
      if (venture.inclusionFocus) completion += 30
      break

    default:
      completion = 50
  }

  return Math.min(100, Math.max(0, completion))
}

export function calculateChecklistCompletion(venture: DueDiligenceVenture, category: string): boolean {
  switch (category) {
    case "Financial":
      return (venture._count?.documents || 0) >= 3 && venture.revenue != null
    case "Legal":
      return venture.operationalReadiness?.legalStructure === true
    case "Technical":
      return venture.operationalReadiness?.businessPlan === true && venture.website != null
    case "Market":
      return venture.targetMarket != null && venture.revenueModel != null
    case "Team":
      return venture.teamSize != null && venture.teamSize > 2
    case "Compliance":
      return (venture.gedsiMetrics?.length || 0) > 0
    default:
      return false
  }
}

export function calculateOverallProgress(categoryItems: DueDiligenceItem[]): number {
  return Math.round(categoryItems.reduce((sum, item) => sum + item.completion, 0) / categoryItems.length)
}

export function calculateDueDate(stage: string | null | undefined, category: string): string {
  let daysFromNow = 30

  if (stage === "DUE_DILIGENCE" || stage === "INVESTMENT_READY") {
    daysFromNow = 14
  } else if (stage === "SERIES_A" || stage === "SERIES_B") {
    daysFromNow = 30
  }

  if (category === "Financial") daysFromNow *= 0.8
  if (category === "Legal") daysFromNow *= 1.2

  const dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return dueDate.toISOString().split("T")[0]
}

export function getLastActivityTime(updatedAt: string | null | undefined): string {
  if (!updatedAt) return "Unknown"

  const diffMs = Date.now() - new Date(updatedAt).getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return "Less than 1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return `${Math.floor(diffDays / 7)} weeks ago`
}
