import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal } from "lucide-react"
import { RiskBadge } from "../shared/risk-badge"
import { StatusBadge } from "../shared/status-badge"
import type { Deal } from "../../types/deal-flow.types"

interface MobileDealCardProps {
  deal: Deal
  onViewDeal: (deal: Deal) => void
  onEditDeal: (deal: Deal) => void
}

export function MobileDealCard({ deal, onViewDeal, onEditDeal }: MobileDealCardProps) {
  return (
    <Card className="rounded-lg">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{deal.company}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {deal.sector} - {deal.location}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`More actions for ${deal.company}`}>
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDeal(deal)}>
                <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditDeal(deal)}>
                <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{deal.stage}</Badge>
          <StatusBadge status={deal.status} />
          <RiskBadge riskLevel={deal.aiInsights.riskLevel} />
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <MobileMetric label="Deal" value={deal.dealSize} />
          <MobileMetric label="Ready" value={`${deal.readinessScore}%`} />
          <MobileMetric label="GEDSI" value={`${deal.gedsiScore}%`} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t pt-3">
          <div className="min-w-0 text-xs text-muted-foreground">
            <div className="truncate">Owner: {deal.team.join(", ")}</div>
            <div>Updated {deal.lastActivity}</div>
          </div>
          <Button size="sm" onClick={() => onViewDeal(deal)}>
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MobileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
