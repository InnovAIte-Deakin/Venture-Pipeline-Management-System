import type { GedsiMetric, SocialImpactTotals, SocialImpactVenture } from "../types/social-impact"

const safeNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0

export function getGedsiMetrics(ventures: SocialImpactVenture[]): GedsiMetric[] {
  return ventures.flatMap((venture) => Array.isArray(venture.gedsiMetrics) ? venture.gedsiMetrics : [])
}

export function aggregateSocialImpact(ventures: SocialImpactVenture[]): SocialImpactTotals {
  const locations = new Set<string>()
  const totals = ventures.reduce<SocialImpactTotals>((result, venture) => {
    const location = typeof venture.location === "string"
      ? venture.location.split(",")[0]?.trim().toLocaleLowerCase()
      : ""
    if (location) locations.add(location)

    result.totalBeneficiaries += safeNumber(venture.totalBeneficiaries)
    result.jobsCreated += safeNumber(venture.jobsCreated)
    result.womenEmpowered += safeNumber(venture.womenEmpowered)
    result.disabilityInclusive += safeNumber(venture.disabilityInclusive)
    result.youthEngaged += safeNumber(venture.youthEngaged)
    return result
  }, {
    totalBeneficiaries: 0,
    jobsCreated: 0,
    locationsRepresented: 0,
    womenEmpowered: 0,
    disabilityInclusive: 0,
    youthEngaged: 0,
  })

  totals.locationsRepresented = locations.size
  return totals
}

export function metricProgress(metric: GedsiMetric): number {
  const current = safeNumber(metric.currentValue)
  const target = safeNumber(metric.targetValue)
  return target === 0 ? 0 : Math.min(100, (current / target) * 100)
}

export function isComplete(metric: GedsiMetric) {
  return metric.status === "VERIFIED" || metric.status === "COMPLETED"
}

export function gedsiCompletionRate(metrics: GedsiMetric[]) {
  return metrics.length === 0 ? 0 : (metrics.filter(isComplete).length / metrics.length) * 100
}

export function parseFounderTypes(value: SocialImpactVenture["founderTypes"]): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (typeof value !== "string" || !value.trim()) return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}
