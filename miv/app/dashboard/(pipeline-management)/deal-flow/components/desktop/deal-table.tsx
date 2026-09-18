import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, MoreHorizontal } from "lucide-react"
import { DealScoreStack } from "../shared/deal-score-stack"
import { RiskBadge } from "../shared/risk-badge"
import { StatusWithIcon } from "../shared/status-badge"
import { TeamAvatarStack } from "../shared/team-avatar-stack"
import type { Deal } from "../../types/deal-flow.types"

interface DealTableProps {
  deals: Deal[]
  onViewDeal: (deal: Deal) => void
  onEditDeal: (deal: Deal) => void
}

export function DealTable({ deals, onViewDeal, onEditDeal }: DealTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals ({deals.length})</CardTitle>
        <CardDescription>Manage your impact venture pipeline deals</CardDescription>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No deals match the current filters.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venture</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Impact Scores</TableHead>
                <TableHead>Deal Size</TableHead>
                <TableHead>Founder Type</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>AI Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deal.company}</div>
                      <div className="text-sm text-muted-foreground">{deal.location}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{deal.inclusionFocus}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{deal.stage}</Badge>
                  </TableCell>
                  <TableCell>
                    <DealScoreStack deal={deal} compact />
                  </TableCell>
                  <TableCell className="font-medium">{deal.dealSize}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {deal.founderType.slice(0, 2).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TeamAvatarStack team={deal.team} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge riskLevel={deal.aiInsights.riskLevel} />
                  </TableCell>
                  <TableCell>
                    <StatusWithIcon status={deal.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onViewDeal(deal)} aria-label={`View ${deal.company}`}>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditDeal(deal)} aria-label={`Edit ${deal.company}`}>
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label={`More actions for ${deal.company}`}>
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
