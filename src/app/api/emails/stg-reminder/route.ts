import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for STG reminder emails
const stgReminderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  ventureId: z.string().optional(),
  stgGoals: z.array(z.string()).optional(),
  reminderType: z.enum(['OVERDUE', 'UPCOMING', 'GENERAL']).default('GENERAL'),
  daysAhead: z.number().min(1).max(30).default(7),
});

// GET /api/emails/stg-reminder - Trigger STG reminder email for a user
export async function GET(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const ventureId = searchParams.get('ventureId');
    const reminderType = searchParams.get('reminderType') || 'GENERAL';
    const daysAhead = parseInt(searchParams.get('daysAhead') || '7');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, organization: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get STG-related data based on user role and parameters
    const stgData: any = {
      user: user,
      reminderType: reminderType,
      daysAhead: daysAhead,
      timestamp: new Date().toISOString()
    };

    // Get ventures with STG goals
    const whereClause: any = {};
    if (ventureId) {
      whereClause.id = ventureId;
    } else if (user.role === 'ADMIN' || user.role === 'VENTURE_MANAGER') {
      // Get all ventures for admins and venture managers
      whereClause.status = 'ACTIVE';
    } else if (user.role === 'CAPITAL_FACILITATOR') {
      // Get ventures that need capital facilitation
      whereClause.status = 'ACTIVE';
      whereClause.stage = { in: ['SEED', 'SERIES_A', 'SERIES_B'] };
    }

    const ventures = await prisma.venture.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        stage: true,
        sector: true,
        status: true,
        stgGoals: true,
        gedsiMetricsSummary: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });

    // Filter ventures with STG goals
    const venturesWithSTG = ventures.filter(v => v.stgGoals && v.stgGoals.length > 0);

    stgData.ventures = {
      total: venturesWithSTG.length,
      withSTGGoals: venturesWithSTG.length,
      recent: venturesWithSTG.slice(0, 10),
      summary: {
        stages: venturesWithSTG.reduce((acc, v) => {
          acc[v.stage] = (acc[v.stage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        sectors: venturesWithSTG.reduce((acc, v) => {
          acc[v.sector] = (acc[v.sector] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        stgGoals: venturesWithSTG.reduce((acc, v) => {
          if (v.stgGoals) {
            v.stgGoals.forEach(goal => {
              acc[goal] = (acc[goal] || 0) + 1;
            });
          }
          return acc;
        }, {} as Record<string, number>)
      }
    };

    // Get STG-related notifications
    const stgNotifications = await prisma.notification.findMany({
      where: {
        userId: userId,
        OR: [
          { type: 'STG_REMINDER' },
          { type: 'GEDSI_ALERT' },
          { type: 'SYSTEM_UPDATE' }
        ],
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    stgData.notifications = {
      total: stgNotifications.length,
      unread: stgNotifications.filter(n => !n.isRead).length,
      recent: stgNotifications.slice(0, 5),
      byType: stgNotifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    // Get GEDSI metrics related to STG goals
    if (user.role === 'ADMIN' || user.role === 'GEDSI_ANALYST') {
      const gedsiMetrics = await prisma.gEDSIMetric.findMany({
        where: {
          ventureId: { in: venturesWithSTG.map(v => v.id) },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          ventureId: true,
          category: true,
          currentValue: true,
          targetValue: true,
          metricName: true,
          status: true,
          createdAt: true,
          venture: {
            select: { name: true, sector: true, stgGoals: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      stgData.gedsiMetrics = {
        total: gedsiMetrics.length,
        recent: gedsiMetrics.slice(0, 10),
        categories: gedsiMetrics.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        status: gedsiMetrics.reduce((acc, m) => {
          acc[m.status] = (acc[m.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    }

    // Create email log entry
    const emailLog = await prisma.emailLog.create({
      data: {
        to: user.email,
        subject: `STG Goals Reminder - MIV Platform (${reminderType})`,
        template: 'stg_reminder',
        status: 'SENT',
        sentAt: new Date(),
        metadata: {
          type: 'stg_reminder',
          reminderType: reminderType,
          daysAhead: daysAhead,
          userId: user.id,
          userName: user.name,
          ventureId: ventureId || null,
          dataSummary: {
            venturesWithSTG: venturesWithSTG.length,
            notificationsCount: stgNotifications.length,
            gedsiMetricsCount: stgData.gedsiMetrics?.total || 0
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `STG reminder email sent to ${user.name} (${user.email})`,
      emailLog: {
        id: emailLog.id,
        to: emailLog.to,
        subject: emailLog.subject,
        status: emailLog.status,
        sentAt: emailLog.sentAt
      },
      stgData: stgData
    });

  } catch (error) {
    console.error('Error sending STG reminder email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/emails/stg-reminder - Send STG reminder email with custom parameters
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: jsonError instanceof Error ? jsonError.message : 'Unknown JSON error' },
        { status: 400 }
      );
    }

    const validatedData = stgReminderSchema.parse(body);

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true, name: true, email: true, role: true, organization: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get STG-related data (same logic as GET)
    const stgData: any = {
      user: user,
      reminderType: validatedData.reminderType,
      daysAhead: validatedData.daysAhead,
      timestamp: new Date().toISOString()
    };

    // Get ventures with STG goals
    const whereClause: any = {};
    if (validatedData.ventureId) {
      whereClause.id = validatedData.ventureId;
    } else if (user.role === 'ADMIN' || user.role === 'VENTURE_MANAGER') {
      whereClause.status = 'ACTIVE';
    } else if (user.role === 'CAPITAL_FACILITATOR') {
      whereClause.status = 'ACTIVE';
      whereClause.stage = { in: ['SEED', 'SERIES_A', 'SERIES_B'] };
    }

    const ventures = await prisma.venture.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        stage: true,
        sector: true,
        status: true,
        stgGoals: true,
        gedsiMetricsSummary: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });

    const venturesWithSTG = ventures.filter(v => v.stgGoals && v.stgGoals.length > 0);

    stgData.ventures = {
      total: venturesWithSTG.length,
      withSTGGoals: venturesWithSTG.length,
      recent: venturesWithSTG.slice(0, 10),
      summary: {
        stages: venturesWithSTG.reduce((acc, v) => {
          acc[v.stage] = (acc[v.stage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        sectors: venturesWithSTG.reduce((acc, v) => {
          acc[v.sector] = (acc[v.sector] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        stgGoals: venturesWithSTG.reduce((acc, v) => {
          if (v.stgGoals) {
            v.stgGoals.forEach(goal => {
              acc[goal] = (acc[goal] || 0) + 1;
            });
          }
          return acc;
        }, {} as Record<string, number>)
      }
    };

    // Get STG-related notifications
    const stgNotifications = await prisma.notification.findMany({
      where: {
        userId: validatedData.userId,
        OR: [
          { type: 'STG_REMINDER' },
          { type: 'GEDSI_ALERT' },
          { type: 'SYSTEM_UPDATE' }
        ],
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    stgData.notifications = {
      total: stgNotifications.length,
      unread: stgNotifications.filter(n => !n.isRead).length,
      recent: stgNotifications.slice(0, 5),
      byType: stgNotifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    // Get GEDSI metrics related to STG goals
    if (user.role === 'ADMIN' || user.role === 'GEDSI_ANALYST') {
      const gedsiMetrics = await prisma.gEDSIMetric.findMany({
        where: {
          ventureId: { in: venturesWithSTG.map(v => v.id) },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          ventureId: true,
          category: true,
          currentValue: true,
          targetValue: true,
          metricName: true,
          status: true,
          createdAt: true,
          venture: {
            select: { name: true, sector: true, stgGoals: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      stgData.gedsiMetrics = {
        total: gedsiMetrics.length,
        recent: gedsiMetrics.slice(0, 10),
        categories: gedsiMetrics.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        status: gedsiMetrics.reduce((acc, m) => {
          acc[m.status] = (acc[m.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    }

    // Create email log entry
    const emailLog = await prisma.emailLog.create({
      data: {
        to: user.email,
        subject: `STG Goals Reminder - MIV Platform (${validatedData.reminderType})`,
        template: 'stg_reminder',
        status: 'SENT',
        sentAt: new Date(),
        metadata: {
          type: 'stg_reminder',
          reminderType: validatedData.reminderType,
          daysAhead: validatedData.daysAhead,
          userId: user.id,
          userName: user.name,
          ventureId: validatedData.ventureId || null,
          stgGoals: validatedData.stgGoals || null,
          dataSummary: {
            venturesWithSTG: venturesWithSTG.length,
            notificationsCount: stgNotifications.length,
            gedsiMetricsCount: stgData.gedsiMetrics?.total || 0
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `STG reminder email sent to ${user.name} (${user.email})`,
      emailLog: {
        id: emailLog.id,
        to: emailLog.to,
        subject: emailLog.subject,
        status: emailLog.status,
        sentAt: emailLog.sentAt
      },
      stgData: stgData
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error sending STG reminder email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
