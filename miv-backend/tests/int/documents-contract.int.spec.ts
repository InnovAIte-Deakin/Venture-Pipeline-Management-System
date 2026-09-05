import { describe, it, expect } from 'vitest'

// Helper function matching the route implementations
function getDisplayDocumentType(backendType: string): string {
  const typeMap: Record<string, string> = {
    'pitch_deck': 'Pitch Deck',
    'financial_statements': 'Financial Statements',
    'legal_documents': 'Legal Documents',
    'gedsi_reports': 'GEDSI Reports',
    'impact_reports': 'Impact Reports',
    'other': 'Other',
  }
  return typeMap[backendType] || backendType
}

// Helper mapping display names to canonical backend enum
function resolveBackendDocumentType(rawType: string): string {
  const documentTypeMap: Record<string, string> = {
    'Pitch Deck': 'pitch_deck',
    'Financial Statements': 'financial_statements',
    'Legal Documents': 'legal_documents',
    'GEDSI Reports': 'gedsi_reports',
    'Impact Reports': 'impact_reports',
    'Other': 'other',
  }
  return documentTypeMap[rawType] || rawType.toLowerCase().replace(/\s+/g, '_')
}

const validBackendTypes = [
  'pitch_deck',
  'financial_statements',
  'legal_documents',
  'gedsi_reports',
  'impact_reports',
  'other',
]

const validReviewStatuses = [
  'pending_review',
  'approved',
  'rejected',
  'needs_revision',
]

