"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  BarChart,
  Calendar,
  Gauge,
  Grid3X3,
  Target,
  type LucideIcon,
} from "lucide-react"

interface WidgetLibraryItem {
  type: string
  name: string
  description: string
  icon: LucideIcon
  borderClass: string
  iconBackgroundClass: string
  iconClass: string
}

interface DashboardWidgetLibraryProps {
  onAddWidget: (widgetName: string) => void
}

const widgetLibrary: WidgetLibraryItem[] = [
  {
    type: "chart",
    name: "Chart",
    description: "Line, bar, or pie charts",
    icon: BarChart,
    borderClass: "border-t-blue-400",
    iconBackgroundClass: "bg-blue-100",
    iconClass: "text-blue-600",
  },
  {
    type: "metric",
    name: "Metric",
    description: "Single value with trend",
    icon: Target,
    borderClass: "border-t-red-400",
    iconBackgroundClass: "bg-red-100",
    iconClass: "text-red-600",
  },
  {
    type: "table",
    name: "Table",
    description: "Data table with sorting",
    icon: Grid3X3,
    borderClass: "border-t-purple-400",
    iconBackgroundClass: "bg-purple-100",
    iconClass: "text-purple-600",
  },
  {
    type: "progress",
    name: "Progress",
    description: "Progress bars and gauges",
    icon: Gauge,
    borderClass: "border-t-amber-400",
    iconBackgroundClass: "bg-amber-100",
    iconClass: "text-amber-600",
  },
  {
    type: "list",
    name: "List",
    description: "Simple list of items",
    icon: Activity,
    borderClass: "border-t-green-400",
    iconBackgroundClass: "bg-green-100",
    iconClass: "text-green-600",
  },
  {
    type: "calendar",
    name: "Calendar",
    description: "Calendar view",
    icon: Calendar,
    borderClass: "border-t-pink-400",
    iconBackgroundClass: "bg-pink-100",
    iconClass: "text-pink-600",
  },
]

export default function DashboardWidgetLibrary({
  onAddWidget,
}: DashboardWidgetLibraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Library</CardTitle>
        <CardDescription>
          Available widgets to add to your dashboards
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {widgetLibrary.map((widget) => {
            const Icon = widget.icon

            return (
              <Card
                key={widget.type}
                className={`cursor-pointer border-t-4 ${widget.borderClass} transition-shadow hover:shadow-md`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${widget.iconBackgroundClass}`}
                    >
                      <Icon className={`h-5 w-5 ${widget.iconClass}`} />
                    </div>

                    <CardTitle className="text-base">
                      {widget.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="mb-3 text-sm text-muted-foreground">
                    {widget.description}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => onAddWidget(widget.name)}
                  >
                    Add Widget
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}