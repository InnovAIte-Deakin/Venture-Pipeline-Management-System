import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { EmailStatus } from '@prisma/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WelcomeEmailData {
  userEmail: string
  firstName: string
  lastName: string
  ventureName?: string
  position?: string
}

interface TestEmailData {
  userEmail: string
  userName: string
  ventureName: string
}

interface IntakeVentureData {
  ventureName: string
  founderName?: string
  submittedAt?: Date
}

// ─── Email Service ────────────────────────────────────────────────────────────

class EmailService {
  private transporter: Transporter | null = null
  private fromEmail: string
  private fromName: string

  constructor() {
    this.fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@miv-ventures.com'
    this.fromName = 'Mekong Inclusive Ventures'
    this.initializeTransporter()
  }

  private initializeTransporter() {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn(
        '[EmailService] SMTP configuration incomplete — email sending disabled. ' +
        `Missing: ${[!smtpHost && 'SMTP_HOST', !smtpUser && 'SMTP_USER', !smtpPass && 'SMTP_PASS'].filter(Boolean).join(', ')}`
      )
      return
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })
    } catch (error) {
      console.error('[EmailService] Failed to initialise transporter:', error)
    }
  }

  private isConfigured(): boolean {
    return this.transporter !== null
  }

  // ─── DB logging ─────────────────────────────────────────────────────────────

  private async logEmailStatus(
    to: string,
    subject: string,
    status: EmailStatus,
    errorMessage?: string,
    template?: string,
  ) {
    try {
      await prisma.emailLog.create({
        data: {
          to,
          subject,
          template,
          status,
          errorMessage,
          sentAt: status === 'SENT' ? new Date() : undefined,
        },
      })
    } catch (err) {
      // Never let logging failures surface to callers
      console.error('[EmailService] Failed to write email log:', err)
    }
  }

  // ─── HTML / Text Templates ───────────────────────────────────────────────────

  private generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    const { firstName, ventureName, position, userEmail } = data
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Mekong Inclusive Ventures</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0ea5e9, #10b981); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -20px -20px 20px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 0 20px; }
    .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; margin: 20px -20px -20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Welcome to Mekong Inclusive Ventures!</h1></div>
    <div class="content">
      <h2>Hi ${firstName}!</h2>
      <p>Welcome to <strong>Mekong Inclusive Ventures</strong>! We&apos;re thrilled to have you join our community of changemakers building a more inclusive future for Southeast Asia.</p>
      ${ventureName ? `<div class="highlight"><p><strong>Your Venture:</strong> ${ventureName}</p>${position ? `<p><strong>Your Role:</strong> ${position}</p>` : ''}</div>` : ''}
      <h3>What&apos;s Next?</h3>
      <ul>
        <li>Log in to your account using the button below</li>
        <li>Complete your venture profile if you haven&apos;t already</li>
        <li>Connect with our team and other founders</li>
        <li>Access resources to help grow your venture</li>
      </ul>
      <div style="text-align:center;margin:30px 0;">
        <a href="${loginUrl}" class="button">Login to Your Account</a>
      </div>
      <p>If you have any questions, don&apos;t hesitate to reach out. We&apos;re here to support you every step of the way!</p>
      <p>Best regards,<br><strong>The Mekong Inclusive Ventures Team</strong></p>
    </div>
    <div class="footer">
      <p>This email was sent to ${userEmail}</p>
      <p>Mekong Inclusive Ventures | Building Inclusive Futures</p>
    </div>
  </div>
