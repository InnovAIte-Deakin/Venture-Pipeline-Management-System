import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { DueDiligenceItem } from "../types/due-diligence.types"

interface DueDiligenceAnalyticsProps {
  categories: string[]
  filteredItems: DueDiligenceItem[]
}

export function DueDiligenceAnalytics({ categories, filteredItems }: DueDiligenceAnalyticsProps) {
  const highPriorityItems = filteredItems.filter((item) => item.priority === "high")
  const overdueItems = filteredItems.filter((item) => new Date(item.dueDate) < new Date())

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">High Priority Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {highPriorityItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                <span className="text-sm font-medium truncate">{item.company}</span>
                <Badge variant="destructive" className="text-xs">
                  {item.completion}%
                </Badge>
              </div>
            ))}
            {highPriorityItems.length === 0 && (
              <p className="text-sm text-muted-foreground">No high priority items</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Overdue Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {overdueItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                <span className="text-sm font-medium truncate">{item.company}</span>
                <Badge variant="outline" className="text-xs text-yellow-600">
                  {Math.ceil((new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </Badge>
              </div>
            ))}
            {overdueItems.length === 0 && (
              <p className="text-sm text-muted-foreground">No overdue items</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Category Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.slice(0, 4).map((category) => {
              const categoryItems = filteredItems.filter((item) => item.category === category)
              const avgProgress = categoryItems.length > 0
                ? categoryItems.reduce((sum, item) => sum + item.completion, 0) / categoryItems.length
                : 0
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span className="text-muted-foreground">{avgProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={avgProgress} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
