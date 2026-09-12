import type { Deal, DealFlowFilters, SortState } from "../types/deal-flow.types"

export function dealMatchesFilters(deal: Deal, filters: DealFlowFilters): boolean {
  const search = filters.searchTerm.toLowerCase()
  const matchesSearch =
    deal.company.toLowerCase().includes(search) ||
    deal.id.toLowerCase().includes(search) ||
    deal.inclusionFocus.toLowerCase().includes(search)
  const matchesStage = filters.selectedStage === "all" || deal.stage === filters.selectedStage
  const matchesSector = filters.selectedSector === "all" || deal.sector === filters.selectedSector
  const matchesStatus = filters.selectedStatus === "all" || deal.status === filters.selectedStatus
  const matchesFounderType = filters.selectedFounderType === "all" || deal.founderType.includes(filters.selectedFounderType)

  return matchesSearch && matchesStage && matchesSector && matchesStatus && matchesFounderType
}

export function filterDeals(deals: Deal[], filters: DealFlowFilters): Deal[] {
  return deals.filter((deal) => dealMatchesFilters(deal, filters))
}

export function sortDeals(deals: Deal[], sort: SortState): Deal[] {
  if (sort.field === "api-order" || sort.direction === "none") {
    return deals
  }

  return deals
}
