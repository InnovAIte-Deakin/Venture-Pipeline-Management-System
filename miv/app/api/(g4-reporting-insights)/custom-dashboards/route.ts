import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET /api/custom-dashboards - Get custom dashboards (simulated from user data)
export async function GET(request: NextRequest) {
  try {
    // For now, we'll simulate custom dashboards based on existing data
    // In a real system, these would be stored in a separate table
    
    // Fetch users to simulate dashboard creators
    const users = await prisma.user.findMany({
      select: { name: true, email: true, id: true },
      take: 10
    });

    // Fetch ventures to calculate dashboard metrics
    const ventures = await prisma.venture.findMany({
      include: {
        gedsiMetrics: true,
        capitalActivities: true,
        _count: {
          select: {
            documents: true,
            activities: true,
          }
        }
      }
    });

    // Create simulated custom dashboards based on real data
    const dashboards = [
      {
        id: "DASH-001",
        name: "Pipeline Overview",
        description: "Comprehensive view of deal pipeline and performance metrics",
        category: "Pipeline",
        widgets: Math.min(ventures.length, 8),
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isPublic: true,
        isFavorite: true,
        createdBy: users[0]?.name || "System User",
        createdById: users[0]?.id || "system",
        data: {
          totalVentures: ventures.length,
          activeDeals: ventures.filter(v => v.stage === 'DUE_DILIGENCE' || v.stage === 'INVESTMENT_READY').length,
          fundedVentures: ventures.filter(v => v.stage === 'FUNDED' || v.fundingRaised > 0).length
        }
      },
      {
        id: "DASH-002", 
        name: "Portfolio Performance",
        description: "Real-time portfolio performance and IRR tracking",
        category: "Portfolio",
        widgets: Math.min(ventures.filter(v => v.fundingRaised > 0).length, 12),
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isPublic: false,
        isFavorite: false,
        createdBy: users[1]?.name || "Portfolio Manager",
        createdById: users[1]?.id || "system",
        data: {
          portfolioVentures: ventures.filter(v => v.fundingRaised > 0).length,
          totalFunding: ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0),
          avgGedsiScore: ventures.filter(v => v.gedsiMetrics.length > 0)
            .reduce((sum, v) => sum + (v.gedsiMetrics.reduce((s, m) => s + m.currentValue, 0) / v.gedsiMetrics.length), 0) / 
            Math.max(ventures.filter(v => v.gedsiMetrics.length > 0).length, 1)
        }
      },
      {
        id: "DASH-003",
        name: "GEDSI Impact Tracker", 
        description: "Gender equality, diversity, and social inclusion metrics",
        category: "Impact",
        widgets: Math.min(ventures.filter(v => v.gedsiMetrics.length > 0).length, 6),
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        isPublic: true,
        isFavorite: true,
        createdBy: users[2]?.name || "Impact Analyst",
        createdById: users[2]?.id || "system",
        data: {
          totalMetrics: ventures.reduce((sum, v) => sum + v.gedsiMetrics.length, 0),
          verifiedMetrics: ventures.reduce((sum, v) => sum + v.gedsiMetrics.filter(m => m.status === 'VERIFIED').length, 0),
          avgCompletionRate: ventures.filter(v => v.gedsiMetrics.length > 0)
            .reduce((sum, v) => sum + (v.gedsiMetrics.filter(m => m.status === 'COMPLETED').length / v.gedsiMetrics.length * 100), 0) /
            Math.max(ventures.filter(v => v.gedsiMetrics.length > 0).length, 1)
        }
      },
      {
        id: "DASH-004",
        name: "Due Diligence Status",
        description: "Track due diligence progress across all active deals", 
        category: "Operations",
        widgets: Math.min(ventures.filter(v => v.stage === 'DUE_DILIGENCE').length * 2, 10),
        lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        isPublic: false,
        isFavorite: false,
        createdBy: users[3]?.name || "Operations Manager",
        createdById: users[3]?.id || "system",
        data: {
          inDueDiligence: ventures.filter(v => v.stage === 'DUE_DILIGENCE').length,
          documentsUploaded: ventures.reduce((sum, v) => sum + (v._count?.documents || 0), 0),
          activitiesLogged: ventures.reduce((sum, v) => sum + (v._count?.activities || 0), 0)
        }
      },
      {
        id: "DASH-005",
        name: "Team Performance",
        description: "Team productivity and deal flow metrics",
        category: "Team", 
        widgets: Math.min(users.length + 2, 7),
        lastModified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
        isPublic: true,
        isFavorite: false,
        createdBy: users[4]?.name || "Team Lead",
        createdById: users[4]?.id || "system",
        data: {
          totalUsers: users.length,
          activeVentures: ventures.filter(v => v.assignedToId).length,
          unassignedVentures: ventures.filter(v => !v.assignedToId).length
        }
      }
    ].filter(dashboard => dashboard.widgets > 0); // Only include dashboards with widgets

    return NextResponse.json({
      dashboards,
      summary: {
        totalDashboards: dashboards.length,
        publicDashboards: dashboards.filter(d => d.isPublic).length,
        favoriteDashboards: dashboards.filter(d => d.isFavorite).length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching custom dashboards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/custom-dashboards - Create a new custom dashboard (placeholder)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real implementation, this would save to a dashboards table
    // For now, we'll just return a success response
    const newDashboard = {
      id: `DASH-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User", // Would get from session
      widgets: 0 // Start with no widgets
    };

    return NextResponse.json({ dashboard: newDashboard }, { status: 201 });
  } catch (error) {
    console.error('Error creating custom dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
