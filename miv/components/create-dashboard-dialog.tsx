"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Plus,
  Sparkles,
  RefreshCw,
  Save,
  TrendingUp,
  Heart,
  BarChart3,
  Activity,
} from "lucide-react"

export interface NewDashboardForm {
  name: string
  description: string
  category: string
  isPublic: boolean
  widgets: unknown[]
}

interface CreateDashboardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: string[]
  newDashboard: NewDashboardForm
  setNewDashboard: React.Dispatch<React.SetStateAction<NewDashboardForm>>
  onCreate: () => void
  isLoading: boolean
}

export default function CreateDashboardDialog({
  open,
  onOpenChange,
  categories,
  newDashboard,
  setNewDashboard,
  onCreate,
  isLoading,
}: CreateDashboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Dashboard
          </DialogTitle>
          <DialogDescription>
            Create a custom dashboard to track your key metrics and KPIs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="dashboard-name">Dashboard Name</Label>
            <Input
              id="dashboard-name"
              placeholder="Enter dashboard name..."
              value={newDashboard.name}
              onChange={(e) =>
                setNewDashboard((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dashboard-description">Description</Label>
            <Textarea
              id="dashboard-description"
              placeholder="Describe what this dashboard will track..."
              value={newDashboard.description}
              onChange={(e) =>
                setNewDashboard((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dashboard-category">Category</Label>
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
              <Label htmlFor="dashboard-public">Visibility</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id="dashboard-public"
                  checked={newDashboard.isPublic}
                  onCheckedChange={(checked) =>
                    setNewDashboard((prev) => ({ ...prev, isPublic: checked }))
                  }
                />
                <Label htmlFor="dashboard-public" className="text-sm">
                  {newDashboard.isPublic ? "Public" : "Private"}
                </Label>
              </div>
            </div>
          </div>

          {/* Quick Start Options */}
          <div className="space-y-3">
            <Label>Quick Start Options</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setNewDashboard((prev) => ({ ...prev, category: "Portfolio" }))}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">Portfolio Focus</div>
                    <div className="text-xs text-muted-foreground">Track investments & returns</div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setNewDashboard((prev) => ({ ...prev, category: "Impact" }))}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Heart className="h-8 w-8 text-pink-600" />
                  <div>
                    <div className="font-medium text-sm">Impact Focus</div>
                    <div className="text-xs text-muted-foreground">Track GEDSI & social impact</div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setNewDashboard((prev) => ({ ...prev, category: "Pipeline" }))}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Pipeline Focus</div>
                    <div className="text-xs text-muted-foreground">Track deal flow & stages</div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setNewDashboard((prev) => ({ ...prev, category: "Operations" }))}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="font-medium text-sm">Operations Focus</div>
                    <div className="text-xs text-muted-foreground">Track team & processes</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            You can add widgets after creating the dashboard
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onCreate} disabled={!newDashboard.name.trim() || isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Dashboard
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
