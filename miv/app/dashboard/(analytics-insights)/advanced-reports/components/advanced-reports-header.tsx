import { FileText, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Title + Templates/Settings/New Report buttons. All three remain
 * decorative (no `onClick`) — preserved from the original, which never
 * wired them up. See README "Dialogs and Actions".
 */
export function AdvancedReportsHeader() {
  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight">Advanced Reports</h1>
        <p className="text-muted-foreground">Generate comprehensive reports and analytics for data-driven decision making</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Templates
        </Button>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>
    </div>
  )
}
