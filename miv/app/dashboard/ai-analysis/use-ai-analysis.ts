"use client"

import { useCallback, useEffect, useState } from "react"
import {
  BarChart3,
  DollarSign,
  Globe,
  Shield,
  Target,
  Users
} from "lucide-react"
import {
  type AIAnalysis,
  type Venture,
  type VentureAnalysisData,
  calculateRiskScore,
  generateInsights,
  generateRecommendations
} from "./analysis-logic"

const analysisTypeOptions = [
  { value: "risk-assessment", label: "Risk Assessment", icon: Shield },
  { value: "impact-analysis", label: "Impact Analysis", icon: Target },
  { value: "market-analysis", label: "Market Analysis", icon: BarChart3 },
  { value: "financial-forecast", label: "Financial Forecast", icon: DollarSign },
  { value: "gedsi-assessment", label: "GEDSI Assessment", icon: Users },
  { value: "sustainability-analysis", label: "Sustainability Analysis", icon: Globe }
]

const defaultVentures: Venture[] = [
  { id: "1", name: "EcoTech Solutions", stage: "Due Diligence", sector: "Clean Energy", location: "Kenya", fundingAmount: 500000 },
  { id: "2", name: "AgriTech Innovations", stage: "Investment Ready", sector: "Agriculture", location: "Uganda", fundingAmount: 750000 },
  { id: "3", name: "HealthTech Africa", stage: "Active", sector: "Healthcare", location: "Nigeria", fundingAmount: 1200000 },
  { id: "4", name: "FinTech Mobile", stage: "Due Diligence", sector: "Financial Services", location: "Ghana", fundingAmount: 300000 }
]

export function useAIAnalysis() {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVenture, setSelectedVenture] = useState("")
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = useCallback(() => {
    setSelectedVenture("")
    setSelectedAnalysisType("")
    setCustomPrompt("")
  }, [])

  const loadAnalyses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/ventures?limit=50")
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const ventures = (data.ventures || []) as VentureAnalysisData[]

      const generatedAnalyses: AIAnalysis[] = ventures
        .filter((venture: VentureAnalysisData) => venture.aiAnalysis || (venture.gedsiMetrics?.length ?? 0) > 0)
        .slice(0, 10)
        .map((venture: VentureAnalysisData, index: number) => {
          const metrics = venture.gedsiMetrics ?? []
          const gedsiScore = metrics.length > 0
            ? metrics.reduce((sum: number, metric: { currentValue?: number }) => sum + (metric.currentValue || 0), 0) / metrics.length
            : Math.floor(Math.random() * 40) + 60

          const riskScore = calculateRiskScore(venture)
          const impactScore = Math.min(gedsiScore * 1.2, 100)

          const analysisTypeOptionsList = ["Risk Assessment", "Impact Analysis", "Market Analysis", "Financial Analysis"]
          const analysisType = analysisTypeOptionsList[index % analysisTypeOptionsList.length]

          const status = venture.aiAnalysis ? "completed" : venture.stage === "DUE_DILIGENCE" ? "processing" : "pending"

          return {
            id: `analysis-${venture.id}`,
            ventureId: venture.id,
            ventureName: venture.name,
            analysisType,
            status,
            riskScore: Math.round(riskScore),
            impactScore: Math.round(impactScore),
            recommendations: generateRecommendations(venture, analysisType),
            insights: generateInsights(venture, analysisType),
            createdAt: new Date(venture.createdAt ?? new Date().toISOString()).toISOString(),
            completedAt: status === "completed"
              ? new Date(venture.updatedAt ?? venture.createdAt ?? new Date().toISOString()).toISOString()
              : undefined
          }
        })

      setAnalyses(generatedAnalyses)
    } catch (error) {
      console.error("❌ Error fetching AI analyses:", error)
      setAnalyses([])
      setError("We couldn't load AI analyses right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  const submitAnalysis = useCallback(async () => {
    if (!selectedVenture || !selectedAnalysisType) {
      setError("Please choose a venture and analysis type before starting.")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    setTimeout(() => {
      const newAnalysis: AIAnalysis = {
        id: Date.now().toString(),
        ventureId: selectedVenture,
        ventureName: defaultVentures.find((venture) => venture.id === selectedVenture)?.name || "",
        analysisType: analysisTypeOptions.find((type) => type.value === selectedAnalysisType)?.label || "",
        status: "processing",
        riskScore: 0,
        impactScore: 0,
        recommendations: [],
        insights: [],
        createdAt: new Date().toISOString()
      }

      setAnalyses((prev) => [newAnalysis, ...prev])
      setIsAnalyzing(false)
      resetForm()
    }, 2000)
  }, [resetForm, selectedAnalysisType, selectedVenture])

  useEffect(() => {
    void loadAnalyses()
  }, [loadAnalyses])

  return {
    analyses,
    loading,
    selectedVenture,
    setSelectedVenture,
    selectedAnalysisType,
    setSelectedAnalysisType,
    customPrompt,
    setCustomPrompt,
    isAnalyzing,
    error,
    loadAnalyses,
    submitAnalysis,
    resetForm,
    analysisTypes: analysisTypeOptions,
    ventures: defaultVentures
  }
}
