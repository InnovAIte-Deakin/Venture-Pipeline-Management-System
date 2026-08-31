import type { HistoricalPerformance, SystemInfo, SystemPerformance } from "../types"
import { HistoricalPerformanceChart } from "./historical-performance-chart"
import { PerformanceOverviewCard } from "./performance-overview-card"
import { SystemInfoCard } from "./system-info-card"

interface SystemSettingsTabProps {
  systemInfo: SystemInfo
  systemPerformance: SystemPerformance
  historicalPerformance: HistoricalPerformance[]
  onRefreshPerformanceData: () => void
}

export function SystemSettingsTab({
  systemInfo,
  systemPerformance,
  historicalPerformance,
  onRefreshPerformanceData,
}: SystemSettingsTabProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <SystemInfoCard systemInfo={systemInfo} />
        <PerformanceOverviewCard
          systemPerformance={systemPerformance}
          onRefreshPerformanceData={onRefreshPerformanceData}
        />
      </div>

      <HistoricalPerformanceChart historicalPerformance={historicalPerformance} />
    </>
  )
}
