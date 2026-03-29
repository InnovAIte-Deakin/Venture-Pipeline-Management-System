import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updates
const updateCalendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  type: z.enum(['meeting', 'call', 'board_meeting', 'due_diligence', 'presentation', 'deadline', 'other']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  attendeeIds: z.array(z.string()).optional(),
  company: z.string().optional(),
  dealId: z.string().optional(),
  notes: z.string().optional(),
  isAllDay: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    interval: z.number().min(1).optional(),
    endDate: z.string().optional(),
    count: z.number().min(1).optional(),
  }).optional(),
});

// GET /api/calendar/events/[id] - Get single calendar event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const teamEvent = await prisma.teamEvent.findUnique({
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

    if (!teamEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Get extended metadata from activity records
    const metadata = await prisma.activity.findFirst({
      where: {
        title: 'Calendar Event Created',
        metadata: {
          path: ['eventId'],
          equals: id
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to calendar event format
    const calendarEvent = transformTeamEventToCalendar(teamEvent, metadata?.metadata);

    return NextResponse.json(calendarEvent);

  } catch (error) {
    console.error('Error fetching calendar event:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/calendar/events/[id] - Update calendar event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = updateCalendarEventSchema.parse(body);

    // Check if event exists
    const existingEvent = await prisma.teamEvent.findUnique({
      where: { id },
      include: {
        attendees: { select: { id: true } }
      }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Verify attendees exist if being updated
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

    // Prepare update data for TeamEvent
    const updateData: any = {};
    if (validatedData.title) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.startDate) updateData.date = new Date(validatedData.startDate);
    if (validatedData.startTime !== undefined) updateData.time = validatedData.startTime;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;
    if (validatedData.isAllDay !== undefined) updateData.isAllDay = validatedData.isAllDay;
    if (validatedData.isRecurring !== undefined) updateData.isRecurring = validatedData.isRecurring;
    if (validatedData.recurrence !== undefined) updateData.recurrence = validatedData.recurrence;

    // Handle attendee updates
    if (validatedData.attendeeIds !== undefined) {
      updateData.attendees = {
        set: validatedData.attendeeIds.map(id => ({ id }))
      };
    }

    // Update the team event
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

    // Update extended metadata in activity record
    const extendedMetadata = {
      type: validatedData.type,
      priority: validatedData.priority,
      status: validatedData.status,
      company: validatedData.company,
      dealId: validatedData.dealId,
      notes: validatedData.notes,
      endDate: validatedData.endDate,
      endTime: validatedData.endTime,
    };

    // Remove undefined values
    Object.keys(extendedMetadata).forEach(key => {
      if (extendedMetadata[key as keyof typeof extendedMetadata] === undefined) {
        delete extendedMetadata[key as keyof typeof extendedMetadata];
      }
    });

    if (Object.keys(extendedMetadata).length > 0) {
      // Create new activity record for the update
      await prisma.activity.create({
        data: {
          type: 'VENTURE_UPDATED',
          title: 'Calendar Event Updated',
          description: `Calendar event "${updatedEvent.title}" updated`,
          userId: existingEvent.organizerId,
          metadata: {
            eventId: updatedEvent.id,
            ...extendedMetadata,
          }
        }
      });
    }

    // Get the latest metadata
    const latestMetadata = await prisma.activity.findFirst({
      where: {
        OR: [
          {
            title: 'Calendar Event Created',
            metadata: { path: ['eventId'], equals: id }
          },
          {
            title: 'Calendar Event Updated',
            metadata: { path: ['eventId'], equals: id }
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to calendar event format
    const calendarEvent = transformTeamEventToCalendar(updatedEvent, latestMetadata?.metadata);

    return NextResponse.json(calendarEvent);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/calendar/events/[id] - Delete calendar event
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

    // Delete the team event (this will cascade to attendee relationships)
    await prisma.teamEvent.delete({
      where: { id }
    });

    // Create activity record for deletion
    await prisma.activity.create({
      data: {
        type: 'VENTURE_UPDATED',
        title: 'Calendar Event Deleted',
        description: `Calendar event "${existingEvent.title}" was deleted`,
        userId: existingEvent.organizerId,
        metadata: {
          eventId: existingEvent.id,
          eventTitle: existingEvent.title,
        }
      }
    });

    return NextResponse.json({ 
      message: 'Event deleted successfully',
      deletedEvent: {
        id: existingEvent.id,
        title: existingEvent.title,
      }
    });

  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to transform team events to calendar events
function transformTeamEventToCalendar(teamEvent: any, metadata?: any) {
  // Infer event type from title and description
  const title = teamEvent.title.toLowerCase();
  const desc = (teamEvent.description || '').toLowerCase();
  
  let type = metadata?.type || 'meeting';
  if (title.includes('board') || desc.includes('board')) type = 'board_meeting';
  else if (title.includes('due diligence') || desc.includes('due diligence')) type = 'due_diligence';
  else if (title.includes('call') || desc.includes('call')) type = 'call';
  else if (title.includes('presentation') || desc.includes('presentation')) type = 'presentation';
  else if (title.includes('deadline') || desc.includes('deadline')) type = 'deadline';

  // Infer priority from title and description
  let priority = metadata?.priority || 'medium';
  if (title.includes('urgent') || title.includes('critical') || desc.includes('urgent')) priority = 'high';
  else if (title.includes('low priority') || desc.includes('low priority')) priority = 'low';

  // Infer status based on date
  const eventDate = new Date(teamEvent.date);
  const now = new Date();
  let status = metadata?.status || 'scheduled';
  if (eventDate < now && status === 'scheduled') {
    status = 'completed'; // Past events are assumed completed unless specified otherwise
  }

  // Extract company name from title or description
  let company = metadata?.company;
  if (!company) {
    const companyMatch = teamEvent.title.match(/^([^-]+) -/);
    if (companyMatch) {
      company = companyMatch[1].trim();
    }
  }

  return {
    id: teamEvent.id,
    title: teamEvent.title,
    description: teamEvent.description || '',
    type,
    startDate: teamEvent.date.toISOString().split('T')[0],
    endDate: metadata?.endDate || teamEvent.date.toISOString().split('T')[0],
    startTime: teamEvent.time || '',
    endTime: metadata?.endTime || '',
    location: teamEvent.location || '',
    attendees: teamEvent.attendees?.map((a: any) => a.name) || [],
    organizer: teamEvent.organizer?.name || '',
    status,
    priority,
    company,
    dealId: metadata?.dealId,
    notes: metadata?.notes,
    lastUpdate: getRelativeTime(teamEvent.updatedAt),
    isAllDay: teamEvent.isAllDay,
    isRecurring: teamEvent.isRecurring,
    attendeeCount: teamEvent._count?.attendees || 0,
    organizerInfo: teamEvent.organizer,
    attendeeInfo: teamEvent.attendees || [],
  };
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}
