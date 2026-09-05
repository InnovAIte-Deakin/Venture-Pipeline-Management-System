import type { DocumentStatus } from "../../types/documents.types"

const statusStyles: Record<DocumentStatus, { label: string; className: string }> = {
  pending_review: { label: "Pending review", className: "border-amber-200 bg-amber-50 text-amber-800" },
  approved: { label: "Approved", className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  rejected: { label: "Rejected", className: "border-red-200 bg-red-50 text-red-800" },
  needs_revision: { label: "Needs revision", className: "border-orange-200 bg-orange-50 text-orange-800" },
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const config = statusStyles[status]
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}
