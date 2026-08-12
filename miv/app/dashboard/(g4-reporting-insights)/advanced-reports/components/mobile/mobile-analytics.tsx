import { AlertTriangle, BarChart3, Download, Target, TrendingUp, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReportChart } from "../charts/report-chart"
import { generateSectorDistributionData, generateVenturePerformanceData } from "../../lib/report-calculations"
import type { Dashboard, GedsiMetricApiResponseItem, Report, VentureApiResponseItem } from "../../types/advanced-reports.types"

interface MobileAnalyticsProps {
  reports: Report[]
  dashboards: Dashboard[]
  ventures: VentureApiResponseItem[]
  gedsiMetrics: GedsiMetricApiResponseItem[]
}

/** Analytics tab, mobile: same data/copy as desktop (see `desktop-analytics.tsx` for the preserved-behaviour notes), stacked into single-column full-width cards with full-width charts instead of a 4-column grid. */
export function MobileAnalytics({ reports, dashboards, ventures, gedsiMetrics }: MobileAnalyticsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900 text-base">
            <Zap className="h-5 w-5" aria-hidden="true" />
            <span>AI-Powered Insights</span>
            <Badge variant="outline" className="border-purple-200 bg-purple-100 text-purple-700">
              Beta
            </Badge>
          </CardTitle>
          <CardDescription className="text-purple-700">Intelligent recommendations based on your data patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-purple-200 bg-white p-4">
            <div className="mb-2 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span className="text-sm font-medium">Performance Insight</span>
            </div>
            <p className="text-xs text-gray-600">
              {gedsiMetrics.length > 0
                ? `Your GEDSI metrics show ${Math.round(
                    (gedsiMetrics.filter((m) => ["COMPLETED", "VERIFIED"].includes(m.status)).length / gedsiMetrics.length) * 100
                  )}% completion rate. ${gedsiMetrics.length < 5 ? "Consider adding more metrics to improve tracking." : "Good progress on impact measurement."}`
                : "No GEDSI metrics available yet. Add ventures and metrics to see performance insights."}
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-white p-4">
            <div className="mb-2 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <span className="text-sm font-medium">Risk Alert</span>
            </div>
            <p className="text-xs text-gray-600">
              {ventures.length === 0
                ? "No ventures available for risk assessment. Add ventures to monitor performance."
                : ventures.length < 3
                  ? `Monitor ${ventures.length} venture${ventures.length === 1 ? "" : "s"} for performance trends as portfolio grows.`
                  : `${Math.max(0, Math.round(ventures.length * 0.2))} ventures may need attention. Review portfolio performance regularly.`}
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-white p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" aria-hidden="true" />
              <span className="text-sm font-medium">Optimization Tip</span>
            </div>
            <p className="text-xs text-gray-600">Consider generating weekly automated reports for your top 5 performing sectors to track trends.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span>Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <BarChart3 className="h-4 w-4 text-blue-500" aria-hidden="true" />
              <span>Dashboards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboards.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-purple-500" aria-hidden="true" />
              <span>Views</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length * 50}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Download className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <span>Exports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length * 10}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Venture Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportChart data={generateVenturePerformanceData(ventures)} type="line" title="Venture Performance Trend" height={220} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sector Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportChart data={generateSectorDistributionData(ventures)} type="pie" title="Sector Distribution" height={220} />
        </CardContent>
      </Card>
    </div>
  )
}
