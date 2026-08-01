"use client"

import { AIAnalysisHeader } from "./components/ai-analysis-header"
import { AnalysisResults } from "./components/analysis-results"
import { QuickAnalysisForm } from "./components/quick-analysis-form"
import { useAIAnalysis } from "./hooks/use-ai-analysis"

export default function AIAnalysisPage() {
  const {
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
    retry,
  } = useAIAnalysis()

  return (
    <div className="space-y-6">
      <AIAnalysisHeader />

      <QuickAnalysisForm
        selectedVenture={selectedVenture}
        selectedAnalysisType={selectedAnalysisType}
        customPrompt={customPrompt}
        isAnalyzing={isAnalyzing}
        onVentureChange={setSelectedVenture}
        onAnalysisTypeChange={setSelectedAnalysisType}
        onCustomPromptChange={setCustomPrompt}
        onStartAnalysis={startAnalysis}
      />

      <AnalysisResults
        analyses={analyses}
        loading={loading}
        error={error}
        onRetry={retry}
      />
    </div>
  )
}
