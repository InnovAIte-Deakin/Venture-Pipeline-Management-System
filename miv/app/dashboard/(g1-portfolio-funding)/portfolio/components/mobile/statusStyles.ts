export const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: "#EAF3DE", text: "#3B6D11", label: "Active" },
  INACTIVE: { bg: "#FAEEDA", text: "#854F0B", label: "Inactive" },
  ARCHIVED: { bg: "#ECECE8", text: "#5F5E5A", label: "Archived" },
}

export function getStatusStyle(status: string) {
  return statusStyles[status] || { bg: "#ECECE8", text: "#5F5E5A", label: status }
}
