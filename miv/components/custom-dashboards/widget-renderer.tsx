"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { WIDGET_LIBRARY } from "./widget-types"
import type { Widget } from "./widget-types"

interface WidgetRendererProps {
  widget: Widget
  onEdit: (widget: Widget) => void
  onRemove: (widgetId: string) => void
}

export default function WidgetRenderer({ widget, onEdit, onRemove }: WidgetRendererProps) {
  const libraryItem = WIDGET_LIBRARY.find((w) => w.type === widget.type)
  const Icon = libraryItem?.icon

  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && <Icon className="h-4 w-4 text-blue-600 shrink-0" />}
            <CardTitle className="text-sm truncate">{widget.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(widget)}>
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onRemove(widget.id)}
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {widget.description && (
          <p className="text-xs text-muted-foreground mb-2">{widget.description}</p>
        )}

        {widget.config.type === "metric" && (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold">{widget.config.value}</span>
            {widget.config.unit && (
              <span className="text-sm text-muted-foreground">{widget.config.unit}</span>
            )}
            {widget.config.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600 ml-1" />}
            {widget.config.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600 ml-1" />}
            {widget.config.trend === "flat" && <Minus className="h-4 w-4 text-muted-foreground ml-1" />}
          </div>
        )}

        {widget.config.type === "chart" && (
          <div className="text-xs text-muted-foreground">
            {widget.config.chartType.toUpperCase()} chart · {widget.config.dataSource || "no data source set"}
          </div>
        )}

        {widget.config.type === "table" && (
          <div className="flex flex-wrap gap-1">
            {widget.config.columns.map((col, i) => (
              <span key={i} className="text-xs bg-muted rounded px-1.5 py-0.5">
                {col}
              </span>
            ))}
          </div>
        )}

        {widget.config.type === "list" && (
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            {widget.config.items.slice(0, 3).map((item, i) => (
              <li key={i} className="truncate">{item}</li>
            ))}
            {widget.config.items.length > 3 && (
              <li className="text-muted-foreground/70">+{widget.config.items.length - 3} more</li>
            )}
            {widget.config.items.length === 0 && <li className="italic">No items yet</li>}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}