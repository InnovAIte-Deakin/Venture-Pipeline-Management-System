"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateAverageVentureGedsiScore, calculatePortfolioSummary } from "@/lib/dashboard/dashboard-aggregates"
import type { DashboardGedsiMetric, DashboardMetricCard, DashboardVenture } from "@/types/dashboard/types"
import { BarChart3, Brain, Building2, DollarSign, FileText, Plus, TrendingUp, UserCheck } from "lucide-react"
import { DashboardLoadingState } from "./dashboard-loading-state"

interface AnalyticsTabProps {
  loading: boolean
  ventures: DashboardVenture[]
  gedsiMetrics: DashboardGedsiMetric[]
  analyticsMetrics: DashboardMetricCard[]
}

export function AnalyticsTab({
  loading,
  ventures,
  gedsiMetrics,
  analyticsMetrics,
}: AnalyticsTabProps) {
  if (loading) {
    return <DashboardLoadingState message="Loading analytics..." />
  }

  const summary = calculatePortfolioSummary(ventures)
  const averageGedsiScore = calculateAverageVentureGedsiScore(ventures)
  const capitalFacilitated = analyticsMetrics.find((metric) => metric.title === "Capital Facilitated")?.value || "$0M"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 sm:gap-0">
          <Button className="w-full sm:w-auto" variant="outline" onClick={() => (window.location.href = "/dashboard/performance-analytics")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance Analytics
          </Button>
          <Button className="w-full sm:w-auto" variant="outline" onClick={() => (window.location.href = "/dashboard/ai-analysis")}>
            <Brain className="h-4 w-4 mr-2" />
            AI Analysis
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => (window.location.href = "/dashboard/advanced-reports")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
              GEDSI Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-purple-600">{averageGedsiScore}%</div>
              <div className="text-sm text-gray-600">{gedsiMetrics.length} total metrics tracked</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${averageGedsiScore}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Venture Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-blue-600">{ventures.length}</div>
              <div className="text-sm text-gray-600">Active ventures in pipeline</div>
              <div className="space-y-2">
                {Object.entries(summary.stageDistribution).map(([stage, count]) => (
                  <div key={stage} className="flex justify-between text-sm">
                    <span>{stage.replace("_", " ")}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
              Capital Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-emerald-600">{capitalFacilitated}</div>
              <div className="text-sm text-gray-600">Total capital facilitated</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average per venture</span>
                  <span className="font-medium">${summary.averageCapitalPerVenture}K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Analytics Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/performance-analytics")}
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Performance</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/ai-analysis")}
            >
              <Brain className="h-6 w-6 mb-2" />
              <span>AI Insights</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/advanced-reports")}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span>Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/custom-dashboards")}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Custom Views</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
