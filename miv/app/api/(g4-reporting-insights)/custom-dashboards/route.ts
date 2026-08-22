import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatTimeAgo } from '@/lib/utils';

function serializeDashboard(dashboard: any) {
  const widgets = Array.isArray(dashboard.widgets) ? dashboard.widgets : [];
  return {
    id: dashboard.id,
    name: dashboard.name,
    description: dashboard.description || '',
    category: dashboard.category,
    widgets: widgets.length,
    lastModified: formatTimeAgo(dashboard.updatedAt),
    isPublic: dashboard.isPublic,
    isFavorite: dashboard.isFavorite,
    createdBy: dashboard.createdBy?.name || 'Unknown',
  };
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const dashboards = await prisma.customDashboard.findMany({
      where: userId
        ? {
            OR: [
              { createdById: userId },
              { sharedWith: { some: { id: userId } } },
              { isPublic: true },
            ],
          }
        : { isPublic: true },
      include: { createdBy: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    const serialized = dashboards.map(serializeDashboard);

    return NextResponse.json({
      dashboards: serialized,
      summary: {
        totalDashboards: serialized.length,
        publicDashboards: serialized.filter((d) => d.isPublic).length,
        favoriteDashboards: serialized.filter((d) => d.isFavorite).length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching custom dashboards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Dashboard name is required' }, { status: 400 });
    }
    if (!body.createdById || typeof body.createdById !== 'string') {
      return NextResponse.json({ error: 'User is required' }, { status: 400 });
    }

    const created = await prisma.customDashboard.create({
      data: {
        name: body.name.trim(),
        description: body.description || '',
        category: body.category || 'Custom',
        widgets: body.widgets ?? [],
        isPublic: !!body.isPublic,
        isFavorite: false,
        createdById: body.createdById,
      },
      include: { createdBy: { select: { name: true } } },
    });

    return NextResponse.json({ dashboard: serializeDashboard(created) }, { status: 201 });
  } catch (error) {
    console.error('Error creating custom dashboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Dashboard id is required' }, { status: 400 });
    }

    const updated = await prisma.customDashboard.update({
      where: { id: body.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
        ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
        ...(body.widgets !== undefined && { widgets: body.widgets }),
      },
      include: { createdBy: { select: { name: true } } },
    });

    return NextResponse.json({ dashboard: serializeDashboard(updated) });
  } catch (error) {
    console.error('Error updating custom dashboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Dashboard id is required' }, { status: 400 });
    }

    const existing = await prisma.customDashboard.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    await prisma.customDashboard.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting custom dashboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
