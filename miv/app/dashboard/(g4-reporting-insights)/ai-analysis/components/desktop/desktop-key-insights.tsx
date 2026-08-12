import { Award, Brain, Target, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DesktopKeyInsights() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Average Risk Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">33%</div>
            <p className="text-sm text-muted-foreground">Across all ventures</p>
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
    </div>
  )
}
