import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialImpactHeader({ refreshing, onRefresh }: { refreshing: boolean; onRefresh: () => void }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Social Impact Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Measuring social outcomes, GEDSI impact, and community engagement across portfolio ventures
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
        <Button variant="outline" onClick={onRefresh} disabled={refreshing} className="min-h-10 px-3">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          {refreshing ? "Refreshing" : "Refresh"}
        </Button>
        <Button asChild className="min-h-10 bg-linear-to-r from-purple-600 to-pink-600">
          <Link href="/dashboard/gedsi-tracker"><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Track Impact</Link>
        </Button>
      </div>
    </header>
  )
}
