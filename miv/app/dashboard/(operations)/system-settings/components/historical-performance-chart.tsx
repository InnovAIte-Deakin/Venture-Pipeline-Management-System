import { BarChart3 } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { systemPerformanceChartConfig } from "../constants"
import type { HistoricalPerformance } from "../types"

interface HistoricalPerformanceChartProps {
  historicalPerformance: HistoricalPerformance[]
}

export function HistoricalPerformanceChart({ historicalPerformance }: HistoricalPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Historical Performance
          </CardTitle>
          <Badge variant="outline">Last 6 months</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={systemPerformanceChartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                domain={[0, 100]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="var(--color-cpu)"
                fill="var(--color-cpu)"
                fillOpacity={0.3}
                name="CPU Usage"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="var(--color-memory)"
                fill="var(--color-memory)"
                fillOpacity={0.3}
                name="Memory Usage"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