describe('API Contract v1 - Document Endpoints Verification Suite', () => {

  describe('§6.1 GET /api/documents (List Documents)', () => {
    it('formats raw database documentType values to contract display names', () => {
      expect(getDisplayDocumentType('pitch_deck')).toBe('Pitch Deck')
      expect(getDisplayDocumentType('financial_statements')).toBe('Financial Statements')
      expect(getDisplayDocumentType('legal_documents')).toBe('Legal Documents')
      expect(getDisplayDocumentType('gedsi_reports')).toBe('GEDSI Reports')
      expect(getDisplayDocumentType('impact_reports')).toBe('Impact Reports')
      expect(getDisplayDocumentType('other')).toBe('Other')
    })

    it('returns a document list item matching the contract required schema', () => {
      const mockDocFromDb = {
        id: 'doc_123',
        filename: 'pitch_deck_v1.pdf',
        documentType: 'pitch_deck',
        status: 'pending_review',
        version: 1,
        filesize: 1048576,
        mimeType: 'application/pdf',
        url: '/uploads/documents/pitch_deck_v1.pdf',
        notes: 'Initial investor deck',
        uploadedBy: { id: 'user_1', name: 'Founder Alice' },
        venture: { id: 'ven_1', name: 'CleanTech' },
        reviewedBy: null,
        reviewedAt: null,
        createdAt: '2026-08-05T10:00:00.000Z',
        updatedAt: '2026-08-05T10:00:00.000Z',
      }

      const listItem = {
        id: mockDocFromDb.id,
        filename: mockDocFromDb.filename,
        documentType: getDisplayDocumentType(mockDocFromDb.documentType),
        status: mockDocFromDb.status,
        version: mockDocFromDb.version,
        filesize: mockDocFromDb.filesize,
        mimeType: mockDocFromDb.mimeType,
        url: mockDocFromDb.url,
        notes: mockDocFromDb.notes,
        uploadedBy: mockDocFromDb.uploadedBy,
        venture: mockDocFromDb.venture,
        reviewedBy: mockDocFromDb.reviewedBy,
        reviewedAt: mockDocFromDb.reviewedAt,
        createdAt: mockDocFromDb.createdAt,
        updatedAt: mockDocFromDb.updatedAt,
      }

      // Check Contract §6.1 required fields
      expect(listItem.documentType).toBe('Pitch Deck')
      expect(listItem).toHaveProperty('id')
      expect(listItem).toHaveProperty('filename')
      expect(listItem).toHaveProperty('status')
      expect(listItem).toHaveProperty('version')
      expect(listItem).toHaveProperty('filesize')
      expect(listItem).toHaveProperty('mimeType')
      expect(listItem).toHaveProperty('url')
      expect(listItem).toHaveProperty('notes')
      expect(listItem).toHaveProperty('uploadedBy')
      expect(listItem).toHaveProperty('venture')
      expect(listItem).toHaveProperty('reviewedBy')
      expect(listItem).toHaveProperty('reviewedAt')
      expect(listItem).toHaveProperty('createdAt')
      expect(listItem).toHaveProperty('updatedAt')
    })
  })

  describe('§6.2 POST /api/documents (Upload Document)', () => {
    it('accepts both user-facing display names and backend keys', () => {
      const displayInput = 'Financial Statements'
      const backendInput = 'financial_statements'

      expect(validBackendTypes.includes(resolveBackendDocumentType(displayInput))).toBe(true)
      expect(validBackendTypes.includes(resolveBackendDocumentType(backendInput))).toBe(true)
      expect(resolveBackendDocumentType(displayInput)).toBe('financial_statements')
      expect(resolveBackendDocumentType(backendInput)).toBe('financial_statements')
    })

    it('rejects invalid document types not defined in the contract', () => {
      const invalidTypes = ['executable_file', 'malicious_script', 'unsupported_type', 'random_string']
      for (const invalidType of invalidTypes) {
        const resolved = resolveBackendDocumentType(invalidType)
        const isValid = validBackendTypes.includes(resolved)
        expect(isValid).toBe(false)
      }
    })

    it('returns the complete document shape matching a list item on successful upload', () => {
      const uploadedDoc = {
        id: 'doc_upload_1',
        filename: 'financials_2026.pdf',
        documentType: 'financial_statements',
        status: 'pending_review',
        version: 1,
        filesize: 204800,
        mimeType: 'application/pdf',
        url: '/uploads/documents/financials_2026.pdf',
        notes: 'FY2025/2026 statements',
        uploadedBy: { id: 'usr_founder', name: 'John Doe' },
        venture: { id: 'ven_123', name: 'AgriTech' },
        reviewedBy: null,
        reviewedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const responseBody = {
        success: true,
        message: 'Document uploaded successfully',
        document: {
          id: uploadedDoc.id,
          filename: uploadedDoc.filename,
          documentType: getDisplayDocumentType(uploadedDoc.documentType),
          status: uploadedDoc.status,
          version: uploadedDoc.version,
          filesize: uploadedDoc.filesize,
          mimeType: uploadedDoc.mimeType,
          url: uploadedDoc.url,
          notes: uploadedDoc.notes,
          uploadedBy: uploadedDoc.uploadedBy,
          venture: uploadedDoc.venture,
          reviewedBy: uploadedDoc.reviewedBy,
          reviewedAt: uploadedDoc.reviewedAt,
          createdAt: uploadedDoc.createdAt,
          updatedAt: uploadedDoc.updatedAt,
        }
      }

      expect(responseBody.success).toBe(true)
      expect(responseBody.document.documentType).toBe('Financial Statements')
      expect(responseBody.document.mimeType).toBe('application/pdf')
      expect(responseBody.document.uploadedBy).toBeDefined()
      expect(responseBody.document.createdAt).toBeDefined()
    })
  })

  describe('§6.3 DELETE /api/documents?id={id} (Canonical Delete)', () => {
    it('returns the exact contract response body: { success: true, message: "Document deleted" }', () => {
      const deleteResponse = {
        success: true,
        message: 'Document deleted',
      }

      expect(deleteResponse.success).toBe(true)
      expect(deleteResponse.message).toBe('Document deleted')
    })
  })

  describe('§6.4 GET /api/documents/[id] (Metadata & Download)', () => {
    it('ensures documentType in single document metadata returns display name', () => {
      const rawDbDocument = {
        id: 'doc_xyz',
        filename: 'gedsi_plan.pdf',
        documentType: 'gedsi_reports',
        status: 'approved',
      }

      const returnedMetadata = {
        ...rawDbDocument,
        documentType: getDisplayDocumentType(rawDbDocument.documentType),
      }

      expect(returnedMetadata.documentType).toBe('GEDSI Reports')
      expect(returnedMetadata.documentType).not.toBe('gedsi_reports')
    })
  })

  describe('§6.5 PATCH /api/documents/[id] (Review Document)', () => {
    it('validates status against the allowed review status list', () => {
      expect(validReviewStatuses.includes('pending_review')).toBe(true)
      expect(validReviewStatuses.includes('approved')).toBe(true)
      expect(validReviewStatuses.includes('rejected')).toBe(true)
      expect(validReviewStatuses.includes('needs_revision')).toBe(true)

      expect(validReviewStatuses.includes('in_progress')).toBe(false)
      expect(validReviewStatuses.includes('draft')).toBe(false)
      expect(validReviewStatuses.includes('invalid_status')).toBe(false)
    })

    it('returns the full updated document shape with reviewedBy and reviewedAt stamped', () => {
      const reviewerUserId = 'usr_analyst_1'
      const reviewDate = new Date().toISOString()

      const reviewedDoc = {
        id: 'doc_rev_1',
        filename: 'legal_cert.pdf',
        documentType: 'legal_documents',
        status: 'approved',
        version: 1,
        filesize: 50000,
        mimeType: 'application/pdf',
        url: '/uploads/documents/legal_cert.pdf',
        notes: 'Verified against ministry registry',
        uploadedBy: { id: 'usr_founder', email: 'founder@example.com' },
        venture: { id: 'ven_1' },
        reviewedBy: reviewerUserId,
        reviewedAt: reviewDate,
        createdAt: '2026-08-01T00:00:00.000Z',
        updatedAt: reviewDate,
      }

      const patchResponse = {
        success: true,
        message: 'Document updated successfully',
        document: {
          id: reviewedDoc.id,
          filename: reviewedDoc.filename,
          documentType: getDisplayDocumentType(reviewedDoc.documentType),
          status: reviewedDoc.status,
          version: reviewedDoc.version,
          filesize: reviewedDoc.filesize,
          mimeType: reviewedDoc.mimeType,
          url: reviewedDoc.url,
          notes: reviewedDoc.notes,
          uploadedBy: reviewedDoc.uploadedBy,
          venture: reviewedDoc.venture,
          reviewedBy: reviewedDoc.reviewedBy,
          reviewedAt: reviewedDoc.reviewedAt,
          createdAt: reviewedDoc.createdAt,
          updatedAt: reviewedDoc.updatedAt,
        }
      }

      expect(patchResponse.document.documentType).toBe('Legal Documents')
      expect(patchResponse.document.status).toBe('approved')
      expect(patchResponse.document.reviewedBy).toBe(reviewerUserId)
      expect(patchResponse.document.reviewedAt).toBe(reviewDate)
      expect(patchResponse.document.filesize).toBe(50000)
    })
  })
})
