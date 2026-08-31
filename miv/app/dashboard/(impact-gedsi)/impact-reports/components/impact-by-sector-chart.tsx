import {
  Bar,
  BarChart,
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
    color: "hsl(var(--chart-1))",
  },
  beneficiaries: {
    label: "Beneficiaries Reached",
    color: "hsl(var(--chart-2))",
  },
}

export function ImpactBySectorChart({
  data,
}: ImpactBySectorChartProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
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
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="sector"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar
              dataKey="jobs"
              fill="var(--color-jobs)"
              name="Jobs Created"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="beneficiaries"
              fill="var(--color-beneficiaries)"
              name="Beneficiaries Reached"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}