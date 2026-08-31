import {
  Area,
  AreaChart,
  Legend,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface ImpactOverTimeData {
  month: string
  ventures: number
  capital: number
}

interface ImpactOverTimeChartProps {
  data: ImpactOverTimeData[]
}

const impactOverTimeChartConfig = {
  ventures: {
    label: "Ventures",
    color: "hsl(var(--chart-1))",
  },
  capital: {
    label: "Capital ($M)",
    color: "hsl(var(--chart-2))",
  },
}

export function ImpactOverTimeChart({
  data,
}: ImpactOverTimeChartProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader>
        <CardTitle>Impact Over Time</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ventures impacted and capital mobilized monthly
        </p>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={impactOverTimeChartConfig}
          className="h-[300px] w-full"
        >
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={36}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}M`}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={48}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ventures"
              stroke="var(--color-ventures)"
              fill="var(--color-ventures)"
              fillOpacity={0.3}
              name="Ventures Impacted"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="capital"
              stroke="var(--color-capital)"
              fill="var(--color-capital)"
              fillOpacity={0.3}
              name="Capital Mobilized"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
