"use client"

import type { UseAIAnalysisResult } from "../../hooks/use-ai-analysis"
import { MobileAIAnalysisHeader } from "./mobile-ai-analysis-header"
import { MobileAnalysisResults } from "./mobile-analysis-results"
import { MobileQuickAnalysisForm } from "./mobile-quick-analysis-form"

export function AIAnalysisMobile({
  controller,
}: {
  controller: UseAIAnalysisResult
}) {
  return (
    <div className="space-y-5 pb-4">
      <MobileAIAnalysisHeader />
      <MobileQuickAnalysisForm {...controller} />
      <MobileAnalysisResults
        analyses={controller.analyses}
        error={controller.error}
        onRetry={controller.retry}
      />
    </div>
  )
}
