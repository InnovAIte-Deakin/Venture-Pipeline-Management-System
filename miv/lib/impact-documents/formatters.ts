import type { ImpactDocument } from "./types"

export function formatImpactDocumentFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}

export function formatImpactDocumentDate(date?: string): string {
  if (!date) return "Unknown"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return "Unknown"
  return parsed.toLocaleDateString()
}

export function formatImpactDocumentUploader(person: ImpactDocument["uploadedBy"]) {
  if (!person || typeof person === "string") {
    return { name: "Unknown uploader", email: "No email available" }
  }

  const name = [person.firstName, person.lastName].filter(Boolean).join(" ").trim()
  return {
    name: name || person.email || "Unknown uploader",
    email: person.email || "No email available",
  }
}

export function formatImpactDocumentVenture(venture: ImpactDocument["venture"]): string {
  if (!venture || typeof venture === "string") return "No venture"
  return venture.name || "No venture"
}
