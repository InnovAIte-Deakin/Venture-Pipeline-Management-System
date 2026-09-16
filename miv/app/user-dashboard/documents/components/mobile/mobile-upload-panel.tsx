"use client"

import { useRef } from "react"
import { FileUp, Loader2, Upload } from "lucide-react"
import {
  DOCUMENT_INPUT_ACCEPT,
  DOCUMENT_TYPE_OPTIONS,
  MAX_FILE_SIZE_LABEL,
} from "../../constants/documents.constants"
import type { UserDocumentsController } from "../../hooks/use-user-documents"

export function MobileUploadPanel({ controller }: { controller: UserDocumentsController }) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-[#138075]/20 bg-white shadow-sm" aria-labelledby="mobile-upload-title">
      <div className="bg-[#2A9D8F]/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#138075] text-white">
            <FileUp className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 id="mobile-upload-title" className="font-bold text-slate-950">Upload a document</h2>
            <p className="text-xs text-slate-600">One file at a time, up to {MAX_FILE_SIZE_LABEL}.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-xl border border-[#2A9D8F]/25 bg-[#2A9D8F]/5 p-3">
          <label htmlFor="mobile-document-type" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#138075] text-[11px] text-white">1</span>
            Select document type
          </label>
          <select
            id="mobile-document-type"
            value={controller.selectedType}
            onChange={(event) => controller.setSelectedType(event.target.value)}
            disabled={controller.uploading}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-[#138075] focus:ring-2 focus:ring-[#138075]/20 disabled:opacity-60"
          >
            <option value="">Choose a type</option>
            {DOCUMENT_TYPE_OPTIONS.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="rounded-xl border border-[#2A9D8F]/25 bg-[#2A9D8F]/5 p-3">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#138075] text-[11px] text-white">2</span>
            Choose your file
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={DOCUMENT_INPUT_ACCEPT}
            disabled={controller.uploading || !controller.selectedType}
            className="sr-only"
            onChange={(event) => {
              if (event.target.files) void controller.handleFiles(Array.from(event.target.files))
              event.target.value = ""
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={controller.uploading || !controller.selectedType}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#138075] px-4 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            {controller.uploading ? (
              <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4" aria-hidden="true" /> Browse files</>
            )}
          </button>
        </div>

        <p className="text-xs leading-5 text-slate-500">Supported formats: PDF, Word, Excel and PowerPoint.</p>
      </div>
    </section>
  )
}
