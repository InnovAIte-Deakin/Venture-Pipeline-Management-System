"use client"

import { useState } from "react"
import type { DragEvent } from "react"
import type { DashboardLayoutItem, UseDashboardBuilderResult, Widget, WidgetPosition } from "../types/advanced-reports.types"
import { AVAILABLE_WIDGETS } from "../constants/advanced-reports.constants"

/**
 * Owns the Dashboard Builder scratch-canvas state only (not the persisted
 * `dashboards` list, which belongs to `use-advanced-reports-data`). Matches
 * the original's non-functional-prototype behaviour exactly: dropped/added
 * widgets never get real data (`data: {}`), nothing here is ever saved into
 * `dashboards`, an API, or localStorage, and closing the builder or
 * reloading the page discards it.
 *
 * `addWidgetByTap` and `moveWidget` are new capabilities this refactor adds
 * for mobile (see README "Mobile Layout") — desktop HTML5 drag-and-drop
 * (`handleDragStart`/`handleDragOver`/`handleDrop`) is preserved unchanged.
 * Both paths append the same shape via the same `data: {}` no-real-data
 * limitation, and `moveWidget` only reorders the in-memory array (it does
 * not resize/reposition — the original `updateWidgetPosition` gap is
 * preserved, not implemented).
 */
export function useDashboardBuilder(): UseDashboardBuilderResult {
  const [isDashboardBuilderOpen, setIsDashboardBuilderOpen] = useState(false)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayoutItem[]>([])

  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId)
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const addWidget = (widgetId: string, position: WidgetPosition) => {
    const widget = AVAILABLE_WIDGETS.find((w) => w.id === widgetId)
    if (!widget) return

    const newWidget: Widget = {
      id: Date.now().toString(),
      type: widget.type,
      title: widget.title,
      data: {},
      position,
      config: { widgetType: widget.id },
    }

    setDashboardLayout((prev) => [...prev, newWidget])
  }

  const handleDrop = (event: DragEvent, targetPosition: WidgetPosition) => {
    event.preventDefault()
    if (!draggedWidget) return
    addWidget(draggedWidget, targetPosition)
    setDraggedWidget(null)
  }

  const addWidgetByTap = (widgetId: string) => {
    addWidget(widgetId, { x: 0, y: 0, w: 4, h: 3 })
  }

  const removeWidget = (widgetId: string) => {
    setDashboardLayout((prev) => prev.filter((w) => w.id !== widgetId))
  }

  const moveWidget = (widgetId: string, direction: "up" | "down") => {
    setDashboardLayout((prev) => {
      const index = prev.findIndex((w) => w.id === widgetId)
      if (index === -1) return prev
      const targetIndex = direction === "up" ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= prev.length) return prev

      const next = [...prev]
      const [moved] = next.splice(index, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
  }

  const clearLayout = () => {
    setDashboardLayout([])
  }

  return {
    isDashboardBuilderOpen,
    setIsDashboardBuilderOpen,
    draggedWidget,
    dashboardLayout,
    handleDragStart,
    handleDragOver,
    handleDrop,
    addWidgetByTap,
    removeWidget,
    moveWidget,
    clearLayout,
  }
}
