import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updating GEDSI metrics
const updateGEDSIMetricSchema = z.object({
  currentValue: z.number().min(0, 'Current value must be positive').optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED']).optional(),
  notes: z.string().optional(),
  verificationDate: z.string().optional(),
});

// GET /api/gedsi-metrics/[id] - Get specific GEDSI metric
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const metric = await prisma.gEDSIMetric.findUnique({
      where: { id },
      include: {
        venture: {
          select: { name: true, sector: true, location: true }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!metric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error fetching GEDSI metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/gedsi-metrics/[id] - Update GEDSI metric
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
    const validatedData = updateGEDSIMetricSchema.parse(body);

    // Check if metric exists
    const existingMetric = await prisma.gEDSIMetric.findUnique({
      where: { id }
    });

    if (!existingMetric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    // Update GEDSI metric
    const updatedMetric = await prisma.gEDSIMetric.update({
      where: { id },
      data: {
        ...validatedData,
        // Set verification date if status is being changed to VERIFIED
        verificationDate: validatedData.status === 'VERIFIED' ? new Date().toISOString() : existingMetric.verificationDate,
      },
      include: {
        venture: {
          select: { name: true, sector: true, location: true }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    // Get user for activity log
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Development User',
          email: 'dev@miv.com',
          role: 'ADMIN'
        }
      });
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: existingMetric.ventureId,
        userId: user.id,
        type: 'METRIC_UPDATED',
        title: 'GEDSI Metric Updated',
        description: `Updated metric "${updatedMetric.metricName}" (${updatedMetric.metricCode})`,
        metadata: { 
          metricCode: updatedMetric.metricCode,
          category: updatedMetric.category,
          oldValue: existingMetric.currentValue,
          newValue: updatedMetric.currentValue,
          oldStatus: existingMetric.status,
          newStatus: updatedMetric.status
        }
      }
    });

    return NextResponse.json(updatedMetric);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
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

// DELETE /api/gedsi-metrics/[id] - Delete GEDSI metric
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

    // Check if metric exists
    const existingMetric = await prisma.gEDSIMetric.findUnique({
      where: { id }
    });

    if (!existingMetric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }

    // Delete GEDSI metric
    await prisma.gEDSIMetric.delete({
      where: { id }
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
