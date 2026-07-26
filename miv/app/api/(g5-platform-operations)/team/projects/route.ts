import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).default('NOT_STARTED'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional(), // ISO date string
  startDate: z.string().optional(), // ISO date string
  budget: z.number().optional(),
  tags: z.array(z.string()).optional(),
  leadId: z.string().min(1, 'Project lead is required'),
  memberIds: z.array(z.string()).optional(),
  ventureId: z.string().optional(),
});

const updateProjectSchema = createProjectSchema.partial();

// GET /api/team/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const leadId = searchParams.get('leadId') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (leadId) {
      where.leadId = leadId;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          lead: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          },
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          },
          tasks: {
            select: {
              id: true,
              name: true,
              status: true,
              priority: true,
              dueDate: true,
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 5 // Latest 5 tasks
          },
          venture: {
            select: {
              id: true,
              name: true,
              sector: true,
            }
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count({ where })
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/team/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    // Verify lead exists
    const lead = await prisma.user.findUnique({
      where: { id: validatedData.leadId }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Project lead not found' },
        { status: 400 }
      );
    }

    // Verify all members exist
    if (validatedData.memberIds && validatedData.memberIds.length > 0) {
      const members = await prisma.user.findMany({
        where: { id: { in: validatedData.memberIds } }
      });

      if (members.length !== validatedData.memberIds.length) {
        return NextResponse.json(
          { error: 'One or more team members not found' },
          { status: 400 }
        );
      }
    }

    // Verify venture exists if provided
    if (validatedData.ventureId) {
      const venture = await prisma.venture.findUnique({
        where: { id: validatedData.ventureId }
      });

      if (!venture) {
        return NextResponse.json(
          { error: 'Venture not found' },
          { status: 400 }
        );
      }
    }

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        budget: validatedData.budget,
        tags: validatedData.tags || [],
        leadId: validatedData.leadId,
        ventureId: validatedData.ventureId,
        members: validatedData.memberIds ? {
          connect: validatedData.memberIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        venture: {
          select: {
            id: true,
            name: true,
            sector: true,
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          }
        }
      }
    });

    return NextResponse.json(project, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
