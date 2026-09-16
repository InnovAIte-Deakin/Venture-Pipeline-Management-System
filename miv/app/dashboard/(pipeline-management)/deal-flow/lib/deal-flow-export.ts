import { EXPORT_COLUMNS } from "../constants/deal-flow.constants"
import type { Deal } from "../types/deal-flow.types"

function escapeCsvValue(value: string | number): string {
  const raw = String(value)
  return `"${raw.replace(/"/g, '""')}"`
}

export function buildDealFlowCsv(deals: Deal[]): string {
  return [
    EXPORT_COLUMNS.join(","),
    ...deals.map((deal) =>
      [
        deal.company,
        deal.stage,
        deal.sector,
        deal.dealSize,
        deal.gedsiScore,
        deal.impactScore,
        deal.location,
        deal.inclusionFocus,
      ]
        .map(escapeCsvValue)
        .join(","),
    ),
  ].join("\n")
}

export function getDealFlowExportFilename(date = new Date()): string {
  return `miv-pipeline-export-${date.toISOString().split("T")[0]}.csv`
}

export function downloadDealFlowCsv(deals: Deal[]): void {
  const blob = new Blob([buildDealFlowCsv(deals)], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = getDealFlowExportFilename()
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(url)
}
