import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SocialImpactFilters as Filters } from "../types/social-impact"

export function SocialImpactFilters({ filters, categories, statuses, onChange, onClear }: { filters: Filters; categories: string[]; statuses: string[]; onChange: (value: Filters) => void; onClear: () => void }) {
  return <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
    <label className="relative"><span className="sr-only">Search ventures</span><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={filters.search} onChange={(event) => onChange({ ...filters, search: event.target.value })} placeholder="Search name, sector, or inclusion focus" className="h-10 pl-9" /></label>
    <Select value={filters.category} onValueChange={(category) => onChange({ ...filters, category })}><SelectTrigger className="h-10 w-full" aria-label="Filter by sector"><SelectValue placeholder="All sectors" /></SelectTrigger><SelectContent><SelectItem value="all">All sectors</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
    <Select value={filters.status} onValueChange={(status) => onChange({ ...filters, status })}><SelectTrigger className="h-10 w-full" aria-label="Filter by status"><SelectValue placeholder="All statuses" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
    <Button type="button" variant="ghost" onClick={onClear} className="h-10"><X className="mr-2 h-4 w-4" />Clear</Button>
  </div>
}
