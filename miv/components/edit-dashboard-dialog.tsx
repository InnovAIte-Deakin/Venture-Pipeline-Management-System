"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Layout, Zap, RefreshCw, Save } from "lucide-react"
import type { Dashboard } from "@/components/dashboard-card"
import type { NewDashboardForm } from "@/components/create-dashboard-dialog"

interface EditDashboardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: string[]
  newDashboard: NewDashboardForm
  setNewDashboard: React.Dispatch<React.SetStateAction<NewDashboardForm>>
  selectedDashboard: Dashboard | null
  onUpdate: () => void
  isLoading: boolean
}

export default function EditDashboardDialog({
  open,
  onOpenChange,
  categories,
  newDashboard,
  setNewDashboard,
  selectedDashboard,
  onUpdate,
  isLoading,
}: EditDashboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Dashboard
          </DialogTitle>
          <DialogDescription>
            Update your dashboard settings and configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-dashboard-name">Dashboard Name</Label>
            <Input
              id="edit-dashboard-name"
              placeholder="Enter dashboard name..."
              value={newDashboard.name}
              onChange={(e) =>
                setNewDashboard((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dashboard-description">Description</Label>
            <Textarea
              id="edit-dashboard-description"
              placeholder="Describe what this dashboard tracks..."
              value={newDashboard.description}
              onChange={(e) =>
                setNewDashboard((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dashboard-category">Category</Label>
              <Select
                value={newDashboard.category}
                onValueChange={(value) =>
                  setNewDashboard((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dashboard-public">Visibility</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id="edit-dashboard-public"
                  checked={newDashboard.isPublic}
                  onCheckedChange={(checked) =>
                    setNewDashboard((prev) => ({ ...prev, isPublic: checked }))
                  }
                />
                <Label htmlFor="edit-dashboard-public" className="text-sm">
                  {newDashboard.isPublic ? "Public" : "Private"}
                </Label>
              </div>
            </div>
          </div>

          {selectedDashboard && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Layout className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Current Dashboard Info</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Widgets: {selectedDashboard.widgets}</div>
                <div>Last modified: {selectedDashboard.lastModified}</div>
                <div>Created by: {selectedDashboard.createdBy}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => alert("Widget management coming soon!")}>
            <Zap className="h-4 w-4 mr-1" />
            Manage Widgets
          </Button>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onUpdate} disabled={!newDashboard.name.trim() || isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Dashboard
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
