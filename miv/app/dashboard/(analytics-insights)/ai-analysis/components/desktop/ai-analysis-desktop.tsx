"use client"

import type { UseAIAnalysisResult } from "../../hooks/use-ai-analysis"
import { DesktopAIAnalysisHeader } from "./desktop-ai-analysis-header"
import { DesktopAnalysisResults } from "./desktop-analysis-results"
import { DesktopQuickAnalysisForm } from "./desktop-quick-analysis-form"

export function AIAnalysisDesktop({
  controller,
}: {
  controller: UseAIAnalysisResult
}) {
  return (
    <div className="space-y-6">
      <DesktopAIAnalysisHeader />
      <DesktopQuickAnalysisForm {...controller} />
      <DesktopAnalysisResults
        analyses={controller.analyses}
        error={controller.error}
        onRetry={controller.retry}
      />
    </div>
  )
}
