"use client"

import { useCallback, useEffect, useState } from "react"
import { ANALYSIS_TYPES } from "../constants/analysis-types"
import { QUICK_ANALYSIS_VENTURES } from "../mock-data/ventures.mock-data"
import type {
  AIAnalysis,
  VenturesResponse,
} from "../types/ai-analysis.types"
import { buildAnalyses } from "../utils/analysis-utils"

export function useAIAnalysis() {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVenture, setSelectedVenture] = useState("")
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/ventures?limit=50")
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ventures: ${response.status} ${response.statusText}`,
        )
      }

      const data = (await response.json()) as VenturesResponse
      const ventures = Array.isArray(data.ventures) ? data.ventures : []

      console.log(`📊 Found ${ventures.length} ventures for AI analysis`)

      const generatedAnalyses = buildAnalyses(ventures)
      setAnalyses(generatedAnalyses)

      console.log(
        `✅ Successfully generated ${generatedAnalyses.length} AI analyses from database data`,
      )
    } catch (fetchError) {
      console.error("❌ Error fetching AI analyses:", fetchError)
      setAnalyses([])
      setError(
        "We could not load the AI analyses. Check the local services and try again.",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAnalyses()
  }, [fetchAnalyses])

  const startAnalysis = () => {
    if (!selectedVenture || !selectedAnalysisType) return

    setIsAnalyzing(true)

    window.setTimeout(() => {
      const newAnalysis: AIAnalysis = {
        id: Date.now().toString(),
        ventureId: selectedVenture,
        ventureName:
          QUICK_ANALYSIS_VENTURES.find(
            (venture) => venture.id === selectedVenture,
          )?.name ?? "",
        analysisType:
          ANALYSIS_TYPES.find((type) => type.value === selectedAnalysisType)
            ?.label ?? "",
        status: "processing",
        riskScore: 0,
        impactScore: 0,
        recommendations: [],
        insights: [],
        createdAt: new Date().toISOString(),
      }

      setAnalyses((previousAnalyses) => [newAnalysis, ...previousAnalyses])
      setIsAnalyzing(false)
      setSelectedVenture("")
      setSelectedAnalysisType("")
      setCustomPrompt("")
    }, 2000)
  }

  return {
    analyses,
    loading,
    error,
    selectedVenture,
    selectedAnalysisType,
    customPrompt,
    isAnalyzing,
    setSelectedVenture,
    setSelectedAnalysisType,
    setCustomPrompt,
    startAnalysis,
    retry: fetchAnalyses,
  }
}

export type UseAIAnalysisResult = ReturnType<typeof useAIAnalysis>
