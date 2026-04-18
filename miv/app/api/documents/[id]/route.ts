import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'
import { handleApiError } from '@/lib/handle-api-error'


const updateDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required').optional(),
  type: z.enum([
    'PITCH_DECK',
    'FINANCIAL_STATEMENTS',
    'BUSINESS_PLAN',
    'LEGAL_DOCUMENTS',
    'MARKET_RESEARCH',
    'TEAM_PROFILE',
    'OTHER',
  ]).optional(),
  url: z.string().url('Valid URL is required').optional(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
})

// GET /api/documents/[id] - Get single document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        venture: {
          select: {
            id: true,
            name: true,
            sector: true,
            stage: true,
            description: true,
            location: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            activities: {
              where: {
                type: 'DOCUMENT_UPLOADED',
                metadata: {
                  path: ['documentId'],
                  equals: id,
                },
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        },
      },
    })

    if (!document) {
      throw new ApiError('Document not found', 404, 'DOCUMENT_NOT_FOUND')
    }

    // Transform document with additional computed fields
    const transformedDocument = {
      ...document,
      sizeFormatted: formatFileSize(document.size || 0),
      uploadedBy: document.venture.createdBy?.name || document.venture.assignedTo?.name || 'System',
      status: getDocumentStatus(document, document.venture),
      tags: generateDocumentTags(document, document.venture),
      description: generateDocumentDescription(document, document.venture),
      downloadCount: await getDocumentDownloadCount(document.id),
      lastAccessed: await getDocumentLastAccessed(document.id),
      relatedDocuments: await getRelatedDocuments(document.ventureId, document.id),
    }

    return NextResponse.json(successResponse(transformedDocument))
  } catch (error) {
    return handleApiError(error, 'GET /api/documents/[id]')
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const validatedData = updateDocumentSchema.parse(body)

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      include: {
        venture: true,
      },
    })

    if (!existingDocument) {
      throw new ApiError('Document not found', 404, 'DOCUMENT_NOT_FOUND')
    }

    // Check for duplicate name if name is being updated
    if (validatedData.name && validatedData.name !== existingDocument.name) {
      const duplicateDoc = await prisma.document.findFirst({
        where: {
          name: validatedData.name,
          ventureId: existingDocument.ventureId,
          id: { not: id },
        },
      })

      if (duplicateDoc) {
        throw new ApiError(
          'A document with this name already exists for this venture',
          409,
          'DUPLICATE_DOCUMENT'
        )
      }
    }

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    )

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        venture: {
          select: {
            id: true,
            name: true,
            sector: true,
            stage: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    // Create activity log for update
    await prisma.activity.create({
      data: {
        type: 'VENTURE_UPDATED',
        title: 'Document Updated',
        description: `Document "${updatedDocument.name}" was updated`,
        userId: existingDocument.venture.createdById,
        ventureId: updatedDocument.ventureId,
        metadata: {
          documentId: updatedDocument.id,
          changes: Object.keys(updateData),
        },
      },
    })

    // Transform document with additional fields
    const transformedDocument = {
      ...updatedDocument,
      sizeFormatted: formatFileSize(updatedDocument.size || 0),
      uploadedBy: updatedDocument.venture.createdBy?.name || updatedDocument.venture.assignedTo?.name || 'System',
      status: getDocumentStatus(updatedDocument, updatedDocument.venture),
      tags: generateDocumentTags(updatedDocument, updatedDocument.venture),
      description: generateDocumentDescription(updatedDocument, updatedDocument.venture),
    }

    return NextResponse.json(
      successResponse(transformedDocument, 'Document updated successfully')
    )
  } catch (error) {
    return handleApiError(error, 'PUT /api/documents/[id]')
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      include: {
        venture: true,
      },
    })

    if (!existingDocument) {
      throw new ApiError('Document not found', 404, 'DOCUMENT_NOT_FOUND')
    }

    await prisma.document.delete({
      where: { id },
    })

    // Create activity log for deletion
    await prisma.activity.create({
      data: {
        type: 'VENTURE_UPDATED',
        title: 'Document Deleted',
        description: `Document "${existingDocument.name}" was deleted`,
        userId: existingDocument.venture.createdById,
        ventureId: existingDocument.ventureId,
        metadata: {
          documentId: existingDocument.id,
          documentName: existingDocument.name,
          documentType: existingDocument.type,
        },
      },
    })

    return NextResponse.json(
      successResponse(
        {
          id: existingDocument.id,
          name: existingDocument.name,
        },
        'Document deleted successfully'
      )
    )
  } catch (error) {
    return handleApiError(error, 'DELETE /api/documents/[id]')
  }
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getDocumentStatus(document: any, venture: any): string {
  const daysSinceUpload = Math.floor(
    (Date.now() - new Date(document.uploadedAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  if (venture.stage === 'FUNDED') return 'approved'
  if (venture.stage === 'DUE_DILIGENCE') return 'review'
  if (venture.stage === 'INVESTMENT_READY') return 'review'
  if (daysSinceUpload > 30) return 'needs_update'
  return 'pending'
}

function generateDocumentTags(document: any, venture: any): string[] {
  const tags = [document.type.toLowerCase().replace('_', '-')]

  if (venture.sector) {
    tags.push(venture.sector.toLowerCase())
  }

  if (venture.stage) {
    tags.push(venture.stage.toLowerCase())
  }

  const extension = document.name.split('.').pop()?.toLowerCase()
  if (extension) {
    tags.push(extension)
  }

  return tags.slice(0, 5)
}

function generateDocumentDescription(document: any, venture: any): string {
  const typeDescriptions = {
    PITCH_DECK: `Investment pitch presentation for ${venture.name}`,
    FINANCIAL_STATEMENTS: `Financial statements and reports for ${venture.name}`,
    BUSINESS_PLAN: `Comprehensive business plan for ${venture.name}`,
    LEGAL_DOCUMENTS: `Legal documentation for ${venture.name}`,
    MARKET_RESEARCH: `Market research and analysis for the ${venture.sector} sector`,
    TEAM_PROFILE: `Team profiles and organizational structure for ${venture.name}`,
    OTHER: `Document for ${venture.name}`,
  }

  return (
    typeDescriptions[document.type as keyof typeof typeDescriptions] ||
    `Document for ${venture.name}`
  )
}

async function getDocumentDownloadCount(documentId: string): Promise<number> {
  const activities = await prisma.activity.count({
    where: {
      metadata: {
        path: ['documentId'],
        equals: documentId,
      },
      title: {
        contains: 'download',
        mode: 'insensitive',
      },
    },
  })

  return activities
}

async function getDocumentLastAccessed(documentId: string): Promise<Date | null> {
  const activity = await prisma.activity.findFirst({
    where: {
      metadata: {
        path: ['documentId'],
        equals: documentId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: true,
    },
  })

  return activity?.createdAt || null
}

async function getRelatedDocuments(ventureId: string, currentDocumentId: string) {
  const documents = await prisma.document.findMany({
    where: {
      ventureId,
      id: {
        not: currentDocumentId,
      },
    },
    take: 5,
    orderBy: {
      uploadedAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      type: true,
      uploadedAt: true,
      size: true,
    },
  })

  return documents.map((doc) => ({
    ...doc,
    sizeFormatted: formatFileSize(doc.size || 0),
  }))
}