import { ArrowDown, ArrowUp, BarChart3, Edit, Settings, Share2, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { REPORT_ICON_MAP } from "../report-icons"
import { ReportChart } from "../charts/report-chart"
import { formatDate } from "../../lib/format"
import { AVAILABLE_WIDGETS } from "../../constants/advanced-reports.constants"
import type { Dashboard, UseDashboardBuilderResult } from "../../types/advanced-reports.types"

interface MobileDashboardListProps {
  dashboards: Dashboard[]
  builder: UseDashboardBuilderResult
}

/**
 * Dashboards tab, mobile. The desktop drag-and-drop canvas is NOT reused
 * here (HTML5 `draggable` is unreliable on touch) — replaced with a
 * tap-to-add widget list and explicit up/down reorder controls instead of
 * desktop drag positioning. This is new interaction design for mobile, not
 * a port of the existing prototype; it shares the exact same
 * `useDashboardBuilder` state/actions as desktop, so nothing is duplicated,
 * and the same "no real widget data, no persistence" limitations apply.
 * See README "Dashboard Builder" and "Mobile Layout".
 */
export function MobileDashboardList({ dashboards, builder }: MobileDashboardListProps) {
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
              <CardDescription>Tap a widget to add it to your dashboard</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              aria-expanded={builder.isDashboardBuilderOpen}
              onClick={() => builder.setIsDashboardBuilderOpen(!builder.isDashboardBuilderOpen)}
            >
              {builder.isDashboardBuilderOpen ? "Close Builder" : "Open Builder"}
            </Button>
            <Button variant="outline" onClick={builder.clearLayout}>
              Clear
            </Button>
          </div>
        </CardHeader>

        {builder.isDashboardBuilderOpen && (
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-3 text-sm font-medium">Available Widgets</h4>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_WIDGETS.map((widget) => {
                  const Icon = REPORT_ICON_MAP[widget.iconName]
                  return (
                    <button
                      key={widget.id}
                      type="button"
                      onClick={() => builder.addWidgetByTap(widget.id)}
                      className="flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Icon className="mb-2 h-6 w-6 text-gray-500" aria-hidden="true" />
                      <span className="text-xs font-medium">{widget.title}</span>
                      <span className="mt-1 text-xs text-gray-500">{widget.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium">Your Dashboard</h4>
              {builder.dashboardLayout.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-center text-gray-500">
                  <p>No widgets yet</p>
                  <p className="text-sm">Tap a widget above to add it</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {builder.dashboardLayout.map((widget, index) => (
                    <Card key={widget.id}>
                      <CardContent className="flex items-center justify-between gap-2 py-3">
                        <span className="text-sm font-medium">{widget.title}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={index === 0}
                            onClick={() => builder.moveWidget(widget.id, "up")}
                            aria-label={`Move ${widget.title} up`}
                          >
                            <ArrowUp className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={index === builder.dashboardLayout.length - 1}
                            onClick={() => builder.moveWidget(widget.id, "down")}
                            aria-label={`Move ${widget.title} down`}
                          >
                            <ArrowDown className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => builder.removeWidget(widget.id)} aria-label={`Remove ${widget.title}`}>
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
                <span>{dashboard.name}</span>
                {dashboard.isDefault && <Badge variant="default">Default</Badge>}
              </CardTitle>
              <CardDescription>
                {dashboard.description} • Updated {formatDate(dashboard.updatedAt)}
              </CardDescription>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" aria-label={`Edit ${dashboard.name}`}>
                  <Edit className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="sm" aria-label={`Share ${dashboard.name}`}>
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboard.widgets.map((widget) => (
                <Card key={widget.id} className="p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{widget.title}</h4>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={`Configure ${widget.title}`}>
                      <Settings className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  {widget.type === "chart" && Array.isArray(widget.data) && <ReportChart data={widget.data} type={String(widget.config.type ?? "")} title={widget.title} height={220} />}
                  {widget.type === "metric" && !Array.isArray(widget.data) && "value" in widget.data && (
                    <div className="text-center">
                      <div className="text-3xl font-bold">{widget.data.value}</div>
                      <div className="text-sm text-muted-foreground">{widget.data.change} from last period</div>
                    </div>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
