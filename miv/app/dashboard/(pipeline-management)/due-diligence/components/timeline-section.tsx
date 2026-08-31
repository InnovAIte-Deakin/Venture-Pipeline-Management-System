import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getPriorityBadge, getStatusBadge } from "../lib/due-diligence-formatters"
import type { DueDiligenceItem } from "../types/due-diligence.types"

interface TimelineSectionProps {
  filteredItems: DueDiligenceItem[]
}

export function TimelineSection({ filteredItems }: TimelineSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Due Diligence Timeline</CardTitle>
        <CardDescription>
          Visual timeline of all due diligence activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredItems.slice(0, 10).map((item) => {
            const isOverdue = new Date(item.dueDate) < new Date()
            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${
                  item.status === "completed" ? "bg-green-500" :
                  item.status === "in_progress" ? "bg-blue-500" :
                  isOverdue ? "bg-red-500" : "bg-gray-300"
                }`} />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-0">
                    <div className="min-w-0">
                      <h4 className="font-medium break-words">{item.company} - {item.category}</h4>
                      <p className="text-sm text-muted-foreground">{item.stage}</p>
                    </div>
                    <div className="md:text-right">
                      <div className="text-sm font-medium">{item.dueDate}</div>
                      <div className="text-xs text-muted-foreground">{item.assignedTo}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                    <Progress value={item.completion} className="flex-1 h-2" />
                    <span className="text-sm">{item.completion}%</span>
                    <div className="flex flex-wrap gap-2">
                      {getPriorityBadge(item.priority)}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  {isOverdue && (
                    <div className="text-sm text-red-600">
                      âš ï¸ Overdue by {Math.ceil((new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {filteredItems.length > 10 && (
            <div className="text-center pt-4">
              <Button variant="outline">
                View All {filteredItems.length} Items
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
