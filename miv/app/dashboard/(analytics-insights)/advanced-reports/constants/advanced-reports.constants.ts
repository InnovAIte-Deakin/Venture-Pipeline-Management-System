import type {
  AvailableWidgetDefinition,
  ChartTypeOption,
  ReportTypeOption,
} from "../types/advanced-reports.types"

// Stable, data-independent values only. Anything that depends on live API
// data (report content, dashboard content, sector lists, ...) stays in
// lib/report-calculations.ts or the hooks that call it.

export const REPORT_TYPES: ReportTypeOption[] = [
  { value: "venture-performance", label: "Venture Performance", iconName: "TrendingUp" },
  { value: "gedsi-impact", label: "GEDSI Impact", iconName: "Users" },
  { value: "financial-analytics", label: "Financial Analytics", iconName: "DollarSign" },
  { value: "workflow-analysis", label: "Workflow Analysis", iconName: "Target" },
  { value: "user-analytics", label: "User Analytics", iconName: "Users" },
  { value: "geographic-distribution", label: "Geographic Distribution", iconName: "Globe" },
  { value: "sector-analysis", label: "Sector Analysis", iconName: "BarChart3" },
  { value: "compliance-report", label: "Compliance Report", iconName: "CheckCircle" },
  { value: "risk-assessment", label: "Risk Assessment", iconName: "AlertTriangle" },
  { value: "custom", label: "Custom Report", iconName: "FileText" },
]

export const CHART_TYPES: ChartTypeOption[] = [
  { value: "bar", label: "Bar Chart", iconName: "BarChart3" },
  { value: "line", label: "Line Chart", iconName: "LineChart" },
  { value: "pie", label: "Pie Chart", iconName: "PieChart" },
  { value: "area", label: "Area Chart", iconName: "AreaChart" },
]

/** Pie-slice palette, cycles past 6 sectors (preserved visual limitation). */
export const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export const AVAILABLE_METRICS = [
  "Total Ventures", "Funding Amount", "Success Rate", "GEDSI Compliance", "Portfolio Diversity",
  "Gender Distribution", "Equity Metrics", "Disability Inclusion", "Social Impact", "Verification Rate",
  "ROI", "Investment Distribution", "Revenue Growth", "Cost Analysis", "Portfolio Valuation",
  "Workflow Completion Rate", "Average Duration", "Resource Utilization", "Active Users", "Login Frequency",
]

export const AVAILABLE_WIDGETS: AvailableWidgetDefinition[] = [
  { id: "metric-card", type: "metric", title: "Metric Card", description: "Display key metrics with trends", iconName: "BarChart3" },
  { id: "bar-chart", type: "chart", title: "Bar Chart", description: "Compare data across categories", iconName: "BarChart3" },
  { id: "line-chart", type: "chart", title: "Line Chart", description: "Show trends over time", iconName: "LineChart" },
  { id: "pie-chart", type: "chart", title: "Pie Chart", description: "Show proportional data", iconName: "PieChart" },
  { id: "area-chart", type: "chart", title: "Area Chart", description: "Display cumulative data", iconName: "AreaChart" },
  { id: "data-table", type: "table", title: "Data Table", description: "Tabular data display", iconName: "FileText" },
  { id: "alert-panel", type: "list", title: "Alert Panel", description: "Show important alerts", iconName: "AlertTriangle" },
]

export const SCHEDULE_FREQUENCIES: { value: "daily" | "weekly" | "monthly" | "quarterly"; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
]

export const REPORT_STATUS_FILTER_OPTIONS: { value: "all" | "published" | "draft" | "archived"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
]

export const DEFAULT_REPORT_CONFIGURATION = {
  reportName: "",
  reportDescription: "",
  selectedReportType: "" as const,
  selectedChartType: "" as const,
  dateRange: null,
  selectedMetrics: [] as string[],
  selectedFilters: {},
  isScheduled: false,
  scheduleFrequency: "weekly" as const,
  reportRecipients: [] as string[],
}
