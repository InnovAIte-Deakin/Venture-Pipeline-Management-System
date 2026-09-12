import { RefreshCw } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AIAnalysis } from "../../types/ai-analysis.types"
import { formatAnalysisDate } from "../../utils/analysis-utils"

export function MobileProcessingAnalysis({
  analysis,
}: {
  analysis: AIAnalysis
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#138075]/15 bg-white shadow-sm">
      <div className="h-1 bg-[#138075]" />
      <CardHeader className="p-4">
        <CardTitle className="flex items-start gap-2 text-base leading-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A9D8F]/15 text-[#138075]">
            <RefreshCw className="h-4 w-4 animate-spin" />
          </span>
          <span className="break-words">
            {analysis.ventureName} - {analysis.analysisType}
          </span>
        </CardTitle>
        <CardDescription>
          Started {formatAnalysisDate(analysis.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2A9D8F]/20">
            <div className="h-full w-[65%] rounded-full bg-[#138075]" />
          </div>
          <span className="text-xs font-semibold text-[#138075]">65%</span>
        </div>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">
          AI is analyzing venture data and generating insights...
        </p>
      </CardContent>
    </Card>
  )
}
