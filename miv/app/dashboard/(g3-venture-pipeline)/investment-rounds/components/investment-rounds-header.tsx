import { Activity, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function InvestmentRoundsHeader({ loading, onRefresh }: { loading: boolean; onRefresh: () => void }) {
  return <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div><h1 className="text-3xl font-bold tracking-tight">Investment Rounds</h1><p className="text-muted-foreground">Track investment rounds with GEDSI impact metrics and AI insights</p></div>
    <div className="flex items-center gap-2">
      {/* Mobile: icon-only refresh */}
      <Button variant="outline" onClick={onRefresh} disabled={loading} className="inline-flex md:hidden" size="icon" aria-label="Refresh">
        <Activity className="h-4 w-4" />
      </Button>
      {/* Desktop / larger: full label */}
      <Button variant="outline" onClick={onRefresh} disabled={loading} className="hidden md:inline-flex">
        <Activity className="mr-2 h-4 w-4" />Refresh
      </Button>

      <Dialog>
        {/* Mobile: icon-only New Round */}
        <DialogTrigger asChild>
          <Button className="inline-flex md:hidden" size="icon" aria-label="New Round">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        {/* Desktop / larger: full label */}
        <DialogTrigger asChild>
          <Button className="hidden md:inline-flex"><Plus className="mr-2 h-4 w-4" />New Round</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl"><DialogHeader><DialogTitle>Add New Investment Round</DialogTitle><DialogDescription>Create a new investment round with GEDSI impact tracking</DialogDescription></DialogHeader>
          <div className="py-8 text-center text-muted-foreground"><Sparkles className="mx-auto mb-4 h-12 w-12 opacity-50" /><p>Add Round Form Coming Soon</p><p className="text-sm">Will include GEDSI scoring and impact metrics</p></div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
}
