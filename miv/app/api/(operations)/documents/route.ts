import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['PITCH_DECK', 'FINANCIAL_STATEMENTS', 'BUSINESS_PLAN', 'LEGAL_DOCUMENTS', 'MARKET_RESEARCH', 'TEAM_PROFILE', 'OTHER']),
  url: z.string().url('Valid URL is required'),
  size: z.number().optional(),
  mimeType: z.string().optional(),
  ventureId: z.string().min(1, 'Venture ID is required'),
});

const updateDocumentSchema = createDocumentSchema.partial();

// GET /api/documents - Get all documents with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const ventureId = searchParams.get('ventureId') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'uploadedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { venture: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (type && type !== 'all') {
      where.type = type;
    }
    
    if (ventureId && ventureId !== 'all') {
      where.ventureId = ventureId;
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'venture') {
      orderBy.venture = { name: sortOrder };
    } else if (sortBy === 'type') {
      orderBy.type = sortOrder;
    } else if (sortBy === 'size') {
      orderBy.size = sortOrder;
    } else {
      orderBy.uploadedAt = sortOrder;
    }

    const [documents, total] =  await Promise.all([
      prisma.document.findMany({
        where,
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
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.document.count({ where })
    ]);

    // Transform documents to include additional computed fields
    const transformedDocuments = documents.map(doc => ({
      ...doc,
      sizeFormatted: formatFileSize(doc.size || 0),
      uploadedBy: doc.venture.createdBy?.name || doc.venture.assignedTo?.name || 'System',
      status: getDocumentStatus(doc, doc.venture),
      tags: generateDocumentTags(doc, doc.venture),
      description: generateDocumentDescription(doc, doc.venture),
    }));

    return NextResponse.json({
      documents: transformedDocuments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalDocuments: total,
        byType: await getDocumentsByType(where),
        byStatus: await getDocumentsByStatus(where),
        recentUploads: await getRecentUploadsCount(where),
      }
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createDocumentSchema.parse(body);

    // Verify venture exists
    const venture = await prisma.venture.findUnique({
      where: { id: validatedData.ventureId }
    });

    if (!venture) {
      return NextResponse.json(
        { error: 'Venture not found' },
        { status: 400 }
      );
    }

    // Check for duplicate document names within the same venture
    const existingDoc = await prisma.document.findFirst({
      where: {
        name: validatedData.name,
        ventureId: validatedData.ventureId
      }
    });

    if (existingDoc) {
      return NextResponse.json(
        { error: 'A document with this name already exists for this venture' },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: validatedData,
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

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'DOCUMENT_UPLOADED',
        title: 'Document Uploaded',
        description: `Document "${document.name}" uploaded for ${document.venture.name}`,
        userId: venture.createdById,
        ventureId: document.ventureId,
        metadata: {
          documentId: document.id,
          documentType: document.type,
          documentSize: document.size,
        }
      }
    });

    // Transform document with additional fields
    const transformedDocument = {
      ...document,
      sizeFormatted: formatFileSize(document.size || 0),
      uploadedBy: document.venture.createdBy?.name || document.venture.assignedTo?.name || 'System',
      status: getDocumentStatus(document, document.venture),
      tags: generateDocumentTags(document, document.venture),
      description: generateDocumentDescription(document, document.venture),
    };

    return NextResponse.json(transformedDocument, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating document:', error);
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
  // Determine status based on venture stage and document age
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
  
  // Add file type tag based on name
  const extension = document.name.split('.').pop()?.toLowerCase();
  if (extension) {
    tags.push(extension);
  }
  
  return tags.slice(0, 5); // Limit to 5 tags
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

async function getDocumentsByType(where: any) {
  const types = await prisma.document.groupBy({
    by: ['type'],
    where,
    _count: { _all: true }
  });
  
  return types.reduce((acc, item) => {
    acc[item.type] = item._count._all;
    return acc;
  }, {} as Record<string, number>);
}

async function getDocumentsByStatus(where: any) {
  // Since status is computed, we'll estimate based on venture stages
  const ventures = await prisma.venture.groupBy({
    by: ['stage'],
    _count: { _all: true }
  });
  
  const statusCounts = {
    pending: 0,
    review: 0,
    approved: 0,
    needs_update: 0
  };
  
  ventures.forEach(v => {
    if (v.stage === 'FUNDED') statusCounts.approved += v._count._all;
    else if (v.stage === 'DUE_DILIGENCE' || v.stage === 'INVESTMENT_READY') statusCounts.review += v._count._all;
    else statusCounts.pending += v._count._all;
  });
  
  return statusCounts;
}

async function getRecentUploadsCount(where: any) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return await prisma.document.count({
    where: {
      ...where,
      uploadedAt: {
        gte: sevenDaysAgo
      }
    }
  });
}
