"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePortfolioSummary } from "@/lib/dashboard/dashboard-aggregates"
import type {
  DashboardGedsiAnalytics,
  DashboardGedsiMetric,
  DashboardMetricCard,
  DashboardVenture,
} from "@/types/dashboard/types"
import { Award, DollarSign, FileText, Globe, Heart, Plus, TrendingUp, UserCheck } from "lucide-react"
import { DashboardLoadingState } from "./dashboard-loading-state"

interface ReportsTabProps {
  loading: boolean
  ventures: DashboardVenture[]
  gedsiMetrics: DashboardGedsiMetric[]
  gedsiAnalytics: DashboardGedsiAnalytics
  analyticsMetrics: DashboardMetricCard[]
}

export function ReportsTab({
  loading,
  ventures,
  gedsiMetrics,
  gedsiAnalytics,
  analyticsMetrics,
}: ReportsTabProps) {
  if (loading) {
    return <DashboardLoadingState message="Loading reports..." />
  }

  const summary = calculatePortfolioSummary(ventures)
  const capitalFacilitated = analyticsMetrics.find((metric) => metric.title === "Capital Facilitated")?.value || "$0M"
  const successRate = analyticsMetrics.find((metric) => metric.title === "Success Rate")?.value || "0%"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enterprise Reporting</h2>
          <p className="text-gray-600">Generate comprehensive reports and compliance documentation</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 sm:gap-0">
          <Button className="w-full sm:w-auto" variant="outline" onClick={() => (window.location.href = "/dashboard/advanced-reports")}>
            <FileText className="h-4 w-4 mr-2" />
            Advanced Reports
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => (window.location.href = "/dashboard/impact-reports")}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => (window.location.href = "/dashboard/impact-reports")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
              GEDSI Compliance Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Comprehensive GEDSI metrics and compliance status across all ventures
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Metrics Tracked:</span>
                <span className="text-sm text-gray-600">{gedsiMetrics.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Compliance Rate:</span>
                <span className="text-sm font-medium text-purple-600">{gedsiAnalytics.gedsiComplianceRate}%</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => (window.location.href = "/dashboard/advanced-reports")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Detailed analysis of venture performance and pipeline metrics
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Ventures:</span>
                <span className="text-sm text-gray-600">{ventures.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate:</span>
                <span className="text-sm font-medium text-blue-600">{successRate}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => (window.location.href = "/dashboard/advanced-reports")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
              Capital Facilitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Capital deployment analysis and investment tracking
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Capital:</span>
                <span className="text-sm text-gray-600">{capitalFacilitated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Deal:</span>
                <span className="text-sm font-medium text-emerald-600">${summary.averageCapitalPerVenture}K</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Report Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/impact-reports")}
            >
              <Award className="h-6 w-6 mb-2" />
              <span>Impact Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/advanced-reports")}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span>Advanced Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/sustainability")}
            >
              <Globe className="h-6 w-6 mb-2" />
              <span>Sustainability</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => (window.location.href = "/dashboard/social-impact")}
            >
              <Heart className="h-6 w-6 mb-2" />
              <span>Social Impact</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
