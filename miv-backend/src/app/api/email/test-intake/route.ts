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
    console.log('TEST INTAKE EMAIL API CALLED')
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

    // send Admin notification email
    const adminEmailSent = await emailService.sendAdminNotificationEmail({
        ventureName,
        founderName,
        founderEmail,
        country,
    })

    if (emailSent && adminEmailSent) {
      return NextResponse.json({
        success: true,
        message: `Intake notification email sent successfully to ${founderEmail} and admin notification email also sent successfully`,
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send intake notification email or admin notification email', founderEmailSent: emailSent, adminEmailSent: adminEmailSent },
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