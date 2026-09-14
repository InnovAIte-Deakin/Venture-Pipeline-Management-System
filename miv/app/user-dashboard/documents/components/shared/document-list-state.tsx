import { FileText, Loader2 } from "lucide-react"

export function DocumentsLoadingState() {
  return (
    <div role="status" className="py-12 text-center">
      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-muted-foreground">Loading documents...</p>
    </div>
  )
}

export function DocumentsEmptyState() {
  return (
    <div className="py-12 text-center">
      <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" aria-hidden="true" />
      <p className="text-muted-foreground">No documents uploaded yet</p>
    </div>
  )
}
