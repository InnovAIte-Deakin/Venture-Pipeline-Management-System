import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const updateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'ANALYST', 'USER', 'VENTURE_MANAGER', 'GEDSI_ANALYST', 'CAPITAL_FACILITATOR', 'EXTERNAL_STAKEHOLDER']).optional(),
  organization: z.string().optional(),
  image: z.string().optional(),
});

// GET /api/team/members/[id] - Get single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const member = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        // Include detailed project information
        ledProjects: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            priority: true,
            progress: true,
            dueDate: true,
            startDate: true,
            completedAt: true,
            members: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            _count: {
              select: {
                tasks: true,
              }
            }
          },
          orderBy: { updatedAt: 'desc' }
        },
        projectMemberships: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            priority: true,
            progress: true,
            dueDate: true,
            startDate: true,
            completedAt: true,
            lead: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            _count: {
              select: {
                tasks: true,
              }
            }
          },
          orderBy: { updatedAt: 'desc' }
        },
        assignedTasks: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            completedAt: true,
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          },
          orderBy: { dueDate: 'asc' },
          take: 20
        },
        createdTasks: {
          select: {
            id: true,
            name: true,
            status: true,
            assignedTo: {
              select: {
                id: true,
                name: true,
              }
            },
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        announcements: {
          select: {
            id: true,
            title: true,
            content: true,
            priority: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        organizedEvents: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            location: true,
            attendees: {
              select: {
                id: true,
                name: true,
              }
            }
          },
          orderBy: { date: 'desc' },
          take: 10
        },
        eventAttendances: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
            organizer: {
              select: {
                id: true,
                name: true,
              }
            }
          },
          orderBy: { date: 'desc' },
          take: 10
        },
        _count: {
          select: {
            ledProjects: true,
            projectMemberships: true,
            assignedTasks: true,
            createdTasks: true,
            announcements: true,
            organizedEvents: true,
            eventAttendances: true,
          }
        }
      }
    });

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(member);

  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/team/members/[id] - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = updateMemberSchema.parse(body);

    // Check if user exists
    const existingMember = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // If email is being updated, check for conflicts
    if (validatedData.email && validatedData.email !== existingMember.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedMember = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(updatedMember);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/members/[id] - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if user exists
    const existingMember = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            ledProjects: true,
            assignedTasks: true,
            createdVentures: true,
            assignedVentures: true,
          }
        }
      }
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Check if user has active dependencies
    const hasActiveDependencies = existingMember._count.ledProjects > 0 || 
                                  existingMember._count.assignedTasks > 0 ||
                                  existingMember._count.createdVentures > 0 ||
                                  existingMember._count.assignedVentures > 0;

    if (hasActiveDependencies) {
      return NextResponse.json(
        { 
          error: 'Cannot delete team member with active projects, tasks, or ventures. Please reassign them first.',
          details: {
            ledProjects: existingMember._count.ledProjects,
            assignedTasks: existingMember._count.assignedTasks,
            createdVentures: existingMember._count.createdVentures,
            assignedVentures: existingMember._count.assignedVentures,
          }
        },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Team member deleted successfully' });

  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
