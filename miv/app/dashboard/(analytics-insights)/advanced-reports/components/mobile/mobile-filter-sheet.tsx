import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ReportFilters } from "../report-filters"
import type { ReportStatusFilter } from "../../types/advanced-reports.types"

interface MobileFilterSheetProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  statusFilter: ReportStatusFilter
  onStatusFilterChange: (value: ReportStatusFilter) => void
  resultCount: number
}

/** Search/status filters inside a Sheet instead of an inline row competing for width — same fields as desktop's inline `ReportFilters`. */
export function MobileFilterSheet({ searchQuery, onSearchQueryChange, statusFilter, onStatusFilterChange, resultCount }: MobileFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
          Filters
          {(searchQuery || statusFilter !== "all") && <span className="ml-2 text-xs text-muted-foreground">({resultCount} matching)</span>}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Reports</SheetTitle>
          <SheetDescription>Search by name, description, or type, and narrow by status.</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <ReportFilters
            layout="stacked"
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
