import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// Validation schema
const uploadDocumentSchema = z.object({
  ventureId: z.string().min(1, 'Venture ID is required'),
  type: z
    .enum([
      'PITCH_DECK',
      'FINANCIAL_STATEMENTS',
      'BUSINESS_PLAN',
      'LEGAL_DOCUMENTS',
      'MARKET_RESEARCH',
      'TEAM_PROFILE',
      'OTHER',
    ])
    .optional(),
});

// Upload validation settings
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
];

const ALLOWED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
];

// POST /api/documents/upload - Upload document files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const ventureId = formData.get('ventureId') as string;
    const documentType = (formData.get('type') as string) || 'OTHER';

    const validatedData = uploadDocumentSchema.parse({
      ventureId,
      type: documentType,
    });

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const venture = await prisma.venture.findUnique({
      where: { id: validatedData.ventureId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!venture) {
      return NextResponse.json(
        { success: false, error: 'Venture not found' },
        { status: 400 }
      );
    }

    // Validate each uploaded file before saving
    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!file || file.size === 0) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" is empty` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" exceeds the 10MB size limit`,
          },
          { status: 400 }
        );
      }

      if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json(
          {
            success: false,
            error: `File type ".${extension || 'unknown'}" is not allowed`,
          },
          { status: 400 }
        );
      }

      if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `MIME type "${file.type}" is not allowed`,
          },
          { status: 400 }
        );
      }
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents');
    await mkdir(uploadDir, { recursive: true });

    const uploadedDocuments = [];

    for (const file of files) {
      try {
        const timestamp = Date.now();

        const sanitizedFileName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, '_')
          .replace(/_+/g, '_');

        const fileName = `${validatedData.ventureId}_${timestamp}_${sanitizedFileName}`;
        const filePath = join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        let docType = validatedData.type || 'OTHER';
        if (docType === 'OTHER') {
          docType = inferDocumentType(file.name, file.type);
        }

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
        });

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
              fileName,
            },
          },
        });

        const transformedDocument = {
          ...document,
          sizeFormatted: formatFileSize(document.size || 0),
          uploadedBy:
            document.venture.createdBy?.name ||
            document.venture.assignedTo?.name ||
            'System',
          status: getDocumentStatus(document, document.venture),
          tags: generateDocumentTags(document, document.venture),
          description: generateDocumentDescription(document, document.venture),
        };

        uploadedDocuments.push(transformedDocument);
      } catch (fileError) {
        console.error(`Error uploading file ${file.name}:`, fileError);

        uploadedDocuments.push({
          name: file.name,
          error: `Failed to upload: ${
            fileError instanceof Error ? fileError.message : 'Unknown error'
          }`,
        });
      }
    }

    const successfulUploads = uploadedDocuments.filter((doc) => !doc.error);
    const failedUploads = uploadedDocuments.filter((doc) => doc.error);

    return NextResponse.json(
      {
        success: failedUploads.length === 0,
        message: `Uploaded ${successfulUploads.length} of ${files.length} files`,
        documents: successfulUploads,
        errors: failedUploads,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error uploading documents:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function inferDocumentType(fileName: string, mimeType: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const type = mimeType.toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  if (extension === 'pdf' || type.includes('pdf')) {
    if (lowerFileName.includes('business') || lowerFileName.includes('plan')) {
      return 'BUSINESS_PLAN';
    }

    if (lowerFileName.includes('pitch') || lowerFileName.includes('deck')) {
      return 'PITCH_DECK';
    }

    if (lowerFileName.includes('legal') || lowerFileName.includes('contract')) {
      return 'LEGAL_DOCUMENTS';
    }

    if (lowerFileName.includes('market') || lowerFileName.includes('research')) {
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
    if (lowerFileName.includes('team') || lowerFileName.includes('profile')) {
      return 'TEAM_PROFILE';
    }

    if (lowerFileName.includes('business') || lowerFileName.includes('plan')) {
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
  const daysSinceUpload = Math.floor(
    (Date.now() - new Date(document.uploadedAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

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
    PITCH_DECK: `Investment pitch presentation for ${venture.name}`,
    FINANCIAL_STATEMENTS: `Financial statements and reports for ${venture.name}`,
    BUSINESS_PLAN: `Comprehensive business plan for ${venture.name}`,
    LEGAL_DOCUMENTS: `Legal documentation for ${venture.name}`,
    MARKET_RESEARCH: `Market research and analysis for the ${venture.sector} sector`,
    TEAM_PROFILE: `Team profiles and organizational structure for ${venture.name}`,
    OTHER: `Document for ${venture.name}`,
  };

  return (
    typeDescriptions[document.type as keyof typeof typeDescriptions] ||
    `Document for ${venture.name}`
  );
}