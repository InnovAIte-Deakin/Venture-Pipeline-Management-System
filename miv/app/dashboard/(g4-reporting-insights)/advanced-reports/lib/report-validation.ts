import type { ReportTypeValue } from "../types/advanced-reports.types"

/**
 * The only validation the original generator performs: the Generate button
 * is `disabled={!selectedReportType}`. No other field is required, and
 * there is no `dateRange.from <= dateRange.to` check or recipient
 * email-format validation — preserved as gaps, not silently added here.
 */
export function isReportConfigurationValid(selectedReportType: ReportTypeValue | ""): boolean {
  return Boolean(selectedReportType)
}
