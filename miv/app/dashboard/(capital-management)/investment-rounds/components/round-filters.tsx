import { Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FOUNDER_TYPES, ROUND_TYPES, SECTORS, STAGES } from "@/app/dashboard/(capital-management)/investment-rounds/libs/constants"
import type { RoundFiltersState } from "@/app/dashboard/(capital-management)/investment-rounds/libs/types"

export function RoundFilters({ filters, onChange }: { filters: RoundFiltersState; onChange: <K extends keyof RoundFiltersState>(key: K, value: RoundFiltersState[K]) => void }) {
  const selects = [
    { key: "roundType", label: "Round Type", all: "All round types", options: ROUND_TYPES },
    { key: "stage", label: "Stage", all: "All stages", options: STAGES },
    { key: "sector", label: "Sector", all: "All sectors", options: SECTORS },
    { key: "founderType", label: "Founder Type", all: "All founder types", options: FOUNDER_TYPES },
    { key: "status", label: "Status", all: "All statuses", options: ["open", "closing", "closed", "cancelled"] },
  ] as const
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters &amp; Search</CardTitle></CardHeader><CardContent><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
    <div className="space-y-2"><label htmlFor="round-search" className="text-sm font-medium">Search</label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="round-search" placeholder="Search rounds, companies, locations..." value={filters.searchTerm} onChange={(event) => onChange("searchTerm", event.target.value)} className="pl-10 w-full" /></div></div>
    {selects.map(({ key, label, all, options }) => <div key={key} className="space-y-2"><label className="text-sm font-medium">{label}</label><Select value={filters[key]} onValueChange={(value) => onChange(key, value)}><SelectTrigger aria-label={label} className="w-full"><SelectValue placeholder={all} /></SelectTrigger><SelectContent><SelectItem value="all">{all}</SelectItem>{options.map((option) => <SelectItem key={option} value={option}>{key === "founderType" ? option.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : key === "status" ? option[0].toUpperCase() + option.slice(1) : option}</SelectItem>)}</SelectContent></Select></div>)}
  </div></CardContent></Card>
}
