import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Calendar, Edit, Eye, MessageSquare, MoreHorizontal } from "lucide-react"
import { getPriorityBadge, getStatusBadge, getStatusIcon } from "../../lib/due-diligence-formatters"
import type { DueDiligenceItem } from "../../types/due-diligence.types"

interface MobileItemCardProps {
  item: DueDiligenceItem
  selected: boolean
  onSelectionChange: (checked: boolean) => void
  onView: (item: DueDiligenceItem) => void
  onEdit: (item: DueDiligenceItem) => void
  onComment: (item: DueDiligenceItem) => void
  onMore: (item: DueDiligenceItem) => void
}

export function MobileItemCard({
  item,
  selected,
  onSelectionChange,
  onView,
  onEdit,
  onComment,
  onMore
}: MobileItemCardProps) {
  const isOverdue = new Date(item.dueDate) < new Date()
  const daysUntilDue = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={`transition-colors ${
      isOverdue ? "bg-red-50 dark:bg-red-950/30" :
      daysUntilDue <= 3 ? "bg-yellow-50 dark:bg-yellow-950/30" : ""
    }`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectionChange(Boolean(checked))}
            className="mt-1"
            aria-label={`Select ${item.company} ${item.category}`}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-medium break-words">{item.company}</h4>
                {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                {!isOverdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                  <Badge variant="outline" className="text-xs text-yellow-600">Due Soon</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{item.id}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">{item.stage}</Badge>
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
              {getPriorityBadge(item.priority)}
            </div>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300 shrink-0">
              {item.assignedTo.split(" ").map((name) => name[0]).join("")}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{item.assignedTo}</div>
              <div className="text-xs text-muted-foreground">{item.lastUpdated}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Progress
                value={item.completion}
                className={`h-2 flex-1 ${
                  item.completion >= 80 ? "[&>div]:bg-green-600" :
                  item.completion >= 50 ? "[&>div]:bg-yellow-500" :
                  "[&>div]:bg-red-500"
                }`}
              />
              <span className="text-sm font-medium min-w-8.75">{item.completion}%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {getStatusIcon(item.status)}
            {getStatusBadge(item.status)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                {item.dueDate}
              </span>
            </div>
            {daysUntilDue > 0 && (
              <div className="text-xs text-muted-foreground">
                {daysUntilDue} days left
              </div>
            )}
            {daysUntilDue < 0 && (
              <div className="text-xs text-red-600">
                {Math.abs(daysUntilDue)} days overdue
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 border-t pt-3">
          <Button variant="ghost" size="sm" aria-label={`View ${item.company} ${item.category}`} onClick={() => onView(item)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label={`Edit ${item.company} ${item.category}`} onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label={`Comment on ${item.company} ${item.category}`} onClick={() => onComment(item)}>
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label={`More actions for ${item.company} ${item.category}`} onClick={() => onMore(item)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
