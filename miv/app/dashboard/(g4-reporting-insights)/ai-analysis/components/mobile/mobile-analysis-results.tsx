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
import { MobileAnalysisCard } from "./mobile-analysis-card"
import { MobileCompletedAnalysis } from "./mobile-completed-analysis"
import { MobileKeyInsights } from "./mobile-key-insights"
import { MobileProcessingAnalysis } from "./mobile-processing-analysis"

interface MobileAnalysisResultsProps {
  analyses: AIAnalysis[]
  error: string | null
  onRetry: () => void
}

export function MobileAnalysisResults({
  analyses,
  error,
  onRetry,
}: MobileAnalysisResultsProps) {
  const completedAnalyses = analyses.filter(
    (analysis) => analysis.status === "completed",
  )
  const processingAnalyses = analyses.filter(
    (analysis) => analysis.status === "processing",
  )

  return (
    <div className="space-y-4">
      {error && <AnalysisErrorAlert error={error} onRetry={onRetry} />}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl p-1">
          <TabsTrigger value="all" className="py-2 text-xs">
            All Analyses
          </TabsTrigger>
          <TabsTrigger value="completed" className="py-2 text-xs">
            Completed
          </TabsTrigger>
          <TabsTrigger value="processing" className="py-2 text-xs">
            Processing
          </TabsTrigger>
          <TabsTrigger value="insights" className="py-2 text-xs">
            Key Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {analyses.length > 0 ? (
            analyses.map((analysis) => (
              <MobileAnalysisCard key={analysis.id} analysis={analysis} />
            ))
          ) : (
            <AnalysisEmptyState
              compact
              title="No analyses yet"
              description="Use Quick Analysis above to generate the first result."
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedAnalyses.length > 0 ? (
            completedAnalyses.map((analysis) => (
              <MobileCompletedAnalysis
                key={analysis.id}
                analysis={analysis}
              />
            ))
          ) : (
            <AnalysisEmptyState
              compact
              title="No completed analyses"
              description="Completed results will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-3">
          {processingAnalyses.length > 0 ? (
            processingAnalyses.map((analysis) => (
              <MobileProcessingAnalysis
                key={analysis.id}
                analysis={analysis}
              />
            ))
          ) : (
            <AnalysisEmptyState
              compact
              title="No analyses processing"
              description="Running analyses will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="insights">
          <MobileKeyInsights />
        </TabsContent>
      </Tabs>
    </div>
  )
}
