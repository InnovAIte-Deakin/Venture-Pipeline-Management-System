import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

interface DealFlowHeaderProps {
  isExporting: boolean
  onExport: () => void
  onAddDeal: () => void
}

export function DealFlowHeader({ isExporting, onExport, onAddDeal }: DealFlowHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deal Flow</h1>
        <p className="text-muted-foreground">Manage and track your impact venture pipeline with GEDSI analytics</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onExport} disabled={isExporting}>
          {isExporting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
              Exporting...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              Export Pipeline
            </>
          )}
        </Button>
        <Button onClick={onAddDeal}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add New Deal
        </Button>
      </div>
    </header>
  )
}
