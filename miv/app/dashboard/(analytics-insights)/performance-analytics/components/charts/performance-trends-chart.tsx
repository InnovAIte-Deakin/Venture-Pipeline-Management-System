// T19 - Refactor and Improve Performance Analytics

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart } from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart as RCLineChart, Line } from "recharts"

interface PerformanceTrendsChartProps {
  data: any[]
}

export function PerformanceTrendsChart({ data }: PerformanceTrendsChartProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Performance Trends
        </CardTitle>
        <CardDescription>Multi-metric performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RCLineChart data={data}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventures" stroke="#3b82f6" strokeWidth={2} name="New Ventures" />
              <Line type="monotone" dataKey="gedsiScore" stroke="#10b981" strokeWidth={2} name="GEDSI Score" />
              <Line type="monotone" dataKey="conversionRate" stroke="#f59e0b" strokeWidth={2} name="Conversion Rate %" />
            </RCLineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}