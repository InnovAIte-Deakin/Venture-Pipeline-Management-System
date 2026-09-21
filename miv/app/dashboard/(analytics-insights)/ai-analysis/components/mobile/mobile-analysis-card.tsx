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
import type { AIAnalysis } from "../../types/ai-analysis.types"
import { formatAnalysisDate } from "../../utils/analysis-utils"
import { AnalysisStatusBadge } from "../shared/analysis-feedback"

export function MobileAnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#138075]/15 bg-white shadow-sm">
      <div className="h-1 bg-[#138075]" />
      <CardHeader className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2A9D8F]/15 text-[#138075]">
            <Brain className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <CardTitle className="break-words text-base leading-6">
              {analysis.ventureName}
            </CardTitle>
            <Badge
              variant="outline"
              className="mt-1 max-w-full border-[#2A9D8F]/30 bg-[#2A9D8F]/10 text-[#0f6a62]"
            >
              {analysis.analysisType}
            </Badge>
          </div>
        </div>

        <CardDescription>
          Started {formatAnalysisDate(analysis.createdAt)}
        </CardDescription>

        <div className="flex items-center justify-between gap-2 border-t pt-3">
          <AnalysisStatusBadge status={analysis.status} />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-[#138075]/25 text-[#138075] hover:bg-[#2A9D8F]/10 hover:text-[#0f6a62]"
              aria-label={`View ${analysis.ventureName} analysis`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-[#138075]/25 text-[#138075] hover:bg-[#2A9D8F]/10 hover:text-[#0f6a62]"
              aria-label={`Download ${analysis.ventureName} analysis`}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {analysis.status === "completed" && (
        <CardContent className="space-y-5 border-t p-4">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4" />
              Risk &amp; Impact Scores
            </h4>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Risk Score</span>
                  <span className="font-semibold">{analysis.riskScore}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F4A261]/20">
                  <div
                    className="h-full rounded-full bg-[#F4A261]"
                    style={{ width: `${analysis.riskScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Impact Score</span>
                  <span className="font-semibold">{analysis.impactScore}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#2A9D8F]/20">
                  <div
                    className="h-full rounded-full bg-[#138075]"
                    style={{ width: `${analysis.impactScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4" />
              Key Insights
            </h4>
            <ul className="space-y-2">
              {analysis.insights.slice(0, 3).map((insight) => (
                <li
                  key={insight}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F4A261]" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
