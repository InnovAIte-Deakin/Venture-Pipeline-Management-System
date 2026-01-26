import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GEDSI Metrics by Category
const GEDSI_METRICS_BY_CATEGORY = {
  WOMEN_LED: [
    "Women in Leadership Positions",
    "Gender Pay Gap",
    "Women Employee Percentage",
    "Gender Diversity Score",
    "Women Board Members",
    "Women in Senior Management",
    "Women Founders/Co-founders",
    "Women Decision Makers",
    "Women Leadership Development",
    "Women Mentorship Programs",
  ],
  YOUTH_LED: [
    "Underserved Community Reach",
    "Social Impact Score",
    "Community Engagement Hours",
    "Inclusive Hiring Practices",
    "Social Inclusion Index",
    "Rural Community Reach",
    "Low-Income Community Impact",
    "Minority Community Engagement",
    "Underserved Population Served",
    "Community Development Score",
  ],
  DISABILITY_INCLUSIVE: [
    "Accessibility Score",
    "Employees with Disabilities",
    "Accessible Technology Usage",
    "Disability Inclusion Training Hours",
    "Accessible Facilities Count",
    "Accessibility Compliance Score",
    "Disability Inclusion Index",
  ],
  INDIGENOUS_LED: [
    "GEDSI Integration Score",
    "Intersectional Impact Assessment",
    "Multi-dimensional Inclusion Index",
    "Cross-cutting GEDSI Metrics",
    "Integrated Impact Measurement",
    "Holistic Inclusion Score",
  ],
};

// Helper function to get category for a metric
function getMetricCategory(metricName: string): string | null {
  for (const [category, metrics] of Object.entries(GEDSI_METRICS_BY_CATEGORY)) {
    if (metrics.includes(metricName)) {
      return category;
    }
  }
  return null;
}

// Helper function to organize metrics by category
function organizeMetricsByCategory(metrics: any[]) {
  const organized: Record<string, any[]> = {
    WOMEN_LED: [],
    YOUTH_LED: [],
    DISABILITY_INCLUSIVE: [],
    INDIGENOUS_LED: [],
    UNCATEGORIZED: [],
  };

  metrics.forEach((metric) => {
    const category = getMetricCategory(metric.metricName);
    if (category) {
      organized[category].push(metric);
    } else {
      organized["UNCATEGORIZED"].push(metric);
    }
  });

  return organized;
}

/**
 * GET /api/gedsi-tracker/[id]
 * Fetch GEDSI metrics for a specific venture and sorted into category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ventureId } = await params;

    // Validate venture ID
    if (!ventureId || ventureId.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Venture ID is required" },
        { status: 400 }
      );
    }

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const categoryFilter = searchParams.get("category");
    const status = searchParams.get("status");

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 200) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid pagination parameters. Limit must be between 1 and 200.",
        },
        { status: 400 }
      );
    }

    // Build filter object - ALWAYS filter by ventureId
    const where: any = {
      ventureId: ventureId,
    };

    if (status) {
      where.status = status;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Verify venture exists
    const venture = await prisma.venture.findUnique({
      where: { id: ventureId },
      select: { id: true, name: true, sector: true, location: true },
    });

    if (!venture) {
      return NextResponse.json(
        { success: false, error: "Venture not found" },
        { status: 404 }
      );
    }

    // Fetch metrics from database
    const [metricsData, total] = await Promise.all([
      prisma.gEDSIMetric.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          venture: {
            select: {
              name: true,
              sector: true,
              location: true,
            },
          },
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.gEDSIMetric.count({ where }),
    ]);

    // Organize metrics by category
    const organizedMetrics = organizeMetricsByCategory(metricsData);

    // Filter by category if specified
    let responseMetrics: any;
    if (categoryFilter && organizedMetrics[categoryFilter]) {
      responseMetrics = {
        [categoryFilter]: organizedMetrics[categoryFilter],
      };
    } else if (categoryFilter) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category. Must be one of: ${Object.keys(
            GEDSI_METRICS_BY_CATEGORY
          ).join(", ")}`,
        },
        { status: 400 }
      );
    } else {
      responseMetrics = organizedMetrics;
    }

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      venture: {
        id: venture.id,
        name: venture.name,
        sector: venture.sector,
        location: venture.location,
      },
      metrics: responseMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching GEDSI metrics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch GEDSI metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}