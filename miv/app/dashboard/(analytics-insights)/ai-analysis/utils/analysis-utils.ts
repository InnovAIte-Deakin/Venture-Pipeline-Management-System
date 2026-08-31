import type {
  AIAnalysis,
  AnalysisStatus,
  VentureRecord,
} from "../types/ai-analysis.types"

const ANALYSIS_LABELS = [
  "Risk Assessment",
  "Impact Analysis",
  "Market Analysis",
  "Financial Analysis",
]

const RECOMMENDATIONS_BY_TYPE: Record<string, string[]> = {
  "Risk Assessment": [
    "Strengthen intellectual property protection",
    "Diversify revenue streams",
    "Enhance regulatory compliance framework",
  ],
  "Impact Analysis": [
    "Expand GEDSI metric tracking",
    "Develop community engagement programs",
    "Implement impact measurement framework",
  ],
  "Market Analysis": [
    "Conduct thorough market research",
    "Identify key competitors and positioning",
    "Develop go-to-market strategy",
  ],
  "Financial Analysis": [
    "Improve financial reporting accuracy",
    "Develop sustainable revenue model",
    "Optimize cost structure",
  ],
}

export function calculateRiskScore(venture: VentureRecord) {
  let risk = 30

  if (venture.stage === "INTAKE" || venture.stage === "SCREENING") risk += 20
  if (!venture.fundingRaised || venture.fundingRaised < 100000) risk += 15
  if (!venture.teamSize || venture.teamSize < 5) risk += 10
  if (venture.sector === "Technology" || venture.sector === "FinTech") risk -= 5
  if ((venture.gedsiMetrics?.length ?? 0) > 5) risk -= 10

  return Math.max(10, Math.min(risk, 80))
}

export function generateRecommendations(
  venture: VentureRecord,
  analysisType: string,
) {
  const recommendations = [
    ...(RECOMMENDATIONS_BY_TYPE[analysisType] ??
      RECOMMENDATIONS_BY_TYPE["Risk Assessment"]),
  ]

  if (venture.sector === "Healthcare") {
    recommendations.push("Partner with local healthcare providers")
  }
  if (venture.inclusionFocus) {
    recommendations.push("Strengthen social impact measurement")
  }
  if (!venture.fundingRaised) {
    recommendations.push("Prepare for investment readiness")
  }

  return recommendations.slice(0, 4)
}

export function generateInsights(venture: VentureRecord) {
  const insights: string[] = []

  if (venture.sector) {
    insights.push(`Strong positioning in ${venture.sector} sector`)
  }
  if ((venture.gedsiMetrics?.length ?? 0) > 0) {
    insights.push("Good GEDSI metrics tracking in place")
  }
  if (venture.inclusionFocus) {
    insights.push("Clear social impact focus")
  }
  if (venture.stage === "FUNDED" || (venture.fundingRaised ?? 0) > 0) {
    insights.push("Proven ability to raise capital")
  }
  if ((venture.teamSize ?? 0) > 10) {
    insights.push("Well-staffed team with growth capacity")
  }

  if (insights.length === 0) {
    insights.push("Venture shows potential for growth")
    insights.push("Market opportunity exists in target sector")
  }

  return insights.slice(0, 3)
}

function toIsoString(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

export function buildAnalyses(ventures: VentureRecord[]): AIAnalysis[] {
  return ventures
    .filter(
      (venture) =>
        Boolean(venture.aiAnalysis) || (venture.gedsiMetrics?.length ?? 0) > 0,
    )
    .slice(0, 10)
    .map((venture, index) => {
      const gedsiMetrics = venture.gedsiMetrics ?? []
      const gedsiScore =
        gedsiMetrics.length > 0
          ? gedsiMetrics.reduce(
              (sum, metric) => sum + (metric.currentValue ?? 0),
              0,
            ) / gedsiMetrics.length
          : Math.floor(Math.random() * 40) + 60

      const analysisType = ANALYSIS_LABELS[index % ANALYSIS_LABELS.length]
      const status: AnalysisStatus = venture.aiAnalysis
        ? "completed"
        : venture.stage === "DUE_DILIGENCE"
          ? "processing"
          : "pending"

      return {
        id: `analysis-${venture.id}`,
        ventureId: venture.id,
        ventureName: venture.name,
        analysisType,
        status,
        riskScore: Math.round(calculateRiskScore(venture)),
        impactScore: Math.round(Math.min(gedsiScore * 1.2, 100)),
        recommendations: generateRecommendations(venture, analysisType),
        insights: generateInsights(venture),
        createdAt: toIsoString(venture.createdAt),
        completedAt:
          status === "completed" ? toIsoString(venture.updatedAt) : undefined,
      }
    })
}

export function formatAnalysisDate(dateString: string) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return "Unknown date"

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getStatusClass(status: AnalysisStatus) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
  }
}
