import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compactWhere, getPagination, pagination, relationId, requirePayloadUser, userSummary } from '../_lib/payload-api'

const typeMap: Record<string, string> = {
  WELCOME: 'welcome',
  VENTURE_CREATED: 'venture_created',
  VENTURE_UPDATED: 'venture_updated',
  GEDSI_ALERT: 'gedsi_alert',
  FUNDING_OPPORTUNITY: 'funding_opportunity',
  SYSTEM_UPDATE: 'system_update',
  REPORT_READY: 'report_ready',
  STG_REMINDER: 'stg_reminder',
  WEEKLY_UPDATE: 'weekly_update',
}

const notificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required').optional(),
  user: z.string().optional(),
  type: z.string().min(1, 'Type is required').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  message: z.string().min(1, 'Message is required').optional(),
  isRead: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
})

function normalizeNotification(notification: any) {
  return {
    ...notification,
    userId: relationId(notification.user),
    user: userSummary(notification.user),
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { page, limit, searchParams } = getPagination(request, 50)
    const userId = searchParams.get('userId') || ''
    const type = searchParams.get('type') || ''
    const isRead = searchParams.get('isRead') || ''

    const notifications = await auth.payload.find({
      collection: 'notifications',
      where: compactWhere([
        userId ? { user: { equals: userId } } : {},
        type ? { type: { equals: typeMap[type] || type } } : {},
        isRead !== '' ? { isRead: { equals: isRead === 'true' } } : {},
      ]),
      page,
      limit,
      sort: '-createdAt',
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json({
      notifications: notifications.docs.map(normalizeNotification),
      pagination: pagination(page, limit, notifications.totalDocs),
    })
  } catch (error) {
    console.error('Error fetching backend notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const data = notificationSchema
      .required({ type: true, title: true, message: true })
      .parse(await request.json())

    const notification = await auth.payload.create({
      collection: 'notifications',
      data: {
        user: data.userId || data.user || auth.user.id,
        type: typeMap[data.type || ''] || data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
        isRead: data.isRead,
      },
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json(normalizeNotification(notification), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error creating backend notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { id, ...body } = await request.json()
    if (!id) return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })

    const data = notificationSchema.partial().parse(body)
    const notification = await auth.payload.update({
      collection: 'notifications',
      id,
      data: {
        ...data,
        user: data.userId || data.user,
        type: data.type ? typeMap[data.type] || data.type : undefined,
      },
      depth: 1,
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json(normalizeNotification(notification))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }

    console.error('Error updating backend notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
