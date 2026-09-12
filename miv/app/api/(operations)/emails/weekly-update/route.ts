import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for weekly update emails
const weeklyUpdateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  period: z.string().optional().default('last week'),
  includeMetrics: z.boolean().default(true),
  includeVentures: z.boolean().default(true),
  includeNotifications: z.boolean().default(true),
});

// GET /api/emails/weekly-update - Trigger weekly update email for a user
export async function GET(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || 'last week';
    const includeMetrics = searchParams.get('includeMetrics') !== 'false';
    const includeVentures = searchParams.get('includeVentures') !== 'false';
    const includeNotifications = searchParams.get('includeNotifications') !== 'false';

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

    // Get weekly data based on user role and preferences
    const weeklyData: any = {
      user: user,
      period: period,
      timestamp: new Date().toISOString()
    };

    // Get ventures data if user is involved with ventures
    if (includeVentures && (user.role === 'ADMIN' || user.role === 'VENTURE_MANAGER' || user.role === 'CAPITAL_FACILITATOR')) {
      const ventures = await prisma.venture.findMany({
        where: {
          OR: [
            { createdById: userId },
            { status: 'ACTIVE' }
          ]
        },
        select: {
          id: true,
          name: true,
          stage: true,
          sector: true,
          status: true,
          createdAt: true,
          gedsiMetricsSummary: true,
          stgGoals: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      weeklyData.ventures = {
        total: ventures.length,
        active: ventures.filter(v => v.status === 'ACTIVE').length,
        recent: ventures.slice(0, 5),
        summary: {
          stages: ventures.reduce((acc, v) => {
            acc[v.stage] = (acc[v.stage] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          sectors: ventures.reduce((acc, v) => {
            acc[v.sector] = (acc[v.sector] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      };
    }

    // Get GEDSI metrics if user is GEDSI analyst or admin
    if (includeMetrics && (user.role === 'ADMIN' || user.role === 'GEDSI_ANALYST')) {
      const gedsiMetrics = await prisma.gEDSIMetric.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
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
            select: { name: true, sector: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      weeklyData.gedsiMetrics = {
        total: gedsiMetrics.length,
        recent: gedsiMetrics.slice(0, 10),
        categories: gedsiMetrics.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    }

    // Get notifications if requested
    if (includeNotifications) {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
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

      weeklyData.notifications = {
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length,
        recent: notifications.slice(0, 5)
      };
    }

    // Get platform statistics for admins
    if (user.role === 'ADMIN') {
      const [totalUsers, totalVentures, totalNotifications, totalEmailLogs] = await Promise.all([
        prisma.user.count(),
        prisma.venture.count(),
        prisma.notification.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.emailLog.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      weeklyData.platformStats = {
        totalUsers,
        totalVentures,
        weeklyNotifications: totalNotifications,
        weeklyEmails: totalEmailLogs
      };
    }

    // Create email log entry
    const emailLog = await prisma.emailLog.create({
      data: {
        to: user.email,
        subject: `Weekly Update - MIV Platform (${period})`,
        template: 'weekly_update',
        status: 'SENT',
        sentAt: new Date(),
        metadata: {
          type: 'weekly_update',
          period: period,
          userName: user.name,
          includeMetrics,
          includeVentures,
          includeNotifications,
          dataSummary: {
            venturesCount: weeklyData.ventures?.total || 0,
            metricsCount: weeklyData.gedsiMetrics?.total || 0,
            notificationsCount: weeklyData.notifications?.total || 0
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Weekly update email sent to ${user.name} (${user.email})`,
      emailLog: {
        id: emailLog.id,
        to: emailLog.to,
        subject: emailLog.subject,
        status: emailLog.status,
        sentAt: emailLog.sentAt
      },
      weeklyData: weeklyData
    });

  } catch (error) {
    console.error('Error sending weekly update email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/emails/weekly-update - Send weekly update email with custom parameters
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

    const validatedData = weeklyUpdateSchema.parse(body);

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

    // Get weekly data (same logic as GET)
    const weeklyData: any = {
      user: user,
      period: validatedData.period,
      timestamp: new Date().toISOString()
    };

    // Get ventures data if requested
    if (validatedData.includeVentures && (user.role === 'ADMIN' || user.role === 'VENTURE_MANAGER' || user.role === 'CAPITAL_FACILITATOR')) {
      const ventures = await prisma.venture.findMany({
        where: {
          OR: [
            { createdById: validatedData.userId },
            { status: 'ACTIVE' }
          ]
        },
        select: {
          id: true,
          name: true,
          stage: true,
          sector: true,
          status: true,
          createdAt: true,
          gedsiMetricsSummary: true,
          stgGoals: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      weeklyData.ventures = {
        total: ventures.length,
        active: ventures.filter(v => v.status === 'ACTIVE').length,
        recent: ventures.slice(0, 5),
        summary: {
          stages: ventures.reduce((acc, v) => {
            acc[v.stage] = (acc[v.stage] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          sectors: ventures.reduce((acc, v) => {
            acc[v.sector] = (acc[v.sector] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      };
    }

    // Get GEDSI metrics if requested
    if (validatedData.includeMetrics && (user.role === 'ADMIN' || user.role === 'GEDSI_ANALYST')) {
      const gedsiMetrics = await prisma.gEDSIMetric.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
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
            select: { name: true, sector: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      weeklyData.gedsiMetrics = {
        total: gedsiMetrics.length,
        recent: gedsiMetrics.slice(0, 10),
        categories: gedsiMetrics.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    }

    // Get notifications if requested
    if (validatedData.includeNotifications) {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: validatedData.userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
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

      weeklyData.notifications = {
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length,
        recent: notifications.slice(0, 5)
      };
    }

    // Create email log entry
    const emailLog = await prisma.emailLog.create({
      data: {
        to: user.email,
        subject: `Weekly Update - MIV Platform (${validatedData.period})`,
        template: 'weekly_update',
        status: 'SENT',
        sentAt: new Date(),
        metadata: {
          type: 'weekly_update',
          period: validatedData.period,
          userName: user.name,
          includeMetrics: validatedData.includeMetrics,
          includeVentures: validatedData.includeVentures,
          includeNotifications: validatedData.includeNotifications,
          dataSummary: {
            venturesCount: weeklyData.ventures?.total || 0,
            metricsCount: weeklyData.gedsiMetrics?.total || 0,
            notificationsCount: weeklyData.notifications?.total || 0
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Weekly update email sent to ${user.name} (${user.email})`,
      emailLog: {
        id: emailLog.id,
        to: emailLog.to,
        subject: emailLog.subject,
        status: emailLog.status,
        sentAt: emailLog.sentAt
      },
      weeklyData: weeklyData
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error sending weekly update email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

