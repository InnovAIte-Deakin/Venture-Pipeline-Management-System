import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface ImpactKpiMetric {
  title: string
  value: number | string
  unit: string
  prefix?: string
  change: number
  trend: "up" | "down"
  icon: LucideIcon
  color: string
  bgColor: string
}

interface ImpactKpiCardsProps {
  metrics: ImpactKpiMetric[]
}

export function ImpactKpiCards({ metrics }: ImpactKpiCardsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        const trendClassName =
          metric.trend === "up"
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"

        return (
          <Card
            key={metric.title}
            className="group border-0 shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`rounded-xl p-3 transition-transform group-hover:scale-110 ${metric.bgColor}`}
                >
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <Badge
                  variant="outline"
                  className={trendClassName}
                >
                  <TrendIcon className="mr-1 h-3 w-3" />
                  {metric.trend === "up" ? "+" : "-"}
                  {metric.change}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  {metric.prefix ?? ""}
                  {metric.value}
                  {metric.unit}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
