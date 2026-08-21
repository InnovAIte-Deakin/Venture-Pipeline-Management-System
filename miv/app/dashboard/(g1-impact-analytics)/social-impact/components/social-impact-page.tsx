"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GedsiMetricsSection } from "./gedsi-metrics-section"
import { ImpactAnalyticsSection } from "./impact-analytics-section"
import { ImpactOverviewSection } from "./impact-overview-section"
import { ImpactStatCards } from "./impact-stat-cards"
import { SocialImpactFilters } from "./social-impact-filters"
import { SocialImpactHeader } from "./social-impact-header"
import { SocialImpactEmpty, SocialImpactError, SocialImpactLoading } from "./social-impact-states"
import { VentureImpactSection } from "./venture-impact-section"
import { useSocialImpactData } from "../hooks/use-social-impact-data"
import { aggregateSocialImpact, getGedsiMetrics } from "../lib/social-impact-calculations"
import { filterVentures, getFilterOptions, hasActiveFilters } from "../lib/social-impact-filters"
import type { SocialImpactFilters as Filters } from "../types/social-impact"

const initialFilters: Filters = { search: "", category: "all", status: "all" }

export function SocialImpactPage() {
  const { ventures, loading, refreshing, error, refresh, retry } = useSocialImpactData()
  const [filters, setFilters] = useState(initialFilters)
  const totals = useMemo(() => aggregateSocialImpact(ventures), [ventures])
  const metrics = useMemo(() => getGedsiMetrics(ventures), [ventures])
  const filteredVentures = useMemo(() => filterVentures(ventures, filters), [ventures, filters])
  const filteredMetrics = useMemo(() => getGedsiMetrics(filteredVentures), [filteredVentures])
  const categories = useMemo(() => getFilterOptions(ventures, "sector"), [ventures])
  const statuses = useMemo(() => getFilterOptions(ventures, "status"), [ventures])
  const clearFilters = () => setFilters(initialFilters)

  return <main className="min-w-0 space-y-6 overflow-x-clip"><SocialImpactHeader refreshing={refreshing} onRefresh={refresh} />{loading ? <SocialImpactLoading /> : error ? <SocialImpactError message={error} onRetry={retry} /> : ventures.length === 0 ? <SocialImpactEmpty /> : <><ImpactStatCards totals={totals} /><Tabs defaultValue="impact-overview" className="min-w-0 space-y-4"><div className="-mx-1 overflow-x-auto px-1 pb-1" aria-label="Social impact views"><TabsList className="grid h-10 min-w-155 grid-cols-4 sm:min-w-0 sm:w-full"><TabsTrigger value="impact-overview">Impact Overview</TabsTrigger><TabsTrigger value="gedsi-metrics">GEDSI Metrics</TabsTrigger><TabsTrigger value="venture-impact">Venture Impact</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList></div><TabsContent value="impact-overview"><ImpactOverviewSection ventures={ventures} metrics={metrics} totals={totals} /></TabsContent><TabsContent value="gedsi-metrics"><GedsiMetricsSection metrics={metrics} ventures={ventures} /></TabsContent><TabsContent value="venture-impact" className="space-y-4"><Card className="gap-4 py-5"><CardHeader className="px-5"><CardTitle>Filter Ventures</CardTitle></CardHeader><CardContent className="px-5"><SocialImpactFilters filters={filters} categories={categories} statuses={statuses} onChange={setFilters} onClear={clearFilters} /></CardContent></Card>{filteredVentures.length ? <VentureImpactSection ventures={filteredVentures} /> : <SocialImpactEmpty filtered={hasActiveFilters(filters)} onClear={clearFilters} />}</TabsContent><TabsContent value="analytics"><ImpactAnalyticsSection ventures={filteredVentures} metrics={filteredMetrics} totals={aggregateSocialImpact(filteredVentures)} /></TabsContent></Tabs></>}</main>
}
