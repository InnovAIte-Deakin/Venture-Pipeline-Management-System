import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { MAX_FILE_SIZE_BYTES } from "../constants/documents.constants"
import { validateUploadSelection, type UploadFileDetails } from "./documents-validation"

const validPdf: UploadFileDetails = {
  name: "venture-pitch.pdf",
  size: 1024,
  type: "application/pdf",
}

describe("document upload validation", () => {
  it("requires a document type", () => {
    assert.deepEqual(validateUploadSelection([validPdf], ""), {
      ok: false,
      message: "Select a document type before choosing a file.",
    })
  })

  it("accepts a supported file at the maximum size", () => {
    const result = validateUploadSelection(
      [{ ...validPdf, size: MAX_FILE_SIZE_BYTES }],
      "Pitch Deck",
    )
    assert.equal(result.ok, true)
  })

  it("rejects empty and oversized files", () => {
    assert.equal(validateUploadSelection([{ ...validPdf, size: 0 }], "Pitch Deck").ok, false)
    assert.equal(
      validateUploadSelection([{ ...validPdf, size: MAX_FILE_SIZE_BYTES + 1 }], "Pitch Deck").ok,
      false,
    )
  })

  it("rejects multiple files and unsupported extensions", () => {
    assert.equal(validateUploadSelection([validPdf, validPdf], "Pitch Deck").ok, false)
    assert.equal(
      validateUploadSelection(
        [{ name: "malware.exe", size: 100, type: "application/octet-stream" }],
        "Other",
      ).ok,
      false,
    )
  })

  it("rejects a mismatched extension and MIME type", () => {
    const result = validateUploadSelection(
      [{ name: "renamed.pdf", size: 100, type: "application/msword" }],
      "Legal Documents",
    )
    assert.deepEqual(result, {
      ok: false,
      message: "The file extension and file type do not match.",
    })
  })
})
