import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { EmailStatus } from '@prisma/client'

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'nodemailer'

let emailTransporter: nodemailer.Transporter | null = null

/**
 * Get or create email transporter for nodemailer
 */
function getEmailTransporter() {
  if (emailTransporter) return emailTransporter

  if (EMAIL_PROVIDER === 'mailersend') {
    return null // MailerSend doesn't need a transporter
  }

  // Default to nodemailer with environment variables
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  return emailTransporter
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  template?: string
  metadata?: Record<string, any>
}

/**
 * Send email using configured provider
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.EMAIL_FROM || 'noreply@venturepipeline.com',
  template,
  metadata,
}: SendEmailOptions) {
  const toArray = Array.isArray(to) ? to : [to]

  try {
    if (EMAIL_PROVIDER === 'mailersend') {
      const { MailerSend, Recipient } = await import('mailersend')
      const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY!,
      })

      await mailerSend.email.send({
        from: { email: from },
        to: toArray.map(email => ({ email })),
        subject,
        html,
        text,
      })
    } else {
      // Use nodemailer
      const transporter = getEmailTransporter()
      if (!transporter) {
        throw new Error('Email transporter not configured')
      }

      await transporter.sendMail({
        from,
        to: toArray.join(', '),
        subject,
        html,
        text,
      })
    }

    // Log successful email
    await logEmailStatus({
      to: toArray[0],
      subject,
      template,
      status: 'SENT',
      metadata,
    })

    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)

    // Log failed email
    await logEmailStatus({
      to: toArray[0],
      subject,
      template,
      status: 'FAILED',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      metadata,
    })

    throw error
  }
}

/**
 * Log email status to database
 */
async function logEmailStatus({
  to,
  subject,
  template,
  status,
  errorMessage,
  metadata,
}: {
  to: string
  subject: string
  template?: string
  status: EmailStatus
  errorMessage?: string
  metadata?: Record<string, any>
}) {
  try {
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        template,
        status,
        errorMessage,
        metadata,
        sentAt: status === 'SENT' ? new Date() : undefined,
      },
    })
  } catch (error) {
    console.error('Failed to log email status:', error)
  }
}

/**
 * Send email and create notification
 */
export async function sendEmailNotification({
  userId,
  email,
  subject,
  html,
  text,
  notificationType,
  notificationTitle,
  notificationMessage,
  metadata,
  template,
}: {
  userId: string
  email: string
  subject: string
  html: string
  text?: string
  notificationType: string
  notificationTitle: string
  notificationMessage: string
  metadata?: Record<string, any>
  template?: string
}) {
  try {
    // Send email
    await sendEmail({
      to: email,
      subject,
      html,
      text,
      template,
      metadata,
    })

    // Create notification record
    await prisma.notification.create({
      data: {
        userId,
        type: notificationType as any,
        title: notificationTitle,
        message: notificationMessage,
        metadata,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send email notification:', error)
    throw error
  }
}

/**
 * Get email statistics
 */
export async function getEmailStats(days: number = 7) {
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)

  const stats = await prisma.emailLog.groupBy({
    by: ['status'],
    where: {
      createdAt: {
        gte: sinceDate,
      },
    },
    _count: true,
  })

  return stats
}

/**
 * Retry failed emails
 */
export async function retryFailedEmails() {
  const failedEmails = await prisma.emailLog.findMany({
    where: {
      status: 'FAILED',
      sentAt: null,
    },
    take: 10, // Retry up to 10 at a time
  })

  let successCount = 0

  for (const emailLog of failedEmails) {
    try {
      await sendEmail({
        to: emailLog.to,
        subject: emailLog.subject,
        html: emailLog.metadata?.html || '',
        template: emailLog.template,
      })
      successCount++
    } catch (error) {
      console.error(`Failed to retry email to ${emailLog.to}:`, error)
    }
  }

  return { totalRetried: failedEmails.length, successCount }
}
