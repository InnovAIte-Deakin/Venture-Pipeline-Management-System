export type DocumentStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_revision"

export interface UserDocument {
  id: string
  filename: string
  documentType: string
  status: DocumentStatus
  version?: number
  filesize?: number
  mimeType?: string
  url?: string
  notes?: string | null
  uploadedBy?: unknown
  venture?: unknown
  reviewedBy?: unknown
  reviewedAt?: string | null
  createdAt: string
  updatedAt?: string
}

export interface DocumentNotice {
  type: "success" | "error"
  message: string
}

export interface DocumentStats {
  total: number
  pending: number
  approved: number
  actionRequired: number
}
