import { REPORT_ICON_MAP } from "../report-icons"
import { AVAILABLE_WIDGETS } from "../../constants/advanced-reports.constants"

interface WidgetPaletteProps {
  onDragStart: (widgetId: string) => void
}

/**
 * Desktop-only widget palette: native HTML5 drag-and-drop, unchanged from
 * the original. NOT reused on mobile — iOS Safari and most touch browsers
 * don't support `draggable` drag gestures reliably, so mobile gets a
 * tap-to-add list instead (`components/mobile/mobile-dashboard-list.tsx`).
 * See README "Mobile Problems in the Current Page".
 */
export function WidgetPalette({ onDragStart }: WidgetPaletteProps) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium">Available Widgets</h4>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {AVAILABLE_WIDGETS.map((widget) => {
          const Icon = REPORT_ICON_MAP[widget.iconName]
          return (
            <div
              key={widget.id}
              draggable
              onDragStart={() => onDragStart(widget.id)}
              className="cursor-move rounded-lg border-2 border-dashed border-gray-300 p-3 transition-colors hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="mb-2 h-6 w-6 text-gray-500" aria-hidden="true" />
                <span className="text-xs font-medium">{widget.title}</span>
                <span className="mt-1 text-xs text-gray-500">{widget.description}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
