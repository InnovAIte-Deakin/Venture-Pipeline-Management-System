import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
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

export interface ImpactBySectorData {
  sector: string
  jobs: number
  beneficiaries: number
}

interface ImpactBySectorChartProps {
  data: ImpactBySectorData[]
}

const sectorChartConfig = {
  jobs: {
    label: "Jobs Created",
    color: "hsl(var(--chart-3))",
  },
  beneficiaries: {
    label: "Beneficiaries",
    color: "hsl(var(--chart-5))",
  },
}

export function ImpactBySectorChart({
  data,
}: ImpactBySectorChartProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Impact by Sector</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Jobs created and beneficiaries reached per sector
        </p>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={sectorChartConfig}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="sector"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                label={{
                  value: "Count",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#6b7280",
                }}
              />

              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />

              <Bar
                yAxisId="left"
                dataKey="jobs"
                fill="var(--color-jobs)"
                name="Jobs Created"
              />

              <Bar
                yAxisId="left"
                dataKey="beneficiaries"
                fill="var(--color-beneficiaries)"
                name="Beneficiaries Reached"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}