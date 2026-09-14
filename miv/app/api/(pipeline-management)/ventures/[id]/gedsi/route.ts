import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { AIServices } from '@/lib/ai-services';
import { z } from 'zod';

// Validation schemas
const createGEDSISchema = z.object({
  metricCode: z.string().min(1, 'Metric code is required'),
  metricName: z.string().min(1, 'Metric name is required'),
  category: z.enum(['GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING']),
  targetValue: z.number().positive('Target value must be positive'),
  currentValue: z.number().min(0, 'Current value must be non-negative'),
  unit: z.string().min(1, 'Unit is required'),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'COMPLETED']).optional(),
  notes: z.string().optional(),
});

const updateGEDSISchema = createGEDSISchema.partial();

// GET /api/ventures/[id]/gedsi - Get GEDSI metrics for a venture
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = await prisma.gEDSIMetric.findMany({
      where: { ventureId: id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching GEDSI metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ventures/[id]/gedsi - Add GEDSI metric
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createGEDSISchema.parse(body);

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if venture exists
    const venture = await prisma.venture.findUnique({
      where: { id: id }
    });

    if (!venture) {
      return NextResponse.json({ error: 'Venture not found' }, { status: 404 });
    }

    // Create GEDSI metric
    const metric = await prisma.gEDSIMetric.create({
      data: {
        ...validatedData,
        ventureId: id,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: id,
        userId: user.id,
        type: 'METRIC_ADDED',
        title: 'GEDSI Metric Added',
        description: `Added metric "${metric.metricName}" (${metric.metricCode})`,
        metadata: { 
          metricCode: metric.metricCode,
          category: metric.category,
          targetValue: metric.targetValue,
          currentValue: metric.currentValue
        }
      }
    });

    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating GEDSI metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/ventures/[id]/gedsi - Update GEDSI metric
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { metricId, ...updateData } = body;
    
    if (!metricId) {
      return NextResponse.json({ error: 'Metric ID is required' }, { status: 400 });
    }

    const validatedData = updateGEDSISchema.parse(updateData);

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if metric exists and belongs to the venture
    const existingMetric = await prisma.gEDSIMetric.findFirst({
      where: {
        id: metricId,
        ventureId: id
      }
    });

    if (!existingMetric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    // Update metric
    const updatedMetric = await prisma.gEDSIMetric.update({
      where: { id: metricId },
      data: validatedData,
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: id,
        userId: user.id,
        type: 'METRIC_UPDATED',
        title: 'GEDSI Metric Updated',
        description: `Updated metric "${updatedMetric.metricName}" (${updatedMetric.metricCode})`,
        metadata: { 
          metricCode: updatedMetric.metricCode,
          updatedFields: Object.keys(validatedData)
        }
      }
    });

    return NextResponse.json(updatedMetric);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating GEDSI metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/ventures/[id]/gedsi - Delete GEDSI metric
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const metricId = searchParams.get('metricId');

    if (!metricId) {
      return NextResponse.json({ error: 'Metric ID is required' }, { status: 400 });
    }

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if metric exists and belongs to the venture
    const existingMetric = await prisma.gEDSIMetric.findFirst({
      where: {
        id: metricId,
        ventureId: id
      }
    });

    if (!existingMetric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    // Delete metric
    await prisma.gEDSIMetric.delete({
      where: { id: metricId }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: id,
        userId: user.id,
        type: 'METRIC_UPDATED',
        title: 'GEDSI Metric Deleted',
        description: `Deleted metric "${existingMetric.metricName}" (${existingMetric.metricCode})`,
        metadata: { metricCode: existingMetric.metricCode }
      }
    });

    return NextResponse.json({ message: 'Metric deleted successfully' });
  } catch (error) {
    console.error('Error deleting GEDSI metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 