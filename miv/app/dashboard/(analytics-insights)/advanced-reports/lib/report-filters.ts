import type { Report, ReportListFilterState } from "../types/advanced-reports.types"

/** Direct lift of the original `filteredReports` `.filter` predicate. */
export function filterReports(reports: Report[], filterState: ReportListFilterState): Report[] {
  const { searchQuery, statusFilter } = filterState

  return reports.filter((report) => {
    const matchesSearch =
      !searchQuery ||
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesStatus
  })
}
