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
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl border border-[#138075]/15 bg-white p-1.5 shadow-sm">
          <TabsTrigger
            value="all"
            className="rounded-xl py-2.5 text-xs text-slate-600 data-[state=active]:bg-[#138075] data-[state=active]:text-white"
          >
            All Analyses
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-xl py-2.5 text-xs text-slate-600 data-[state=active]:bg-[#138075] data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="processing"
            className="rounded-xl py-2.5 text-xs text-slate-600 data-[state=active]:bg-[#138075] data-[state=active]:text-white"
          >
            Processing
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="rounded-xl py-2.5 text-xs text-slate-600 data-[state=active]:bg-[#138075] data-[state=active]:text-white"
          >
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
