import { NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

export async function GET() {
  try {
    const configStatus = emailService.getConfigurationStatus()
    
    return NextResponse.json({
      success: true,
      configured: configStatus.configured,
      missing: configStatus.missing,
      message: configStatus.configured 
        ? 'SMTP email service is properly configured' 
        : `SMTP configuration incomplete. Missing: ${configStatus.missing.join(', ')}`,
    })
  } catch (error) {
    console.error('Failed to check email configuration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check email configuration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
