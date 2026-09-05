import { BarChart3, Hash, List as ListIcon, Table as TableIcon, LucideIcon } from "lucide-react"

export type WidgetType = "metric" | "chart" | "table" | "list"

export interface Widget {
  id: string
  type: WidgetType
  title: string
  description?: string
  config: WidgetConfig
}

export type WidgetConfig =
  | { type: "metric"; value: string; unit?: string; trend?: "up" | "down" | "flat" }
  | { type: "chart"; chartType: "bar" | "line" | "pie"; dataSource: string }
  | { type: "table"; columns: string[] }
  | { type: "list"; items: string[] }

export interface WidgetLibraryItem {
  type: WidgetType
  name: string
  description: string
  icon: LucideIcon
}

export const WIDGET_LIBRARY: WidgetLibraryItem[] = [
  { type: "metric", name: "Metric Card", description: "A single KPI, like total ventures or revenue.", icon: Hash },
  { type: "chart", name: "Chart", description: "Bar, line, or pie visualization of a data source.", icon: BarChart3 },
  { type: "table", name: "Table", description: "Tabular view of records with custom columns.", icon: TableIcon },
  { type: "list", name: "List", description: "Simple list of items, like recent activity.", icon: ListIcon },
]

export function createDefaultConfig(type: WidgetType): WidgetConfig {
  switch (type) {
    case "metric":
      return { type: "metric", value: "0", unit: "", trend: "flat" }
    case "chart":
      return { type: "chart", chartType: "bar", dataSource: "" }
    case "table":
      return { type: "table", columns: ["Column 1", "Column 2"] }
    case "list":
      return { type: "list", items: [] }
  }
}