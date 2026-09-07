"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  BarChart,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

interface DashboardTemplate {
  name: string
  description: string
  widgetCount: number
  icon: LucideIcon
  borderClass: string
  iconBackgroundClass: string
  iconClass: string
}

interface DashboardTemplatesProps {
  onUseTemplate: (templateName: string, widgetCount: number) => void
}

const dashboardTemplates: DashboardTemplate[] = [
  {
    name: "Pipeline Overview",
    description: "Complete pipeline tracking with deal flow metrics",
    widgetCount: 8,
    icon: BarChart,
    borderClass: "border-t-blue-400",
    iconBackgroundClass: "bg-blue-100",
    iconClass: "text-blue-600",
  },
  {
    name: "Portfolio Performance",
    description: "Portfolio tracking with IRR and performance metrics",
    widgetCount: 12,
    icon: TrendingUp,
    borderClass: "border-t-green-400",
    iconBackgroundClass: "bg-green-100",
    iconClass: "text-green-600",
  },
  {
    name: "GEDSI Impact",
    description: "Gender equality and social impact tracking",
    widgetCount: 6,
    icon: Users,
    borderClass: "border-t-purple-400",
    iconBackgroundClass: "bg-purple-100",
    iconClass: "text-purple-600",
  },
  {
    name: "Due Diligence",
    description: "Due diligence process tracking and management",
    widgetCount: 10,
    icon: Activity,
    borderClass: "border-t-orange-400",
    iconBackgroundClass: "bg-orange-100",
    iconClass: "text-orange-600",
  },
  {
    name: "Financial Overview",
    description: "Financial metrics and investment tracking",
    widgetCount: 9,
    icon: DollarSign,
    borderClass: "border-t-green-400",
    iconBackgroundClass: "bg-green-100",
    iconClass: "text-green-600",
  },
  {
    name: "Team Performance",
    description: "Team productivity and performance metrics",
    widgetCount: 7,
    icon: Target,
    borderClass: "border-t-red-400",
    iconBackgroundClass: "bg-red-100",
    iconClass: "text-red-600",
  },
]

export default function DashboardTemplates({
  onUseTemplate,
}: DashboardTemplatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Templates</CardTitle>
        <CardDescription>
          Pre-built dashboard templates to get you started quickly
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardTemplates.map((template) => {
            const Icon = template.icon

            return (
              <Card
                key={template.name}
                className={`cursor-pointer border-t-4 ${template.borderClass} transition-shadow hover:shadow-md`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${template.iconBackgroundClass}`}
                    >
                      <Icon className={`h-5 w-5 ${template.iconClass}`} />
                    </div>
                    <CardTitle className="text-base">
                      {template.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="mb-3 text-sm text-muted-foreground">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {template.widgetCount} widgets
                    </Badge>

                    <Button
                      size="sm"
                      onClick={() =>
                        onUseTemplate(template.name, template.widgetCount)
                      }
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}