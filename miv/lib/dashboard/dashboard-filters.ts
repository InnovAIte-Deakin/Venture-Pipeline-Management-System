import type { DashboardFilters, DashboardTimeframe, DashboardVenture } from "@/types/dashboard/types"

const RANGE_DAYS: Record<string, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
}

export function getVentureCountry(venture: Pick<DashboardVenture, "location">): string {
  const location = venture.location || "Unknown"
  return location.includes(",") ? location.split(",")[1].trim() : location
}

export function filterDashboardVentures(
  ventures: DashboardVenture[],
  timeframe: DashboardTimeframe,
  filters: DashboardFilters,
): DashboardVenture[] {
  const now = new Date()
  const days = RANGE_DAYS[timeframe] ?? 30
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  return ventures.filter((venture) => {
    const createdAt = venture.createdAt ? new Date(venture.createdAt) : null
    const inRange = createdAt ? createdAt >= since : true
    const sectorOk = filters.sector
      ? String(venture.sector).toLowerCase() === filters.sector.toLowerCase()
      : true
    const stageOk = filters.stage
      ? String(venture.stage).toLowerCase() === filters.stage.toLowerCase()
      : true
    const country = getVentureCountry(venture)
    const countryOk = filters.country
      ? country.toLowerCase() === filters.country.toLowerCase()
      : true

    return inRange && sectorOk && stageOk && countryOk
  })
}
