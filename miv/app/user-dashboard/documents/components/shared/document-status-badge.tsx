import type { DocumentStatus } from "../../types/documents.types"

const statusStyles: Record<DocumentStatus, { label: string; className: string }> = {
  pending_review: { label: "Pending Review", className: "bg-warning/10 text-warning" },
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-secondary/10 text-secondary" },
  needs_revision: { label: "Needs Revision", className: "bg-secondary/10 text-secondary" },
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const config = statusStyles[status]
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
