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

export function DesktopCompletedAnalysis({
  analysis,
}: {
  analysis: AIAnalysis
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {analysis.ventureName} - {analysis.analysisType}
        </CardTitle>
        <CardDescription>
          Completed{" "}
          {formatAnalysisDate(analysis.completedAt ?? analysis.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="mb-3 font-semibold">Recommendations</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation) => (
                <li
                  key={recommendation}
                  className="flex items-start gap-2 text-sm"
                >
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Key Insights</h4>
            <ul className="space-y-2">
              {analysis.insights.map((insight) => (
                <li key={insight} className="flex items-start gap-2 text-sm">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
