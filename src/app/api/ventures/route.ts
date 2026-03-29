import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { AIServices } from '@/lib/ai-services';
import { triggerVentureRecalculation } from '@/lib/calculation-service';
import { z } from 'zod';

// Validation schemas
const createVentureSchema = z.object({
  name: z.string().min(1, 'Venture name is required'),
  sector: z.string().min(1, 'Sector is required'),
  location: z.string().min(1, 'Location is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().optional(),
  pitchSummary: z.string().optional(),
  inclusionFocus: z.string().optional(),

  founderTypes: z.array(z.string()).min(1, 'Founder types are required'),
  teamSize: z.string().optional(),
  foundingYear: z.string().optional(),
  targetMarket: z.string().optional(),
  revenueModel: z.string().optional(),
  operationalReadiness: z.record(z.any()).optional(),
  capitalReadiness: z.record(z.any()).optional(),
  gedsiGoals: z.array(z.string()).optional(),
  washingtonShortSet: z
    .object({
      seeing: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      hearing: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      walking: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      cognition: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      selfCare: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      communication: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
    })
    .optional(),
  disabilityInclusion: z
    .object({
      disabilityLedLeadership: z.boolean().optional(),
      inclusiveHiringPractices: z.boolean().optional(),
      accessibleProductsOrServices: z.boolean().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  challenges: z.string().optional(),
  supportNeeded: z.string().optional(),
  timeline: z.string().optional(),
});

const updateVentureSchema = createVentureSchema.partial();

// GET /api/ventures - List ventures with filtering
export async function GET(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sector = searchParams.get('sector') || '';
    const stage = searchParams.get('stage') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sector: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (sector) where.sector = sector;
    if (stage) where.stage = stage;
    if (status) where.status = status;

    const [ventures, total] = await Promise.all([
      prisma.venture.findMany({
        where,
        include: {
          createdBy: {
            select: { name: true, email: true }
          },
          assignedTo: {
            select: { name: true, email: true }
          },
          gedsiMetrics: true,
          documents: {
            orderBy: { uploadedAt: 'desc' },
            take: 5
          },
          activities: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          capitalActivities: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              documents: true,
              activities: true,
              capitalActivities: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.venture.count({ where })
    ]);

    return NextResponse.json({
      ventures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ventures:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ventures - Create new venture
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const validatedData = createVentureSchema.parse(body);

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

    // Create venture
    const venture = await prisma.venture.create({
      data: {
        ...validatedData,
        founderTypes: JSON.stringify(validatedData.founderTypes),
        createdById: user.id,
      } as any,
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        gedsiMetrics: true,
      }
    });

    // Trigger initial calculations for the new venture
    triggerVentureRecalculation(venture.id).catch(console.error);

    // AI-powered analysis (async)
    Promise.all([
      // Generate GEDSI metrics suggestions
      AIServices.analyzeGEDSIMetrics(venture).then(async (analysis) => {
        await prisma.activity.create({
          data: {
            ventureId: venture.id,
            userId: user.id,
            type: 'NOTE_ADDED',
            title: 'AI GEDSI Analysis',
            description: analysis,
            metadata: { type: 'ai_analysis', category: 'gedsi' }
          }
        });
      }).catch(console.error),

      // Assess venture readiness
      AIServices.assessVentureReadiness(venture).then(async (assessment) => {
        await prisma.activity.create({
          data: {
            ventureId: venture.id,
            userId: user.id,
            type: 'NOTE_ADDED',
            title: 'AI Readiness Assessment',
            description: assessment,
            metadata: { type: 'ai_analysis', category: 'readiness' }
          }
        });
      }).catch(console.error),

      // Generate tags
      AIServices.generateTags(venture).then(async (tags) => {
        if (tags.length > 0) {
          await prisma.activity.create({
            data: {
              ventureId: venture.id,
              userId: user.id,
              type: 'NOTE_ADDED',
              title: 'AI Generated Tags',
              description: JSON.stringify(tags),
              metadata: { type: 'ai_analysis', category: 'tags', tags }
            }
          });
        }
      }).catch(console.error),

      // Risk assessment
      AIServices.assessRisk(venture).then(async (riskAssessment) => {
        await prisma.activity.create({
          data: {
            ventureId: venture.id,
            userId: user.id,
            type: 'NOTE_ADDED',
            title: 'AI Risk Assessment',
            description: riskAssessment,
            metadata: { type: 'ai_analysis', category: 'risk' }
          }
        });
      }).catch(console.error)
    ]);

    // Create activity log
    await prisma.activity.create({
      data: {
        ventureId: venture.id,
        userId: user.id,
        type: 'VENTURE_CREATED',
        title: 'Venture Created',
        description: `New venture "${venture.name}" was created`,
      }
    });

    return NextResponse.json(venture, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating venture:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 