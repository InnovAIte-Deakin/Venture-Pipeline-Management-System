/**
 * Email templates for different notification types
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const APP_NAME = 'Venture Pipeline Management System'

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Base email layout wrapper
 */
function wrapEmailTemplate(content: string, preheader: string = ''): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${APP_NAME}</title>
        ${preheader ? `<style>div.preheader { display: none; visibility: hidden; mso-hide: all; }</style>` : ''}
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
        ${preheader ? `<div class="preheader">${preheader}</div>` : ''}
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="margin: 0; color: #1f2937; font-size: 24px;">${APP_NAME}</h1>
          </div>

          <!-- Content -->
          <div style="margin-bottom: 30px;">
            ${content}
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #f0f0f0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666;">
            <p style="margin: 0 0 10px 0;">
              <a href="${APP_URL}/account/preferences" style="color: #3b82f6; text-decoration: none;">Manage notification preferences</a>
            </p>
            <p style="margin: 0;">
              © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

export const emailTemplates = {
  /**
   * Welcome email for new users
   */
  welcome: (userName: string): EmailTemplate => {
    const content = `
      <p>Hello ${userName},</p>
      <p>Welcome to ${APP_NAME}! We're excited to have you on board.</p>
      <p>You can now:</p>
      <ul style="margin: 15px 0;">
        <li>Create and manage venture submissions</li>
        <li>Track funding progress and milestones</li>
        <li>Access GEDSI metrics and analytics</li>
        <li>Collaborate with your team</li>
      </ul>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/dashboard" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
      </div>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `
    return {
      subject: `Welcome to ${APP_NAME}`,
      html: wrapEmailTemplate(content, 'Welcome to our platform'),
      text: `Welcome to ${APP_NAME}. Visit ${APP_URL}/dashboard to get started.`,
    }
  },

  /**
   * Venture created notification
   */
  ventureCreated: (
    userName: string,
    ventureTitle: string,
    ventureId: string
  ): EmailTemplate => {
    const content = `
      <p>Hello ${userName},</p>
      <p>Great news! Your venture <strong>${ventureTitle}</strong> has been successfully created and registered in our system.</p>
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">What's Next?</h3>
        <ol style="margin: 10px 0;">
          <li>Complete your venture details and documentation</li>
          <li>Submit GEDSI metrics and social impact data</li>
          <li>Set your STG (Sustainable Growth) goals</li>
          <li>Wait for our team's initial screening</li>
        </ol>
      </div>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/ventures/${ventureId}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Venture</a>
      </div>
    `
    return {
      subject: `Venture Created: ${ventureTitle}`,
      html: wrapEmailTemplate(content, `Venture ${ventureTitle} created`),
      text: `Your venture "${ventureTitle}" has been created. View it at: ${APP_URL}/ventures/${ventureId}`,
    }
  },

  /**
   * Venture updated notification
   */
  ventureUpdated: (
    userName: string,
    ventureTitle: string,
    changesSummary: string,
    ventureId: string
  ): EmailTemplate => {
    const content = `
      <p>Hello ${userName},</p>
      <p>Your venture <strong>${ventureTitle}</strong> has been updated.</p>
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Recent Changes</h3>
        <p style="margin: 0; white-space: pre-wrap;">${changesSummary}</p>
      </div>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/ventures/${ventureId}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Review Changes</a>
      </div>
    `
    return {
      subject: `Update: ${ventureTitle}`,
      html: wrapEmailTemplate(content, `Venture ${ventureTitle} updated`),
      text: `Your venture "${ventureTitle}" has been updated. View changes at: ${APP_URL}/ventures/${ventureId}`,
    }
  },

  /**
   * STG reminder notification
   */
  stgReminder: (
    userName: string,
    ventureTitle: string,
    stgGoals: Array<{ title: string; dueDate?: string }>,
    ventureId: string
  ): EmailTemplate => {
    const goalsHtml = stgGoals
      .map(
        goal => `
        <div style="margin: 10px 0; padding: 10px; border-left: 3px solid #f59e0b; background: #fef3c7;">
          <strong>${goal.title}</strong>
          ${goal.dueDate ? `<br><small>Due: ${goal.dueDate}</small>` : ''}
        </div>
      `
      )
      .join('')

    const content = `
      <p>Hello ${userName},</p>
      <p>This is a reminder about upcoming STG (Sustainable Growth) goals for <strong>${ventureTitle}</strong>.</p>
      <div style="margin: 20px 0;">
        ${goalsHtml}
      </div>
      <p>Please ensure these goals are on track and update their status in the system.</p>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/ventures/${ventureId}?tab=stg-goals" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Update STG Goals</a>
      </div>
    `
    return {
      subject: `STG Reminder: ${ventureTitle}`,
      html: wrapEmailTemplate(content, `STG reminder for ${ventureTitle}`),
      text: `STG reminder for "${ventureTitle}". View and update at: ${APP_URL}/ventures/${ventureId}?tab=stg-goals`,
    }
  },

  /**
   * GEDSI alert notification
   */
  gedsiAlert: (
    userName: string,
    ventureTitle: string,
    alertMessage: string,
    gedsiScore: number,
    ventureId: string
  ): EmailTemplate => {
    const content = `
      <p>Hello ${userName},</p>
      <p>We wanted to alert you about a GEDSI-related update for <strong>${ventureTitle}</strong>.</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <p style="margin: 0;">${alertMessage}</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Current GEDSI Score: <strong>${gedsiScore}%</strong></p>
      </div>
      <p>GEDSI (Gender Equality, Disability Inclusion, and Social Inclusion) metrics are crucial for social impact assessment.</p>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/ventures/${ventureId}?tab=gedsi" style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View GEDSI Details</a>
      </div>
    `
    return {
      subject: `GEDSI Alert: ${ventureTitle}`,
      html: wrapEmailTemplate(content, `GEDSI alert for ${ventureTitle}`),
      text: `GEDSI Alert for "${ventureTitle}": ${alertMessage}\nCurrent score: ${gedsiScore}%\nView details at: ${APP_URL}/ventures/${ventureId}?tab=gedsi`,
    }
  },

  /**
   * Funding opportunity notification
   */
  fundingOpportunity: (
    userName: string,
    opportunityTitle: string,
    opportunityDescription: string,
    deadline: string
  ): EmailTemplate => {
    const content = `
      <p>Hello ${userName},</p>
      <p>We found a new funding opportunity that might be a great fit for your ventures!</p>
      <div style="background: #dcfce7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #22c55e;">
        <h3 style="margin-top: 0; color: #15803d;">${opportunityTitle}</h3>
        <p style="margin: 10px 0;">${opportunityDescription}</p>
        <p style="margin: 10px 0; font-size: 14px;"><strong>Application Deadline:</strong> ${deadline}</p>
      </div>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/funding-opportunities" style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View All Opportunities</a>
      </div>
    `
    return {
      subject: `Funding Opportunity: ${opportunityTitle}`,
      html: wrapEmailTemplate(content, `New funding opportunity: ${opportunityTitle}`),
      text: `Funding Opportunity: ${opportunityTitle}\n${opportunityDescription}\nDeadline: ${deadline}\nView at: ${APP_URL}/funding-opportunities`,
    }
  },

  /**
   * Weekly update notification
   */
  weeklyUpdate: (
    userName: string,
    summary: {
      newVentures: number
      completedGoals: number
      activeVentures: number
      gedsiImprovement: number
      topPerformingVenture?: string
    }
  ): EmailTemplate => {
    const content = `
      <p>Hello ${userName},</p>
      <p>Here's your weekly summary from ${APP_NAME}:</p>
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #3b82f6;">
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${summary.newVentures}</div>
            <div style="color: #666; font-size: 14px;">New Ventures</div>
          </div>
          <div style="padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #10b981;">
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${summary.completedGoals}</div>
            <div style="color: #666; font-size: 14px;">Completed Goals</div>
          </div>
          <div style="padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #f59e0b;">
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${summary.activeVentures}</div>
            <div style="color: #666; font-size: 14px;">Active Ventures</div>
          </div>
          <div style="padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #8b5cf6;">
            <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">+${summary.gedsiImprovement}%</div>
            <div style="color: #666; font-size: 14px;">GEDSI Improvement</div>
          </div>
        </div>
      </div>
      ${summary.topPerformingVenture ? `<p><strong>Top Performing Venture:</strong> ${summary.topPerformingVenture}</p>` : ''}
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/dashboard" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Full Dashboard</a>
      </div>
    `
    return {
      subject: `Weekly Update - ${new Date().toLocaleDateString()}`,
      html: wrapEmailTemplate(content, 'Your weekly summary'),
      text: `Weekly Summary:\n- New Ventures: ${summary.newVentures}\n- Completed Goals: ${summary.completedGoals}\n- Active Ventures: ${summary.activeVentures}\n- GEDSI Improvement: +${summary.gedsiImprovement}%`,
    }
  },

  /**
   * Report ready notification
   */
  reportReady: (
    userName: string,
    reportTitle: string,
    reportType: string,
    reportId: string
  ): EmailTemplate => {
    const content = `
      <p>Hello ${userName},</p>
      <p>Your <strong>${reportTitle}</strong> report is now ready for download!</p>
      <div style="background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #0284c7;">
        <p style="margin: 0;"><strong>Report Type:</strong> ${reportType}</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #0c4a6e;">Generated: ${new Date().toLocaleString()}</p>
      </div>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/reports/${reportId}" style="background: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Report</a>
      </div>
    `
    return {
      subject: `Your Report is Ready: ${reportTitle}`,
      html: wrapEmailTemplate(content, `Report ${reportTitle} ready`),
      text: `Your report "${reportTitle}" is ready for download. View at: ${APP_URL}/reports/${reportId}`,
    }
  },

  /**
   * System update notification
   */
  systemUpdate: (
    updateTitle: string,
    updateDescription: string,
    affectedAreas: string[]
  ): EmailTemplate => {
    const areasHtml = affectedAreas
      .map(area => `<li>${area}</li>`)
      .join('')

    const content = `
      <p>Hello,</p>
      <p>${APP_NAME} has been updated with new features and improvements.</p>
      <div style="background: #f3e8ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #a855f7;">
        <h3 style="margin-top: 0; color: #6b21a8;">${updateTitle}</h3>
        <p style="margin: 10px 0;">${updateDescription}</p>
        <h4 style="margin: 15px 0 10px 0; color: #6b21a8;">Affected Areas:</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${areasHtml}
        </ul>
      </div>
      <div style="margin: 30px 0;">
        <a href="${APP_URL}/help/updates" style="background: #a855f7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Learn More</a>
      </div>
    `
    return {
      subject: `System Update: ${updateTitle}`,
      html: wrapEmailTemplate(content, `System update: ${updateTitle}`),
      text: `System Update: ${updateTitle}\n${updateDescription}\nAffected areas: ${affectedAreas.join(', ')}\nLearn more at: ${APP_URL}/help/updates`,
    }
  },
}

