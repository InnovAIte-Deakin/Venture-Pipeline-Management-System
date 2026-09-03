import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import type { ImpactDocumentStatus } from "@/lib/impact-documents"

const STATUS_BADGE_CONFIG = {
  pending_review: { color: "bg-yellow-100 text-yellow-800", text: "Pending Review", icon: Clock },
  approved: { color: "bg-green-100 text-green-800", text: "Approved", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-800", text: "Rejected", icon: XCircle },
  needs_revision: { color: "bg-orange-100 text-orange-800", text: "Needs Revision", icon: AlertCircle },
  unknown: { color: "bg-gray-100 text-gray-700", text: "Unknown", icon: AlertCircle },
}

interface DocumentStatusBadgeProps {
  status: ImpactDocumentStatus | string
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const config = STATUS_BADGE_CONFIG[status as keyof typeof STATUS_BADGE_CONFIG] || STATUS_BADGE_CONFIG.unknown
  const IconComponent = config.icon

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
      <IconComponent className="mr-1 h-3 w-3" aria-hidden="true" />
      {config.text}
    </span>
  )
}
