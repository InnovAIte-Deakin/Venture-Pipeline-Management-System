import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface PerformanceMetricCardProps {
  icon: LucideIcon
  iconClassName: string
  label: string
  value: number
}

function getPerformanceStatus(value: number) {
  if (value > 80) {
    return { label: "High", variant: "destructive" as const }
  }

  if (value > 60) {
    return { label: "Medium", variant: "secondary" as const }
  }

  return { label: "Normal", variant: "default" as const }
}

export function PerformanceMetricCard({ icon: Icon, iconClassName, label, value }: PerformanceMetricCardProps) {
  const status = getPerformanceStatus(value)

  return (
    <div className="text-center">
      <Icon className={`h-8 w-8 mx-auto mb-2 ${iconClassName}`} />
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</div>
      <p className="text-sm text-gray-600">{label}</p>
      <Progress value={value} className="h-2 mt-2" />
      <Badge variant={status.variant} className="mt-2">
        {status.label}
      </Badge>
    </div>
  )
}
