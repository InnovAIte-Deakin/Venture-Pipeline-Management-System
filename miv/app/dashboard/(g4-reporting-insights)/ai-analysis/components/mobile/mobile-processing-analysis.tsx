import { RefreshCw } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AIAnalysis } from "../../types/ai-analysis.types"
import { formatAnalysisDate } from "../../utils/analysis-utils"

export function MobileProcessingAnalysis({
  analysis,
}: {
  analysis: AIAnalysis
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="p-4">
        <CardTitle className="flex items-start gap-2 text-base leading-6">
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
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
          <Progress value={65} className="flex-1" />
          <span className="text-xs font-medium text-muted-foreground">65%</span>
        </div>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">
          AI is analyzing venture data and generating insights...
        </p>
      </CardContent>
    </Card>
  )
}
