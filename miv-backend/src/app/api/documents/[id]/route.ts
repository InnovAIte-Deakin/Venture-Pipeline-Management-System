import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const uploadsDir = path.resolve(dirname, '../../../../../uploads/documents')

// GET /api/documents/[id] - Get a specific document or download it
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Get the document
    const document = await payload.findByID({
      collection: 'documents',
      id,
      depth: 1,
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

    // Check permission
    const isAdmin = user.role === 'admin' || user.role === 'miv_analyst'
    const uploadedById = typeof document.uploadedBy === 'object' 
      ? (document.uploadedBy as any)?.id 
      : document.uploadedBy
    const isOwner = uploadedById === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to access this document.',
        },
        { status: 403 }
      )
    }

    // Check if download is requested
    const { searchParams } = new URL(request.url)
    const download = searchParams.get('download') === 'true'

    if (download) {
      // Serve the file for download
      const filePath = path.join(uploadsDir, document.filename as string)
      
      try {
        const fileBuffer = await readFile(filePath)
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': (document.mimeType as string) || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${document.filename}"`,
            'Content-Length': String(fileBuffer.length),
          },
        })
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: 'File not found',
            message: 'The document file could not be found on the server.',
          },
          { status: 404 }
        )
      }
    }

    // Return document metadata
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        filename: document.filename,
        documentType: document.documentType,
        status: document.status,
        version: document.version,
        filesize: document.filesize,
        mimeType: document.mimeType,
        url: document.url,
        notes: document.notes,
        uploadedBy: document.uploadedBy,
        venture: document.venture,
        reviewedBy: document.reviewedBy,
        reviewedAt: document.reviewedAt,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    })
  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get document',
        message: 'An error occurred while fetching the document.',
      },
      { status: 500 }
    )
  }
}

// PATCH /api/documents/[id] - Update document status (for reviewers)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to update documents.',
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

    // Only admin and miv_analyst can update document status
    if (user.role !== 'admin' && user.role !== 'miv_analyst') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to update document status.',
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, notes } = body

    const validStatuses = ['pending_review', 'approved', 'rejected', 'needs_revision']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status',
          message: 'Status must be one of: pending_review, approved, rejected, needs_revision.',
        },
        { status: 400 }
      )
    }

    // Update the document
    const updateData: Record<string, unknown> = {}
    if (status) {
      updateData.status = status
      updateData.reviewedBy = user.id
      updateData.reviewedAt = new Date().toISOString()
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const document = await payload.update({
      collection: 'documents',
      id,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      document: {
        id: document.id,
        filename: document.filename,
        documentType: document.documentType,
        status: document.status,
        notes: document.notes,
        reviewedBy: document.reviewedBy,
        reviewedAt: document.reviewedAt,
        updatedAt: document.updatedAt,
      },
    })
  } catch (error) {
    console.error('Update document error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update document',
        message: 'An error occurred while updating the document.',
      },
      { status: 500 }
    )
  }
}
