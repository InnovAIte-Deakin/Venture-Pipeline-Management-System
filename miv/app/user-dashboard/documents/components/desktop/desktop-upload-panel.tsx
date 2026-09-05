"use client"

import { useRef, useState } from "react"
import { FileUp, Loader2, ShieldCheck, Upload } from "lucide-react"
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
    <section className="overflow-hidden rounded-2xl border border-[#138075]/20 bg-white shadow-sm" aria-labelledby="desktop-upload-title">
      <div className="border-t-4 border-[#138075] bg-[#2A9D8F]/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#138075] text-white">
            <FileUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="desktop-upload-title" className="text-lg font-bold text-slate-950">Upload a document</h2>
            <p className="text-sm text-slate-600">Files are securely sent for review.</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <label htmlFor="desktop-document-type" className="mb-2 block text-sm font-semibold text-slate-800">
            Document type <span className="text-[#F4A261]">*</span>
          </label>
          <select
            id="desktop-document-type"
            value={controller.selectedType}
            onChange={(event) => controller.setSelectedType(event.target.value)}
            disabled={controller.uploading}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-[#138075] focus:ring-2 focus:ring-[#138075]/20 disabled:opacity-60"
          >
            <option value="">Select document type</option>
            {DOCUMENT_TYPE_OPTIONS.map((type) => <option key={type} value={type}>{type}</option>)}
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
          className={`rounded-2xl border-2 border-dashed p-7 text-center transition ${
            dragActive ? "border-[#138075] bg-[#2A9D8F]/10" : "border-slate-300 bg-slate-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={DOCUMENT_INPUT_ACCEPT}
            disabled={controller.uploading}
            className="sr-only"
            onChange={(event) => {
              submitFiles(event.target.files)
              event.target.value = ""
            }}
          />

          {controller.uploading ? (
            <div role="status" className="flex min-h-28 flex-col items-center justify-center">
              <Loader2 className="h-9 w-9 animate-spin text-[#138075]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-800">Uploading document...</p>
              <p className="mt-1 text-sm text-slate-500">Keep this page open until it finishes.</p>
            </div>
          ) : (
            <div className="flex min-h-28 flex-col items-center justify-center">
              <Upload className="h-9 w-9 text-[#138075]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-800">Drop a file here</p>
              <p className="mt-1 text-sm text-slate-500">or choose one from your computer</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-4 rounded-xl bg-[#138075] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f6b63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#138075] focus-visible:ring-offset-2"
              >
                Browse files
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#138075]" aria-hidden="true" />
          <p>PDF, Word, Excel or PowerPoint only. One file per upload, up to {MAX_FILE_SIZE_LABEL}.</p>
        </div>
      </div>
    </section>
  )
}