/**
 * Get template by notification type and data
 */
export function getEmailTemplate(
  type: string,
  data: Record<string, any>
): EmailTemplate | null {
  switch (type) {
    case 'WELCOME':
      return emailTemplates.welcome(data.userName)
    case 'VENTURE_CREATED':
      return emailTemplates.ventureCreated(
        data.userName,
        data.ventureTitle,
        data.ventureId
      )
    case 'VENTURE_UPDATED':
      return emailTemplates.ventureUpdated(
        data.userName,
        data.ventureTitle,
        data.changesSummary,
        data.ventureId
      )
    case 'STG_REMINDER':
      return emailTemplates.stgReminder(
        data.userName,
        data.ventureTitle,
        data.stgGoals,
        data.ventureId
      )
    case 'GEDSI_ALERT':
      return emailTemplates.gedsiAlert(
        data.userName,
        data.ventureTitle,
        data.alertMessage,
        data.gedsiScore,
        data.ventureId
      )
    case 'FUNDING_OPPORTUNITY':
      return emailTemplates.fundingOpportunity(
        data.userName,
        data.opportunityTitle,
        data.opportunityDescription,
        data.deadline
      )
    case 'WEEKLY_UPDATE':
      return emailTemplates.weeklyUpdate(data.userName, data.summary)
    case 'REPORT_READY':
      return emailTemplates.reportReady(
        data.userName,
        data.reportTitle,
        data.reportType,
        data.reportId
      )
    case 'SYSTEM_UPDATE':
      return emailTemplates.systemUpdate(
        data.updateTitle,
        data.updateDescription,
        data.affectedAreas
      )
    default:
      return null
  }
}
