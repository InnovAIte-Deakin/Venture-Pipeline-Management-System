import type { ImpactDocument, ImpactDocumentFilters, ImpactDocumentStats } from "./types"

export function calculateImpactDocumentStats(documents: ImpactDocument[]): ImpactDocumentStats {
  return documents.reduce<ImpactDocumentStats>(
    (stats, document) => {
      stats.total += 1
      if (document.status === "pending_review") stats.pending += 1
      if (document.status === "approved") stats.approved += 1
      if (document.status === "rejected") stats.rejected += 1
      return stats
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 },
  )
}

function getPersonSearchText(person: ImpactDocument["uploadedBy"]): string {
  if (!person || typeof person === "string") return ""
  return [person.firstName, person.lastName, person.email].filter(Boolean).join(" ")
}

function getVentureSearchText(venture: ImpactDocument["venture"]): string {
  if (!venture || typeof venture === "string") return ""
  return venture.name || ""
}

export function filterImpactDocuments(
  documents: ImpactDocument[],
  filters: ImpactDocumentFilters,
): ImpactDocument[] {
  const query = filters.searchQuery.trim().toLowerCase()

  return documents.filter((document) => {
    const matchesSearch =
      !query ||
      [
        document.filename,
        document.documentType,
        getPersonSearchText(document.uploadedBy),
        getVentureSearchText(document.venture),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)

    const matchesType = filters.selectedType === "All Types" || document.documentType === filters.selectedType
    const matchesStatus = filters.selectedStatus === "All Status" || document.status === filters.selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })
}
