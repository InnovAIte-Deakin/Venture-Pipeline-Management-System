import { Brain, Download, Eye, Lightbulb, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { AnalysisStatusBadge } from "../shared/analysis-feedback"

export function DesktopAnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
              <Brain className="h-5 w-5 shrink-0" />
              <span>{analysis.ventureName}</span>
              <Badge variant="outline">{analysis.analysisType}</Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Started {formatAnalysisDate(analysis.createdAt)}
              {analysis.completedAt &&
                ` • Completed ${formatAnalysisDate(analysis.completedAt)}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AnalysisStatusBadge status={analysis.status} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={`View ${analysis.ventureName} analysis`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={`Download ${analysis.ventureName} analysis`}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {analysis.status === "completed" && (
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4" />
                <span>Risk &amp; Impact Scores</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span>{analysis.riskScore}%</span>
                  </div>
                  <Progress value={analysis.riskScore} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Impact Score</span>
                    <span>{analysis.impactScore}%</span>
                  </div>
                  <Progress value={analysis.impactScore} className="h-2" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4" />
                <span>Key Insights</span>
              </h4>
              <ul className="space-y-2">
                {analysis.insights.slice(0, 3).map((insight) => (
                  <li
                    key={insight}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
