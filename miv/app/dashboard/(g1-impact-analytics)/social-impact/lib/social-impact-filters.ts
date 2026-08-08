import type { SocialImpactFilters, SocialImpactVenture } from "../types/social-impact"

const normalize = (value: string | null | undefined) => value?.trim().toLocaleLowerCase() ?? ""

export function filterVentures(ventures: SocialImpactVenture[], filters: SocialImpactFilters) {
  const query = normalize(filters.search)
  return ventures.filter((venture) => {
    const matchesSearch = !query || [venture.name, venture.sector, venture.inclusionFocus]
      .some((value) => normalize(value).includes(query))
    const matchesCategory = filters.category === "all" || venture.sector === filters.category
    const matchesStatus = filters.status === "all" || venture.status === filters.status
    return matchesSearch && matchesCategory && matchesStatus
  })
}

export function getFilterOptions(ventures: SocialImpactVenture[], key: "sector" | "status") {
  return [...new Set(ventures.map((venture) => venture[key]?.trim()).filter((value): value is string => Boolean(value)))]
    .sort((a, b) => a.localeCompare(b))
}

export function hasActiveFilters(filters: SocialImpactFilters) {
  return Boolean(filters.search.trim()) || filters.category !== "all" || filters.status !== "all"
}
