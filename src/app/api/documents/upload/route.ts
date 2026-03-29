import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// Validation schema
const uploadDocumentSchema = z.object({
  ventureId: z.string().min(1, 'Venture ID is required'),
  type: z.enum(['PITCH_DECK', 'FINANCIAL_STATEMENTS', 'BUSINESS_PLAN', 'LEGAL_DOCUMENTS', 'MARKET_RESEARCH', 'TEAM_PROFILE', 'OTHER']).optional(),
});

// POST /api/documents/upload - Upload document files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const ventureId = formData.get('ventureId') as string;
    const documentType = formData.get('type') as string || 'OTHER';

    // Validate input
    const validatedData = uploadDocumentSchema.parse({
      ventureId,
      type: documentType
    });

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Verify venture exists
    const venture = await prisma.venture.findUnique({
      where: { id: validatedData.ventureId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!venture) {
      return NextResponse.json(
        { error: 'Venture not found' },
        { status: 400 }
      );
    }

    // Check file size limits (10MB per file)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    for (const file of files) {
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds maximum size limit of 10MB` },
          { status: 400 }
        );
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
    }

    const uploadedDocuments = [];

    for (const file of files) {
      try {
        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${sanitizedFileName}`;
        const filePath = join(uploadDir, fileName);

        // Save file to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Determine document type based on file extension if not specified
        let docType = validatedData.type || 'OTHER';
        if (docType === 'OTHER') {
          docType = inferDocumentType(file.name, file.type);
        }

        // Create document record in database
        const document = await prisma.document.create({
          data: {
            name: file.name,
            type: docType as any,
            url: `/uploads/documents/${fileName}`,
            size: file.size,
            mimeType: file.type,
            ventureId: validatedData.ventureId,
          },
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
              fileName: fileName,
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

        uploadedDocuments.push(transformedDocument);

      } catch (fileError) {
        console.error(`Error uploading file ${file.name}:`, fileError);
        // Continue with other files, but log the error
        uploadedDocuments.push({
          name: file.name,
          error: `Failed to upload: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`
        });
      }
    }

    return NextResponse.json({
      message: `Successfully uploaded ${uploadedDocuments.filter(doc => !doc.error).length} of ${files.length} files`,
      documents: uploadedDocuments,
      success: uploadedDocuments.filter(doc => !doc.error),
      errors: uploadedDocuments.filter(doc => doc.error),
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error uploading documents:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper functions
function inferDocumentType(fileName: string, mimeType: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const type = mimeType.toLowerCase();

  // Infer type based on file extension and MIME type
  if (extension === 'pdf' || type.includes('pdf')) {
    if (fileName.toLowerCase().includes('business') || fileName.toLowerCase().includes('plan')) {
      return 'BUSINESS_PLAN';
    }
    if (fileName.toLowerCase().includes('pitch') || fileName.toLowerCase().includes('deck')) {
      return 'PITCH_DECK';
    }
    if (fileName.toLowerCase().includes('legal') || fileName.toLowerCase().includes('contract')) {
      return 'LEGAL_DOCUMENTS';
    }
    if (fileName.toLowerCase().includes('market') || fileName.toLowerCase().includes('research')) {
      return 'MARKET_RESEARCH';
    }
    return 'OTHER';
  }

  if (extension === 'xlsx' || extension === 'xls' || type.includes('spreadsheet')) {
    return 'FINANCIAL_STATEMENTS';
  }

  if (extension === 'pptx' || extension === 'ppt' || type.includes('presentation')) {
    return 'PITCH_DECK';
  }

  if (extension === 'docx' || extension === 'doc' || type.includes('document')) {
    if (fileName.toLowerCase().includes('team') || fileName.toLowerCase().includes('profile')) {
      return 'TEAM_PROFILE';
    }
    if (fileName.toLowerCase().includes('business') || fileName.toLowerCase().includes('plan')) {
      return 'BUSINESS_PLAN';
    }
    return 'OTHER';
  }

  return 'OTHER';
}

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
