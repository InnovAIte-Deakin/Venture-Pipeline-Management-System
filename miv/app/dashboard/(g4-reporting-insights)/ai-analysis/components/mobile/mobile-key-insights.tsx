import { Award, Brain, Target, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

export function MobileKeyInsights() {
  return (
    <div className="space-y-3">
      <Card className="rounded-2xl border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Average Risk Score
          </div>
          <div className="mt-3 text-3xl font-bold">33%</div>
          <p className="text-sm text-muted-foreground">Across all ventures</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-5 w-5 text-blue-600" />
            Average Impact Score
          </div>
          <div className="mt-3 text-3xl font-bold">80%</div>
          <p className="text-sm text-muted-foreground">High impact potential</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-purple-200 bg-purple-50/60 dark:border-purple-900 dark:bg-purple-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Award className="h-5 w-5 text-purple-600" />
            Analyses Completed
          </div>
          <div className="mt-3 text-3xl font-bold">24</div>
          <p className="text-sm text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl">
        <Brain className="h-4 w-4" />
        <AlertDescription className="leading-5">
          AI analysis provides data-driven insights to support investment
          decisions and risk assessment.
        </AlertDescription>
      </Alert>
    </div>
  )
}
