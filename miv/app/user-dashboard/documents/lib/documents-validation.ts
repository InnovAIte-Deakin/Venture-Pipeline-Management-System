import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_LABEL,
  type DocumentType,
} from "../constants/documents.constants"

export interface UploadFileDetails {
  name: string
  size: number
  type: string
}

export type UploadValidationResult =
  | { ok: true; file: UploadFileDetails }
  | { ok: false; message: string }

function getExtension(filename: string): keyof typeof ACCEPTED_FILE_TYPES | "" {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase()
  return extension in ACCEPTED_FILE_TYPES
    ? (extension as keyof typeof ACCEPTED_FILE_TYPES)
    : ""
}

export function validateUploadSelection(
  files: readonly UploadFileDetails[],
  documentType: DocumentType | "",
): UploadValidationResult {
  if (!documentType) {
    return { ok: false, message: "Select a document type before choosing a file." }
  }

  if (files.length === 0) {
    return { ok: false, message: "Choose a file to upload." }
  }

  if (files.length > 1) {
    return { ok: false, message: "Upload one file at a time." }
  }

  const file = files[0]

  if (file.size === 0) {
    return { ok: false, message: "The selected file is empty." }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, message: `The file must be ${MAX_FILE_SIZE_LABEL} or smaller.` }
  }

  const extension = getExtension(file.name)
  if (!extension) {
    return { ok: false, message: "Use a PDF, Word, Excel or PowerPoint file." }
  }

  if (file.type !== ACCEPTED_FILE_TYPES[extension]) {
    return { ok: false, message: "The file extension and file type do not match." }
  }

  return { ok: true, file }
}
