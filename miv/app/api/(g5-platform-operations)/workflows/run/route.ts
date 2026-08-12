import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface WorkflowStep {
  type: string
  config: any
}

interface WorkflowDefinition {
  trigger: {
    type: string
    config: any
  }
  steps: WorkflowStep[]
  metadata?: any
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflowId, input = {} } = body
    
    if (!workflowId) {
      return NextResponse.json({ error: 'workflowId is required' }, { status: 400 })
    }

    // Fetch workflow
    const workflow = await prisma.workflow.findUnique({ 
      where: { id: workflowId },
      include: { createdBy: true }
    })
    
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    if (!workflow.isActive) {
      return NextResponse.json({ error: 'Workflow is not active' }, { status: 400 })
    }

    // Create run record
    const run = await prisma.workflowRun.create({
      data: {
        workflowId,
        status: 'RUNNING',
        input,
      },
    })

    // Execute workflow in background (simulate async execution)
    executeWorkflow(workflow, run.id, input).catch(error => {
      console.error('Workflow execution failed:', error)
      // Update run status to failed
      prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message || 'Unknown error',
          finishedAt: new Date(),
        }
      }).catch(console.error)
    })

    return NextResponse.json(run)
  } catch (error) {
    console.error('Error starting workflow run:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function executeWorkflow(workflow: any, runId: string, input: any) {
  const definition = workflow.definition as WorkflowDefinition
  const executionLog: any[] = []
  let currentInput = input

  try {
    // Execute each step
    for (let i = 0; i < definition.steps.length; i++) {
      const step = definition.steps[i]
      const stepResult = await executeStep(step, currentInput, workflow)
      
      executionLog.push({
        stepIndex: i,
        stepType: step.type,
        config: step.config,
        result: stepResult,
        timestamp: new Date().toISOString()
      })

      // Pass output to next step
      currentInput = { ...currentInput, previousStepOutput: stepResult }
    }

    // Mark as successful
    await prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: 'SUCCEEDED',
        output: {
          executionLog,
          finalResult: currentInput,
          completedSteps: definition.steps.length
        },
        finishedAt: new Date(),
      }
    })

  } catch (error) {
    // Mark as failed
    await prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        output: {
          executionLog,
          failedStep: executionLog.length,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        finishedAt: new Date(),
      }
    })
    throw error
  }
}

async function executeStep(step: WorkflowStep, input: any, workflow: any): Promise<any> {
  const { type, config } = step

  switch (type) {
    case 'send_email':
      return await executeSendEmail(config, input, workflow)
    
    case 'create_notification':
      return await executeCreateNotification(config, input, workflow)
    
    case 'update_database':
      return await executeUpdateDatabase(config, input, workflow)
    
    case 'generate_document':
      return await executeGenerateDocument(config, input, workflow)
    
    case 'assign_task':
      return await executeAssignTask(config, input, workflow)
    
    case 'schedule_meeting':
      return await executeScheduleMeeting(config, input, workflow)
    
    case 'webhook_call':
      return await executeWebhookCall(config, input, workflow)
    
    case 'delay':
      return await executeDelay(config, input, workflow)
    
    default:
      throw new Error(`Unknown step type: ${type}`)
  }
}

async function executeSendEmail(config: any, input: any, workflow: any): Promise<any> {
  // Simulate email sending
  const { to, subject, body } = config
  
  if (!to || !subject) {
    throw new Error('Email requires "to" and "subject" fields')
  }

  // In a real implementation, you would integrate with an email service
  console.log(`Sending email to ${to} with subject: ${subject}`)
  
  return {
    action: 'send_email',
    recipient: to,
    subject,
    body: body || '',
    sent: true,
    timestamp: new Date().toISOString()
  }
}

async function executeCreateNotification(config: any, input: any, workflow: any): Promise<any> {
  const { title, message } = config
  
  if (!title || !message) {
    throw new Error('Notification requires "title" and "message" fields')
  }

  // Create notification in database
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: 'WORKFLOW',
        userId: workflow.createdById,
        metadata: {
          workflowId: workflow.id,
          workflowName: workflow.name,
          source: 'workflow_execution'
        }
      }
    })

    return {
      action: 'create_notification',
      notificationId: notification.id,
      title,
      message,
      created: true,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to create notification:', error)
    // Return success even if notification creation fails (non-critical)
    return {
      action: 'create_notification',
      title,
      message,
      created: false,
      error: 'Failed to create notification',
      timestamp: new Date().toISOString()
    }
  }
}

async function executeUpdateDatabase(config: any, input: any, workflow: any): Promise<any> {
  // Simulate database update
  const { table, data, condition } = config
  
  console.log(`Updating ${table} with data:`, data, 'where:', condition)
  
  return {
    action: 'update_database',
    table,
    data,
    condition,
    updated: true,
    timestamp: new Date().toISOString()
  }
}

async function executeGenerateDocument(config: any, input: any, workflow: any): Promise<any> {
  // Simulate document generation
  const { template, data } = config
  
  console.log(`Generating document from template: ${template}`)
  
  return {
    action: 'generate_document',
    template,
    data,
    documentId: `doc_${Date.now()}`,
    generated: true,
    timestamp: new Date().toISOString()
  }
}

async function executeAssignTask(config: any, input: any, workflow: any): Promise<any> {
  // Simulate task assignment
  const { assignee, title, description, dueDate } = config
  
  console.log(`Assigning task "${title}" to ${assignee}`)
  
  return {
    action: 'assign_task',
    assignee,
    title,
    description,
    dueDate,
    taskId: `task_${Date.now()}`,
    assigned: true,
    timestamp: new Date().toISOString()
  }
}

async function executeScheduleMeeting(config: any, input: any, workflow: any): Promise<any> {
  // Simulate meeting scheduling
  const { attendees, title, duration, scheduledFor } = config
  
  console.log(`Scheduling meeting "${title}" for ${attendees?.length || 0} attendees`)
  
  return {
    action: 'schedule_meeting',
    attendees,
    title,
    duration,
    scheduledFor,
    meetingId: `meeting_${Date.now()}`,
    scheduled: true,
    timestamp: new Date().toISOString()
  }
}

async function executeWebhookCall(config: any, input: any, workflow: any): Promise<any> {
  const { url, method = 'POST', headers = {}, body } = config
  
  if (!url) {
    throw new Error('Webhook call requires a URL')
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const responseData = await response.text()
    
    return {
      action: 'webhook_call',
      url,
      method,
      statusCode: response.status,
      success: response.ok,
      response: responseData,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    throw new Error(`Webhook call failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function executeDelay(config: any, input: any, workflow: any): Promise<any> {
  const { duration = 1000 } = config // Default 1 second
  
  await new Promise(resolve => setTimeout(resolve, duration))
  
  return {
    action: 'delay',
    duration,
    delayed: true,
    timestamp: new Date().toISOString()
  }
}

