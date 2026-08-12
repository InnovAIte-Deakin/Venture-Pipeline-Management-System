import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from 'lucide-react'
import { Venture } from "../hooks/use-gedsi-data" // Updated relative path

interface FiltersBarProps {
  ventures: Venture[]
  selectedVenture: string
  setSelectedVenture: (val: string) => void
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  selectedStatus: string
  setSelectedStatus: (val: string) => void
}

export function FiltersBar({
  ventures,
  selectedVenture,
  setSelectedVenture,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus
}: FiltersBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Venture</Label>
            <Select value={selectedVenture} onValueChange={setSelectedVenture}>
              <SelectTrigger><SelectValue placeholder="All ventures" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ventures</SelectItem>
                {ventures.map(venture => (
                  <SelectItem key={venture.id} value={venture.id}>{venture.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Gender">Gender</SelectItem>
                <SelectItem value="Disability">Disability</SelectItem>
                <SelectItem value="Social Inclusion">Social Inclusion</SelectItem>
                <SelectItem value="Cross-cutting">Cross-cutting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}