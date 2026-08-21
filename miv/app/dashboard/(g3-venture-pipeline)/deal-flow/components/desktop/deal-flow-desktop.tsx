import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DealFlowFilters } from "../deal-flow-filters"
import { DealFlowSummary } from "../deal-flow-summary"
import { PipelineBoard } from "./pipeline-board"
import { DealTable } from "./deal-table"
import { RiskBadge } from "../shared/risk-badge"
import type { DealFlowState } from "../../types/deal-flow.types"
import { AlertCircle, ArrowRight, CheckCircle, Globe, Heart, Lightbulb, Sparkles, XCircle, Zap } from "lucide-react"
import type { ReactNode } from "react"

export function DealFlowDesktop({ state }: { state: DealFlowState }) {
  return (
    <Tabs value={state.activeView} onValueChange={(value) => state.actions.setActiveView(value as DealFlowState["activeView"])} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        <TabsTrigger value="impact">Impact</TabsTrigger>
        <TabsTrigger value="insights">AI Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <DealFlowSummary summary={state.summary} />
      </TabsContent>

      <TabsContent value="pipeline" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <DealFlowFilters filters={state.filters} onChange={state.actions.setFilters} />
          </CardContent>
        </Card>
        <PipelineBoard
          stageGroups={state.stageGroups}
          summary={state.summary}
          bottlenecks={state.bottlenecks}
          highPerformers={state.highPerformers}
          selectedStageForFilter={state.selectedStageForFilter}
          hoveredStage={state.hoveredStage}
          onStageClick={state.actions.handleStageClick}
          onStageFilter={state.actions.handleStageFilter}
          onHoverStage={state.actions.setHoveredStage}
        />
        <DealTable deals={state.filteredDeals} onViewDeal={state.actions.handleViewDeal} onEditDeal={state.actions.handleEditDeal} />
      </TabsContent>

      <TabsContent value="impact" className="space-y-6">
        <ImpactView state={state} />
      </TabsContent>

      <TabsContent value="insights" className="space-y-6">
        <InsightsView state={state} />
      </TabsContent>
    </Tabs>
  )
}

function ImpactView({ state }: { state: DealFlowState }) {
  const youthLed = state.deals.filter((deal) => deal.founderType.includes("youth-led")).length
  const ruralFocus = state.deals.filter((deal) => deal.founderType.includes("rural-focus")).length

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" aria-hidden="true" />
              Impact Metrics Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricRow label="Total Jobs Created" value={state.summary.totalJobsCreated.toLocaleString()} />
            <MetricRow label="Communities Served" value={String(state.summary.totalCommunitiesServed)} />
            <MetricRow label="Average GEDSI Score" value={`${state.summary.avgGedsiScore.toFixed(1)}%`} />
            <MetricRow label="Average Impact Score" value={`${state.summary.avgImpactScore.toFixed(1)}%`} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" aria-hidden="true" />
              GEDSI Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DistributionRow label="Women-Led Ventures" count={state.summary.womenLedDeals} total={state.summary.totalDeals} />
            <DistributionRow label="Disability Inclusive" count={state.summary.disabilityInclusiveDeals} total={state.summary.totalDeals} />
            <DistributionRow label="Youth-Led Ventures" count={youthLed} total={state.summary.totalDeals} />
            <DistributionRow label="Rural Focus" count={ruralFocus} total={state.summary.totalDeals} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impact Details by Venture</CardTitle>
          <CardDescription>Detailed impact metrics for each venture in the pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.deals.map((deal) => (
              <div key={deal.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{deal.company}</h3>
                    <p className="text-sm text-muted-foreground">{deal.inclusionFocus}</p>
                  </div>
                  <Badge variant="outline">{deal.stage}</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  <MetricBlock label="Jobs Created" value={deal.metrics.jobsCreated.toLocaleString()} />
                  <MetricBlock label="Communities" value={String(deal.metrics.communitiesServed)} />
                  <MetricBlock label="Women Leadership" value={`${deal.metrics.womenLeadership}%`} />
                  <MetricBlock label="Disability Inclusive" value={deal.metrics.disabilityInclusive ? "Yes" : "No"} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1 border-t pt-3">
                  {deal.sustainabilityGoals.map((goal) => (
                    <Badge key={goal} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function InsightsView({ state }: { state: DealFlowState }) {
  const low = state.deals.filter((deal) => deal.aiInsights.riskLevel === "low").length
  const medium = state.deals.filter((deal) => deal.aiInsights.riskLevel === "medium").length
  const high = state.deals.filter((deal) => deal.aiInsights.riskLevel === "high").length

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        <RiskCount title="Low Risk Deals" count={low} total={state.summary.totalDeals} icon={<Zap className="h-5 w-5 text-yellow-500" aria-hidden="true" />} />
        <RiskCount title="Medium Risk Deals" count={medium} total={state.summary.totalDeals} icon={<AlertCircle className="h-5 w-5 text-orange-500" aria-hidden="true" />} />
        <RiskCount title="High Risk Deals" count={high} total={state.summary.totalDeals} icon={<XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" aria-hidden="true" />
            AI Recommendations
          </CardTitle>
          <CardDescription>AI-powered insights and recommendations for each venture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {state.deals.map((deal) => (
              <div key={deal.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{deal.company}</h3>
                    <p className="text-sm text-muted-foreground">{deal.location}</p>
                  </div>
                  <RiskBadge riskLevel={deal.aiInsights.riskLevel} />
                </div>
                <Alert className="mb-4">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>{deal.aiInsights.recommendation}</AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-2">
                  <InsightList title="Key Strengths" icon={<CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />} items={deal.aiInsights.keyStrengths} />
                  <InsightList title="Areas for Improvement" icon={<ArrowRight className="h-4 w-4 text-orange-500" aria-hidden="true" />} items={deal.aiInsights.areasForImprovement} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function DistributionRow({ label, count, total }: { label: string; count: number; total: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">{count}</span>
        <Badge variant="secondary">{total > 0 ? ((count / total) * 100).toFixed(1) : 0}%</Badge>
      </div>
    </div>
  )
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

function RiskCount({ title, count, total, icon }: { title: string; count: number; total: number; icon: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{total > 0 ? ((count / total) * 100).toFixed(1) : 0}% of portfolio</p>
      </CardContent>
    </Card>
  )
}

function InsightList({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1 text-sm font-medium">
        {icon}
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
