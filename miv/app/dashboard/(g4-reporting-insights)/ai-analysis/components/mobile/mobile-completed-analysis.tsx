import { CheckCircle, Lightbulb } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AIAnalysis } from "../../types/ai-analysis.types"
import { formatAnalysisDate } from "../../utils/analysis-utils"

export function MobileCompletedAnalysis({
  analysis,
}: {
  analysis: AIAnalysis
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#138075]/15 bg-white shadow-sm">
      <div className="h-1 bg-[#138075]" />
      <CardHeader className="p-4">
        <CardTitle className="break-words text-base leading-6">
          {analysis.ventureName} - {analysis.analysisType}
        </CardTitle>
        <CardDescription>
          Completed{" "}
          {formatAnalysisDate(analysis.completedAt ?? analysis.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-4 pt-0">
        <div>
          <h4 className="mb-2 text-sm font-semibold">Recommendations</h4>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation) => (
              <li
                key={recommendation}
                className="flex items-start gap-2 text-sm"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#138075]" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Key Insights</h4>
          <ul className="space-y-2">
            {analysis.insights.map((insight) => (
              <li key={insight} className="flex items-start gap-2 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#F4A261]" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
