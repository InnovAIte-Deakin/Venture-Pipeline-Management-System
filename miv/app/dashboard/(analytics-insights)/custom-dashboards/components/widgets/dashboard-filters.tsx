"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, Search } from "lucide-react"

interface DashboardFiltersProps {
  searchTerm: string
  selectedCategory: string
  selectedView: string
  categories: string[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onViewChange: (value: string) => void
}

export default function DashboardFilters({
  searchTerm,
  selectedCategory,
  selectedView,
  categories,
  onSearchChange,
  onCategoryChange,
  onViewChange,
}: DashboardFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search dashboards..."
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={selectedCategory}
              onValueChange={onCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">View</label>
            <Select value={selectedView} onValueChange={onViewChange}>
              <SelectTrigger>
                <SelectValue placeholder="All views" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dashboards</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}