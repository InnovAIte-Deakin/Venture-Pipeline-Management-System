export const DOCUMENT_TYPE_OPTIONS = [
  "Pitch Deck",
  "Financial Statements",
  "Legal Documents",
  "GEDSI Reports",
  "Impact Reports",
  "Other",
] as const

export type DocumentType = (typeof DOCUMENT_TYPE_OPTIONS)[number]

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
export const MAX_FILE_SIZE_LABEL = "10 MB"

export const ACCEPTED_FILE_TYPES = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
} as const

export const DOCUMENT_INPUT_ACCEPT = Object.keys(ACCEPTED_FILE_TYPES).join(",")
