import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Activity, BarChart3, Calendar, Edit, Eye, Filter, Globe, Heart, Plus, Target, Users } from "lucide-react"
import { RiskBadge } from "../shared/risk-badge"
import type { ReactNode } from "react"
import type { Deal, DealStage, StageDealsDialogState } from "../../types/deal-flow.types"

interface StageDealsDialogProps {
  state: StageDealsDialogState
  onOpenChange: (open: boolean) => void
  onViewDeal: (deal: Deal) => void
  onEditDeal: (deal: Deal) => void
  onStageFilter: (stage: DealStage) => void
  onAddDeal: () => void
}

export function StageDealsDialog({ state, onOpenChange, onViewDeal, onEditDeal, onStageFilter, onAddDeal }: StageDealsDialogProps) {
  const totalValue = state.deals.reduce((sum, deal) => {
    const value = Number.parseFloat(deal.dealSize.replace(/[^0-9.]/g, ""))
    return sum + value
  }, 0)
  const averageGedsi = state.deals.length > 0 ? Math.round(state.deals.reduce((sum, deal) => sum + deal.gedsiScore, 0) / state.deals.length) : 0
  const womenLed = state.deals.filter((deal) => deal.founderType.includes("women-led")).length

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
            {state.stage} Stage - {state.deals.length} Deals
          </DialogTitle>
          <DialogDescription>Detailed view of all deals currently in the {state.stage} stage</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 rounded-lg bg-muted/50 p-4 md:grid-cols-4">
            <Summary label="Total Deals" value={state.deals.length} color="text-blue-600" />
            <Summary label="Total Value" value={`$${totalValue.toFixed(1)}M`} color="text-green-600" />
            <Summary label="Avg GEDSI Score" value={`${averageGedsi}%`} color="text-purple-600" />
            <Summary label="Women-Led" value={womenLed} color="text-orange-600" />
          </div>

          {state.deals.length === 0 ? (
            <div className="py-8 text-center">
              <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <p className="text-muted-foreground">No deals found in this stage</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.deals.map((deal) => (
                <div key={deal.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/30">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-medium">{deal.company}</h3>
                        <Badge variant="outline" className="text-xs">
                          {deal.sector}
                        </Badge>
                        <RiskBadge riskLevel={deal.aiInsights.riskLevel} />
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{deal.location}</p>
                      <p className="text-sm">{deal.inclusionFocus}</p>
                    </div>
                    <div className="text-right">
                      <div className="mb-1 text-lg font-bold text-green-600">{deal.dealSize}</div>
                      <div className="text-sm text-muted-foreground">Deal Value</div>
                    </div>
                  </div>
                  <div className="mb-3 grid gap-4 md:grid-cols-4">
                    <Score icon={<Heart className="h-3 w-3 text-pink-500" />} label="GEDSI Score" value={deal.gedsiScore} />
                    <Score icon={<Globe className="h-3 w-3 text-green-500" />} label="Impact Score" value={deal.impactScore} />
                    <Score icon={<Target className="h-3 w-3 text-blue-500" />} label="Readiness" value={deal.readinessScore} />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-orange-500" aria-hidden="true" />
                        <span className="text-xs text-muted-foreground">Expected Close</span>
                      </div>
                      <div className="text-sm font-medium">{deal.expectedClose}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 border-t pt-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm">{deal.team.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => onViewDeal(deal)}>
                        <Eye className="mr-1 h-4 w-4" aria-hidden="true" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onEditDeal(deal)}>
                        <Edit className="mr-1 h-4 w-4" aria-hidden="true" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {state.stage && (
                <Button variant="outline" size="sm" onClick={() => onStageFilter(state.stage as DealStage)}>
                  <Filter className="mr-1 h-4 w-4" aria-hidden="true" />
                  Filter by This Stage
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onAddDeal}>
                <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
                Add Deal to Stage
              </Button>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Summary({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function Score({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={value} className="h-2 flex-1" />
        <span className="text-sm font-medium">{value}%</span>
      </div>
    </div>
  )
}
