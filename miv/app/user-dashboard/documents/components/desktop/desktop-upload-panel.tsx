"use client"

import { useRef, useState } from "react"
import { Loader2, Upload } from "lucide-react"
import {
  DOCUMENT_INPUT_ACCEPT,
  DOCUMENT_TYPE_OPTIONS,
  MAX_FILE_SIZE_LABEL,
} from "../../constants/documents.constants"
import type { UserDocumentsController } from "../../hooks/use-user-documents"

export function DesktopUploadPanel({ controller }: { controller: UserDocumentsController }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const submitFiles = (files: FileList | null) => {
    if (!files) return
    void controller.handleFiles(Array.from(files))
  }

  return (
    <section
      className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm"
      aria-labelledby="desktop-upload-title"
    >
      <h2 id="desktop-upload-title" className="mb-4 text-xl font-semibold text-foreground">
        Upload New Document
      </h2>

      <div className="mb-6">
        <label htmlFor="desktop-document-type" className="mb-2 block text-sm font-medium text-foreground">
          Document Type *
        </label>
        <select
          id="desktop-document-type"
          value={controller.selectedType}
          onChange={(event) => controller.setSelectedType(event.target.value)}
          disabled={controller.uploading}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground outline-none transition focus:border-transparent focus:ring-2 focus:ring-ring disabled:opacity-60"
        >
          <option value="">Select document type...</option>
          {DOCUMENT_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div
        onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }}
        onDragOver={(event) => { event.preventDefault(); setDragActive(true) }}
        onDragLeave={(event) => { event.preventDefault(); setDragActive(false) }}
        onDrop={(event) => {
          event.preventDefault()
          setDragActive(false)
          submitFiles(event.dataTransfer.files)
        }}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        } ${controller.uploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={DOCUMENT_INPUT_ACCEPT}
          disabled={controller.uploading || !controller.selectedType}
          className="sr-only"
          onChange={(event) => {
            submitFiles(event.target.files)
            event.target.value = ""
          }}
        />

        {controller.uploading ? (
          <div role="status" className="flex flex-col items-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" aria-hidden="true" />
            <p className="mb-2 font-medium text-foreground">Uploading...</p>
            <p className="text-sm text-muted-foreground">Keep this page open until the upload finishes.</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <p className="mb-2 font-medium text-foreground">Drag and drop your file here, or</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={!controller.selectedType}
              className="rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Browse Files
            </button>
            <p className="mt-3 text-sm text-muted-foreground">
              Supported: PDF, Word, Excel, PowerPoint (Max {MAX_FILE_SIZE_LABEL})
            </p>
          </>
        )}
      </div>
    </section>
  )
}
