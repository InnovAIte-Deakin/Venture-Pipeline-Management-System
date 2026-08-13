import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Extended validation schemas for calendar events
const createCalendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['meeting', 'call', 'board_meeting', 'due_diligence', 'presentation', 'deadline', 'other']).default('meeting'),
  startDate: z.string().min(1, 'Start date is required'), // ISO date string
  endDate: z.string().optional(), // ISO date string, defaults to startDate
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
  organizerId: z.string().min(1, 'Organizer is required'),
  attendeeIds: z.array(z.string()).optional(),
  company: z.string().optional(), // Company/venture name
  dealId: z.string().optional(), // Related venture/deal ID
  notes: z.string().optional(),
  isAllDay: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurrence: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    interval: z.number().min(1).optional(),
    endDate: z.string().optional(),
    count: z.number().min(1).optional(),
  }).optional(),
});

const updateCalendarEventSchema = createCalendarEventSchema.partial();

// GET /api/calendar/events - Get all calendar events with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const priority = searchParams.get('priority') || '';
    const status = searchParams.get('status') || '';
    const organizerId = searchParams.get('organizerId') || '';
    const attendeeId = searchParams.get('attendeeId') || '';
    const company = searchParams.get('company') || '';
    const startDate = searchParams.get('startDate'); // Filter events from this date
    const endDate = searchParams.get('endDate'); // Filter events to this date
    const view = searchParams.get('view') || 'all'; // all, upcoming, past, today, this_week
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // First, let's get team events and transform them to calendar events
    const teamEventsWhere: any = {};
    
    if (search) {
      teamEventsWhere.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (organizerId) {
      teamEventsWhere.organizerId = organizerId;
    }
    
    if (attendeeId) {
      teamEventsWhere.attendees = {
        some: { id: attendeeId }
      };
    }

    // Date filtering based on view
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (view === 'today') {
      teamEventsWhere.date = {
        gte: new Date(todayStr),
        lt: new Date(new Date(todayStr).getTime() + 24 * 60 * 60 * 1000)
      };
    } else if (view === 'upcoming') {
      teamEventsWhere.date = { gte: today };
    } else if (view === 'past') {
      teamEventsWhere.date = { lt: today };
    } else if (view === 'this_week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      teamEventsWhere.date = {
        gte: weekStart,
        lt: weekEnd
      };
    } else if (startDate || endDate) {
      teamEventsWhere.date = {};
      if (startDate) {
        teamEventsWhere.date.gte = new Date(startDate);
      }
      if (endDate) {
        teamEventsWhere.date.lte = new Date(endDate);
      }
    }

    const [teamEvents, total] = await Promise.all([
      prisma.teamEvent.findMany({
        where: teamEventsWhere,
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
      prisma.teamEvent.count({ where: teamEventsWhere })
    ]);

    // Transform team events to calendar event format
    let calendarEvents = teamEvents.map(event => transformTeamEventToCalendar(event));

    // Apply additional filters that aren't in the database
    if (type && type !== 'all') {
      calendarEvents = calendarEvents.filter(e => e.type === type);
    }
    if (priority && priority !== 'all') {
      calendarEvents = calendarEvents.filter(e => e.priority === priority);
    }
    if (status && status !== 'all') {
      calendarEvents = calendarEvents.filter(e => e.status === status);
    }
    if (company) {
      calendarEvents = calendarEvents.filter(e => 
        e.company?.toLowerCase().includes(company.toLowerCase())
      );
    }

    // Calculate analytics
    const analytics = calculateEventAnalytics(calendarEvents);

    return NextResponse.json({
      events: calendarEvents,
      pagination: {
        page,
        limit,
        total: calendarEvents.length,
        pages: Math.ceil(calendarEvents.length / limit)
      },
      analytics
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/calendar/events - Create new calendar event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCalendarEventSchema.parse(body);

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

    // Create the event in TeamEvent table with extended metadata
    const event = await prisma.teamEvent.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.startDate),
        time: validatedData.startTime,
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

    // Store extended metadata in a separate activity record for tracking
    await prisma.activity.create({
      data: {
        type: 'VENTURE_UPDATED',
        title: 'Calendar Event Created',
        description: `Calendar event "${validatedData.title}" created`,
        userId: validatedData.organizerId,
        metadata: {
          eventId: event.id,
          eventType: validatedData.type,
          priority: validatedData.priority,
          status: validatedData.status,
          company: validatedData.company,
          dealId: validatedData.dealId,
          notes: validatedData.notes,
          endDate: validatedData.endDate,
          endTime: validatedData.endTime,
        }
      }
    });

    // Transform to calendar event format
    const calendarEvent = transformTeamEventToCalendar(event, {
      type: validatedData.type,
      priority: validatedData.priority,
      status: validatedData.status,
      company: validatedData.company,
      dealId: validatedData.dealId,
      notes: validatedData.notes,
      endDate: validatedData.endDate,
      endTime: validatedData.endTime,
    });

    return NextResponse.json(calendarEvent, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating calendar event:', error);
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

// Helper function to calculate event analytics
function calculateEventAnalytics(events: any[]) {
  const total = events.length;
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.startDate === today).length;
  
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const thisWeekEvents = events.filter(e => {
    const eventDate = new Date(e.startDate);
    return eventDate >= new Date() && eventDate <= weekFromNow;
  }).length;

  const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date()).length;
  const highPriorityEvents = events.filter(e => e.priority === 'high').length;

  // Group by type
  const byType = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  // Group by priority
  const byPriority = events.reduce((acc, event) => {
    acc[event.priority] = (acc[event.priority] || 0) + 1;
    return acc;
  }, {});

  // Group by status
  const byStatus = events.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    todayEvents,
    thisWeekEvents,
    upcomingEvents,
    highPriorityEvents,
    byType,
    byPriority,
    byStatus,
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
