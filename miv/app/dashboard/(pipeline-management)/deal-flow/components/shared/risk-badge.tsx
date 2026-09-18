import { Badge } from "@/components/ui/badge"
import type { DealRiskLevel } from "../../types/deal-flow.types"

interface RiskBadgeProps {
  riskLevel: DealRiskLevel
  uppercase?: boolean
}

export function RiskBadge({ riskLevel, uppercase = false }: RiskBadgeProps) {
  const className =
    riskLevel === "low"
      ? "bg-green-100 text-green-800"
      : riskLevel === "medium"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"

  return (
    <Badge variant={riskLevel === "low" ? "default" : riskLevel === "medium" ? "secondary" : "destructive"} className={className}>
      {uppercase ? `${riskLevel.toUpperCase()} RISK` : riskLevel}
    </Badge>
  )
}