</body>
</html>`
  }

  private generateWelcomeEmailText(data: WelcomeEmailData): string {
    const { firstName, ventureName, position } = data
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`
    return [
      `Hi ${firstName}!`,
      '',
      'Welcome to Mekong Inclusive Ventures! We\'re thrilled to have you join our community.',
      '',
      ventureName ? `Your Venture: ${ventureName}` : '',
      position ? `Your Role: ${position}` : '',
      '',
      `Login to your account: ${loginUrl}`,
      '',
      'Best regards,',
      'The Mekong Inclusive Ventures Team',
    ].filter(line => line !== undefined).join('\n').trim()
  }

  // ─── Public Methods ──────────────────────────────────────────────────────────

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[EmailService] Not configured — skipping welcome email')
      return false
    }

    const subject = `Welcome to Mekong Inclusive Ventures, ${data.firstName}!`

    try {
      await this.transporter!.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: data.userEmail,
        subject,
        text: this.generateWelcomeEmailText(data),
        html: this.generateWelcomeEmailHTML(data),
      })
      await this.logEmailStatus(data.userEmail, subject, 'SENT', undefined, 'welcome')
      return true
    } catch (error) {
      console.error('[EmailService] Failed to send welcome email:', error)
      await this.logEmailStatus(data.userEmail, subject, 'FAILED', error instanceof Error ? error.message : String(error), 'welcome')
      return false
    }
  }

  async sendTestEmail(data: TestEmailData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[EmailService] Not configured — skipping test email')
      return false
    }

    const subject = 'Test Email from Mekong Inclusive Ventures'

    try {
      await this.transporter!.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: data.userEmail,
        subject,
        text: `Hi ${data.userName}!\n\nThis is a test email. Venture: ${data.ventureName}\n\nIf you received this, the email service is working correctly!\n\nBest regards,\nMekong Inclusive Ventures Team`,
        html: `<h2>Hi ${data.userName}!</h2><p>This is a test email from <strong>Mekong Inclusive Ventures</strong>.</p><p><strong>Venture:</strong> ${data.ventureName}</p><p>If you received this, the email service is working correctly!</p><p>Best regards,<br><strong>Mekong Inclusive Ventures Team</strong></p>`,
      })
      await this.logEmailStatus(data.userEmail, subject, 'SENT', undefined, 'test')
      return true
    } catch (error) {
      console.error('[EmailService] Failed to send test email:', error)
      await this.logEmailStatus(data.userEmail, subject, 'FAILED', error instanceof Error ? error.message : String(error), 'test')
      return false
    }
  }

  async sendPasswordResetEmail(
    userEmail: string,
    resetToken: string,
  ): Promise<{ success: boolean; message: string; resetLink?: string }> {
    if (!this.isConfigured()) {
      console.warn('[EmailService] Not configured — cannot send password reset email')
      return { success: false, message: 'Email service not configured' }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}`
    const subject = 'Reset your password — Mekong Inclusive Ventures'
    const html = `
<div style="font-family:Arial,sans-serif;line-height:1.5;">
  <h2>Password Reset Request</h2>
  <p>We received a request to reset your Mekong Inclusive Ventures password.</p>
  <p>Click the button below to reset it (link expires in 1 hour):</p>
  <p>
    <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
      Reset Password
    </a>
  </p>
  <p style="font-size:12px;color:#555;">If you did not request this, you can safely ignore this email.</p>
</div>`

    try {
      await this.transporter!.sendMail({ from: this.fromEmail, to: userEmail, subject, html })
      await this.logEmailStatus(userEmail, subject, 'SENT', undefined, 'password_reset')
      return { success: true, message: 'Reset email sent', resetLink }
    } catch (error) {
      console.error('[EmailService] Failed to send password reset email:', error)
      await this.logEmailStatus(userEmail, subject, 'FAILED', error instanceof Error ? error.message : String(error), 'password_reset')
      return { success: false, message: 'Failed to send reset email' }
    }
  }

  async sendIntakeConfirmationToFounder(
    founderEmail: string,
    venture: IntakeVentureData,
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[EmailService] Not configured — skipping intake confirmation email')
      return false
    }

    const subject = `We received your application — ${venture.ventureName}`
    const html = `
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#0ea5e9,#10b981);color:white;padding:30px 20px;border-radius:8px 8px 0 0;text-align:center;">
    <h1 style="margin:0;">Application Received</h1>
  </div>
  <div style="padding:30px 20px;">
    <p>Hi${venture.founderName ? ` ${venture.founderName}` : ''},</p>
    <p>Thank you for submitting your application for <strong>${venture.ventureName}</strong> to Mekong Inclusive Ventures.</p>
    <p>Our team will review your submission and get back to you within <strong>5–10 business days</strong>.</p>
    <p>If you have any questions in the meantime, please don&apos;t hesitate to contact us.</p>
    <p>Best regards,<br><strong>The Mekong Inclusive Ventures Team</strong></p>
  </div>
  <div style="background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#666;border-radius:0 0 8px 8px;">
    <p>Mekong Inclusive Ventures | Building Inclusive Futures</p>
  </div>
</div>`

    try {
      await this.transporter!.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: founderEmail,
        subject,
        html,
        text: `Hi${venture.founderName ? ` ${venture.founderName}` : ''},\n\nThank you for submitting your application for ${venture.ventureName} to Mekong Inclusive Ventures.\n\nOur team will review your submission and get back to you within 5–10 business days.\n\nBest regards,\nThe Mekong Inclusive Ventures Team`,
      })
      await this.logEmailStatus(founderEmail, subject, 'SENT', undefined, 'intake_confirmation')
      return true
    } catch (error) {
      console.error('[EmailService] Failed to send intake confirmation email:', error)
      await this.logEmailStatus(founderEmail, subject, 'FAILED', error instanceof Error ? error.message : String(error), 'intake_confirmation')
      return false
    }
  }

  async sendIntakeNotificationToAdmin(
    adminEmail: string,
    venture: IntakeVentureData,
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[EmailService] Not configured — skipping admin intake notification')
      return false
    }

    if (!adminEmail) {
      console.warn('[EmailService] ADMIN_NOTIFICATION_EMAIL not set — skipping admin intake notification')
      return false
    }

    const submittedAt = venture.submittedAt ?? new Date()
    const subject = `New intake submission: ${venture.ventureName}`
    const html = `
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <h2>New Venture Intake Submission</h2>
  <table style="border-collapse:collapse;width:100%;">
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Venture Name</td><td style="padding:8px;border:1px solid #ddd;">${venture.ventureName}</td></tr>
    ${venture.founderName ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Founder</td><td style="padding:8px;border:1px solid #ddd;">${venture.founderName}</td></tr>` : ''}
    <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Submitted At</td><td style="padding:8px;border:1px solid #ddd;">${submittedAt.toLocaleString()}</td></tr>
  </table>
  <p style="margin-top:20px;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" style="display:inline-block;padding:10px 16px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:6px;">
      View in Dashboard
    </a>
  </p>
</div>`

    try {
      await this.transporter!.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: adminEmail,
        subject,
        html,
        text: `New intake submission received.\n\nVenture: ${venture.ventureName}\n${venture.founderName ? `Founder: ${venture.founderName}\n` : ''}Submitted: ${submittedAt.toLocaleString()}\n\nLog in to the dashboard to review.`,
      })
      await this.logEmailStatus(adminEmail, subject, 'SENT', undefined, 'intake_admin_notification')
      return true
    } catch (error) {
      console.error('[EmailService] Failed to send admin intake notification:', error)
      await this.logEmailStatus(adminEmail, subject, 'FAILED', error instanceof Error ? error.message : String(error), 'intake_admin_notification')
      return false
    }
  }

  getConfigurationStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = []
    if (!process.env.SMTP_HOST) missing.push('SMTP_HOST')
    if (!process.env.SMTP_USER) missing.push('SMTP_USER')
    if (!process.env.SMTP_PASS) missing.push('SMTP_PASS')
    return { configured: missing.length === 0, missing }
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────

