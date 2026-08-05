import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/calendar/analytics - Get calendar analytics and insights
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const organizerId = searchParams.get('organizerId');

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Base where clause
    const baseWhere: any = {};
    if (organizerId && organizerId !== 'all') {
      baseWhere.organizerId = organizerId;
    }

    // Get all team events for analysis
    const allEvents = await prisma.teamEvent.findMany({
      where: baseWhere,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            role: true,
          }
        },
        attendees: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            attendees: true,
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    // Transform events to calendar format for analysis
    const calendarEvents = allEvents.map(event => transformTeamEventToCalendar(event));

    // Calculate current period metrics
    const recentEvents = allEvents.filter(event => 
      new Date(event.date) >= startDate
    );

    // Calculate previous period for comparison
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays);
    
    const previousPeriodEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= previousPeriodStart && eventDate < startDate;
    });

    // Current date calculations
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 7);

    // Calculate metrics
    const totalEvents = calendarEvents.length;
    const todayEvents = calendarEvents.filter(e => e.startDate === todayStr).length;
    const upcomingEvents = calendarEvents.filter(e => new Date(e.startDate) >= today).length;
    const thisWeekEvents = calendarEvents.filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate >= thisWeekStart && eventDate < thisWeekEnd;
    }).length;
    const highPriorityEvents = calendarEvents.filter(e => e.priority === 'high').length;

    // Growth calculations
    const growthRate = previousPeriodEvents.length > 0 
      ? ((recentEvents.length - previousPeriodEvents.length) / previousPeriodEvents.length) * 100 
      : recentEvents.length > 0 ? 100 : 0;

    // Event type distribution
    const typeDistribution = calendarEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority distribution
    const priorityDistribution = calendarEvents.reduce((acc, event) => {
      acc[event.priority] = (acc[event.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status distribution
    const statusDistribution = calendarEvents.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Time-based analysis
    const eventsByDay = getEventTrends(calendarEvents, periodDays);
    const busyDays = getBusiestDays(calendarEvents);
    const upcomingDeadlines = getUpcomingDeadlines(calendarEvents);

    // Organizer analysis
    const organizerStats = getOrganizerStats(allEvents);
    
    // Meeting efficiency metrics
    const avgAttendeesPerEvent = totalEvents > 0 
      ? allEvents.reduce((sum, event) => sum + (event._count?.attendees || 0), 0) / totalEvents 
      : 0;

    const meetingTypes = ['meeting', 'call', 'board_meeting', 'due_diligence'];
    const meetingEvents = calendarEvents.filter(e => meetingTypes.includes(e.type));
    const avgMeetingsPerWeek = meetingEvents.length > 0 
      ? (meetingEvents.length / Math.max(periodDays / 7, 1)) 
      : 0;

    return NextResponse.json({
      summary: {
        totalEvents,
        todayEvents,
        thisWeekEvents,
        upcomingEvents,
        highPriorityEvents,
        growthRate: Math.round(growthRate * 100) / 100,
        avgAttendeesPerEvent: Math.round(avgAttendeesPerEvent * 10) / 10,
        avgMeetingsPerWeek: Math.round(avgMeetingsPerWeek * 10) / 10,
      },
      distributions: {
        byType: Object.entries(typeDistribution).map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalEvents) * 100 * 10) / 10
        })),
        byPriority: Object.entries(priorityDistribution).map(([priority, count]) => ({
          priority,
          count,
          percentage: Math.round((count / totalEvents) * 100 * 10) / 10
        })),
        byStatus: Object.entries(statusDistribution).map(([status, count]) => ({
          status,
          count,
          percentage: Math.round((count / totalEvents) * 100 * 10) / 10
        }))
      },
      trends: {
        eventsByDay,
        busyDays,
        upcomingDeadlines: upcomingDeadlines.slice(0, 5),
      },
      insights: {
        organizerStats: organizerStats.slice(0, 5),
        mostCommonType: Object.entries(typeDistribution).reduce((max, [type, count]) => 
          count > (max[1] || 0) ? [type, count] : max, ['meeting', 0])[0],
        busiestDay: busyDays[0]?.day || 'Monday',
        upcomingHighPriority: calendarEvents.filter(e => 
          e.priority === 'high' && new Date(e.startDate) >= today
        ).length,
        overdueEvents: calendarEvents.filter(e => 
          new Date(e.startDate) < today && e.status === 'scheduled'
        ).length,
      },
      period: {
        days: periodDays,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching calendar analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper functions
function transformTeamEventToCalendar(teamEvent: any) {
  const title = teamEvent.title.toLowerCase();
  const desc = (teamEvent.description || '').toLowerCase();
  
  let type = 'meeting';
  if (title.includes('board') || desc.includes('board')) type = 'board_meeting';
  else if (title.includes('due diligence') || desc.includes('due diligence')) type = 'due_diligence';
  else if (title.includes('call') || desc.includes('call')) type = 'call';
  else if (title.includes('presentation') || desc.includes('presentation')) type = 'presentation';
  else if (title.includes('deadline') || desc.includes('deadline')) type = 'deadline';

  let priority = 'medium';
  if (title.includes('urgent') || title.includes('critical') || desc.includes('urgent')) priority = 'high';
  else if (title.includes('low priority') || desc.includes('low priority')) priority = 'low';

  const eventDate = new Date(teamEvent.date);
  const now = new Date();
  let status = 'scheduled';
  if (eventDate < now) status = 'completed';

  let company;
  const companyMatch = teamEvent.title.match(/^([^-]+) -/);
  if (companyMatch) {
    company = companyMatch[1].trim();
  }

  return {
    id: teamEvent.id,
    title: teamEvent.title,
    description: teamEvent.description || '',
    type,
    startDate: teamEvent.date.toISOString().split('T')[0],
    endDate: teamEvent.date.toISOString().split('T')[0],
    startTime: teamEvent.time || '',
    endTime: '',
    location: teamEvent.location || '',
    attendees: teamEvent.attendees?.map((a: any) => a.name) || [],
    organizer: teamEvent.organizer?.name || '',
    status,
    priority,
    company,
    attendeeCount: teamEvent._count?.attendees || 0,
  };
}

function getEventTrends(events: any[], days: number) {
  const trends = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayEvents = events.filter(event => event.startDate === dateStr);
    
    trends.push({
      date: dateStr,
      count: dayEvents.length,
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      highPriority: dayEvents.filter(e => e.priority === 'high').length,
      meetings: dayEvents.filter(e => ['meeting', 'call', 'board_meeting'].includes(e.type)).length,
    });
  }

  return trends;
}

function getBusiestDays(events: any[]) {
  const dayCount = events.reduce((acc, event) => {
    const date = new Date(event.startDate);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(dayCount)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => b.count - a.count);
}

function getUpcomingDeadlines(events: any[]) {
  const today = new Date();
  const deadlines = events
    .filter(event => 
      event.type === 'deadline' && 
      new Date(event.startDate) >= today &&
      event.status !== 'completed'
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return deadlines.map(deadline => ({
    ...deadline,
    daysUntil: Math.ceil((new Date(deadline.startDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }));
}

function getOrganizerStats(events: any[]) {
  const organizerCount = events.reduce((acc, event) => {
    const organizer = event.organizer?.name || 'Unknown';
    if (!acc[organizer]) {
      acc[organizer] = {
        name: organizer,
        role: event.organizer?.role || 'Unknown',
        eventsOrganized: 0,
        totalAttendees: 0,
      };
    }
    acc[organizer].eventsOrganized++;
    acc[organizer].totalAttendees += event._count?.attendees || 0;
    return acc;
  }, {} as Record<string, any>);

  return Object.values(organizerCount)
    .sort((a: any, b: any) => b.eventsOrganized - a.eventsOrganized);
}
