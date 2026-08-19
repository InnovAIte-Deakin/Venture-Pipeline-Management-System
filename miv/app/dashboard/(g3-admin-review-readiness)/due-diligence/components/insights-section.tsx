import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Lightbulb, Plus, TrendingUp } from "lucide-react"
import {
  calculateAverageCompletionTime,
  calculateAverageGEDSIScore,
  calculateCompletionTimeProgress,
  calculateOnTimeCompletionRate
} from "../lib/due-diligence-calculations"
import type { DueDiligenceVenture } from "../types/due-diligence.types"

interface InsightsSectionProps {
  ventures: DueDiligenceVenture[]
}

export function InsightsSection({ ventures }: InsightsSectionProps) {
  const averageCompletionTime = calculateAverageCompletionTime(ventures)
  const completionTimeProgress = calculateCompletionTimeProgress(ventures)
  const onTimeCompletionRate = calculateOnTimeCompletionRate(ventures)
  const averageGEDSIScore = calculateAverageGEDSIScore(ventures)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Automated analysis of due diligence progress and risks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Portfolio Risk Assessment</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Current portfolio shows <strong>medium risk</strong> with 3 overdue items requiring immediate attention.
                Financial reviews are progressing 15% faster than legal reviews on average.
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">GEDSI Compliance</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                85% of active due diligence processes meet GEDSI requirements.
                Inclusive Learning Technologies and Youth Climate Innovators show exceptional GEDSI alignment.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Resource Allocation</h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Sarah Johnson is assigned to 60% of high-priority items. Consider redistributing workload for optimal efficiency.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trends
            </CardTitle>
            <CardDescription>
              Key metrics and trends over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ventures.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Performance Data Available</h3>
                <p className="text-muted-foreground mb-4">
                  Add ventures to the pipeline to see performance trends and completion metrics.
                </p>
                <Button onClick={() => window.location.href = "/dashboard/venture-intake"}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Venture
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm">Average Completion Time</span>
                    <span className="font-medium">
                      {averageCompletionTime} days
                    </span>
                  </div>
                  <Progress value={completionTimeProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Based on {ventures.length} ventures in pipeline
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm">On-Time Completion Rate</span>
                    <span className="font-medium">
                      {onTimeCompletionRate}%
                    </span>
                  </div>
                  <Progress value={onTimeCompletionRate} className="h-2" />
                  <div className="text-xs text-muted-foreground">Target: 80%</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm">GEDSI Score Average</span>
                    <span className="font-medium">
                      {averageGEDSIScore}/100
                    </span>
                  </div>
                  <Progress value={averageGEDSIScore} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {averageGEDSIScore >= 75 ? "Above" : "Below"} MIV target of 75
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>
            AI-generated recommendations for improving due diligence efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900 dark:text-red-100">Urgent Action Required</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Youth Climate Innovators legal review is 95% behind schedule. Consider assigning additional legal resources or extending deadline.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Take Action
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Process Optimization</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Technical assessments consistently take 30% longer than estimated. Consider updating time allocation models.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Review Process
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 dark:text-green-100">Best Practice</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Inclusive Learning Technologies shows excellent progress across all categories. Consider this as a template for other ventures.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
