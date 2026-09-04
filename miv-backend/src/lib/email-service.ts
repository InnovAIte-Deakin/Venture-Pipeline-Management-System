import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

interface WelcomeEmailData {
  userEmail: string
  firstName: string
  lastName: string
  ventureName?: string
  position?: string
}

// This interface defines the structure of the data required for a IntakeNotificationEmailData
interface IntakeNotificationEmailData {
  founderEmail: string
  founderName: string
  ventureName: string 
  country?: string
}

// This interface defines the structure of the data required for a AdminNotificationEmailData
interface AdminNotificationEmailData {
  ventureName: string
  founderName: string
  founderEmail: string
  country?: string
}

interface TestEmailData {
  userEmail: string
  userName: string
  ventureName: string
}

class EmailService {
  private transporter: Transporter | null = null
  private fromEmail: string
  private fromName: string

  constructor() {
    this.fromEmail = process.env.SMTP_FROM_EMAIL || process.env.EMAILJS_REPLY_TO || 'noreply@miv-ventures.com'
    this.fromName = 'Mekong Inclusive Ventures'
    this.initializeTransporter()
  }

  private initializeTransporter() {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('SMTP configuration missing. Email sending will be disabled.')
      console.log('Required environment variables:')
      console.log('- SMTP_HOST:', smtpHost ? 'SET' : 'MISSING')
      console.log('- SMTP_USER:', smtpUser ? 'SET' : 'MISSING')
      console.log('- SMTP_PASS:', smtpPass ? 'SET' : 'MISSING')
      return
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      console.log('Email service initialized successfully')
      console.log('- SMTP Host:', smtpHost)
      console.log('- SMTP Port:', smtpPort)
      console.log('- From Email:', this.fromEmail)
    } catch (error) {
      console.error('Failed to initialize email service:', error)
    }
  }

  private isConfigured(): boolean {
    return this.transporter !== null
  }

  private generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    const { firstName, lastName, ventureName, position } = data
    const loginUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/login`
      : 'http://localhost:3000/login'

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
        .header { background: linear-gradient(135deg, #0ea5e9, #10b981); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 0 20px; }
        .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .button:hover { background: #0284c7; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; margin: 20px -20px -20px -20px; }
        .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Mekong Inclusive Ventures!</h1>
        </div>
        
        <div class="content">
          <h2>Hi ${firstName}! 👋</h2>
          
          <p>Welcome to <strong>Mekong Inclusive Ventures</strong>! We're thrilled to have you join our community of changemakers who are building a more inclusive future for Southeast Asia.</p>
          
          ${ventureName ? `
          <div class="highlight">
            <p><strong>Your Venture:</strong> ${ventureName}</p>
            ${position ? `<p><strong>Your Role:</strong> ${position}</p>` : ''}
          </div>
          ` : ''}
          
          <h3>What's Next?</h3>
          <ul>
            <li>🔑 <strong>Login to your account</strong> using the button below</li>
            <li>📋 <strong>Complete your venture profile</strong> if you haven't already</li>
            <li>🤝 <strong>Connect with our team</strong> and other founders</li>
            <li>🚀 <strong>Access resources</strong> to help grow your venture</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" class="button">Login to Your Account</a>
          </div>
          
          <p>If you have any questions or need assistance, don't hesitate to reach out to our team. We're here to support you every step of the way!</p>
          
          <p>Best regards,<br>
          <strong>The Mekong Inclusive Ventures Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${data.userEmail}</p>
          <p>Mekong Inclusive Ventures | Building Inclusive Futures</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  private generateWelcomeEmailText(data: WelcomeEmailData): string {
    const { firstName, ventureName, position } = data
    const loginUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/login`
      : 'http://localhost:3000/login'

    return `
Hi ${firstName}!

Welcome to Mekong Inclusive Ventures! We're thrilled to have you join our community of changemakers who are building a more inclusive future for Southeast Asia.

${ventureName ? `Your Venture: ${ventureName}` : ''}
${position ? `Your Role: ${position}` : ''}

What's Next?
• Login to your account: ${loginUrl}
• Complete your venture profile if you haven't already
• Connect with our team and other founders
• Access resources to help grow your venture

If you have any questions or need assistance, don't hesitate to reach out to our team. We're here to support you every step of the way!

Best regards,
The Mekong Inclusive Ventures Team

---
This email was sent to ${data.userEmail}
Mekong Inclusive Ventures | Building Inclusive Futures
    `.trim()
  }

  // Intake notification email template: HTML and plain text
  private generateIntakeNotificationEmailHTML(data: IntakeNotificationEmailData): string {
    const { founderName, ventureName, country } = data

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Submission | Mekong Inclusive Ventures</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9, #10b981); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 0 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; margin: 20px -20px -20px -20px; }
        .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">

        <div class="header">
          <h1>Thank You for Your Venture Submission </h1>
        </div>

        <div class="content">
          <h2>Hi ${founderName},</h2>
          <p>Thank you for submitting your venture intake to <strong>Mekong Inclusive Ventures</strong>.
          We're pleased to let you know that we've successfully received your submission and it has been forwarded to our team for review.
          </p>

          <div class="highlight">
            <p><strong>Venture Name:</strong> ${ventureName}</p>
            ${country ? `<p><strong>Country:</strong> ${country}</p>` : ''}
          </div>
          <p> Our team will carefully review the information you've provided. If any additional details are required, or when there is an update regarding your application, we'll be in touch via email. </p>
          <p> Best regards,<br>
          <strong>The Mekong Inclusive Ventures Team</strong></p>
        </div>

        <div class="footer">
          <p>This email was sent to ${data.founderEmail}</p>
          <p>Mekong Inclusive Ventures | Building Inclusive Futures</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  private generateIntakeNotificationEmailText(data: IntakeNotificationEmailData): string {
    const { founderName, ventureName, country } = data
    
    return `

Hi ${founderName},

Thank you for submitting your venture intake to Mekong Inclusive Ventures. We have successfully received your submission, and it has been forwarded to our team for review.

Venture: ${ventureName}
${country ? `Country: ${country}` : ''}

Our team will carefully review the information you have provided. If any additional details are required, or when there is an update regarding your application, we will be in touch via email.
Best regards,
The Mekong Inclusive Ventures Team

---
This email was sent to ${data.founderEmail}
Mekong Inclusive Ventures | Building Inclusive Futures
    `.trim()
  }

  // Admin notification email template: HTML and plain text
  private generateAdminNotificationHTML(data: AdminNotificationEmailData): string {
    const { ventureName, founderName, founderEmail, country } = data

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Venture Intake Submitted | Mekong Inclusive Ventures</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9, #10b981); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }
        .header h1 { margin: 0; font-size: 26px; }
        .content { padding: 0 20px; }
        .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; margin: 20px -20px -20px -20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Intake Submitted</h1>
        </div>
        <div class="content">
          <h2>A new venture intake needs review</h2>
          <div class="highlight">
            <p><strong>Venture:</strong> ${ventureName}</p>
            <p><strong>Founder:</strong> ${founderName} (${founderEmail})</p>
            ${country ? `<p><strong>Country:</strong> ${country}</p>` : ''}
          </div>
          <p>Please log in to review this submission at your earliest convenience.</p>
          <p>Best regards,<br>
          <strong>VPMS System</strong></p>
        </div>
        <div class="footer">
          <p>Mekong Inclusive Ventures | Building Inclusive Futures</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  private generateAdminNotificationText(data: AdminNotificationEmailData): string {
    const { ventureName, founderName, founderEmail, country } = data
    return `
A new venture intake needs review

Venture: ${ventureName}
Founder: ${founderName} (${founderEmail})
${country ? `Country: ${country}` : ''}

Please log in to review this submission at your earliest convenience.

Best regards,
VPMS System

---
Mekong Inclusive Ventures | Building Inclusive Futures
    `.trim()
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email service not configured - skipping welcome email')
      return false
    }

    try {
      console.log(`Sending welcome email to ${data.userEmail}`)

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: data.userEmail,
        subject: `Welcome to Mekong Inclusive Ventures, ${data.firstName}!`,
        text: this.generateWelcomeEmailText(data),
        html: this.generateWelcomeEmailHTML(data),
      }

      const result = await this.transporter!.sendMail(mailOptions)
      console.log('Welcome email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      return false
    }
  }

  // Intake notification email sending method
  async sendIntakeNotificationEmail(data: IntakeNotificationEmailData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email service not configured...skipping intake notification email')
      return false
    }

    try {
      console.log(`Sending intake notification email to ${data.founderEmail}`)

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: data.founderEmail,
        subject: `Successful Submission, ${data.founderName}!`,
        text: this.generateIntakeNotificationEmailText(data),
        html: this.generateIntakeNotificationEmailHTML(data),
      }

      const result = await this.transporter!.sendMail(mailOptions)
      console.log('Intake notification email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('Failed to send intake notification email:', error)
      return false
    }
  }

  // Admin notification email sending method
   async sendAdminNotificationEmail(data: AdminNotificationEmailData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email service not configured...skipping admin notification email')
      return false
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
    if (!adminEmail) {
      console.warn('ADMIN_NOTIFICATION_EMAIL not set...skipping admin notification email')
      return false
    }

    try {
      console.log(`Sending admin notification email to ${adminEmail}`)

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: adminEmail,
        subject: `New Intake Submitted, ${data.ventureName}`,
        text: this.generateAdminNotificationText(data),
        html: this.generateAdminNotificationHTML(data),
      }

      const result = await this.transporter!.sendMail(mailOptions)
      console.log('Admin notification email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('Failed to send admin notification email:', error)
      return false
    }
  }

  async sendTestEmail(data: TestEmailData): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email service not configured - skipping test email')
      return false
    }

    try {
      console.log(`Sending test email to ${data.userEmail}`)

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: data.userEmail,
        subject: 'Test Email from Mekong Inclusive Ventures',
        text: `Hi ${data.userName}!\n\nThis is a test email from Mekong Inclusive Ventures.\n\nVenture: ${data.ventureName}\n\nIf you received this email, the email service is working correctly!\n\nBest regards,\nMekong Inclusive Ventures Team`,
        html: `
          <h2>Hi ${data.userName}!</h2>
          <p>This is a test email from <strong>Mekong Inclusive Ventures</strong>.</p>
          <p><strong>Venture:</strong> ${data.ventureName}</p>
          <p>If you received this email, the email service is working correctly! ✅</p>
          <p>Best regards,<br><strong>Mekong Inclusive Ventures Team</strong></p>
        `,
      }

      const result = await this.transporter!.sendMail(mailOptions)
      console.log('Test email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('Failed to send test email:', error)
      return false
    }
  }

  async sendPasswordResetEmail(userEmail: string, resetToken: string) {
  if (!this.isConfigured()) {
    console.log("SMTP not configured, cannot send reset email.");
    console.log("Reset token:", resetToken);
    return { success: false, message: "Email service not configured" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}`;

  const subject = "Reset your password";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password.</p>
      <p>Click the button below to reset it:</p>
      <p>
        <a href="${resetLink}"
           style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 12px; color: #555;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `;

  try {
    await this.transporter!.sendMail({
      from: this.fromEmail,
      to: userEmail,
      subject,
      html,
    });

    console.log("✅ Password reset email sent to:", userEmail);
    return { success: true, message: "Reset email sent", resetLink };
  } catch (error) {
    console.error("❌ Failed to send reset email:", error);
    return { success: false, message: "Failed to send reset email" };
  }
}


  getConfigurationStatus(): { configured: boolean; missing: string[] } {
    const missing: string[] = []
    
    if (!process.env.SMTP_HOST) missing.push('SMTP_HOST')
    if (!process.env.SMTP_USER) missing.push('SMTP_USER')
    if (!process.env.SMTP_PASS) missing.push('SMTP_PASS')

    return {
      configured: missing.length === 0,
      missing
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export types
export type { WelcomeEmailData, IntakeNotificationEmailData, AdminNotificationEmailData, TestEmailData }
