import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FOUNDER_TYPES, SECTORS, DEAL_STAGES } from "../constants/deal-flow.constants"
import type { DealFlowFilters, DealStage, DealStatus } from "../types/deal-flow.types"
import { Search } from "lucide-react"

interface DealFlowFiltersProps {
  filters: DealFlowFilters
  onChange: (filters: DealFlowFilters) => void
  compact?: boolean
}

export function DealFlowFilters({ filters, onChange, compact = false }: DealFlowFiltersProps) {
  const gridClassName = compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2 lg:grid-cols-5"

  return (
    <div className={gridClassName}>
      <div className="space-y-2">
        <Label htmlFor="deal-search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="deal-search"
            placeholder="Search deals, companies, focus..."
            value={filters.searchTerm}
            onChange={(event) => onChange({ ...filters, searchTerm: event.target.value })}
            className="pl-10"
          />
        </div>
      </div>
      <SelectField
        label="Stage"
        value={filters.selectedStage}
        onValueChange={(value) => onChange({ ...filters, selectedStage: value as DealStage | "all" })}
        options={DEAL_STAGES.map((stage) => ({ value: stage, label: stage }))}
        allLabel="All stages"
      />
      <SelectField
        label="Sector"
        value={filters.selectedSector}
        onValueChange={(value) => onChange({ ...filters, selectedSector: value })}
        options={SECTORS.map((sector) => ({ value: sector, label: sector }))}
        allLabel="All sectors"
      />
      <SelectField
        label="Founder Type"
        value={filters.selectedFounderType}
        onValueChange={(value) => onChange({ ...filters, selectedFounderType: value })}
        options={FOUNDER_TYPES.map((type) => ({ value: type, label: formatFounderType(type) }))}
        allLabel="All types"
      />
      <SelectField
        label="Status"
        value={filters.selectedStatus}
        onValueChange={(value) => onChange({ ...filters, selectedStatus: value as DealStatus | "all" })}
        options={[
          { value: "active", label: "Active" },
          { value: "paused", label: "Paused" },
          { value: "closed", label: "Closed" },
          { value: "lost", label: "Lost" },
        ]}
        allLabel="All statuses"
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onValueChange,
  options,
  allLabel,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  allLabel: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function formatFounderType(type: string): string {
  return type.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}
