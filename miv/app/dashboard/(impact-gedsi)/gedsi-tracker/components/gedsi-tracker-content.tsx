"use client"

import { FiltersBar } from "./filters-bar"
import { GedsiInsightsCard } from "./gedsi-insights-card"
import { GedsiTrackerHeader } from "./gedsi-tracker-header"
import { GedsiTrackerTabs } from "./gedsi-tracker-tabs"
import { OverviewCards } from "./overview-cards"
import type { GedsiTrackerState } from "../types/gedsi-tracker.types"

export function GedsiTrackerContent({ state }: { state: GedsiTrackerState }) {
  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200" />
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <GedsiTrackerHeader
        ventures={state.ventures}
        showAddMetric={state.showAddMetric}
        setShowAddMetric={state.setShowAddMetric}
        isExporting={state.isExporting}
        onExport={state.exportData}
        onAddMetric={(metricData) => void state.handleAddMetric(metricData)}
      />
      <OverviewCards metrics={state.metrics} />
      <GedsiInsightsCard metrics={state.metrics} ventures={state.ventures} />
      <FiltersBar
        ventures={state.ventures}
        selectedVenture={state.selectedVenture}
        setSelectedVenture={state.setSelectedVenture}
        selectedCategory={state.selectedCategory}
        setSelectedCategory={state.setSelectedCategory}
        selectedStatus={state.selectedStatus}
        setSelectedStatus={state.setSelectedStatus}
      />
      <GedsiTrackerTabs state={state} />
    </div>
  )
}
