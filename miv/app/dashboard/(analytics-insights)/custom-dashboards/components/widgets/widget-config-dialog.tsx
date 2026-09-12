"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, X } from "lucide-react"
import type { Widget, WidgetType, WidgetConfig } from "./widget-types"
import { createDefaultConfig, WIDGET_LIBRARY } from "./widget-types"

interface WidgetConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  widgetType: WidgetType | null
  existingWidget: Widget | null
  onSave: (widget: Widget) => void
}

export default function WidgetConfigDialog({
  open,
  onOpenChange,
  widgetType,
  existingWidget,
  onSave,
}: WidgetConfigDialogProps) {
  const type = existingWidget?.type ?? widgetType
  const libraryItem = WIDGET_LIBRARY.find((w) => w.type === type)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [config, setConfig] = useState<WidgetConfig | null>(null)

  useEffect(() => {
    if (!open || !type) return
    if (existingWidget) {
      setTitle(existingWidget.title)
      setDescription(existingWidget.description ?? "")
      setConfig(existingWidget.config)
    } else {
      setTitle("")
      setDescription("")
      setConfig(createDefaultConfig(type))
    }
  }, [open, type, existingWidget])

  if (!type || !config) return null

  const handleSave = () => {
    if (!title.trim()) return
    const widget: Widget = {
      id: existingWidget?.id ?? crypto.randomUUID(),
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      config,
    }
    onSave(widget)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingWidget ? "Edit Widget" : `Add ${libraryItem?.name ?? "Widget"}`}</DialogTitle>
          <DialogDescription>
            {libraryItem?.description ?? "Configure this widget."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="widget-title">Title</Label>
            <Input
              id="widget-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Total Active Ventures"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="widget-description">Description (optional)</Label>
            <Textarea
              id="widget-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this widget shows"
              rows={2}
            />
          </div>

          {config.type === "metric" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Value</Label>
                <Input
                  value={config.value}
                  onChange={(e) => setConfig({ ...config, value: e.target.value })}
                  placeholder="128"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unit (optional)</Label>
                <Input
                  value={config.unit ?? ""}
                  onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                  placeholder="ventures"
                />
              </div>
            </div>
          )}

          {config.type === "chart" && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Chart Type</Label>
                <Select
                  value={config.chartType}
                  onValueChange={(v) => setConfig({ ...config, chartType: v as "bar" | "line" | "pie" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="pie">Pie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Data Source</Label>
                <Input
                  value={config.dataSource}
                  onChange={(e) => setConfig({ ...config, dataSource: e.target.value })}
                  placeholder="e.g. ventures-by-stage"
                />
              </div>
            </div>
          )}

          {config.type === "table" && (
            <div className="space-y-1.5">
              <Label>Columns (comma-separated)</Label>
              <Input
                value={config.columns.join(", ")}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    columns: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                  })
                }
                placeholder="Name, Status, Stage"
              />
            </div>
          )}

          {config.type === "list" && (
            <div className="space-y-1.5">
              <Label>Items (one per line)</Label>
              <Textarea
                value={config.items.join("\n")}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    items: e.target.value.split("\n").map((i) => i.trim()).filter(Boolean),
                  })
                }
                rows={4}
                placeholder={"Venture A approved\nVenture B submitted"}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-4">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
            <Save className="h-4 w-4 mr-1.5" />
            {existingWidget ? "Save Changes" : "Add Widget"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}