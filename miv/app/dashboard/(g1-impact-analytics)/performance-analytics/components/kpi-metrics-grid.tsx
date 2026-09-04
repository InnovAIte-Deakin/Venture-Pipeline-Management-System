// T19 - Refactor and Improve Performance Analytics
// Shared KPI card renderer. Desktop and mobile pass different grid layouts
// via className, but the card markup itself is identical - no need to
// duplicate this logic in both places.

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import type { KpiMetric } from "../types"

interface KpiMetricsGridProps {
  metrics: KpiMetric[]
  gridClassName?: string
}

export function KpiMetricsGrid({
  metrics,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4",
}: KpiMetricsGridProps) {
  return (
    <div className={gridClassName}>
      {metrics.map((metric, index) => (
        <Card key={index} className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  metric.trend === "up"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : metric.trend === "down"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {metric.trend === "up" ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : metric.trend === "down" ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : (
                  <Minus className="h-3 w-3 mr-1" />
                )}
                {metric.trend === "up" ? "+" : ""}{metric.change}
                {metric.unit === "%" ? "%" : ""}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.unit === "M" ? "$" : ""}{metric.value}{metric.unit}
              </p>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}