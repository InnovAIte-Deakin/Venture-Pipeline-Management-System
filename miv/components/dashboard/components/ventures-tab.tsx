"use client"

import { useRouter } from "next/navigation"
import { AdvancedDataTable } from "@/components/dashboard/advanced-data-table"
import { AdvancedFilters } from "@/components/dashboard/advanced-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  noopAdvancedFilterChange,
  ventureFilterFields,
  ventureTableColumns,
} from "@/lib/dashboard/dashboard-mappers"
import type { DashboardVentureRow } from "@/types/dashboard/types"
import { Building2, Edit, Eye, Plus } from "lucide-react"
import { DashboardLoadingState } from "./dashboard-loading-state"

interface VenturesTabProps {
  loading: boolean
  venturesData: DashboardVentureRow[]
  addToast: (toast: { type: "success" | "error" | "info" | "warning"; title: string; description?: string }) => void
}

export function VenturesTab({ loading, venturesData, addToast }: VenturesTabProps) {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Venture Management</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 sm:gap-0">
          <AdvancedFilters fields={ventureFilterFields} onFiltersChange={noopAdvancedFilterChange} />
          <Button className="w-full sm:w-auto" onClick={() => (window.location.href = "/dashboard/venture-intake")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Venture
          </Button>
        </div>
      </div>
      {loading ? (
        <DashboardLoadingState message="Loading ventures..." />
      ) : venturesData.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ventures Found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first venture to the pipeline</p>
          <Button onClick={() => router.push("/dashboard/venture-intake")}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Venture
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Active Ventures</h2>
              <p className="text-sm text-slate-600">{venturesData.length} items</p>
            </div>
            {venturesData.map((venture) => (
              <div key={venture.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">{venture.name}</p>
                        <p className="truncate text-xs text-gray-500">{venture.sector}</p>
                      </div>
                    </div>
                  </div>
                  <Badge className="shrink-0 bg-gray-100 text-gray-800">{venture.status}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Stage</p>
                    <p className="font-medium text-gray-900">{venture.stage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="font-medium text-gray-900">{venture.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">GEDSI Score</p>
                    <p className="font-medium text-gray-900">{venture.gedsiScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Capital Needed</p>
                    <p className="font-medium text-gray-900">{venture.capitalNeeded}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/ventures/${venture.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/ventures/${venture.id}?edit=true`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <AdvancedDataTable
              data={venturesData}
              columns={ventureTableColumns}
              title="Active Ventures"
              searchable={true}
              filterable={true}
              exportable={true}
              selectable={true}
              actions={true}
              pagination={true}
              onRowClick={(row) => {
                router.push(`/dashboard/ventures/${row.id}`)
              }}
              onEdit={(row) => {
                router.push(`/dashboard/ventures/${row.id}?edit=true`)
              }}
              onDelete={(row) => {
                addToast({
                  type: "info",
                  title: "Delete Venture",
                  description: `Delete functionality for ${row.name} would be implemented here`,
                })
              }}
              onBulkAction={(action, rows) => {
                addToast({
                  type: "info",
                  title: "Bulk Action",
                  description: `${action} action on ${rows.length} ventures would be implemented here`,
                })
              }}
            />
          </div>
        </>
      )}
    </>
  )
}