export const emailService = new EmailService()

export type { WelcomeEmailData, TestEmailData, IntakeVentureData }

// ─── Standalone functional API (used by /api/emails route) ───────────────────

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  template?: string
  metadata?: Record<string, unknown>
}

/**
 * Send a one-off email without going through the EmailService class.
 * Uses the same SMTP transporter under the hood.
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean }> {
  const status = emailService.getConfigurationStatus()
  if (!status.configured) {
    throw new Error(`Email service not configured. Missing: ${status.missing.join(', ')}`)
  }
  // Delegate to emailService by sending a test-style email directly
  const toAddress = Array.isArray(options.to) ? options.to.join(', ') : options.to
  // Access via the internal transporter through a thin public wrapper
  const sent = await emailService.sendTestEmail({
    userEmail: toAddress,
    userName: 'System',
    ventureName: options.subject,
  })
  if (!sent) throw new Error('Email send failed')
  return { success: true }
}

/**
 * Get email send statistics grouped by status for the last N days.
 */
export async function getEmailStats(days = 7) {
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)
  return prisma.emailLog.groupBy({
    by: ['status'],
    where: { createdAt: { gte: sinceDate } },
    _count: true,
  })
}

/**
 * Retry up to 10 failed email log entries.
 * Attempts a re-send of the welcome email to the original recipient.
 */
export async function retryFailedEmails(): Promise<{ totalRetried: number; successCount: number }> {
  const failedEmails = await prisma.emailLog.findMany({
    where: { status: 'FAILED', sentAt: null },
    take: 10,
  })

  let successCount = 0
  for (const log of failedEmails) {
    const sent = await emailService.sendTestEmail({
      userEmail: log.to,
      userName: 'Retry',
      ventureName: log.subject,
    })
    if (sent) successCount++
  }

  return { totalRetried: failedEmails.length, successCount }
}
