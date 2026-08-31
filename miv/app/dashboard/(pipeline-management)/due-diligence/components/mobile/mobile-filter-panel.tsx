import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import type { DateRange } from "../../types/due-diligence.types"

interface MobileFilterPanelProps {
  selectedVentureForDetails: string | null
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  selectedCategory: string
  setSelectedCategory: Dispatch<SetStateAction<string>>
  selectedStage: string
  setSelectedStage: Dispatch<SetStateAction<string>>
  selectedStatus: string
  setSelectedStatus: Dispatch<SetStateAction<string>>
  selectedPriority: string
  setSelectedPriority: Dispatch<SetStateAction<string>>
  sortBy: string
  setSortBy: Dispatch<SetStateAction<string>>
  showAdvancedFilters: boolean
  setShowAdvancedFilters: Dispatch<SetStateAction<boolean>>
  dateRange: DateRange
  setDateRange: Dispatch<SetStateAction<DateRange>>
  categories: string[]
  stages: string[]
}

export function MobileFilterPanel({
  selectedVentureForDetails,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStage,
  setSelectedStage,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  showAdvancedFilters,
  setShowAdvancedFilters,
  dateRange,
  setDateRange,
  categories,
  stages
}: MobileFilterPanelProps) {
  return (
    <Card className="md:hidden">
      <CardHeader>
        <div className="space-y-3">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {selectedVentureForDetails ? `Filters for ${selectedVentureForDetails}` : "Filters & Search"}
          </CardTitle>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? "Simple" : "Advanced"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedStage("all")
                setSelectedStatus("all")
                setSelectedPriority("all")
                setDateRange({ from: "", to: "" })
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies, IDs..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="completion">Progress</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="lastUpdated">Last Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stage</label>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="All stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date From</label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(event) => setDateRange((prev) => ({ ...prev, from: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date To</label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(event) => setDateRange((prev) => ({ ...prev, to: event.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <Button
              variant={selectedStatus === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(selectedStatus === "in_progress" ? "all" : "in_progress")}
            >
              In Progress
            </Button>
            <Button
              variant={selectedPriority === "high" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority(selectedPriority === "high" ? "all" : "high")}
            >
              High Priority
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date().toISOString().split("T")[0]
                setDateRange({ from: "", to: today })
              }}
            >
              Overdue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                setDateRange({
                  from: today.toISOString().split("T")[0],
                  to: nextWeek.toISOString().split("T")[0]
                })
              }}
            >
              Due This Week
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
