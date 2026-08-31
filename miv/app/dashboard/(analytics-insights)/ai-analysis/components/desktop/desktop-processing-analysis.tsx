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

export function DesktopProcessingAnalysis({
  analysis,
}: {
  analysis: AIAnalysis
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>
            {analysis.ventureName} - {analysis.analysisType}
          </span>
        </CardTitle>
        <CardDescription>
          Started {formatAnalysisDate(analysis.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Progress value={65} className="flex-1" />
          <span className="text-sm text-muted-foreground">65%</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          AI is analyzing venture data and generating insights...
        </p>
      </CardContent>
    </Card>
  )
}
