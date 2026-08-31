export interface Report {
  id: string
  name: string
  type: string
  description: string
  lastGenerated: string
  status: "draft" | "published" | "archived"
  metrics: string[]
  filters: Record<string, unknown>
  schedule?: string
  isScheduled?: boolean
  scheduleFrequency?: "daily" | "weekly" | "monthly" | "quarterly"
  nextRun?: string
  recipients?: string[]
  autoGenerate?: boolean
}

export type ReportExportFormat = "pdf" | "excel" | "csv"
