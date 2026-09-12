"use client"

import { AIAnalysisDesktop } from "./components/desktop/ai-analysis-desktop"
import { AIAnalysisMobile } from "./components/mobile/ai-analysis-mobile"
import { AnalysisLoadingState } from "./components/shared/analysis-feedback"
import { useAIAnalysis } from "./hooks/use-ai-analysis"
import { useViewport } from "./hooks/use-viewport"

export default function AIAnalysisPage() {
  const controller = useAIAnalysis()
  const { isMobile, isReady } = useViewport()

  if (!isReady || controller.loading) {
    return <AnalysisLoadingState />
  }

  return isMobile ? (
    <AIAnalysisMobile controller={controller} />
  ) : (
    <AIAnalysisDesktop controller={controller} />
  )
}
