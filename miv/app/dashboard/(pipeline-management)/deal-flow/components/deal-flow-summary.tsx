import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, DollarSign, Globe, Heart, Shield, Target, Users } from "lucide-react"
import type { ReactNode } from "react"
import type { SummaryMetrics } from "../types/deal-flow.types"

interface DealFlowSummaryProps {
  summary: SummaryMetrics
  variant?: "full" | "compact"
}

export function DealFlowSummary({ summary, variant = "full" }: DealFlowSummaryProps) {
  const averageValue = summary.totalDeals > 0 ? (summary.totalValue / summary.totalDeals).toFixed(1) : "NaN"

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalDeals}</div>
            <p className="text-xs text-muted-foreground">{summary.activeDeals} active deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalValue.toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Average: ${averageValue}M per deal</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-pink-500 bg-linear-to-r from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">GEDSI Score</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {summary.avgGedsiScore > 0 ? summary.avgGedsiScore.toFixed(1) : "0"}%
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" aria-hidden="true" />
              {summary.womenLedDeals} women-led ventures
            </p>
            <Progress value={summary.avgGedsiScore} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 bg-linear-to-r from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Impact Score</CardTitle>
            <Globe className="h-4 w-4 text-green-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {summary.avgImpactScore > 0 ? summary.avgImpactScore.toFixed(1) : "0"}%
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" aria-hidden="true" />
              {summary.totalCommunitiesServed} communities served
            </p>
            <Progress value={summary.avgImpactScore} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {variant === "full" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Jobs Created" value={summary.totalJobsCreated} icon={<Users className="h-4 w-4 text-blue-500" aria-hidden="true" />} />
          <MetricCard title="Communities" value={summary.totalCommunitiesServed} icon={<Globe className="h-4 w-4 text-green-500" aria-hidden="true" />} />
          <MetricCard title="Women-Led" value={summary.womenLedDeals} subtitle={`${summary.totalDeals > 0 ? ((summary.womenLedDeals / summary.totalDeals) * 100).toFixed(1) : "0"}% of portfolio`} icon={<Heart className="h-4 w-4 text-pink-500" aria-hidden="true" />} />
          <MetricCard title="Disability Inclusive" value={summary.disabilityInclusiveDeals} subtitle={`${summary.totalDeals > 0 ? ((summary.disabilityInclusiveDeals / summary.totalDeals) * 100).toFixed(1) : "0"}% of portfolio`} icon={<Shield className="h-4 w-4 text-purple-500" aria-hidden="true" />} />
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon }: { title: string; value: number; subtitle?: string; icon: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle || "Across all portfolio ventures"}</p>
      </CardContent>
    </Card>
  )
}
