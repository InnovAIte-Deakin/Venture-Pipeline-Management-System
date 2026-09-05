"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Plus, Sparkles } from "lucide-react"
import { AddMetricForm } from "./dialogs/add-metric-form"
import type { GEDSIMetric, Venture } from "../types/gedsi-tracker.types"

interface GedsiTrackerHeaderProps {
  ventures: Venture[]
  showAddMetric: boolean
  setShowAddMetric: (value: boolean) => void
  isExporting: boolean
  onExport: () => void
  onAddMetric: (metricData: Partial<GEDSIMetric>) => void
}

export function GedsiTrackerHeader({
  ventures,
  showAddMetric,
  setShowAddMetric,
  isExporting,
  onExport,
  onAddMetric,
}: GedsiTrackerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-black">
          GEDSI Intelligence Hub
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          AI-powered GEDSI tracking with UN standards, Washington Group Short Set, and IRIS+ integration
        </p>
      </div>
      <div className="grid w-full grid-cols-3 gap-2 md:w-auto md:flex md:items-center md:space-x-2 md:gap-0">
        <Button variant="outline" size="sm" className="px-2 text-xs md:px-3 md:text-sm" onClick={onExport} disabled={isExporting}>
          <Download className="mr-1 h-4 w-4 md:mr-2" />
          <span className="hidden sm:inline">{isExporting ? "Exporting..." : "UN Standards Report"}</span>
          <span className="sm:hidden">{isExporting ? "Exporting" : "Export"}</span>
        </Button>
        <Button variant="outline" size="sm" className="px-2 text-xs md:px-3 md:text-sm">
          <Sparkles className="mr-1 h-4 w-4 md:mr-2" />
          AI Insights
        </Button>
        <Dialog open={showAddMetric} onOpenChange={setShowAddMetric}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-black px-2 text-xs text-white hover:bg-neutral-800 md:px-3 md:text-sm">
              <Plus className="mr-1 h-4 w-4 md:mr-2" />
              Add Metric
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add GEDSI Metric</DialogTitle>
              <DialogDescription>Add a new GEDSI metric for tracking venture impact</DialogDescription>
            </DialogHeader>
            <AddMetricForm onSubmit={onAddMetric} ventures={ventures} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
