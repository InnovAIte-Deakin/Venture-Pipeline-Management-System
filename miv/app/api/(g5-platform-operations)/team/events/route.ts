import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'), // ISO date string
  time: z.string().optional(),
  location: z.string().optional(),
  isAllDay: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurrence: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    interval: z.number().min(1).optional(),
    endDate: z.string().optional(),
    count: z.number().min(1).optional(),
  }).optional(),
  organizerId: z.string().min(1, 'Organizer is required'),
  attendeeIds: z.array(z.string()).optional(),
});

const updateEventSchema = createEventSchema.partial();

// GET /api/team/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const organizerId = searchParams.get('organizerId') || '';
    const attendeeId = searchParams.get('attendeeId') || '';
    const startDate = searchParams.get('startDate'); // Filter events from this date
    const endDate = searchParams.get('endDate'); // Filter events to this date
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (organizerId) {
      where.organizerId = organizerId;
    }
    
    if (attendeeId) {
      where.attendees = {
        some: {
          id: attendeeId
        }
      };
    }

    // Date range filtering
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const [events, total] = await Promise.all([
      prisma.teamEvent.findMany({
        where,
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            }
          },
          attendees: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            }
          },
          _count: {
            select: {
              attendees: true,
            }
          }
        },
        orderBy: { date: 'asc' },
        skip,
        take: limit
      }),
      prisma.teamEvent.count({ where })
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/team/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    // Verify organizer exists
    const organizer = await prisma.user.findUnique({
      where: { id: validatedData.organizerId }
    });

    if (!organizer) {
      return NextResponse.json(
        { error: 'Organizer not found' },
        { status: 400 }
      );
    }

    // Verify all attendees exist
    if (validatedData.attendeeIds && validatedData.attendeeIds.length > 0) {
      const attendees = await prisma.user.findMany({
        where: { id: { in: validatedData.attendeeIds } }
      });

      if (attendees.length !== validatedData.attendeeIds.length) {
        return NextResponse.json(
          { error: 'One or more attendees not found' },
          { status: 400 }
        );
      }
    }

    const event = await prisma.teamEvent.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        time: validatedData.time,
        location: validatedData.location,
        isAllDay: validatedData.isAllDay,
        isRecurring: validatedData.isRecurring,
        recurrence: validatedData.recurrence || null,
        organizerId: validatedData.organizerId,
        attendees: validatedData.attendeeIds ? {
          connect: validatedData.attendeeIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          }
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          }
        },
        _count: {
          select: {
            attendees: true,
          }
        }
      }
    });

    return NextResponse.json(event, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
