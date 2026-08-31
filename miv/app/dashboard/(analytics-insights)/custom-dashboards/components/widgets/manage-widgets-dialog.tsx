"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Zap, Plus, X, LayoutGrid } from "lucide-react"
import { WIDGET_LIBRARY } from "./widget-types"
import type { Widget, WidgetType } from "./widget-types"
import WidgetRenderer from "./widget-renderer"
import WidgetConfigDialog from "./widget-config-dialog"
import type { Dashboard } from "../dashboard-card"

interface ManageWidgetsDialogProps {
  dashboard: Dashboard | null
  open: boolean
  onOpenChange: (open: boolean) => void
  widgets: Widget[]
  onWidgetsChange: (widgets: Widget[]) => void
}

export default function ManageWidgetsDialog({
  dashboard,
  open,
  onOpenChange,
  widgets,
  onWidgetsChange,
}: ManageWidgetsDialogProps) {
  const [configOpen, setConfigOpen] = useState(false)
  const [pendingType, setPendingType] = useState<WidgetType | null>(null)
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null)

  if (!dashboard) return null

  const handleAddFromLibrary = (type: WidgetType) => {
    setEditingWidget(null)
    setPendingType(type)
    setConfigOpen(true)
  }

  const handleEditWidget = (widget: Widget) => {
    setEditingWidget(widget)
    setPendingType(widget.type)
    setConfigOpen(true)
  }

  const handleRemoveWidget = (widgetId: string) => {
    onWidgetsChange(widgets.filter((w) => w.id !== widgetId))
  }

  const handleSaveWidget = (widget: Widget) => {
    const exists = widgets.some((w) => w.id === widget.id)
    onWidgetsChange(
      exists ? widgets.map((w) => (w.id === widget.id ? widget : w)) : [...widgets, widget]
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5" />
              Manage Widgets
            </DialogTitle>
            <DialogDescription>
              Add, configure, and arrange widgets for <span className="font-medium">{dashboard.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Widget Library</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WIDGET_LIBRARY.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.type}
                      onClick={() => handleAddFromLibrary(item.type)}
                      className="flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs font-medium">{item.name}</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">
                        {item.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">On this dashboard ({widgets.length})</h4>

              {widgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
                  <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No widgets yet — add one from the Widget Library above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {widgets.map((widget) => (
                    <WidgetRenderer
                      key={widget.id}
                      widget={widget}
                      onEdit={handleEditWidget}
                      onRemove={handleRemoveWidget}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-1.5" />
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WidgetConfigDialog
        open={configOpen}
        onOpenChange={setConfigOpen}
        widgetType={pendingType}
        existingWidget={editingWidget}
        onSave={handleSaveWidget}
      />
    </>
  )
}