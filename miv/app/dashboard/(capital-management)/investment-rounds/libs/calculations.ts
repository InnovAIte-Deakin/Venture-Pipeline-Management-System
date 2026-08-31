import type { InvestmentRound, InvestmentRoundSummary, RoundFiltersState } from "./types"

export function amountInMillions(value: string) {
  return Number.parseFloat(value.replace(/[^0-9.]/g, "")) || 0
}

export function percentage(part: number, total: number) {
  return total > 0 ? (part / total) * 100 : 0
}

export function filterInvestmentRounds(rounds: InvestmentRound[], filters: RoundFiltersState) {
  const search = filters.searchTerm.toLowerCase()
  return rounds.filter((round) =>
    (round.company.toLowerCase().includes(search) || round.id.toLowerCase().includes(search) || round.location.toLowerCase().includes(search)) &&
    (filters.roundType === "all" || round.roundType === filters.roundType) &&
    (filters.stage === "all" || round.stage === filters.stage) &&
    (filters.status === "all" || round.status === filters.status) &&
    (filters.sector === "all" || round.sector === filters.sector) &&
    (filters.founderType === "all" || round.founderType.includes(filters.founderType)),
  )
}

export function calculateSummary(rounds: InvestmentRound[]): InvestmentRoundSummary {
  const totalRounds = rounds.length
  const totalTargetAmount = rounds.reduce((sum, round) => sum + amountInMillions(round.targetAmount), 0)
  const totalRaisedAmount = rounds.reduce((sum, round) => sum + amountInMillions(round.raisedAmount), 0)
  const womenLedRounds = rounds.filter((round) => round.founderType.includes("women-led")).length
  const disabilityInclusiveRounds = rounds.filter((round) => round.metrics.disabilityInclusive).length
  const average = (selector: (round: InvestmentRound) => number) => totalRounds ? rounds.reduce((sum, round) => sum + selector(round), 0) / totalRounds : 0
  return {
    totalRounds,
    openRounds: rounds.filter((round) => round.status === "open").length,
    closedRounds: rounds.filter((round) => round.status === "closed").length,
    totalTargetAmount, totalRaisedAmount,
    raisedPercentage: percentage(totalRaisedAmount, totalTargetAmount),
    avgGedsiScore: average((round) => round.gedsiScore),
    avgImpactScore: average((round) => round.impactScore),
    avgSustainabilityScore: average((round) => round.sustainabilityScore),
    totalJobsCreated: rounds.reduce((sum, round) => sum + round.metrics.jobsCreated, 0),
    totalCommunitiesServed: rounds.reduce((sum, round) => sum + round.metrics.communitiesServed, 0),
    totalCarbonReduction: rounds.reduce((sum, round) => sum + round.metrics.carbonReduction, 0),
    avgWomenLeadership: average((round) => round.metrics.womenLeadership),
    womenLedRounds, womenLedPercentage: percentage(womenLedRounds, totalRounds),
    disabilityInclusiveRounds, disabilityInclusivePercentage: percentage(disabilityInclusiveRounds, totalRounds),
  }
}

export const topGedsiRounds = (rounds: InvestmentRound[]) => [...rounds].sort((a, b) => b.gedsiScore - a.gedsiScore).slice(0, 5)
export const timelineRounds = (rounds: InvestmentRound[]) => [...rounds].sort((a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime())
export const fundingProgress = (round: InvestmentRound) => percentage(amountInMillions(round.raisedAmount), amountInMillions(round.targetAmount))
