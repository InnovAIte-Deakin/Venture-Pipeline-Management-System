export const DOCUMENT_TYPES = [
  "All Types",
  "Pitch Deck",
  "Financial Statements",
  "Legal Documents",
  "GEDSI Reports",
  "Impact Reports",
  "Other",
] as const

export const STATUS_OPTIONS = [
  "All Status",
  "pending_review",
  "approved",
  "rejected",
  "needs_revision",
] as const

export type ImpactDocumentStatus = Exclude<(typeof STATUS_OPTIONS)[number], "All Status">
export type ImpactDocumentTypeFilter = (typeof DOCUMENT_TYPES)[number]
export type ImpactDocumentStatusFilter = (typeof STATUS_OPTIONS)[number]
export type ImpactDocumentRowAction = "status" | "delete" | "download"

export interface ImpactDocumentPerson {
  id?: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  role?: string | null
}

export interface ImpactDocumentVenture {
  id?: string
  name?: string | null
}

export interface ImpactDocument {
  id: string
  filename: string
  documentType: string
  status: ImpactDocumentStatus
  version?: number
  filesize?: number
  mimeType?: string
  url?: string
  notes?: string | null
  uploadedBy?: ImpactDocumentPerson | string | null
  venture?: ImpactDocumentVenture | string | null
  reviewedBy?: ImpactDocumentPerson | string | null
  reviewedAt?: string | null
  createdAt: string
  updatedAt?: string
}

export interface ImpactDocumentStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export interface ImpactDocumentFilters {
  searchQuery: string
  selectedType: ImpactDocumentTypeFilter
  selectedStatus: ImpactDocumentStatusFilter
}

export interface DocumentListPayload {
  documents: ImpactDocument[]
}

export interface MutationPayload {
  message?: string
  document?: Partial<ImpactDocument>
}
