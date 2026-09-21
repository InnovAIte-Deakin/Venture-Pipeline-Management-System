import { Activity } from "lucide-react"
import { MobileDealCard } from "./mobile-deal-card"
import type { Deal } from "../../types/deal-flow.types"

interface MobileDealListProps {
  deals: Deal[]
  onViewDeal: (deal: Deal) => void
  onEditDeal: (deal: Deal) => void
}

export function MobileDealList({ deals, onViewDeal, onEditDeal }: MobileDealListProps) {
  if (deals.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <Activity className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="font-medium">No deals found</p>
        <p className="mt-1 text-sm text-muted-foreground">Adjust filters or add a new deal to the pipeline.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {deals.map((deal) => (
        <MobileDealCard key={deal.id} deal={deal} onViewDeal={onViewDeal} onEditDeal={onEditDeal} />
      ))}
    </div>
  )
}
