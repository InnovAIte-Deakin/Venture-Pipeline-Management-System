import { AlertTriangle, BarChart3, Download, Target, TrendingUp, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReportChart } from "../charts/report-chart"
import { generateSectorDistributionData, generateVenturePerformanceData } from "../../lib/report-calculations"
import type { GedsiMetricApiResponseItem, Report, VentureApiResponseItem, Dashboard } from "../../types/advanced-reports.types"

interface DesktopAnalyticsProps {
  reports: Report[]
  dashboards: Dashboard[]
  ventures: VentureApiResponseItem[]
  gedsiMetrics: GedsiMetricApiResponseItem[]
}

/**
 * Analytics tab, desktop. "AI-Powered Insights" is NOT AI-generated despite
 * the label/icon/Beta badge — the three cards are simple string templates
 * driven by thresholds. "Report Views"/"Exports" stat tiles are fabricated
 * constants (`reports.length * 50` / `* 10`), not real telemetry. Preserved
 * exactly. See README "Business Rules and Calculations".
 */
export function DesktopAnalytics({ reports, dashboards, ventures, gedsiMetrics }: DesktopAnalyticsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-100 bg-linear-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900">
            <Zap className="h-5 w-5" aria-hidden="true" />
            <span>AI-Powered Insights</span>
            <Badge variant="outline" className="border-purple-200 bg-purple-100 text-purple-700">
              Beta
            </Badge>
          </CardTitle>
          <CardDescription className="text-purple-700">Get intelligent recommendations and insights based on your data patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
              <span>Total Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reports.length}</div>
            <p className="text-sm text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <span>Active Dashboards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboards.length}</div>
            <p className="text-sm text-muted-foreground">Custom dashboards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" aria-hidden="true" />
              <span>Report Views</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reports.length * 50}</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-orange-500" aria-hidden="true" />
              <span>Exports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reports.length * 10}</div>
            <p className="text-sm text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Venture Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportChart data={generateVenturePerformanceData(ventures)} type="line" title="Venture Performance Trend" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sector Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportChart data={generateSectorDistributionData(ventures)} type="pie" title="Sector Distribution" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
