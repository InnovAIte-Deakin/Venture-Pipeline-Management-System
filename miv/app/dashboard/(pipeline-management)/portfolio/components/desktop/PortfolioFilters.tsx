"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PortfolioFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedStageFilter: string
  onStageFilterChange: (value: string) => void
  selectedFounderType: string
  onFounderTypeChange: (value: string) => void
  founderTypes: string[]
}

export function PortfolioFilters({
  searchTerm,
  onSearchChange,
  selectedStageFilter,
  onStageFilterChange,
  selectedFounderType,
  onFounderTypeChange,
  founderTypes,
}: PortfolioFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      <Select value={selectedStageFilter} onValueChange={onStageFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="portfolio">Portfolio Companies Only</SelectItem>
          <SelectItem value="all">All Ventures (Including Pipeline)</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedFounderType} onValueChange={onFounderTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {founderTypes.map(type => (
            <SelectItem key={type} value={type}>
              {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
