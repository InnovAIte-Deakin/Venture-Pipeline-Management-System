import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  progress: z.number().min(0).max(100).optional(),
  dueDate: z.string().optional(), // ISO date string
  startDate: z.string().optional(), // ISO date string
  completedAt: z.string().optional(), // ISO date string
  budget: z.number().optional(),
  tags: z.array(z.string()).optional(),
  leadId: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  ventureId: z.string().optional(),
});

// GET /api/team/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          }
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            dependencies: {
              select: {
                id: true,
                name: true,
                status: true,
              }
            },
            dependentOn: {
              select: {
                id: true,
                name: true,
                status: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        venture: {
          select: {
            id: true,
            name: true,
            sector: true,
            stage: true,
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

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/team/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          select: { id: true }
        }
      }
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Verify lead exists if being updated
    if (validatedData.leadId) {
      const lead = await prisma.user.findUnique({
        where: { id: validatedData.leadId }
      });

      if (!lead) {
        return NextResponse.json(
          { error: 'Project lead not found' },
          { status: 400 }
        );
      }
    }

    // Verify all members exist if being updated
    if (validatedData.memberIds) {
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

    // Verify venture exists if being updated
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

    // Prepare update data
    const updateData: any = {
      name: validatedData.name,
      description: validatedData.description,
      status: validatedData.status,
      priority: validatedData.priority,
      progress: validatedData.progress,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      completedAt: validatedData.completedAt ? new Date(validatedData.completedAt) : undefined,
      budget: validatedData.budget,
      tags: validatedData.tags,
      leadId: validatedData.leadId,
      ventureId: validatedData.ventureId,
    };

    // Handle member updates separately if provided
    if (validatedData.memberIds !== undefined) {
      // Disconnect all current members and connect new ones
      updateData.members = {
        set: validatedData.memberIds.map(id => ({ id }))
      };
    }

    // Auto-set completedAt if status is COMPLETED
    if (validatedData.status === 'COMPLETED' && !existingProject.completedAt) {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
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

    return NextResponse.json(updatedProject);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true,
          }
        }
      }
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if project has tasks
    if (existingProject._count.tasks > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete project with existing tasks. Please delete or reassign tasks first.',
          details: {
            tasks: existingProject._count.tasks,
          }
        },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
