import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'
import { z } from 'zod'

const TestIntakeEmailSchema = z.object({
  founderEmail: z.string().email('Valid email address required'),
  founderName: z.string().min(1, 'Founder name required'),
  ventureName: z.string().min(1, 'Venture name required'),
  country: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = TestIntakeEmailSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { founderEmail, founderName, ventureName, country } = validation.data

    // send intake notification email
    const emailSent = await emailService.sendIntakeNotificationEmail({
      founderEmail,
      founderName,
      ventureName,
      country,
    })

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: `Intake notification email sent successfully to ${founderEmail}`,
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send intake notification email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test intake email endpoint error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}