import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for email logs
const createEmailLogSchema = z.object({
  to: z.string().email('Valid email address is required'),
  subject: z.string().min(1, 'Subject is required'),
  template: z.string().min(1, 'Template is required'),
  status: z.enum(['PENDING', 'SENT', 'FAILED', 'DELIVERED', 'BOUNCED', 'OPENED', 'CLICKED']).default('PENDING'),
  metadata: z.record(z.any()).optional(),
});

const updateEmailLogSchema = createEmailLogSchema.partial().extend({
  status: z.enum(['PENDING', 'SENT', 'FAILED', 'DELIVERED', 'BOUNCED', 'OPENED', 'CLICKED']).optional(),
  errorMessage: z.string().optional(),
  sentAt: z.string().datetime().optional(),
  deliveredAt: z.string().datetime().optional(),
});

// GET /api/emails/logs - List email logs with filtering
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
    const to = searchParams.get('to') || '';
    const status = searchParams.get('status') || '';
    const template = searchParams.get('template') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (to) where.to = { contains: to };
    if (status) where.status = status;
    if (template) where.template = template;

    const [emailLogs, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.emailLog.count({ where })
    ]);

    return NextResponse.json({
      emailLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/emails/logs - Create new email log
export async function POST(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const validatedData = createEmailLogSchema.parse(body);

    // Create email log
    const emailLog = await prisma.emailLog.create({
      data: validatedData,
    });

    return NextResponse.json(emailLog, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating email log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/emails/logs - Update email log (status, delivery info, etc.)
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
        { error: 'Email log ID is required' },
        { status: 400 }
      );
    }

    const validatedData = updateEmailLogSchema.parse(updateData);

    // Update email log
    const emailLog = await prisma.emailLog.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(emailLog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating email log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
