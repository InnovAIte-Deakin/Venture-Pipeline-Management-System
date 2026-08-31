import { Cpu, HardDrive, MemoryStickIcon as Memory, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { SystemPerformance } from "../types"
import { PerformanceMetricCard } from "./performance-metric-card"

interface PerformanceOverviewCardProps {
  systemPerformance: SystemPerformance
  onRefreshPerformanceData: () => void
}

export function PerformanceOverviewCard({
  systemPerformance,
  onRefreshPerformanceData,
}: PerformanceOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <PerformanceMetricCard
            icon={Cpu}
            iconClassName="text-teal-600"
            label="CPU Usage"
            value={systemPerformance.cpuUsage}
          />
          <PerformanceMetricCard
            icon={Memory}
            iconClassName="text-blue-600"
            label="Memory Usage"
            value={systemPerformance.memoryUsage}
          />
          <PerformanceMetricCard
            icon={HardDrive}
            iconClassName="text-amber-600"
            label="Disk Usage"
            value={systemPerformance.diskUsage}
          />
        </div>

        <div className="pt-4">
          <Button onClick={onRefreshPerformanceData} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
