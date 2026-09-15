import type { DocumentStats, UserDocument } from "../types/documents.types"

export function getDisplayFilename(filename: string): string {
  return filename.replace(/^\d{10,}-/, "")
}

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return "Size unavailable"
  if (bytes === 0) return "0 Bytes"

  const units = ["Bytes", "KB", "MB", "GB"]
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** unitIndex
  const precision = unitIndex === 0 ? 0 : 1

  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

export function formatDocumentDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Date unavailable"

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function calculateDocumentStats(documents: UserDocument[]): DocumentStats {
  return documents.reduce<DocumentStats>(
    (stats, document) => {
      stats.total += 1
      if (document.status === "pending_review") stats.pending += 1
      if (document.status === "approved") stats.approved += 1
      if (document.status === "rejected" || document.status === "needs_revision") {
        stats.actionRequired += 1
      }
      return stats
    },
    { total: 0, pending: 0, approved: 0, actionRequired: 0 },
  )
}
