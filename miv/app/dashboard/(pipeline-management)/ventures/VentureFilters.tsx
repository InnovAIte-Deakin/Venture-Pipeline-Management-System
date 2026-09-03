"use client"

import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  formatLabel,
  hasActiveVentureFilters,
  type VentureFiltersState,
  VENTURE_STAGES,
  VENTURE_STATUSES,
} from "@/lib/ventures"

interface VentureFiltersProps {
  filters: VentureFiltersState
  sectors: string[]
  resultCount: number
  totalCount: number
  onChange: (filters: VentureFiltersState) => void
}

export function VentureFilters({ filters, sectors, resultCount, totalCount, onChange }: VentureFiltersProps) {
  const updateFilter = (key: keyof VentureFiltersState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onChange({ search: "", status: "all", stage: "all", sector: "all" })
  }

  const hasFilters = hasActiveVentureFilters(filters)

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Filter Ventures</CardTitle>
            <CardDescription>
              Showing {resultCount} of {totalCount} ventures
            </CardDescription>
          </div>
          {hasFilters && (
            <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="w-full sm:w-auto">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="min-w-0 space-y-2">
            <Label htmlFor="venture-search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="venture-search"
                placeholder="Search ventures..."
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="min-w-0 space-y-2">
            <Label htmlFor="venture-status-filter">Status</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
              <SelectTrigger id="venture-status-filter" className="w-full">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {VENTURE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0 space-y-2">
            <Label htmlFor="venture-stage-filter">Stage</Label>
            <Select value={filters.stage} onValueChange={(value) => updateFilter("stage", value)}>
              <SelectTrigger id="venture-stage-filter" className="w-full">
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {VENTURE_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {formatLabel(stage)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0 space-y-2">
            <Label htmlFor="venture-sector-filter">Sector</Label>
            <Select value={filters.sector} onValueChange={(value) => updateFilter("sector", value)}>
              <SelectTrigger id="venture-sector-filter" className="w-full">
                <SelectValue placeholder="All sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
