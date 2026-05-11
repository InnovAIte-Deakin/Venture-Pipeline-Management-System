import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getEmailStats, retryFailedEmails } from '@/lib/email-service'

const emailPreferencesSchema = z.object({
  userId: z.string(),
  preferences: z.record(z.boolean())
})

/**
 * GET /api/emails - Get email statistics and logs
 * Query params:
 *   - action: 'stats' | 'logs' | 'test'
 *   - days: number (for stats, default 7)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'
    const days = parseInt(searchParams.get('days') || '7')

    switch (action) {
      case 'stats':
        const stats = await getEmailStats(days)
        return NextResponse.json({ stats, period: `${days} days` })

      case 'logs':
        const limit = parseInt(searchParams.get('limit') || '50')
        const page = parseInt(searchParams.get('page') || '1')
        const skip = (page - 1) * limit

        const [logs, total] = await Promise.all([
          prisma.emailLog.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.emailLog.count()
        ])

        return NextResponse.json({
          logs,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        })

      case 'retry-failed':
        if (process.env.NODE_ENV !== 'development') {
          return NextResponse.json(
            { error: 'Only available in development' },
            { status: 403 }
          )
        }
        const result = await retryFailedEmails()
        return NextResponse.json(result)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in email API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/emails - Send test email or manage preferences
 * Body:
 *   - action: 'test' | 'preferences'
 *   - email: string (for test emails)
 *   - userId: string (for preferences)
 *   - preferences: Record<string, boolean> (for preferences)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action || 'test'

    switch (action) {
      case 'test':
        return await handleTestEmail(body)

      case 'preferences':
        return await handlePreferences(body)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error in email POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleTestEmail(body: any) {
  const { email } = body

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }

  try {
    const { sendEmail } = await import('@/lib/email-service')

    await sendEmail({
      to: email,
      subject: 'Test Email - Venture Pipeline Management System',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Venture Pipeline Management System.</p>
        <p>If you received this email, your email configuration is working correctly!</p>
        <div style="margin-top: 30px; font-size: 12px; color: #666;">
          <p>Sent at: ${new Date().toLocaleString()}</p>
          <p>Provider: ${process.env.EMAIL_PROVIDER || 'nodemailer'}</p>
        </div>
      `,
      text: 'Test email from Venture Pipeline Management System',
      template: 'TEST'
    })

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`
    })
  } catch (error) {
    console.error('Failed to send test email:', error)
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function handlePreferences(body: any) {
  const { userId, preferences } = body

  if (!userId || !preferences) {
    return NextResponse.json(
      { error: 'userId and preferences are required' },
      { status: 400 }
    )
  }

  try {
    // Get current preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Merge with existing preferences
    const currentPrefs = user.notificationPreferences || {}
    const updatedPrefs = { ...currentPrefs, ...preferences }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { notificationPreferences: updatedPrefs },
      select: { notificationPreferences: true }
    })

    return NextResponse.json({
      success: true,
      preferences: updatedUser.notificationPreferences
    })
  } catch (error) {
    console.error('Failed to update preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
