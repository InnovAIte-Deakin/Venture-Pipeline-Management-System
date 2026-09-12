"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DashboardFilters } from "@/types/dashboard/types"

interface DashboardFilterDialogProps {
  open: boolean
  filters: DashboardFilters
  onOpenChange: (open: boolean) => void
  onApply: (filters: DashboardFilters) => void
  onReset: () => void
}

export function DashboardFilterDialog({
  open,
  filters,
  onOpenChange,
  onApply,
  onReset,
}: DashboardFilterDialogProps) {
  const [tempSector, setTempSector] = useState<string | undefined>(undefined)
  const [tempStage, setTempStage] = useState<string | undefined>(undefined)
  const [tempCountry, setTempCountry] = useState<string | undefined>(undefined)
  const [saveFiltersDefault, setSaveFiltersDefault] = useState(false)

  useEffect(() => {
    if (open) {
      setTempSector(filters.sector)
      setTempStage(filters.stage)
      setTempCountry(filters.country)
      setSaveFiltersDefault(false)
    }
  }, [filters.country, filters.sector, filters.stage, open])

  const handleApply = () => {
    const next = {
      sector: tempSector || undefined,
      stage: tempStage || undefined,
      country: tempCountry || undefined,
    }

    onApply(next)
    if (saveFiltersDefault) {
      try {
        localStorage.setItem("dashboard.filters", JSON.stringify(next))
      } catch {}
    }
    onOpenChange(false)
  }

  const handleReset = () => {
    onReset()
    try {
      localStorage.removeItem("dashboard.filters")
    } catch {}
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>Filters</span>
            <span className="flex flex-wrap items-center gap-2">
              {filters.sector && (
                <Badge variant="outline" className="text-xs">
                  Sector: {filters.sector}
                </Badge>
              )}
              {filters.stage && (
                <Badge variant="outline" className="text-xs">
                  Stage: {filters.stage.replace("_", " ")}
                </Badge>
              )}
              {filters.country && (
                <Badge variant="outline" className="text-xs">
                  Country: {filters.country}
                </Badge>
              )}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Sector</p>
            <Select value={tempSector ?? "ALL"} onValueChange={(value) => setTempSector(value === "ALL" ? undefined : value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="CleanTech">CleanTech</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="EdTech">EdTech</SelectItem>
                <SelectItem value="CircularEconomy">CircularEconomy</SelectItem>
                <SelectItem value="SupplyChain">SupplyChain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Stage</p>
            <Select value={tempStage ?? "ALL"} onValueChange={(value) => setTempStage(value === "ALL" ? undefined : value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="INTAKE">Intake</SelectItem>
                <SelectItem value="SCREENING">Screening</SelectItem>
                <SelectItem value="DIAGNOSTICS">Diagnostics</SelectItem>
                <SelectItem value="DUE_DILIGENCE">Due Diligence</SelectItem>
                <SelectItem value="INVESTMENT_READY">Investment Ready</SelectItem>
                <SelectItem value="CAPITAL_FACILITATION">Capital Facilitation</SelectItem>
                <SelectItem value="SEED">Seed</SelectItem>
                <SelectItem value="SERIES_A">Series A</SelectItem>
                <SelectItem value="SERIES_B">Series B</SelectItem>
                <SelectItem value="SERIES_C">Series C</SelectItem>
                <SelectItem value="FUNDED">Funded</SelectItem>
                <SelectItem value="EXITED">Exited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Country</p>
            <Select value={tempCountry ?? "ALL"} onValueChange={(value) => setTempCountry(value === "ALL" ? undefined : value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="Cambodia">Cambodia</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Philippines">Philippines</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={saveFiltersDefault}
              onChange={(event) => setSaveFiltersDefault(event.target.checked)}
            />{" "}
            Save as default filters
          </label>
        </div>
        <DialogFooter>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
            <Button className="w-full sm:w-auto" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2 sm:gap-0">
              <Button className="w-full sm:w-auto" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleApply}>Apply</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
