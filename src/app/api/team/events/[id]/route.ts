import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  date: z.string().optional(), // ISO date string
  time: z.string().optional(),
  location: z.string().optional(),
  isAllDay: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    interval: z.number().min(1).optional(),
    endDate: z.string().optional(),
    count: z.number().min(1).optional(),
  }).optional(),
  attendeeIds: z.array(z.string()).optional(),
});

// GET /api/team/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const event = await prisma.teamEvent.findUnique({
      where: { id },
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

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/team/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = updateEventSchema.parse(body);

    // Check if event exists
    const existingEvent = await prisma.teamEvent.findUnique({
      where: { id },
      include: {
        attendees: {
          select: { id: true }
        }
      }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Verify all attendees exist if being updated
    if (validatedData.attendeeIds) {
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

    // Prepare update data
    const updateData: any = {
      title: validatedData.title,
      description: validatedData.description,
      date: validatedData.date ? new Date(validatedData.date) : undefined,
      time: validatedData.time,
      location: validatedData.location,
      isAllDay: validatedData.isAllDay,
      isRecurring: validatedData.isRecurring,
      recurrence: validatedData.recurrence,
    };

    // Handle attendee updates separately if provided
    if (validatedData.attendeeIds !== undefined) {
      // Set all attendees (replace existing)
      updateData.attendees = {
        set: validatedData.attendeeIds.map(id => ({ id }))
      };
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedEvent = await prisma.teamEvent.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedEvent);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if event exists
    const existingEvent = await prisma.teamEvent.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await prisma.teamEvent.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
