import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Edit, Eye, MessageSquare } from "lucide-react"
import { getStatusBadge, getStatusIcon } from "../../lib/due-diligence-formatters"
import type { DueDiligenceItem } from "../../types/due-diligence.types"

interface ItemViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: DueDiligenceItem | null
  onEditItem: (item: DueDiligenceItem) => void
  onCommentItem: (item: DueDiligenceItem) => void
}

export function ItemViewDialog({
  open,
  onOpenChange,
  selectedItem,
  onEditItem,
  onCommentItem
}: ItemViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto md:max-w-4xl md:max-h-none md:overflow-visible">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Due Diligence Details: {selectedItem?.company}
          </DialogTitle>
          <DialogDescription>
            {selectedItem?.category} review for {selectedItem?.company}
          </DialogDescription>
        </DialogHeader>

        {selectedItem && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Review Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Company:</span>
                    <span className="font-medium">{selectedItem.company}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="outline">{selectedItem.category}</Badge>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Stage:</span>
                    <Badge variant="outline">{selectedItem.stage}</Badge>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <Badge variant={selectedItem.priority === "high" ? "destructive" : selectedItem.priority === "medium" ? "default" : "secondary"}>
                      {selectedItem.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Progress & Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Completion:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedItem.completion} className="w-16 h-2" />
                      <span className="text-sm font-medium">{selectedItem.completion}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedItem.status)}
                      {getStatusBadge(selectedItem.status)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{selectedItem.dueDate}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated:</span>
                    <span className="text-sm text-muted-foreground">{selectedItem.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Team & Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {selectedItem.assignedTo.split(" ").map((name) => name[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium">{selectedItem.assignedTo}</div>
                      <div className="text-sm text-muted-foreground">Lead Reviewer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Documents:</span>
                    <span className="font-medium">{selectedItem.documents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Comments:</span>
                    <span className="font-medium">{selectedItem.comments}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row sm:justify-between sm:gap-0">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" onClick={() => onEditItem(selectedItem)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Review
                </Button>
                <Button variant="outline" size="sm" onClick={() => onCommentItem(selectedItem)}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Add Comment
                </Button>
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
