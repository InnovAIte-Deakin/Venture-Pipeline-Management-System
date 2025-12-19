// app/api/search/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  description?: string
  type: 'venture' | 'user' | 'document' | 'fund' | 'project' | 'gedsi' | 'capital' | 'task'
  url: string
  metadata?: {
    status?: string
    stage?: string
    amount?: number
    date?: string
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get search query
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 1) { // Changed from 2 to 1
      return NextResponse.json({ 
        results: [], 
        total: 0, 
        query: query || '' 
      })
    }

    const searchTerm = query.trim()
    const searchLower = searchTerm.toLowerCase()
    const results: SearchResult[] = []

    console.log('=== SEARCH START ===')
    console.log('Search term:', searchTerm)

    // Search Ventures - with more flexible matching
    try {
      // First, get all ventures
      const allVentures = await prisma.venture.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`Total ventures in DB: ${allVentures.length}`)
      
      // Filter in JavaScript for case-insensitive search
      const ventures = allVentures.filter(v => 
        v.name?.toLowerCase().includes(searchLower) ||
        v.description?.toLowerCase().includes(searchLower) ||
        v.sector?.toLowerCase().includes(searchLower) ||
        v.location?.toLowerCase().includes(searchLower) ||
        v.contactEmail?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${ventures.length} matching ventures`)
      if (ventures.length > 0) {
        console.log('First venture:', ventures[0].name)
      }

      ventures.forEach(venture => {
        results.push({
          id: venture.id,
          title: venture.name,
          subtitle: venture.sector,
          description: venture.description || undefined,
          type: 'venture',
          url: `/dashboard/ventures/${venture.id}`,
          metadata: {
            status: venture.status,
            stage: venture.stage
          }
        })
      })
    } catch (error) {
      console.error('Error searching ventures:', error)
    }

    // Search Users - with more flexible matching
    try {
      const allUsers = await prisma.user.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`Total users in DB: ${allUsers.length}`)
      
      const users = allUsers.filter(u =>
        u.name?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.organization?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${users.length} matching users`)

      users.forEach(user => {
        results.push({
          id: user.id,
          title: user.name || user.email,
          subtitle: user.organization || user.email,
          description: user.role,
          type: 'user',
          url: `/dashboard/team-management?user=${user.id}`,
          metadata: {
            status: user.role
          }
        })
      })
    } catch (error) {
      console.error('Error searching users:', error)
    }

    // Search Documents
    try {
      const allDocuments = await prisma.document.findMany({
        include: {
          venture: {
            select: { name: true }
          }
        },
        take: 100,
        orderBy: { uploadedAt: 'desc' }
      })
      
      console.log(`Total documents in DB: ${allDocuments.length}`)
      
      const documents = allDocuments.filter(d =>
        d.name?.toLowerCase().includes(searchLower) ||
        d.type?.toLowerCase().includes(searchLower) ||
        d.venture?.name?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${documents.length} matching documents`)

      documents.forEach(doc => {
        results.push({
          id: doc.id,
          title: doc.name,
          subtitle: doc.venture.name,
          description: doc.type,
          type: 'document',
          url: `/dashboard/documents/${doc.id}`,
          metadata: {
            status: doc.type,
            date: doc.uploadedAt.toISOString()
          }
        })
      })
    } catch (error) {
      console.error('Error searching documents:', error)
    }

    // Search Funds
    try {
      const allFunds = await prisma.fund.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`Total funds in DB: ${allFunds.length}`)
      
      const funds = allFunds.filter(f =>
        f.name?.toLowerCase().includes(searchLower) ||
        f.vintage?.toLowerCase().includes(searchLower) ||
        f.fundType?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${funds.length} matching funds`)

      funds.forEach(fund => {
        results.push({
          id: fund.id,
          title: fund.name,
          subtitle: `${fund.vintage} • ${fund.fundType}`,
          description: `Size: $${(fund.size / 1000000).toFixed(1)}M`,
          type: 'fund',
          url: `/dashboard/fund-management/${fund.id}`,
          metadata: {
            status: fund.status,
            amount: fund.size
          }
        })
      })
    } catch (error) {
      console.error('Error searching funds:', error)
    }

    // Search Projects
    try {
      const allProjects = await prisma.project.findMany({
        include: {
          venture: {
            select: { name: true }
          }
        },
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`Total projects in DB: ${allProjects.length}`)
      
      const projects = allProjects.filter(p =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.venture?.name?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${projects.length} matching projects`)

      projects.forEach(project => {
        results.push({
          id: project.id,
          title: project.name,
          subtitle: project.venture?.name || 'No venture',
          description: project.description || undefined,
          type: 'project',
          url: `/dashboard/projects/${project.id}`,
          metadata: {
            status: project.status,
            date: project.dueDate?.toISOString()
          }
        })
      })
    } catch (error) {
      console.error('Error searching projects:', error)
    }

    // Search GEDSI Metrics
    try {
      const allMetrics = await prisma.gEDSIMetric.findMany({
        include: {
          venture: {
            select: { name: true }
          }
        },
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`Total GEDSI metrics in DB: ${allMetrics.length}`)
      
      const gedsiMetrics = allMetrics.filter(m =>
        m.metricName?.toLowerCase().includes(searchLower) ||
        m.metricCode?.toLowerCase().includes(searchLower) ||
        m.category?.toLowerCase().includes(searchLower) ||
        m.venture?.name?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${gedsiMetrics.length} matching GEDSI metrics`)

      gedsiMetrics.forEach(metric => {
        results.push({
          id: metric.id,
          title: metric.metricName,
          subtitle: metric.venture.name,
          description: `${metric.category} • ${metric.currentValue}/${metric.targetValue} ${metric.unit}`,
          type: 'gedsi',
          url: `/dashboard/gedsi-tracker?metric=${metric.id}`,
          metadata: {
            status: metric.status
          }
        })
      })
    } catch (error) {
      console.error('Error searching GEDSI metrics:', error)
    }

    // Search Capital Activities
    try {
      const allCapital = await prisma.capitalActivity.findMany({
        include: {
          venture: {
            select: { name: true }
          }
        },
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`Total capital activities in DB: ${allCapital.length}`)
      
      const capitalActivities = allCapital.filter(c =>
        c.type?.toLowerCase().includes(searchLower) ||
        c.investorName?.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower) ||
        c.venture?.name?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${capitalActivities.length} matching capital activities`)

      capitalActivities.forEach(activity => {
        results.push({
          id: activity.id,
          title: `${activity.type} - ${activity.venture.name}`,
          subtitle: activity.investorName || 'Unknown investor',
          description: activity.description || undefined,
          type: 'capital',
          url: `/dashboard/capital-facilitation?activity=${activity.id}`,
          metadata: {
            status: activity.status,
            amount: activity.amount || undefined,
            date: activity.date?.toISOString()
          }
        })
      })
    } catch (error) {
      console.error('Error searching capital activities:', error)
    }

    // Search Tasks
    try {
      const allTasks = await prisma.task.findMany({
        include: {
          project: {
            select: { name: true }
          }
        },
        take: 100,
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`Total tasks in DB: ${allTasks.length}`)
      
      const tasks = allTasks.filter(t =>
        t.name?.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.project?.name?.toLowerCase().includes(searchLower)
      ).slice(0, 10)
      
      console.log(`Found ${tasks.length} matching tasks`)

      tasks.forEach(task => {
        results.push({
          id: task.id,
          title: task.name,
          subtitle: task.project.name,
          description: task.description || undefined,
          type: 'task',
          url: `/dashboard/projects/${task.projectId}?task=${task.id}`,
          metadata: {
            status: task.status,
            date: task.dueDate?.toISOString()
          }
        })
      })
    } catch (error) {
      console.error('Error searching tasks:', error)
    }

    console.log(`=== SEARCH END === Total results: ${results.length}`)

    // Sort results by relevance (you can implement custom scoring)
    const limitedResults = results.slice(0, 50)

    return NextResponse.json({
      results: limitedResults,
      total: limitedResults.length,
      query: searchTerm
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', results: [], total: 0 },
      { status: 500 }
    )
  }
}