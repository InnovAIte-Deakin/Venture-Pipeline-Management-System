import type { GEDSIMetric, GedsiCategory, GedsiInsightSummary, Venture } from "../types/gedsi-tracker.types"

export const GEDSI_CATEGORIES: GedsiCategory[] = ["Gender", "Disability", "Social Inclusion", "Cross-cutting"]

export const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export const WASHINGTON_GROUP_QUESTIONS = [
  "Do you have difficulty seeing, even if wearing glasses?",
  "Do you have difficulty hearing, even if using a hearing aid?",
  "Do you have difficulty walking or climbing steps?",
  "Do you have difficulty remembering or concentrating?",
  "Do you have difficulty with self-care such as washing all over or dressing?",
  "Using your usual language, do you have difficulty communicating?",
]

export const WASHINGTON_GROUP_RESPONSES = [
  "No difficulty",
  "Some difficulty",
  "A lot of difficulty",
  "Cannot do at all",
]

export const mockMetrics: GEDSIMetric[] = [
  {
    id: "1",
    ventureId: "1",
    ventureName: "GreenTech Solutions",
    metricCode: "OI.1",
    metricName: "Number of women-led ventures supported",
    category: "Gender",
    targetValue: 100,
    currentValue: 75,
    unit: "ventures",
    status: "In Progress",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    ventureId: "1",
    ventureName: "GreenTech Solutions",
    metricCode: "OI.2",
    metricName: "Ventures with disability inclusion",
    category: "Disability",
    targetValue: 50,
    currentValue: 30,
    unit: "ventures",
    status: "In Progress",
    lastUpdated: "2024-01-15",
  },
  {
    id: "3",
    ventureId: "2",
    ventureName: "EcoFarm Vietnam",
    metricCode: "OI.3",
    metricName: "Rural communities served",
    category: "Social Inclusion",
    targetValue: 200,
    currentValue: 150,
    unit: "communities",
    status: "Verified",
    verificationDate: "2024-01-10",
    lastUpdated: "2024-01-10",
  },
]

export const mockVentures: Venture[] = [
  {
    id: "1",
    name: "GreenTech Solutions",
    sector: "CleanTech",
    location: "Vietnam",
    gedsiScore: 85,
    status: "Active",
    founderTypes: ["women-led", "rural-focus"],
  },
  {
    id: "2",
    name: "EcoFarm Vietnam",
    sector: "Agriculture",
    location: "Vietnam",
    gedsiScore: 92,
    status: "Active",
    founderTypes: ["women-led", "disability-inclusive"],
  },
]

export const mockAiInsights: GedsiInsightSummary = {
  trendAnalysis: "GEDSI metrics show 15% improvement in gender inclusion over the last quarter",
  recommendations: "Focus on disability inclusion metrics and rural community engagement",
  riskAlerts: "3 metrics are overdue and require immediate attention",
}
