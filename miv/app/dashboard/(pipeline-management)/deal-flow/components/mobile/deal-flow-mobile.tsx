"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DEAL_STAGES } from "../../constants/deal-flow.constants"
import { DealFlowSummary } from "../deal-flow-summary"
import { MobileDealList } from "./mobile-deal-list"
import { MobileFilterSheet } from "./mobile-filter-sheet"
import type { DealFlowState, DealStage } from "../../types/deal-flow.types"
import { Filter, Search } from "lucide-react"

export function DealFlowMobile({ state }: { state: DealFlowState }) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="space-y-4">
      <DealFlowSummary summary={state.summary} variant="compact" />

      <div className="space-y-3 rounded-lg border p-3">
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="mobile-deal-search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="mobile-deal-search"
                value={state.filters.searchTerm}
                onChange={(event) => state.actions.setFilters((current) => ({ ...current, searchTerm: event.target.value }))}
                placeholder="Search deals"
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => setFiltersOpen(true)} aria-label="Open deal filters">
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Stage filters">
          <StageChip
            label="All"
            selected={state.filters.selectedStage === "all"}
            onClick={() => {
              state.actions.setSelectedStageForFilter(null)
              state.actions.setFilters((current) => ({ ...current, selectedStage: "all" }))
            }}
          />
          {DEAL_STAGES.map((stage) => (
            <StageChip
              key={stage}
              label={stage}
              selected={state.filters.selectedStage === stage}
              onClick={() => state.actions.handleStageFilter(stage as DealStage)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Deals</h2>
        <Badge variant="secondary">{state.filteredDeals.length}</Badge>
      </div>

      <MobileDealList deals={state.filteredDeals} onViewDeal={state.actions.handleViewDeal} onEditDeal={state.actions.handleEditDeal} />
      <MobileFilterSheet open={filtersOpen} onOpenChange={setFiltersOpen} filters={state.filters} onChange={state.actions.setFilters} />
    </div>
  )
}

function StageChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <Button type="button" size="sm" variant={selected ? "default" : "outline"} className="h-8 rounded-full" onClick={onClick}>
      {label}
    </Button>
  )
}
