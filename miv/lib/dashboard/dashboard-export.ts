import type { DashboardChartWidget } from "@/types/dashboard/types"

export function downloadDashboardCharts(charts: DashboardChartWidget[]): void {
  const blob = new Blob([JSON.stringify(charts, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `dashboard-charts-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
