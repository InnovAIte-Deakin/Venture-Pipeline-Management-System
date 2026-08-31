import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Shield, Target } from "lucide-react"
import type { DueDiligenceItem, DueDiligenceViewMode, VentureDD } from "../types/due-diligence.types"

interface DueDiligenceSummaryProps {
  viewMode: DueDiligenceViewMode
  venturesDDs: VentureDD[]
  filteredItems: DueDiligenceItem[]
}

export function DueDiligenceSummary({ viewMode, venturesDDs, filteredItems }: DueDiligenceSummaryProps) {
  const completedCount = filteredItems.filter((item) => item.status === "completed").length
  const inProgressCount = filteredItems.filter((item) => item.status === "in_progress").length
  const uniqueCompanies = new Set(filteredItems.map((item) => item.company)).size
  const averageCompletion = filteredItems.length > 0
    ? (filteredItems.reduce((sum, item) => sum + item.completion, 0) / filteredItems.length).toFixed(0)
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {viewMode === "ventures" ? "Total Ventures" : "Total Items"}
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {viewMode === "ventures" ? venturesDDs.length : filteredItems.length}
          </div>
          <p className="text-xs text-muted-foreground">
            {viewMode === "ventures"
              ? `${filteredItems.length} total DD items`
              : `Across ${uniqueCompanies} companies`
            }
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {completedCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {filteredItems.length > 0 ? ((completedCount / filteredItems.length) * 100).toFixed(1) : 0}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {inProgressCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {filteredItems.length > 0 ? ((inProgressCount / filteredItems.length) * 100).toFixed(1) : 0}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageCompletion}%
          </div>
          <p className="text-xs text-muted-foreground">
            Across all active items
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
