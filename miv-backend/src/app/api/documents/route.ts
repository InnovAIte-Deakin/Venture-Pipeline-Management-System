import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const uploadsDir = path.resolve(dirname, '../../../../uploads/documents')

// Helper function to convert backend document type to display name
function getDisplayDocumentType(backendType: string): string {
  const typeMap: Record<string, string> = {
    'pitch_deck': 'Pitch Deck',
    'financial_statements': 'Financial Statements',
    'legal_documents': 'Legal Documents',
    'gedsi_reports': 'GEDSI Reports',
    'impact_reports': 'Impact Reports',
    'other': 'Other'
  }
  return typeMap[backendType] || backendType
}

// GET /api/documents - Get all documents for the current user
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to access documents.',
        },
        { status: 401 }
      )
    }

    // Verify the token and get the user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired session.',
        },
        { status: 401 }
      )
    }

    // Build query based on user role
    const isAdmin = user.role === 'admin' || user.role === 'miv_analyst'
    
    const documents = await payload.find({
      collection: 'documents',
      where: isAdmin ? undefined : { uploadedBy: { equals: user.id } },
      sort: '-createdAt',
      depth: 1, // Include related user/venture data
    })

    return NextResponse.json({
      success: true,
      documents: documents.docs.map((doc) => ({
        id: doc.id,
        filename: doc.filename,
        documentType: getDisplayDocumentType(doc.documentType as string),
        status: doc.status,
        version: doc.version,
        filesize: doc.filesize,
        mimeType: doc.mimeType,
        url: doc.url,
        notes: doc.notes,
        uploadedBy: doc.uploadedBy,
        venture: doc.venture,
        reviewedBy: doc.reviewedBy,
        reviewedAt: doc.reviewedAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      totalDocs: documents.totalDocs,
      totalPages: documents.totalPages,
      page: documents.page,
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get documents',
        message: 'An error occurred while fetching documents.',
      },
      { status: 500 }
    )
  }
}

// POST /api/documents - Upload a new document
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to upload documents.',
        },
        { status: 401 }
      )
    }

    // Verify the token and get the user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired session.',
        },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentTypeRaw = formData.get('documentType') as string
    const ventureId = formData.get('ventureId') as string | null
    const notes = formData.get('notes') as string | null

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
          message: 'Please select a file to upload.',
        },
        { status: 400 }
      )
    }

    if (!documentTypeRaw) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document type required',
          message: 'Please select a document type.',
        },
        { status: 400 }
      )
    }

    // Convert display name to backend value
    const documentTypeMap: Record<string, string> = {
      'Pitch Deck': 'pitch_deck',
      'Financial Statements': 'financial_statements',
      'Legal Documents': 'legal_documents',
      'GEDSI Reports': 'gedsi_reports',
      'Impact Reports': 'impact_reports',
      'Other': 'other'
    }
    
    const documentType = documentTypeMap[documentTypeRaw] || documentTypeRaw.toLowerCase().replace(/\s+/g, '_')

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large',
          message: 'File size must be less than 10MB.',
        },
        { status: 400 }
      )
    }

    // Validate mime type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type',
          message: 'Supported formats: PDF, Word, Excel, PowerPoint.',
        },
        { status: 400 }
      )
    }

    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `${timestamp}-${sanitizedName}`
    const filePath = path.join(uploadsDir, uniqueFilename)

    // Write file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create document record in Payload
    const document = await payload.create({
      collection: 'documents',
      data: {
        filename: uniqueFilename,
        documentType,
        status: 'pending_review',
        version: 1,
        uploadedBy: user.id,
        venture: ventureId || undefined,
        notes: notes || undefined,
        filesize: file.size,
        mimeType: file.type,
        url: `/uploads/documents/${uniqueFilename}`,
      } as any,
      filePath,
    })

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        filename: document.filename,
        documentType: getDisplayDocumentType(document.documentType as string),
        status: document.status,
        version: document.version,
        filesize: document.filesize,
        url: document.url,
        createdAt: document.createdAt,
      },
    })
  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload document',
        message: 'An error occurred while uploading the document.',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/documents - Delete a document
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to delete documents.',
        },
        { status: 401 }
      )
    }

    // Verify the token and get the user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired session.',
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document ID required',
          message: 'Please provide a document ID.',
        },
        { status: 400 }
      )
    }

    // Check if document exists and user has permission
    const document = await payload.findByID({
      collection: 'documents',
      id: documentId,
    })

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document not found',
          message: 'The requested document does not exist.',
        },
        { status: 404 }
      )
    }

    // Check permission: admin/analyst can delete any, founder can only delete own
    const isAdmin = user.role === 'admin' || user.role === 'miv_analyst'
    const isOwner = (document.uploadedBy as any)?.id === user.id || document.uploadedBy === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to delete this document.',
        },
        { status: 403 }
      )
    }

    // Delete the document
    await payload.delete({
      collection: 'documents',
      id: documentId,
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    })
  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete document',
        message: 'An error occurred while deleting the document.',
      },
      { status: 500 }
    )
  }
}
