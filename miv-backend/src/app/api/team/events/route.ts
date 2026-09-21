import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compactWhere, getPagination, pagination, requirePayloadUser, textSearch } from '../../_lib/payload-api'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  location: z.string().optional(),
  isAllDay: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.record(z.any()).optional(),
  organizerId: z.string().optional(),
  organizer: z.string().optional(),
  attendeeIds: z.array(z.string()).optional(),
  attendees: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { page, limit, searchParams } = getPagination(request, 50)
    const search = searchParams.get('search') || ''
    const organizerId = searchParams.get('organizerId') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const dateRange =
      startDate || endDate
        ? {
            date: {
              ...(startDate ? { greater_than_equal: startDate } : {}),
              ...(endDate ? { less_than_equal: endDate } : {}),
            },
          }
        : {}

    const events = await auth.payload.find({
      collection: 'teamEvents',
      where: compactWhere([
        textSearch(['title', 'description', 'location'], search),
        organizerId ? { organizer: { equals: organizerId } } : {},
        dateRange,
      ]),
      page,
      limit,
      sort: 'date',
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json({
      events: events.docs,
      pagination: pagination(page, limit, events.totalDocs),
    })
  } catch (error) {
    console.error('Error fetching backend events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const data = eventSchema.parse(await request.json())
    const event = await auth.payload.create({
      collection: 'teamEvents',
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        isAllDay: data.isAllDay,
        isRecurring: data.isRecurring,
        recurrence: data.recurrence,
        organizer: data.organizerId || data.organizer || auth.user.id,
        attendees: data.attendeeIds || data.attendees,
      },
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating backend event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
