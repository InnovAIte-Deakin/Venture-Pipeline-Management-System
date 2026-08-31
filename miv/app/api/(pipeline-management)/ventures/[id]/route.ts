import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updates
const updateVentureSchema = z.object({
  name: z.string().min(1).optional(),
  sector: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  pitchSummary: z.string().optional(),
  inclusionFocus: z.string().optional(),
  founderTypes: z.array(z.string()).optional(),
  teamSize: z.string().optional(),
  foundingYear: z.string().optional(),
  targetMarket: z.string().optional(),
  revenueModel: z.string().optional(),
  operationalReadiness: z.record(z.any()).optional(),
  capitalReadiness: z.record(z.any()).optional(),
  gedsiGoals: z.array(z.string()).optional(),
  challenges: z.string().optional(),
  supportNeeded: z.string().optional(),
  timeline: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  stage: z.enum(['INTAKE', 'SCREENING', 'DUE_DILIGENCE', 'INVESTMENT_READY', 'FUNDED', 'EXITED']).optional(),
  // assignedToId will be handled separately
});

// GET /api/ventures/[id] - Get single venture
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // No sample data - use database only

    // Get venture from database only
    const venture = await prisma.venture.findUnique({
      where: { id: id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        assignedTo: {
          select: { name: true, email: true }
        },
        gedsiMetrics: {
          orderBy: { createdAt: 'desc' }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        },
        activities: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        capitalActivities: {
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            documents: true,
            activities: true,
            capitalActivities: true,
            gedsiMetrics: true,
          }
        }
      }
    });

    if (!venture) {
      return NextResponse.json({ error: 'Venture not found' }, { status: 404 });
    }

    return NextResponse.json(venture);
  } catch (error) {
    console.error('Error fetching venture:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/ventures/[id] - Update venture
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const validatedData = updateVentureSchema.parse(body);

    // Get user ID from session (disabled for development)
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email! }
    // });

    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }

    // For development, use a default user
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    // Check if venture exists
    const existingVenture = await prisma.venture.findUnique({
      where: { id: id }
    });

    if (!existingVenture) {
      return NextResponse.json({ error: 'Venture not found' }, { status: 404 });
    }

    // Handle assignedToId separately if provided
    const updateData: any = { ...validatedData };
    if (body.assignedToId !== undefined) {
      updateData.assignedToId = body.assignedToId;
    }

    // Update venture
    const updatedVenture = await prisma.venture.update({
      where: { id: id },
      data: updateData,
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        assignedTo: {
          select: { name: true, email: true }
        },
        gedsiMetrics: true,
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: id,
        userId: user.id,
        type: 'VENTURE_UPDATED',
        title: 'Venture Updated',
        description: `Venture "${updatedVenture.name}" was updated`,
        metadata: { updatedFields: Object.keys(validatedData) }
      }
    });

    return NextResponse.json(updatedVenture);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating venture:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/ventures/[id] - Delete venture
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Get user ID from session (disabled for development)
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email! }
    // });

    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }

    // For development, use a default user
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    // Check if venture exists
    const existingVenture = await prisma.venture.findUnique({
      where: { id: id }
    });

    if (!existingVenture) {
      return NextResponse.json({ error: 'Venture not found' }, { status: 404 });
    }

    // Delete venture (this will cascade delete related records)
    await prisma.venture.delete({
      where: { id: id }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'VENTURE_UPDATED',
        title: 'Venture Deleted',
        description: `Venture "${existingVenture.name}" was deleted`,
        metadata: { ventureId: id }
      }
    });

    return NextResponse.json({ message: 'Venture deleted successfully' });
  } catch (error) {
    console.error('Error deleting venture:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 