import { Progress } from "@/components/ui/progress"
import { Globe, Heart, Target } from "lucide-react"
import type { Deal } from "../../types/deal-flow.types"

interface DealScoreStackProps {
  deal: Pick<Deal, "gedsiScore" | "impactScore" | "readinessScore">
  compact?: boolean
}

export function DealScoreStack({ deal, compact = false }: DealScoreStackProps) {
  const rowClassName = compact ? "flex items-center justify-between gap-2 text-xs" : "flex items-center gap-2"

  return (
    <div className="space-y-1">
      <div className={rowClassName}>
        <span className="flex items-center gap-2">
          <Heart className="h-3 w-3 text-pink-500" aria-hidden="true" />
          GEDSI
        </span>
        <span>{deal.gedsiScore}%</span>
      </div>
      {!compact && <Progress value={deal.gedsiScore} className="h-2" />}
      <div className={rowClassName}>
        <span className="flex items-center gap-2">
          <Globe className="h-3 w-3 text-green-500" aria-hidden="true" />
          Impact
        </span>
        <span>{deal.impactScore}%</span>
      </div>
      {!compact && <Progress value={deal.impactScore} className="h-2" />}
      <div className={rowClassName}>
        <span className="flex items-center gap-2">
          <Target className="h-3 w-3 text-blue-500" aria-hidden="true" />
          Ready
        </span>
        <span>{deal.readinessScore}%</span>
      </div>
      {!compact && <Progress value={deal.readinessScore} className="h-2" />}
    </div>
  )
}
