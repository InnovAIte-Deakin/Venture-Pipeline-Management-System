import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { triggerVentureRecalculation } from '@/lib/calculation-service';
import { z } from 'zod';
// import { triggerN8n } from '@/lib/n8n-webhooks'; // Removed - file deleted

// Validation schema for GEDSI metrics
const createGEDSIMetricSchema = z.object({
  ventureId: z.string().min(1, 'Venture ID is required'),
  metricCode: z.string().min(1, 'Metric code is required'),
  metricName: z.string().min(1, 'Metric name is required'),
  category: z.enum(['GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING']),
  targetValue: z.number().min(0, 'Target value must be positive'),
  currentValue: z.number().min(0, 'Current value must be positive').default(0),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string().optional(),
});

const updateGEDSIMetricSchema = createGEDSIMetricSchema.partial();

async function validateMetricCodeAndEnrich(data: any) {
  const catalog = await prisma.iRISMetricCatalog.findFirst({ where: { code: data.metricCode } });
  if (!catalog) {
    const error: any = new Error(`Unknown IRIS metric code: ${data.metricCode}`);
    error.status = 400;
    throw error;
  }
  return {
    ...data,
    metricName: data.metricName || catalog.name,
    unit: data.unit || catalog.unit || 'units',
  };
}

// GET /api/gedsi-metrics - List GEDSI metrics with filtering
export async function GET(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const ventureId = searchParams.get('ventureId') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (ventureId) where.ventureId = ventureId;
    if (category) where.category = category;
    if (status) where.status = status;

    const [metrics, total] = await Promise.all([
      prisma.gEDSIMetric.findMany({
        where,
        include: {
          venture: {
            select: { name: true, sector: true, location: true }
          },
          createdBy: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gEDSIMetric.count({ where })
    ]);

    return NextResponse.json({
      metrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching GEDSI metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/gedsi-metrics - Create new GEDSI metric
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const validatedData = createGEDSIMetricSchema.parse(body);
    const enrichedData = await validateMetricCodeAndEnrich(validatedData);

    // Get user ID from session
    // For development, use a default user or create one
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

    // Create GEDSI metric
    const metric = await prisma.gEDSIMetric.create({
      data: {
        ...enrichedData,
        createdById: user.id,
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

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: enrichedData.ventureId,
        userId: user.id,
        type: 'METRIC_ADDED',
        title: 'GEDSI Metric Added',
        description: `New GEDSI metric "${enrichedData.metricName}" was added`,
        metadata: { 
          type: 'gedsi_metric', 
          metricCode: enrichedData.metricCode,
          category: enrichedData.category
        }
      }
    });

    // Trigger recalculation of venture metrics
    triggerVentureRecalculation(enrichedData.ventureId).catch(console.error);

    // n8n webhook (async, non-blocking) - disabled for now
    // triggerN8n({
    //   event: 'GEDSI_METRIC_ADDED',
    //   payload: {
    //     id: metric.id,
    //     ventureId: metric.ventureId,
    //     metricCode: metric.metricCode,
    //     metricName: metric.metricName,
    //     category: metric.category,
    //     currentValue: metric.currentValue,
    //     targetValue: metric.targetValue,
    //     unit: metric.unit,
    //     createdBy: user.email
    //   }
    // }).catch(() => {})

    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    if ((error as any)?.status === 400) {
      return NextResponse.json(
        { error: (error as any).message },
        { status: 400 }
      );
    }
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