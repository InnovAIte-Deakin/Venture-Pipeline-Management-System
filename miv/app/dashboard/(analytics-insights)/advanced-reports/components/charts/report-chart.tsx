"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ChartType, SectorDistributionSlice, VenturePerformancePoint } from "../../types/advanced-reports.types"
import { CHART_COLORS } from "../../constants/advanced-reports.constants"

interface ReportChartProps {
  data: VenturePerformancePoint[] | SectorDistributionSlice[]
  type: ChartType | string
  title?: string
  /** Chart height in px; defaults to the original fixed 300px on desktop. Pass a smaller value on mobile so the chart doesn't fight a narrow container. */
  height?: number
}

/**
 * Direct lift of the original `renderChart` switch. Intentionally NOT
 * generic despite the loose `data` prop: bar/line/area hardcode
 * `dataKey="month"` + `"ventures"`/`"funding"` series (the shape produced by
 * `generateVenturePerformanceData`), and pie hardcodes `dataKey="value"` +
 * `name` (the shape produced by `generateSectorDistributionData`). Do not
 * generalize this silently — see README "Chart Types and Chart Data".
 */
export function ReportChart({ data, type, title, height = 300 }: ReportChartProps) {
  if (!data || data.length === 0) {
    return (
      <div role="img" aria-label={title ? `${title}: no data available` : "No chart data available"} className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
        No data available
      </div>
    )
  }

  const chartLabel = title ? `${title} chart` : `${type} chart`

  switch (type) {
    case "bar":
      return (
        <div role="img" aria-label={chartLabel}>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventures" fill="#8884d8" />
              <Bar dataKey="funding" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    case "line":
      return (
        <div role="img" aria-label={chartLabel}>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventures" stroke="#8884d8" />
              <Line type="monotone" dataKey="funding" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    case "pie":
      return (
        <div role="img" aria-label={chartLabel}>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    case "area":
      return (
        <div role="img" aria-label={chartLabel}>
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="ventures" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="funding" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )
    default:
      return <div>Chart type not supported</div>
  }
}
