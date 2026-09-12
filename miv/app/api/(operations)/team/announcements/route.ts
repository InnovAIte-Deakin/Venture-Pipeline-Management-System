import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(), // ISO date string
  authorId: z.string().min(1, 'Author is required'),
});

const updateAnnouncementSchema = createAnnouncementSchema.partial();

// GET /api/team/announcements - Get all announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const priority = searchParams.get('priority') || '';
    const isActive = searchParams.get('isActive');
    const authorId = searchParams.get('authorId') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (authorId) {
      where.authorId = authorId;
    }

    // Filter out expired announcements unless explicitly requested
    if (isActive !== 'false') {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ];
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.announcement.count({ where })
    ]);

    return NextResponse.json({
      announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/team/announcements - Create new announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAnnouncementSchema.parse(body);

    // Verify author exists
    const author = await prisma.user.findUnique({
      where: { id: validatedData.authorId }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        priority: validatedData.priority,
        isActive: validatedData.isActive,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        authorId: validatedData.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(announcement, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
