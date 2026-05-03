import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'
import { z } from 'zod'

const TestWelcomeEmailSchema = z.object({
  email: z.string().email('Valid email address required'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  ventureName: z.string().optional(),
  position: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = TestWelcomeEmailSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 }
      )
    }

    const { email, firstName, lastName, ventureName, position } = validation.data

    // Check if email service is configured
    const configStatus = emailService.getConfigurationStatus()
    if (!configStatus.configured) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured',
          missing: configStatus.missing,
          message: `Cannot send welcome email. Missing configuration: ${configStatus.missing.join(', ')}`,
        },
        { status: 422 }
      )
    }

    // Send welcome email
    const emailSent = await emailService.sendWelcomeEmail({
      userEmail: email,
      firstName,
      lastName,
      ventureName,
      position,
    })
    
    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: `Welcome email sent successfully to ${email}`,
        timestamp: new Date().toISOString(),
        recipient: {
          email,
          name: `${firstName} ${lastName}`,
          venture: ventureName || 'N/A',
          position: position || 'N/A',
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send welcome email',
          message: 'Email sending failed. Check server logs for details.',
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Test welcome email endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
