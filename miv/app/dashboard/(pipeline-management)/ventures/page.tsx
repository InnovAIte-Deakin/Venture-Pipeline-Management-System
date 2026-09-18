"use client"

import Link from "next/link"
import { Download, Plus, RefreshCw } from "lucide-react"

import { VentureFilters } from "./VentureFilters"
import { EmptyVentureResults, EmptyVentures, VenturesError, VenturesLoading } from "./components/venture-feedback"
import { VentureMobileList } from "./components/venture-mobile-list"
import { VentureSummaryCards } from "./components/venture-summary-cards"
import { VentureTable } from "./components/venture-table"
import { useVentures } from "./hooks/use-ventures"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VenturesPage() {
  const {
    error,
    filteredVentures,
    filters,
    loading,
    refresh,
    refreshing,
    retry,
    sectors,
    setFilters,
    summary,
    ventures,
  } = useVentures()

  if (loading) {
    return <VenturesLoading />
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">Ventures</h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">Manage and track all ventures in the pipeline</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
          <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" disabled>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export
          </Button>
          <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={refresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/venture-intake">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Venture
            </Link>
          </Button>
        </div>
      </header>

      {error && <VenturesError message={error} onRetry={retry} />}

      {!error && ventures.length === 0 && <EmptyVentures />}

      {!error && ventures.length > 0 && (
        <>
          <VentureSummaryCards summary={summary} />

          <VentureFilters
            filters={filters}
            sectors={sectors}
            resultCount={filteredVentures.length}
            totalCount={ventures.length}
            onChange={setFilters}
          />

          <Card>
            <CardHeader>
              <CardTitle>All Ventures ({filteredVentures.length})</CardTitle>
              <CardDescription>Open a venture to view detailed pipeline information</CardDescription>
            </CardHeader>
            <CardContent>
              <VentureTable ventures={filteredVentures} />
              <VentureMobileList ventures={filteredVentures} />
              {filteredVentures.length === 0 && <EmptyVentureResults />}
            </CardContent>
          </Card>
        </>
      )}
    </main>
  )
}
