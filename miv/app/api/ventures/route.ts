import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIServices } from '@/lib/ai-services';
import { triggerVentureRecalculation } from '@/lib/calculation-service';
import { z } from 'zod';
import { getMobileFlag } from '@/lib/mobile-detect';
import { createCachedResponse, CACHE_CONFIGS } from '@/lib/cache-headers';

// Validation schema
const createVentureSchema = z.object({
  name: z.string().min(1, 'Venture name is required'),
  sector: z.string().min(1, 'Sector is required'),
  location: z.string().min(1, 'Location is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().optional(),
  pitchSummary: z.string().optional(),
  inclusionFocus: z.string().optional(),
  impactBeneficiaries: z.array(z.string()).optional(),
  impactAreas: z.array(z.string()).optional(),
  impactNotes: z.string().optional(),

  fundingRequired: z.string().optional(),
  annualRevenue: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  fundingStage: z.string().optional(),
  currentInvestment: z.string().optional(),

  documentsMetadata: z.record(z.any()).optional(),
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
      seeing: z.enum([
        'no_difficulty',
        'some_difficulty',
        'a_lot_of_difficulty',
        'cannot_do_at_all',
      ]).optional(),
      hearing: z.enum([
        'no_difficulty',
        'some_difficulty',
        'a_lot_of_difficulty',
        'cannot_do_at_all',
      ]).optional(),
      walking: z.enum([
        'no_difficulty',
        'some_difficulty',
        'a_lot_of_difficulty',
        'cannot_do_at_all',
      ]).optional(),
      cognition: z.enum([
        'no_difficulty',
        'some_difficulty',
        'a_lot_of_difficulty',
        'cannot_do_at_all',
      ]).optional(),
      selfCare: z.enum([
        'no_difficulty',
        'some_difficulty',
        'a_lot_of_difficulty',
        'cannot_do_at_all',
      ]).optional(),
      communication: z.enum([
        'no_difficulty',
        'some_difficulty',
        'a_lot_of_difficulty',
        'cannot_do_at_all',
      ]).optional(),
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

// GET /api/ventures - List ventures with filtering
export async function GET(request: NextRequest) {
  try {
    const { isMobile } = getMobileFlag(request);
    console.log(`Mobile request: ${isMobile}`);

    const { searchParams } = new URL(request.url);

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    let limit =
      Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;

    // Reduce limit for mobile clients
    if (isMobile && limit > 5) {
      limit = 5;
    }

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

    if (sector) {
      where.sector = sector;
    }

    if (stage) {
      where.stage = stage;
    }

    if (status) {
      where.status = status;
    }

    // Optimize included data based on device type
    const includeConfig: any = {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          documents: true,
          activities: true,
          capitalActivities: true,
        },
      },
    };

    // Desktop gets more details; mobile gets a smaller response
    if (!isMobile) {
      includeConfig.gedsiMetrics = true;

      includeConfig.documents = {
        orderBy: {
          uploadedAt: 'desc',
        },
        take: 5,
      };

      includeConfig.activities = {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      };

      includeConfig.capitalActivities = {
        orderBy: {
          createdAt: 'desc',
        },
      };
    }

    const [ventures, total] = await Promise.all([
      prisma.venture.findMany({
        where,
        include: includeConfig,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.venture.count({
        where,
      }),
    ]);

    const responseData = {
      ventures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      isMobile,
    };

    return createCachedResponse(
      responseData,
      CACHE_CONFIGS.ANALYTICS
    );
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
    const body = await request.json();
    const validatedData = createVentureSchema.parse(body);

    // For development, use an existing user or create a default user.
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Development User',
          email: 'dev@miv.com',
          role: 'ADMIN',
        },
      });
    }

    const {
      impactBeneficiaries,
      impactAreas,
      impactNotes,
      fundingRequired,
      annualRevenue,
      numberOfEmployees,
      fundingStage,
      currentInvestment,
      documentsMetadata,
      ...ventureData
    } = validatedData;

    // Create the venture.
    const venture = await prisma.venture.create({
      data: {
        ...ventureData,

        founderTypes: JSON.stringify(validatedData.founderTypes),

        gedsiMetricsSummary: {
          beneficiaries: impactBeneficiaries ?? [],
          impactAreas: impactAreas ?? [],
          additionalNotes: impactNotes ?? '',
        },

        financials: {
          fundingRequired: fundingRequired ?? '',
          annualRevenue: annualRevenue ?? '',
          numberOfEmployees: numberOfEmployees ?? '',
          fundingStage: fundingStage ?? '',
          currentInvestment: currentInvestment ?? '',
        },

        documentsMetadata: documentsMetadata ?? {},

        createdById: user.id,
      } as any,

      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        gedsiMetrics: true,
      },
    });

    // Trigger initial calculations for the new venture.
    triggerVentureRecalculation(venture.id).catch((error) => {
      console.error('Venture recalculation failed:', error);
    });

    // Run AI analysis asynchronously.
    void Promise.all([
      AIServices.analyzeGEDSIMetrics(venture)
        .then(async (analysis) => {
          await prisma.activity.create({
            data: {
              ventureId: venture.id,
              userId: user.id,
              type: 'NOTE_ADDED',
              title: 'AI GEDSI Analysis',
              description: analysis,
              metadata: {
                type: 'ai_analysis',
                category: 'gedsi',
              },
            },
          });
        })
        .catch((error) => {
          console.error('AI GEDSI analysis failed:', error);
        }),

      AIServices.assessVentureReadiness(venture)
        .then(async (assessment) => {
          await prisma.activity.create({
            data: {
              ventureId: venture.id,
              userId: user.id,
              type: 'NOTE_ADDED',
              title: 'AI Readiness Assessment',
              description: assessment,
              metadata: {
                type: 'ai_analysis',
                category: 'readiness',
              },
            },
          });
        })
        .catch((error) => {
          console.error('AI readiness assessment failed:', error);
        }),

      AIServices.generateTags(venture)
        .then(async (tags) => {
          if (tags.length > 0) {
            await prisma.activity.create({
              data: {
                ventureId: venture.id,
                userId: user.id,
                type: 'NOTE_ADDED',
                title: 'AI Generated Tags',
                description: JSON.stringify(tags),
                metadata: {
                  type: 'ai_analysis',
                  category: 'tags',
                  tags,
                },
              },
            });
          }
        })
        .catch((error) => {
          console.error('AI tag generation failed:', error);
        }),

      AIServices.assessRisk(venture)
        .then(async (riskAssessment) => {
          await prisma.activity.create({
            data: {
              ventureId: venture.id,
              userId: user.id,
              type: 'NOTE_ADDED',
              title: 'AI Risk Assessment',
              description: riskAssessment,
              metadata: {
                type: 'ai_analysis',
                category: 'risk',
              },
            },
          });
        })
        .catch((error) => {
          console.error('AI risk assessment failed:', error);
        }),
    ]);

    // Create activity log.
    await prisma.activity.create({
      data: {
        ventureId: venture.id,
        userId: user.id,
        type: 'VENTURE_CREATED',
        title: 'Venture Created',
        description: `New venture "${venture.name}" was created`,
      },
    });

    return NextResponse.json(venture, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
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