import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ReportStatusFilter } from "../types/advanced-reports.types"
import { REPORT_STATUS_FILTER_OPTIONS } from "../constants/advanced-reports.constants"

interface ReportFiltersProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: ReportStatusFilter
  onStatusFilterChange: (value: ReportStatusFilter) => void
  /** Desktop renders these fields inline; mobile renders the same fields inside a Sheet — only the container differs. */
  layout?: "inline" | "stacked"
}

/** Shared search + status filter fields — the fields themselves are identical on desktop and mobile; only the surrounding container (inline row vs. Sheet) differs. */
export function ReportFilters({ searchQuery, onSearchQueryChange, statusFilter, onStatusFilterChange, layout = "inline" }: ReportFiltersProps) {
  return (
    <div className={layout === "inline" ? "flex flex-col gap-4 md:flex-row" : "flex flex-col gap-4"}>
      <div className="flex-1">
        <Label htmlFor="report-search" className="sr-only">
          Search reports
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <Input
            id="report-search"
            placeholder="Search reports by name, description, or type..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="report-status-filter" className="sr-only">
          Filter by status
        </Label>
        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as ReportStatusFilter)}>
          <SelectTrigger id="report-status-filter" className={layout === "inline" ? "w-40" : "w-full"}>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
