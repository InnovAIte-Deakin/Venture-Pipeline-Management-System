export interface AIAnalysis {
  id: string
  ventureId: string
  ventureName: string
  analysisType: string
  status: "pending" | "processing" | "completed" | "failed"
  riskScore: number
  impactScore: number
  recommendations: string[]
  insights: string[]
  createdAt: string
  completedAt?: string
}

export interface Venture {
  id: string
  name: string
  stage: string
  sector: string
  location: string
  fundingAmount: number
}

export interface VentureAnalysisData extends Omit<Venture, "stage"> {
  aiAnalysis?: unknown
  gedsiMetrics?: Array<{ currentValue?: number }>
  fundingRaised?: number
  teamSize?: number
  inclusionFocus?: boolean
  createdAt?: string
  updatedAt?: string
  stage?: string
}

export const calculateRiskScore = (venture: VentureAnalysisData) => {
  let risk = 30

  if (venture.stage === "INTAKE" || venture.stage === "SCREENING") risk += 20
  if (!venture.fundingRaised || venture.fundingRaised < 100000) risk += 15
  if (!venture.teamSize || venture.teamSize < 5) risk += 10
  if (venture.sector === "Technology" || venture.sector === "FinTech") risk -= 5
  if (venture.gedsiMetrics?.length && venture.gedsiMetrics.length > 5) risk -= 10

  return Math.max(10, Math.min(risk, 80))
}

export const generateRecommendations = (venture: VentureAnalysisData, analysisType: string) => {
  const baseRecs = {
    "Risk Assessment": [
      "Strengthen intellectual property protection",
      "Diversify revenue streams",
      "Enhance regulatory compliance framework"
    ],
    "Impact Analysis": [
      "Expand GEDSI metric tracking",
      "Develop community engagement programs",
      "Implement impact measurement framework"
    ],
    "Market Analysis": [
      "Conduct thorough market research",
      "Identify key competitors and positioning",
      "Develop go-to-market strategy"
    ],
    "Financial Analysis": [
      "Improve financial reporting accuracy",
      "Develop sustainable revenue model",
      "Optimize cost structure"
    ]
  }

  const recs = [...(baseRecs[analysisType as keyof typeof baseRecs] || baseRecs["Risk Assessment"])]

  if (venture.sector === "Healthcare") {
    recs.push("Partner with local healthcare providers")
  }
  if (venture.inclusionFocus) {
    recs.push("Strengthen social impact measurement")
  }
  if (!venture.fundingRaised) {
    recs.push("Prepare for investment readiness")
  }

  return recs.slice(0, 4)
}

export const generateInsights = (venture: VentureAnalysisData, analysisType: string) => {
  const insights: string[] = []

  if (venture.sector) {
    insights.push(`Strong positioning in ${venture.sector} sector`)
  }
  if (venture.gedsiMetrics?.length) {
    insights.push("Good GEDSI metrics tracking in place")
  }
  if (venture.inclusionFocus) {
    insights.push("Clear social impact focus")
  }
  if (venture.stage === "FUNDED" || (venture.fundingRaised || 0) > 0) {
    insights.push("Proven ability to raise capital")
  }
  if ((venture.teamSize || 0) > 10) {
    insights.push("Well-staffed team with growth capacity")
  }

  if (insights.length === 0) {
    insights.push("Venture shows potential for growth")
    insights.push("Market opportunity exists in target sector")
  }

  return insights.slice(0, 3)
}

export const getStatusClasses = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const formatAnalysisDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

