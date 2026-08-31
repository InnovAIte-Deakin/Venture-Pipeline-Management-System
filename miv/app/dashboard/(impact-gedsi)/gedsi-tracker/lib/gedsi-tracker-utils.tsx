import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import type { GEDSIMetric, GedsiMetricStatus } from "../types/gedsi-tracker.types"

export function mapApiMetric(metric: any): GEDSIMetric {
  return {
    id: metric.id,
    ventureId: metric.ventureId,
    ventureName: metric.venture?.name || metric.ventureName || "Unknown",
    metricCode: metric.metricCode,
    metricName: metric.metricName,
    category:
      metric.category === "GENDER"
        ? "Gender"
        : metric.category === "DISABILITY"
          ? "Disability"
          : metric.category === "SOCIAL_INCLUSION"
            ? "Social Inclusion"
            : "Cross-cutting",
    targetValue: metric.targetValue,
    currentValue: metric.currentValue,
    unit: metric.unit,
    status:
      metric.status === "VERIFIED" || metric.status === "COMPLETED"
        ? "Verified"
        : metric.status === "IN_PROGRESS"
          ? "In Progress"
          : metric.status === "OVERDUE"
            ? "Overdue"
            : "Not Started",
    verificationDate: metric.verificationDate,
    notes: metric.notes,
    lastUpdated: metric.updatedAt || metric.lastUpdated,
  }
}

export function getStatusColor(status: GedsiMetricStatus) {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-800 border-green-200"
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Overdue":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getStatusIcon(status: GedsiMetricStatus) {
  switch (status) {
    case "Verified":
      return <CheckCircle className="h-4 w-4" />
    case "In Progress":
      return <Clock className="h-4 w-4" />
    case "Overdue":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}
