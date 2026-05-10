import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Get first user as creator
    const users = await prisma.user.findMany({ take: 1 })
    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found to assign as workflow creator' }, { status: 400 })
    }
    const createdById = users[0].id

    // Sample workflows
    const sampleWorkflows = [
      {
        name: "Venture Onboarding Automation",
        description: "Automatically guide new ventures through intake, screening, and initial assessment process",
        definition: {
          trigger: { type: "venture_created" },
          steps: [
            { type: "send_email", config: { to: "{{venture.contactEmail}}", subject: "Welcome to MIV - Next Steps", body: "Thank you for your interest in Mekong Inclusive Ventures..." } },
            { type: "create_notification", config: { title: "New Venture Requires Review", message: "{{venture.name}} has been submitted and needs initial screening" } },
            { type: "assign_task", config: { assignee: "screening-team", title: "Initial Venture Screening", description: "Review venture application and conduct initial assessment" } }
          ],
          metadata: {
            category: "Venture Management",
            template: "venture-onboarding",
            createdAt: new Date().toISOString()
          }
        },
        isActive: true,
        createdById
      },
      {
        name: "GEDSI Compliance Monitoring",
        description: "Monitor GEDSI metrics weekly and alert on compliance issues or low scores",
        definition: {
          trigger: { type: "schedule", config: { frequency: "weekly", time: "09:00" } },
          steps: [
            { type: "check_gedsi_metrics", config: { threshold: 70 } },
            { type: "identify_at_risk", config: { criteria: "score_below_threshold" } },
            { type: "create_notification", config: { title: "GEDSI Compliance Alert", message: "{{venture_count}} ventures require GEDSI attention" } },
            { type: "send_email", config: { to: "compliance@miv.com", subject: "Weekly GEDSI Compliance Report", body: "Please find attached the weekly GEDSI compliance summary..." } }
          ],
          metadata: {
            category: "Compliance",
            template: "gedsi-monitoring",
            createdAt: new Date().toISOString()
          }
        },
        isActive: true,
        createdById
      },
      {
        name: "Investment Pipeline Tracker",
        description: "Track ventures through investment stages and notify stakeholders of progress",
        definition: {
          trigger: { type: "stage_changed" },
          steps: [
            { type: "update_pipeline_status", config: {} },
            { type: "calculate_stage_metrics", config: {} },
            { type: "send_email", config: { to: "{{stakeholders}}", subject: "Pipeline Update: {{venture.name}}", body: "{{venture.name}} has progressed to {{venture.stage}}" } },
            { type: "schedule_meeting", config: { type: "stage_review", daysFromNow: 7 } }
          ],
          metadata: {
            category: "Investment",
            template: "investment-pipeline",
            createdAt: new Date().toISOString()
          }
        },
        isActive: true,
        createdById
      },
      {
        name: "Monthly Impact Reports",
        description: "Generate and distribute comprehensive monthly impact and performance reports",
        definition: {
          trigger: { type: "schedule", config: { frequency: "monthly", day: 1, time: "08:00" } },
          steps: [
            { type: "generate_impact_report", config: {} },
            { type: "compile_gedsi_summary", config: {} },
            { type: "create_visual_dashboard", config: {} },
            { type: "send_email", config: { to: "stakeholders@miv.com", subject: "Monthly Impact Report - {{month}} {{year}}", body: "Please find attached the monthly impact report..." } }
          ],
          metadata: {
            category: "Reporting",
            template: "monthly-reporting",
            createdAt: new Date().toISOString()
          }
        },
        isActive: false,
        createdById
      },
      {
        name: "Due Diligence Checklist Automation",
        description: "Create comprehensive due diligence checklists when ventures enter DD stage",
        definition: {
          trigger: { type: "stage_changed", config: { to: "DUE_DILIGENCE" } },
          steps: [
            { type: "create_checklist", config: { template: "comprehensive_dd" } },
            { type: "assign_task", config: { assignee: "legal-team", title: "Legal Due Diligence", description: "Complete legal review and documentation" } },
            { type: "assign_task", config: { assignee: "financial-team", title: "Financial Due Diligence", description: "Review financial statements and projections" } },
            { type: "schedule_meeting", config: { type: "dd_kickoff", daysFromNow: 2 } },
            { type: "create_notification", config: { title: "DD Process Started", message: "Due diligence process initiated for {{venture.name}}" } }
          ],
          metadata: {
            category: "Due Diligence",
            template: "due-diligence-checklist",
            createdAt: new Date().toISOString()
          }
        },
        isActive: true,
        createdById
      }
    ]

    // Create workflows
    const createdWorkflows = []
    for (const workflowData of sampleWorkflows) {
      const workflow = await prisma.workflow.create({
        data: workflowData
      })
      createdWorkflows.push(workflow)
    }

    // Create some sample workflow runs
    const sampleRuns = []
    const statuses = ['SUCCEEDED', 'SUCCEEDED', 'SUCCEEDED', 'FAILED', 'RUNNING']
    
    for (let i = 0; i < createdWorkflows.length; i++) {
      const workflow = createdWorkflows[i]
      const numRuns = Math.floor(Math.random() * 5) + 1 // 1-5 runs per workflow
      
      for (let j = 0; j < numRuns; j++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const startedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
        const finishedAt = status !== 'RUNNING' ? new Date(startedAt.getTime() + Math.random() * 60000) : null // Up to 1 minute duration
        
        const run = await prisma.workflowRun.create({
          data: {
            workflowId: workflow.id,
            status,
            input: {
              triggeredBy: j === 0 ? 'manual' : 'system',
              context: {
                venture: j % 2 === 0 ? 'Test Venture Alpha' : 'Test Venture Beta',
                timestamp: startedAt.toISOString()
              }
            },
            output: status === 'SUCCEEDED' ? {
              executionLog: [
                { stepIndex: 0, stepType: 'send_email', result: { sent: true, recipient: 'test@example.com' } },
                { stepIndex: 1, stepType: 'create_notification', result: { created: true, notificationId: 'notif_123' } }
              ],
              completedSteps: 2,
              finalResult: { success: true }
            } : status === 'FAILED' ? {
              executionLog: [
                { stepIndex: 0, stepType: 'send_email', result: { sent: false, error: 'SMTP connection failed' } }
              ],
              failedStep: 0,
              error: 'Email service unavailable'
            } : null,
            errorMessage: status === 'FAILED' ? 'Email service unavailable' : null,
            startedAt,
            finishedAt
          }
        })
        sampleRuns.push(run)
      }
    }

    return NextResponse.json({
      message: 'Sample workflows and runs created successfully',
      workflows: createdWorkflows.length,
      runs: sampleRuns.length
    })

  } catch (error) {
    console.error('Error seeding workflows:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}