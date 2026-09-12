import type { ScheduleFrequency } from "../types/advanced-reports.types"

/** Direct lift of the original inline `getNextRunTime`. Purely a client-side estimate — nothing schedules or ticks this forward; see README "Report Scheduling Workflow". */
export function getNextRunTime(frequency: ScheduleFrequency | string): Date {
  const now = new Date()
  switch (frequency) {
    case "daily":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    case "weekly":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    case "monthly":
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    case "quarterly":
      return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
  }
}
