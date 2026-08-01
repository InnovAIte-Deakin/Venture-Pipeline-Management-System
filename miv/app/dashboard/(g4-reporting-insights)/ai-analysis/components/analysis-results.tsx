import {
  AlertTriangle,
  Award,
  Brain,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Lightbulb,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type {
  AIAnalysis,
  AnalysisStatus,
} from "../types/ai-analysis.types"
import {
  formatAnalysisDate,
  getStatusClass,
} from "../utils/analysis-utils"

interface AnalysisResultsProps {
  analyses: AIAnalysis[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function StatusIcon({ status }: { status: AnalysisStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "processing":
      return <RefreshCw className="h-4 w-4 animate-spin" />
    case "pending":
      return <Clock className="h-4 w-4" />
    case "failed":
      return <AlertTriangle className="h-4 w-4" />
  }
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <Brain className="mb-3 h-8 w-8 text-muted-foreground" />
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function AllAnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
              <Brain className="h-5 w-5 shrink-0" />
              <span className="break-words">{analysis.ventureName}</span>
              <Badge variant="outline">{analysis.analysisType}</Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Started {formatAnalysisDate(analysis.createdAt)}
              {analysis.completedAt &&
                ` • Completed ${formatAnalysisDate(analysis.completedAt)}`}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusClass(analysis.status)}>
              <StatusIcon status={analysis.status} />
              <span className="ml-1 capitalize">{analysis.status}</span>
            </Badge>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

export function AnalysisResults({
  analyses,
  loading,
  error,
  onRetry,
}: AnalysisResultsProps) {
  if (loading) {
    return (
      <Card role="status" aria-live="polite">
        <CardContent className="flex items-center justify-center gap-2 py-12">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading AI analyses...</span>
        </CardContent>
      </Card>
    )
  }

  const completedAnalyses = analyses.filter(
    (analysis) => analysis.status === "completed",
  )
  const processingAnalyses = analyses.filter(
    (analysis) => analysis.status === "processing",
  )

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unable to load analyses</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
          <TabsTrigger value="all" className="whitespace-normal py-2 text-xs sm:text-sm">
            All Analyses
          </TabsTrigger>
          <TabsTrigger value="completed" className="whitespace-normal py-2 text-xs sm:text-sm">
            Completed
          </TabsTrigger>
          <TabsTrigger value="processing" className="whitespace-normal py-2 text-xs sm:text-sm">
            Processing
          </TabsTrigger>
          <TabsTrigger value="insights" className="whitespace-normal py-2 text-xs sm:text-sm">
            Key Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {analyses.length > 0 ? (
            analyses.map((analysis) => (
              <AllAnalysisCard key={analysis.id} analysis={analysis} />
            ))
          ) : (
            <EmptyState
              title="No analyses yet"
              description="Choose a venture and analysis type above to start the first analysis."
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAnalyses.length > 0 ? (
            completedAnalyses.map((analysis) => (
              <Card key={analysis.id}>
                <CardHeader>
                  <CardTitle className="break-words text-lg">
                    {analysis.ventureName} - {analysis.analysisType}
                  </CardTitle>
                  <CardDescription>
                    Completed{" "}
                    {formatAnalysisDate(
                      analysis.completedAt ?? analysis.createdAt,
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                          <li
                            key={insight}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              title="No completed analyses"
              description="Completed analysis results will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {processingAnalyses.length > 0 ? (
            processingAnalyses.map((analysis) => (
              <Card key={analysis.id}>
                <CardHeader>
                  <CardTitle className="flex items-start gap-2 text-lg">
                    <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
                    <span className="break-words">
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
            ))
          ) : (
            <EmptyState
              title="No analyses processing"
              description="Analyses that are currently running will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Average Risk Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">33%</div>
                <p className="text-sm text-muted-foreground">
                  Across all ventures
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Average Impact Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">80%</div>
                <p className="text-sm text-muted-foreground">
                  High impact potential
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span>Analyses Completed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              AI analysis provides data-driven insights to support investment
              decisions and risk assessment. All analyses are performed using
              advanced machine learning models trained on venture capital data.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
