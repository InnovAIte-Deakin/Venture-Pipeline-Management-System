import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const updateDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required').optional(),
  type: z.enum(['PITCH_DECK', 'FINANCIAL_STATEMENTS', 'BUSINESS_PLAN', 'LEGAL_DOCUMENTS', 'MARKET_RESEARCH', 'TEAM_PROFILE', 'OTHER']).optional(),
  url: z.string().url('Valid URL is required').optional(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
});

// GET /api/documents/[id] - Get single document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
              }
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              }
            },
            activities: {
              where: {
                type: 'DOCUMENT_UPLOADED',
                metadata: {
                  path: ['documentId'],
                  equals: id
                }
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
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
    };

    return NextResponse.json(transformedDocument);

  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = updateDocumentSchema.parse(body);

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      include: {
        venture: true
      }
    });

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check for duplicate name if name is being updated
    if (validatedData.name && validatedData.name !== existingDocument.name) {
      const duplicateDoc = await prisma.document.findFirst({
        where: {
          name: validatedData.name,
          ventureId: existingDocument.ventureId,
          id: { not: id }
        }
      });

      if (duplicateDoc) {
        return NextResponse.json(
          { error: 'A document with this name already exists for this venture' },
          { status: 400 }
        );
      }
    }

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

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
              }
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

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
        }
      }
    });

    // Transform document with additional fields
    const transformedDocument = {
      ...updatedDocument,
      sizeFormatted: formatFileSize(updatedDocument.size || 0),
      uploadedBy: updatedDocument.venture.createdBy?.name || updatedDocument.venture.assignedTo?.name || 'System',
      status: getDocumentStatus(updatedDocument, updatedDocument.venture),
      tags: generateDocumentTags(updatedDocument, updatedDocument.venture),
      description: generateDocumentDescription(updatedDocument, updatedDocument.venture),
    };

    return NextResponse.json(transformedDocument);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id },
      include: {
        venture: {
          select: {
            id: true,
            name: true,
            createdById: true,
          }
        }
      }
    });

    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete the document
    await prisma.document.delete({
      where: { id }
    });

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
        }
      }
    });

    return NextResponse.json({ 
      message: 'Document deleted successfully',
      deletedDocument: {
        id: existingDocument.id,
        name: existingDocument.name,
        type: existingDocument.type,
      }
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getDocumentStatus(document: any, venture: any): string {
  const daysSinceUpload = Math.floor((Date.now() - new Date(document.uploadedAt).getTime()) / (1000 * 60 * 60 * 24));
  
  if (venture.stage === 'FUNDED') return 'approved';
  if (venture.stage === 'DUE_DILIGENCE') return 'review';
  if (venture.stage === 'INVESTMENT_READY') return 'review';
  if (daysSinceUpload > 30) return 'needs_update';
  return 'pending';
}

function generateDocumentTags(document: any, venture: any): string[] {
  const tags = [document.type.toLowerCase().replace('_', '-')];
  
  if (venture.sector) {
    tags.push(venture.sector.toLowerCase());
  }
  
  if (venture.stage) {
    tags.push(venture.stage.toLowerCase());
  }
  
  const extension = document.name.split('.').pop()?.toLowerCase();
  if (extension) {
    tags.push(extension);
  }
  
  return tags.slice(0, 5);
}

function generateDocumentDescription(document: any, venture: any): string {
  const typeDescriptions = {
    'PITCH_DECK': `Investment pitch presentation for ${venture.name}`,
    'FINANCIAL_STATEMENTS': `Financial statements and reports for ${venture.name}`,
    'BUSINESS_PLAN': `Comprehensive business plan for ${venture.name}`,
    'LEGAL_DOCUMENTS': `Legal documentation for ${venture.name}`,
    'MARKET_RESEARCH': `Market research and analysis for the ${venture.sector} sector`,
    'TEAM_PROFILE': `Team profiles and organizational structure for ${venture.name}`,
    'OTHER': `Document for ${venture.name}`
  };
  
  return typeDescriptions[document.type as keyof typeof typeDescriptions] || `Document for ${venture.name}`;
}

async function getDocumentDownloadCount(documentId: string): Promise<number> {
  // Count activities related to document downloads
  const count = await prisma.activity.count({
    where: {
      type: 'VENTURE_UPDATED', // Using existing activity type
      title: 'Document Downloaded',
      metadata: {
        path: ['documentId'],
        equals: documentId
      }
    }
  });
  
  return count;
}

async function getDocumentLastAccessed(documentId: string): Promise<Date | null> {
  // Get last access activity
  const lastActivity = await prisma.activity.findFirst({
    where: {
      metadata: {
        path: ['documentId'],
        equals: documentId
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return lastActivity?.createdAt || null;
}

async function getRelatedDocuments(ventureId: string, currentDocId: string) {
  // Get other documents from the same venture
  const relatedDocs = await prisma.document.findMany({
    where: {
      ventureId,
      id: { not: currentDocId }
    },
    select: {
      id: true,
      name: true,
      type: true,
      size: true,
      uploadedAt: true,
    },
    orderBy: { uploadedAt: 'desc' },
    take: 5
  });
  
  return relatedDocs.map(doc => ({
    ...doc,
    sizeFormatted: formatFileSize(doc.size || 0),
  }));
}
