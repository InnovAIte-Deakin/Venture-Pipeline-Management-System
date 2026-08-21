import type {
  CapitalMetrics,
  CapitalRequest,
  CapitalStatus,
  PipelineStage,
} from "@/types/capital-facilitation"

export const getCapitalStatus = (stage: string): CapitalStatus => {
  if (["FUNDED", "SERIES_A", "SERIES_B", "SERIES_C"].includes(stage)) return "Approved"
  if (stage === "INVESTMENT_READY") return "Under Review"
  if (stage === "DUE_DILIGENCE") return "Pending"
  return "Under Review"
}

export const getCapitalStage = (stage: string): string => {
  const stageMap: Record<string, string> = {
    INTAKE: "Initial Review",
    SCREENING: "Initial Review",
    DUE_DILIGENCE: "Due Diligence",
    INVESTMENT_READY: "Term Sheet",
    FUNDED: "Documentation",
    SEED: "Documentation",
    SERIES_A: "Closed",
    SERIES_B: "Closed",
    SERIES_C: "Closed",
    EXITED: "Closed",
  }
  return stageMap[stage] || "Initial Review"
}

export const calculateCapitalProgress = (stage: string, status: CapitalStatus): number => {
  if (status === "Approved") return 100
  if (status === "Rejected") return 0

  const progressMap: Record<string, number> = {
    INTAKE: 20,
    SCREENING: 35,
    DUE_DILIGENCE: 60,
    INVESTMENT_READY: 80,
    FUNDED: 100,
    SERIES_A: 100,
    SERIES_B: 100,
    SERIES_C: 100,
  }
  return progressMap[stage] || 25
}

export const calculateMetrics = (requests: CapitalRequest[]): CapitalMetrics => {
  const totalCapital = requests.reduce((sum, request) => sum + request.amount, 0)
  return {
    totalCapital,
    activeDeals: requests.filter((request) => request.status !== "Rejected").length,
    successRate: requests.length
      ? Math.round((requests.filter((request) => request.status === "Approved").length / requests.length) * 100)
      : 0,
    averageDealSize: requests.length ? totalCapital / requests.length : 0,
  }
}

export const calculatePipelineStages = (requests: CapitalRequest[]): PipelineStage[] => {
  const stages = [
    ["Initial Review", "bg-gray-50 dark:bg-gray-800"],
    ["Due Diligence", "bg-blue-50 dark:bg-blue-900/20"],
    ["Term Sheet", "bg-yellow-50 dark:bg-yellow-900/20"],
    ["Documentation", "bg-green-50 dark:bg-green-900/20"],
    ["Closed", "bg-teal-50 dark:bg-teal-900/20"],
  ] as const

  return stages.map(([name, color]) => ({
    name,
    color,
    deals: requests.filter((request) => request.stage === name).length,
    capital: requests
      .filter((request) => request.stage === name)
      .reduce((sum, request) => sum + request.amount, 0),
  }))
}

export const calculateFundingTimeline = (requests: CapitalRequest[]): Record<string, number> => {
  const stageTimelines = new Map<string, number[]>()
  requests.forEach((request) => {
    const submitted = new Date(request.submittedDate).getTime()
    const expected = new Date(request.expectedDecision).getTime()
    const daysToClose = Math.max(0, Math.ceil((expected - submitted) / (1000 * 60 * 60 * 24)))
    const days = stageTimelines.get(request.stage) || []
    days.push(daysToClose)
    stageTimelines.set(request.stage, days)
  })

  return Object.fromEntries(
    Array.from(stageTimelines.entries()).map(([stage, days]) => [
      stage,
      Math.round(days.reduce((sum, day) => sum + day, 0) / days.length),
    ]),
  )
}

export const calculateSectorDistribution = (requests: CapitalRequest[]) => {
  const sectors = ["HealthTech", "CleanTech", "FinTech", "AgriTech"]
  return sectors.map((sector) => {
    const keyword = sector.toLowerCase().replace("tech", "")
    const count = requests.filter((request) => request.venture.toLowerCase().includes(keyword)).length
    return {
      sector,
      percentage: requests.length ? Math.round((count / requests.length) * 100) : 0,
    }
  })
}

export const calculateStatusCounts = (requests: CapitalRequest[]) => ({
  Approved: requests.filter((request) => request.status === "Approved").length,
  "Under Review": requests.filter((request) => request.status === "Under Review").length,
  Pending: requests.filter((request) => request.status === "Pending").length,
})
