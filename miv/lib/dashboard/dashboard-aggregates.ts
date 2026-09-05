import { calculateGEDSIScore } from "@/lib/gedsi-utils"
import type {
  DashboardGedsiAnalytics,
  DashboardGedsiMetric,
  DashboardPortfolioSummary,
  DashboardVenture,
} from "@/types/dashboard/types"

export function calculateGedsiAnalytics(
  ventures: DashboardVenture[],
): DashboardGedsiAnalytics {
  const venturesWithGedsiScores = ventures.filter((venture) => calculateGEDSIScore(venture) > 0)

  const averageGedsiScore =
    venturesWithGedsiScores.length > 0
      ? Math.round(
          venturesWithGedsiScores.reduce((sum, venture) => sum + calculateGEDSIScore(venture), 0) /
            venturesWithGedsiScores.length,
        )
      : 0

  const gedsiCompliantVentures = ventures.filter((venture) => calculateGEDSIScore(venture) >= 70)
  const gedsiComplianceRate =
    ventures.length > 0 ? Math.round((gedsiCompliantVentures.length / ventures.length) * 100) : 0

  return {
    averageGedsiScore,
    gedsiComplianceRate,
  }
}

export function calculatePortfolioSummary(
  ventures: DashboardVenture[],
): DashboardPortfolioSummary {
  const totalVentures = ventures.length
  const totalCapital = ventures.reduce((sum, venture) => sum + (venture.fundingRaised || 0), 0)
  const successfulVentures = ventures.filter((venture) =>
    venture.stage ? ["SERIES_A", "SERIES_B", "SERIES_C"].includes(venture.stage) : false,
  )
  const successRate =
    ventures.length > 0 ? Math.round((successfulVentures.length / ventures.length) * 100) : 0
  const averageCapitalPerVenture =
    ventures.length > 0 ? Math.round(totalCapital / ventures.length / 1000) : 0
  const stageDistribution = ventures.reduce<Record<string, number>>((acc, venture) => {
    const stage = venture.stage || "Unknown"
    acc[stage] = (acc[stage] || 0) + 1
    return acc
  }, {})

  return {
    totalVentures,
    totalCapital,
    successRate,
    averageCapitalPerVenture,
    stageDistribution,
  }
}

export function calculateOverallPerformance(
  filteredVentures: DashboardVenture[],
  gedsiMetrics: DashboardGedsiMetric[],
): number {
  const completedGedsiMetrics = gedsiMetrics.filter(
    (metric) => metric.status === "COMPLETED" || metric.status === "VERIFIED",
  )
  const gedsiCompliance =
    gedsiMetrics.length > 0
      ? Math.round((completedGedsiMetrics.length / gedsiMetrics.length) * 100)
      : 0

  const advancedVentures = filteredVentures.filter((venture) =>
    ["SERIES_A", "SERIES_B", "SERIES_C", "FUNDED"].includes(venture.stage || ""),
  )
  const progressionScore =
    filteredVentures.length > 0
      ? Math.round((advancedVentures.length / filteredVentures.length) * 100)
      : 0

  const ventureGedsiScores = filteredVentures.map((venture) => {
    const ventureMetrics = gedsiMetrics.filter((metric) => metric.ventureId === venture.id)
    const completed = ventureMetrics.filter(
      (metric) => metric.status === "COMPLETED" || metric.status === "VERIFIED",
    )
    return ventureMetrics.length > 0 ? (completed.length / ventureMetrics.length) * 100 : 0
  })
  const avgGedsiScore =
    ventureGedsiScores.length > 0
      ? Math.round(ventureGedsiScores.reduce((sum, score) => sum + score, 0) / ventureGedsiScores.length)
      : 0

  return Math.round((gedsiCompliance + progressionScore + avgGedsiScore) / 3)
}

export function calculateAverageVentureGedsiScore(ventures: DashboardVenture[]): number {
  return ventures.length > 0
    ? Math.round(ventures.reduce((sum, venture) => sum + calculateGEDSIScore(venture), 0) / ventures.length)
    : 0
}
