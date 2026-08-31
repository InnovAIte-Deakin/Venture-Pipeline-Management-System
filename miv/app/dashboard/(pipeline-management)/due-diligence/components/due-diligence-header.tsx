import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Plus } from "lucide-react"
import type { DueDiligenceViewMode } from "../types/due-diligence.types"

interface DueDiligenceHeaderProps {
  viewMode: DueDiligenceViewMode
  selectedVentureForDetails: string | null
  loading: boolean
  filteredItemsCount: number
  onSetViewMode: (viewMode: DueDiligenceViewMode) => void
  onSetSelectedVentureForDetails: (ventureName: string | null) => void
  onSetSearchTerm: (searchTerm: string) => void
  onBackToVentures: () => void
  onNewDueDiligence: () => void
}

export function DueDiligenceHeader({
  viewMode,
  selectedVentureForDetails,
  loading,
  filteredItemsCount,
  onSetViewMode,
  onSetSelectedVentureForDetails,
  onSetSearchTerm,
  onBackToVentures,
  onNewDueDiligence
}: DueDiligenceHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Due Diligence</h1>
          <p className="text-muted-foreground">
            Manage due diligence processes and track progress
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-row">
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === "ventures" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                if (selectedVentureForDetails) {
                  onBackToVentures()
                } else {
                  onSetViewMode("ventures")
                }
              }}
              className="rounded-r-none flex-1 sm:flex-none"
              disabled={loading}
            >
              By Venture
            </Button>
            <Button
              variant={viewMode === "items" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                if (selectedVentureForDetails) {
                  onSetSelectedVentureForDetails(null)
                  onSetSearchTerm("")
                } else {
                  onSetViewMode("items")
                }
              }}
              className="rounded-l-none flex-1 sm:flex-none"
              disabled={loading}
            >
              {selectedVentureForDetails ? "All Items" : "By Items"}
            </Button>
          </div>
          <Button onClick={onNewDueDiligence} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Due Diligence
          </Button>
        </div>
      </div>

      {selectedVentureForDetails && viewMode === "items" && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="py-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
              <div className="flex flex-wrap items-center gap-2 text-sm min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToVentures}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                >
                  â† Back to Ventures
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium break-words">{selectedVentureForDetails} Due Diligence Details</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filteredItemsCount} items found
                </Badge>
                <Button variant="outline" size="sm" onClick={onBackToVentures}>
                  <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                  Back to Overview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
