import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const userId = searchParams.get('userId') || '';
    const type = searchParams.get('type') || '';
    const isRead = searchParams.get('isRead') || '';

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
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const validatedData = createNotificationSchema.parse(body);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    });

    if (!user) {
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
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
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

