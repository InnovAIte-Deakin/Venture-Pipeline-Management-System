import { Button } from "@/components/ui/button"

interface ReportSummaryProps {
  filteredCount: number
  totalCount: number
  onClearFilters: () => void
}

/** "Showing N of M reports" bar + Clear Filters, shared by desktop and mobile. */
export function ReportSummary({ filteredCount, totalCount, onClearFilters }: ReportSummaryProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
      <span>
        Showing {filteredCount} of {totalCount} reports
      </span>
      <Button variant="ghost" size="sm" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  )
}
