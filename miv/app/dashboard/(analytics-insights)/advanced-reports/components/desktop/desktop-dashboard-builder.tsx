import { BarChart3, Edit, Settings, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WidgetPalette } from "../dashboard-builder/widget-palette"
import { DashboardCanvas } from "../dashboard-builder/dashboard-canvas"
import { ReportChart } from "../charts/report-chart"
import { formatDate } from "../../lib/format"
import type { Dashboard, UseDashboardBuilderResult } from "../../types/advanced-reports.types"

interface DesktopDashboardBuilderProps {
  dashboards: Dashboard[]
  builder: UseDashboardBuilderResult
}

/**
 * Dashboards tab, desktop: the scratch-canvas builder (unchanged
 * drag-and-drop prototype — no persistence, no real widget data, no
 * position/resize) plus the read-only "Existing Dashboards" list, whose
 * Edit/Share buttons stay decorative. See README "Dashboard Builder Workflow".
 */
export function DesktopDashboardBuilder({ dashboards, builder }: DesktopDashboardBuilderProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" aria-hidden="true" />
                <span>Dashboard Builder</span>
              </CardTitle>
              <CardDescription>Create custom dashboards by dragging and dropping widgets</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                aria-expanded={builder.isDashboardBuilderOpen}
                onClick={() => builder.setIsDashboardBuilderOpen(!builder.isDashboardBuilderOpen)}
              >
                {builder.isDashboardBuilderOpen ? "Close Builder" : "Open Builder"}
              </Button>
              <Button onClick={builder.clearLayout}>Clear Layout</Button>
            </div>
          </div>
        </CardHeader>

        {builder.isDashboardBuilderOpen && (
          <CardContent className="space-y-4">
            <WidgetPalette onDragStart={builder.handleDragStart} />
            <DashboardCanvas dashboardLayout={builder.dashboardLayout} onDragOver={builder.handleDragOver} onDrop={builder.handleDrop} onRemoveWidget={builder.removeWidget} />
          </CardContent>
        )}
      </Card>

      <div className="grid gap-6">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" aria-hidden="true" />
                    <span>{dashboard.name}</span>
                    {dashboard.isDefault && <Badge variant="default">Default</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {dashboard.description} • Updated {formatDate(dashboard.updatedAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" aria-label={`Edit ${dashboard.name}`}>
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="sm" aria-label={`Share ${dashboard.name}`}>
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {dashboard.widgets.map((widget) => (
                  <Card key={widget.id} className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-semibold">{widget.title}</h4>
                      <Button variant="ghost" size="sm" aria-label={`Configure ${widget.title}`}>
                        <Settings className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                    {widget.type === "chart" && Array.isArray(widget.data) && (
                      <div className="h-64">
                        <ReportChart data={widget.data} type={String(widget.config.type ?? "")} title={widget.title} height={240} />
                      </div>
                    )}
                    {widget.type === "metric" && !Array.isArray(widget.data) && "value" in widget.data && (
                      <div className="text-center">
                        <div className="text-3xl font-bold">{widget.data.value}</div>
                        <div className="text-sm text-muted-foreground">{widget.data.change} from last period</div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
