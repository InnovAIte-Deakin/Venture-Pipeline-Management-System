import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Edit } from "lucide-react"
import type { DueDiligenceItem } from "../../types/due-diligence.types"

interface ItemEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: DueDiligenceItem | null
}

export function ItemEditDialog({ open, onOpenChange, selectedItem }: ItemEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto sm:max-w-2xl md:max-h-none md:overflow-visible">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Due Diligence: {selectedItem?.company}
          </DialogTitle>
          <DialogDescription>
            Update {selectedItem?.category} review details and progress
          </DialogDescription>
        </DialogHeader>

        {selectedItem && (
          <div className="space-y-6 py-4">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <strong>Demo Mode:</strong> This is a demonstration. In production, this would update the actual due diligence records.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Progress (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={selectedItem.completion}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select defaultValue={selectedItem.priority} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue={selectedItem.status} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Add notes about the review progress..."
                rows={4}
                disabled
              />
            </div>
          </div>
        )}

        <div className="flex flex-col justify-end gap-2 pt-4 border-t sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled>
            Save Changes (Demo)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
