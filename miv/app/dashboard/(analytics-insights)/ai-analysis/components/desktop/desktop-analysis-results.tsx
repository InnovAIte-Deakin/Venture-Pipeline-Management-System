import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { AIAnalysis } from "../../types/ai-analysis.types"
import {
  AnalysisEmptyState,
  AnalysisErrorAlert,
} from "../shared/analysis-feedback"
import { DesktopAnalysisCard } from "./desktop-analysis-card"
import { DesktopCompletedAnalysis } from "./desktop-completed-analysis"
import { DesktopKeyInsights } from "./desktop-key-insights"
import { DesktopProcessingAnalysis } from "./desktop-processing-analysis"

interface DesktopAnalysisResultsProps {
  analyses: AIAnalysis[]
  error: string | null
  onRetry: () => void
}

export function DesktopAnalysisResults({
  analyses,
  error,
  onRetry,
}: DesktopAnalysisResultsProps) {
  const completedAnalyses = analyses.filter(
    (analysis) => analysis.status === "completed",
  )
  const processingAnalyses = analyses.filter(
    (analysis) => analysis.status === "processing",
  )

  return (
    <div className="space-y-4">
      {error && <AnalysisErrorAlert error={error} onRetry={onRetry} />}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Analyses</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {analyses.length > 0 ? (
            analyses.map((analysis) => (
              <DesktopAnalysisCard key={analysis.id} analysis={analysis} />
            ))
          ) : (
            <AnalysisEmptyState
              title="No analyses yet"
              description="Choose a venture and analysis type above to start the first analysis."
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAnalyses.length > 0 ? (
            completedAnalyses.map((analysis) => (
              <DesktopCompletedAnalysis
                key={analysis.id}
                analysis={analysis}
              />
            ))
          ) : (
            <AnalysisEmptyState
              title="No completed analyses"
              description="Completed analysis results will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {processingAnalyses.length > 0 ? (
            processingAnalyses.map((analysis) => (
              <DesktopProcessingAnalysis
                key={analysis.id}
                analysis={analysis}
              />
            ))
          ) : (
            <AnalysisEmptyState
              title="No analyses processing"
              description="Analyses that are currently running will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="insights">
          <DesktopKeyInsights />
        </TabsContent>
      </Tabs>
    </div>
  )
}
