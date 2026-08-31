import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertCircle, ArrowRight, BarChart3, CheckCircle } from "lucide-react"
import type { Deal, DealStage, PipelineTransition, StageGroup, SummaryMetrics } from "../../types/deal-flow.types"

interface PipelineBoardProps {
  stageGroups: StageGroup[]
  summary: SummaryMetrics
  bottlenecks: PipelineTransition[]
  highPerformers: PipelineTransition[]
  selectedStageForFilter: DealStage | null
  hoveredStage: DealStage | null
  onStageClick: (stage: DealStage, deals: Deal[]) => void
  onStageFilter: (stage: DealStage) => void
  onHoverStage: (stage: DealStage | null) => void
}

export function PipelineBoard({
  stageGroups,
  summary,
  bottlenecks,
  highPerformers,
  selectedStageForFilter,
  hoveredStage,
  onStageClick,
  onStageFilter,
  onHoverStage,
}: PipelineBoardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
          Pipeline Flow Analysis
        </CardTitle>
        <CardDescription>Interactive venture pipeline with conversion rates and flow metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {summary.totalDeals === 0 ? (
          <div className="py-12 text-center">
            <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground" aria-hidden="true" />
            <p className="mb-2 text-lg text-muted-foreground">No deals found in pipeline</p>
            <p className="text-sm text-muted-foreground">Add ventures to see pipeline flow analysis</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">DEAL FLOW PROGRESSION</h2>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Legend color="bg-blue-500" label="Active" />
                  <Legend color="bg-green-500" label="High Conversion" />
                  <Legend color="bg-red-500" label="Bottleneck" />
                </div>
              </div>

              <div className="relative flex items-center justify-between">
                {stageGroups.map((group, index) => {
                  const isSelected = selectedStageForFilter === group.stage
                  const isHovered = hoveredStage === group.stage
                  return (
                    <div key={group.stage} className="relative flex-1">
                      <button
                        type="button"
                        className={`relative w-full rounded-lg border-2 p-4 text-center transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                          isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
                        } ${
                          group.isBottleneck
                            ? "border-red-200 bg-red-50 hover:bg-red-100"
                            : group.isHighConversion
                              ? "border-green-200 bg-green-50 hover:bg-green-100"
                              : "border-blue-200 bg-blue-50 hover:bg-blue-100"
                        } ${isHovered ? "shadow-lg" : ""}`}
                        onClick={() => onStageClick(group.stage, group.deals)}
                        onMouseEnter={() => onHoverStage(group.stage)}
                        onMouseLeave={() => onHoverStage(null)}
                        aria-label={`View ${group.deals.length} deals in ${group.stage}`}
                      >
                        <span className="mb-1 block text-xs font-medium text-muted-foreground">{group.stage}</span>
                        <span className="mb-1 block text-2xl font-bold">{group.deals.length}</span>
                        <span className="block text-xs text-muted-foreground">
                          {summary.totalDeals > 0 ? ((group.deals.length / summary.totalDeals) * 100).toFixed(0) : 0}% of total
                        </span>
                        {group.recentMovements > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                            {group.recentMovements}
                          </span>
                        )}
                        <span
                          className={`absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white ${
                            group.isBottleneck ? "bg-red-500" : group.isHighConversion ? "bg-green-500" : "bg-blue-500"
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {index < stageGroups.length - 1 && (
                        <div className="absolute -right-6 top-1/2 z-10 -translate-y-1/2">
                          <ArrowRight
                            className={`h-4 w-4 ${
                              group.isBottleneck ? "text-red-500" : group.isHighConversion ? "text-green-500" : "text-blue-500"
                            }`}
                            aria-hidden="true"
                          />
                          {group.conversionRate && (
                            <Badge className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs" variant="outline">
                              {group.conversionRate}%
                            </Badge>
                          )}
                        </div>
                      )}

                      {isHovered && group.deals.length > 0 && (
                        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 bg-white px-2 text-xs shadow-md"
                            onClick={(event) => {
                              event.stopPropagation()
                              onStageFilter(group.stage)
                            }}
                          >
                            {isSelected ? "Clear Filter" : "Filter Deals"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 border-t pt-6 md:grid-cols-4">
              <Metric label="Total Deals" value={summary.totalDeals} color="text-blue-600" />
              <Metric label="Funded Deals" value={summary.fundedDeals} color="text-green-600" />
              <Metric label="Success Rate" value={`${summary.successRate}%`} color="text-orange-600" />
              <Metric label="Avg GEDSI Score" value={`${Math.round(summary.avgGedsiScore)}%`} color="text-purple-600" />
            </div>

            <div className="space-y-3 border-t pt-4">
              <h2 className="text-sm font-medium text-muted-foreground">STAGE PERFORMANCE ANALYSIS</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <PerformanceList title="Bottlenecks Detected" emptyText="No significant bottlenecks detected" items={bottlenecks} icon="alert" />
                <PerformanceList title="High Performers" emptyText="No high-performing transitions identified" items={highPerformers} icon="check" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-3 w-3 rounded-full ${color}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function PerformanceList({
  title,
  emptyText,
  items,
  icon,
}: {
  title: string
  emptyText: string
  items: PipelineTransition[]
  icon: "alert" | "check"
}) {
  const isAlert = icon === "alert"
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        {isAlert ? (
          <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
        )}
        <span className={`text-sm font-medium ${isAlert ? "text-red-700" : "text-green-700"}`}>{title}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="space-y-1">
          {items.map((item) => (
            <div key={`${item.from}-${item.to}`} className={`rounded px-2 py-1 text-xs ${isAlert ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {item.from} to {item.to}: {item.rate}% conversion ({item.deals} deals)
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
