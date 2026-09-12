import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/iris/metrics/[code] - Get specific IRIS metric by code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { error: 'Metric code is required' },
        { status: 400 }
      );
    }

    // Find the metric by code
    const metric = await prisma.iRISMetricCatalog.findUnique({
      where: { code },
    });

    if (!metric) {
      return NextResponse.json(
        { error: 'Metric not found' },
        { status: 404 }
      );
    }

    // Suggest GEDSI category based on content
    function suggestGedsiCategory(item: any): 'Gender' | 'Disability' | 'Social Inclusion' | 'Cross-cutting' | undefined {
      const hay = `${item.code} ${item.name} ${item.description || ''}`.toLowerCase()
      
      if (hay.includes('women') || hay.includes('female') || hay.includes('gender') || hay.includes('girl')) {
        return 'Gender'
      }
      if (hay.includes('disability') || hay.includes('disabled') || hay.includes('accessibility') || hay.includes('inclusive')) {
        return 'Disability'
      }
      if (hay.includes('social') || hay.includes('community') || hay.includes('marginalized') || hay.includes('underserved') || hay.includes('rural') || hay.includes('urban')) {
        return 'Social Inclusion'
      }
      return 'Cross-cutting'
    }

    const gedsiSuggestion = suggestGedsiCategory(metric);

    return NextResponse.json({
      ...metric,
      gedsiSuggestion
    });

  } catch (error) {
    console.error('Error fetching IRIS metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

