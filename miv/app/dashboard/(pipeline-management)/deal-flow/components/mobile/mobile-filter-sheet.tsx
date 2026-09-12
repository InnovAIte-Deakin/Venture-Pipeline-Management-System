import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DealFlowFilters } from "../deal-flow-filters"
import type { DealFlowFilters as DealFlowFiltersType } from "../../types/deal-flow.types"

interface MobileFilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: DealFlowFiltersType
  onChange: (filters: DealFlowFiltersType) => void
}

export function MobileFilterSheet({ open, onOpenChange, filters, onChange }: MobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-lg">
        <SheetHeader>
          <SheetTitle>Filter Deals</SheetTitle>
          <SheetDescription>Refine the mobile deal list by search, stage, sector, founder type, and status.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <DealFlowFilters filters={filters} onChange={onChange} compact />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onChange({
                  searchTerm: "",
                  selectedStage: "all",
                  selectedSector: "all",
                  selectedStatus: "all",
                  selectedFounderType: "all",
                })
              }
            >
              Reset
            </Button>
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
