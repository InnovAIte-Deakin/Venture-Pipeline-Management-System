import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Plus } from "lucide-react"
import { getPriorityBadge } from "../lib/due-diligence-formatters"
import type { ChecklistItem } from "../types/due-diligence.types"

interface ChecklistSectionProps {
  checklistItems: ChecklistItem[]
}

export function ChecklistSection({ checklistItems }: ChecklistSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Due Diligence Checklist</CardTitle>
        <CardDescription>
          Standard checklist items for due diligence process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checklistItems.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Checklist Items</h3>
              <p className="text-muted-foreground mb-4">
                Add ventures to generate due diligence checklist items.
              </p>
              <Button onClick={() => window.location.href = "/dashboard/venture-intake"}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Venture
              </Button>
            </div>
          ) : (
            checklistItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  checked={item.completed}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-0">
                    <h4 className="font-medium break-words">{item.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {getPriorityBadge(item.priority)}
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground break-words">{item.description}</p>
                  <div className="flex flex-col gap-1 text-sm md:flex-row md:items-center md:justify-between md:gap-0">
                    <span className="text-muted-foreground">Assigned to: {item.assignedTo}</span>
                    <span className="text-muted-foreground">Due: {item.dueDate}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
