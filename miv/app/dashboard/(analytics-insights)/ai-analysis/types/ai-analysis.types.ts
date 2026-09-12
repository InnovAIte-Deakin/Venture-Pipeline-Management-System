import type { LucideIcon } from "lucide-react"

export type AnalysisStatus = "pending" | "processing" | "completed" | "failed"

export interface AIAnalysis {
  id: string
  ventureId: string
  ventureName: string
  analysisType: string
  status: AnalysisStatus
  riskScore: number
  impactScore: number
  recommendations: string[]
  insights: string[]
  createdAt: string
  completedAt?: string
}

export interface QuickAnalysisVenture {
  id: string
  name: string
  stage: string
  sector: string
  location: string
  fundingAmount: number
}

export interface AnalysisTypeOption {
  value: string
  label: string
  icon: LucideIcon
}

interface GedsiMetric {
  currentValue?: number | null
}

export interface VentureRecord {
  id: string
  name: string
  stage: string
  sector?: string | null
  fundingRaised?: number | null
  teamSize?: number | null
  inclusionFocus?: string | null
  createdAt: string
  updatedAt: string
  aiAnalysis?: unknown
  gedsiMetrics?: GedsiMetric[]
}

export interface VenturesResponse {
  ventures?: VentureRecord[]
}
