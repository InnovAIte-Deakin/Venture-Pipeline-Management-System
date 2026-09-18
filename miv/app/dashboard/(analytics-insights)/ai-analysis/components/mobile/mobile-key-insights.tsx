import { Award, Brain, Target, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

export function MobileKeyInsights() {
  return (
    <div className="space-y-3">
      <Card className="rounded-2xl border-[#F4A261]/30 bg-[#F4A261]/10 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-5 w-5 text-[#a75d18]" />
            Average Risk Score
          </div>
          <div className="mt-3 text-3xl font-bold">33%</div>
          <p className="text-sm text-muted-foreground">Across all ventures</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-[#138075]/25 bg-[#2A9D8F]/10 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-5 w-5 text-[#138075]" />
            Average Impact Score
          </div>
          <div className="mt-3 text-3xl font-bold">80%</div>
          <p className="text-sm text-muted-foreground">High impact potential</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-[#2A9D8F]/30 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Award className="h-5 w-5 text-[#2A9D8F]" />
            Analyses Completed
          </div>
          <div className="mt-3 text-3xl font-bold">24</div>
          <p className="text-sm text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-[#138075]/20 bg-[#F8F9FA]">
        <Brain className="h-4 w-4 text-[#138075]" />
        <AlertDescription className="leading-5">
          AI analysis provides data-driven insights to support investment
          decisions and risk assessment.
        </AlertDescription>
      </Alert>
    </div>
  )
}
