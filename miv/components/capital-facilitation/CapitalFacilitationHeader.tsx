"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

interface CapitalFacilitationHeaderProps {
  onAddCapitalRequest?: () => void
  onExportOverview?: () => void
}

export function CapitalFacilitationHeader({ onAddCapitalRequest, onExportOverview }: CapitalFacilitationHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold break-words">Capital Facilitation</h1>
          <Badge variant="secondary">Portfolio Funding Overview</Badge>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage venture capital requirements, investor engagement, funding progress and readiness.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onExportOverview}>
          <Download className="mr-2 h-4 w-4" />
          Export Overview
        </Button>
        <Button size="sm" onClick={onAddCapitalRequest}>
          <Plus className="mr-2 h-4 w-4" />
          Add Capital Request
        </Button>
      </div>
    </header>
  )
}
