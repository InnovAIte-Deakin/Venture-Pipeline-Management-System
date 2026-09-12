import type { DragEvent } from "react"
import { Settings, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DashboardLayoutItem, WidgetPosition } from "../../types/advanced-reports.types"

interface DashboardCanvasProps {
  dashboardLayout: DashboardLayoutItem[]
  onDragOver: (event: DragEvent) => void
  onDrop: (event: DragEvent, targetPosition: WidgetPosition) => void
  onRemoveWidget: (widgetId: string) => void
}

/**
 * Desktop-only drop canvas, unchanged from the original: a single `onDrop`
 * handler always passes the same literal `{x:0,y:0,w:4,h:3}` (drag position
 * is cosmetic — there is no per-cell target), rendering ignores
 * `widget.position` entirely in favour of a static `grid-cols-12` layout,
 * and dropped widgets render only a placeholder (no real chart/table
 * preview is ever attached). See README "Dashboard Builder Workflow".
 */
export function DashboardCanvas({ dashboardLayout, onDragOver, onDrop, onRemoveWidget }: DashboardCanvasProps) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium">Dashboard Canvas</h4>
      <div
        className="min-h-96 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, { x: 0, y: 0, w: 4, h: 3 })}
      >
        {dashboardLayout.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            <div className="text-center">
              <Settings className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
              <p>Drag widgets here to build your dashboard</p>
              <p className="text-sm">Start by dragging a widget from above</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {dashboardLayout.map((widget) => (
              <Card key={widget.id} className="group relative col-span-6 lg:col-span-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{widget.title}</CardTitle>
                    <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" aria-label={`Configure ${widget.title}`}>
                        <Settings className="h-3 w-3" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onRemoveWidget(widget.id)} aria-label={`Remove ${widget.title}`}>
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex h-32 items-center justify-center rounded bg-gray-100">
                    <span className="text-xs text-gray-500">{widget.type} widget placeholder</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
