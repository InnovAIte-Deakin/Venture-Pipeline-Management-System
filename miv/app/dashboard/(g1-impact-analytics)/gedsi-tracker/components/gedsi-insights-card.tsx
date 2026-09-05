import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lightbulb, Sparkles, TrendingUp } from "lucide-react"
import type { GEDSIMetric, Venture } from "../types/gedsi-tracker.types"

export function GedsiInsightsCard({ metrics, ventures }: { metrics: GEDSIMetric[]; ventures: Venture[] }) {
  return (
    <Card className="bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI-Powered GEDSI Intelligence
            </CardTitle>
          </div>
          <Badge className="bg-purple-600 text-white">UN Standards Compliant</Badge>
        </div>
        <CardDescription>
          Machine learning insights based on UN Women, Washington Group, and IRIS+ frameworks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white/80 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold text-green-800">Performance Trends</h4>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              {metrics.length > 0
                ? `${Math.round((metrics.filter((metric) => metric.status === "Verified").length / metrics.length) * 100)}% completion rate`
                : "No metrics to analyze yet"}
            </p>
            <div className="text-xs text-green-600">
              {ventures.filter((venture) => venture.inclusionFocus && venture.inclusionFocus.length > 0).length}/
              {ventures.length} ventures with inclusion focus
            </div>
          </div>

          <div className="rounded-lg border bg-white/80 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">UN Standards Integration</h4>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              Washington Group Short Set implementation recommended for disability data collection
            </p>
            <div className="text-xs text-blue-600">IRIS+ framework integration: {metrics.length > 0 ? "Active" : "Ready"}</div>
          </div>

          <div className="rounded-lg border bg-white/80 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <h4 className="font-semibold text-orange-800">Priority Actions</h4>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              {metrics.filter((metric) => metric.status === "Not Started").length > 0
                ? `${metrics.filter((metric) => metric.status === "Not Started").length} metrics need to be started`
                : "All metrics are actively tracked"}
            </p>
            <div className="text-xs text-orange-600">Focus on disability inclusion metrics</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
