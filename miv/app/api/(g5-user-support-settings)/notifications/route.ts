import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { mapRole } from '@/lib/utils';

// Validation schema for notifications
const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['WELCOME', 'VENTURE_CREATED', 'VENTURE_UPDATED', 'GEDSI_ALERT', 'FUNDING_OPPORTUNITY', 'SYSTEM_UPDATE', 'REPORT_READY', 'STG_REMINDER', 'WEEKLY_UPDATE']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  metadata: z.record(z.any()).optional(),
});

const updateNotificationSchema = createNotificationSchema.partial().extend({
  isRead: z.boolean().optional(),
});

// GET /api/notifications - List notifications with filtering
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const role = mapRole(user.role);
    const isStaff = ['admin', 'miv_analyst'].includes(role);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    let userId = searchParams.get('userId') || '';
    const type = searchParams.get('type') || '';
    const isRead = searchParams.get('isRead') || '';

    // Non-staff can ONLY see their own notifications
    if (!isStaff) {
      userId = user.id;
      if (!userId) {
        return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
      }
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (isRead !== '') where.isRead = isRead === 'true';

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where })
    ]);

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const role = mapRole(user.role);
    const isStaff = ['admin', 'miv_analyst'].includes(role);
    if (!isStaff) {
      return NextResponse.json({ success: false, error: 'FORBIDDEN' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createNotificationSchema.parse(body);

    // Verify user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: validatedData,
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      }
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - Update notification (mark as read, etc.)
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Check if notification exists
    const existingNotification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!existingNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const role = mapRole(user.role);
    const isStaff = ['admin', 'miv_analyst'].includes(role);
    
    // Non-staff can only update their own notifications
    if (!isStaff && existingNotification.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'FORBIDDEN' }, { status: 403 });
    }

    const validatedData = updateNotificationSchema.parse(updateData);

    // Update notification
    const notification = await prisma.notification.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

