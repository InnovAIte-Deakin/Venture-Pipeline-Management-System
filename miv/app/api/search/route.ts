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

// Separate search functions for better organization
async function searchVentures(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const ventures = await prisma.venture.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    const filtered = ventures.filter(v => 
      v.name?.toLowerCase().includes(searchLower) ||
      v.description?.toLowerCase().includes(searchLower) ||
      v.sector?.toLowerCase().includes(searchLower) ||
      v.location?.toLowerCase().includes(searchLower) ||
      v.contactEmail?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching ventures`)

    return filtered.map(venture => ({
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
    }))
  } catch (error) {
    console.error('Error searching ventures:', error)
    return []
  }
}

async function searchUsers(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    const filtered = users.filter(u =>
      u.name?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      u.organization?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching users`)

    return filtered.map(user => ({
      id: user.id,
      title: user.name || user.email,
      subtitle: user.organization || user.email,
      description: user.role,
      type: 'user',
      url: `/dashboard/team-management?user=${user.id}`,
      metadata: {
        status: user.role
      }
    }))
  } catch (error) {
    console.error('Error searching users:', error)
    return []
  }
}

async function searchDocuments(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const documents = await prisma.document.findMany({
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: 10,
      orderBy: { uploadedAt: 'desc' }
    })
    
    const filtered = documents.filter(d =>
      d.name?.toLowerCase().includes(searchLower) ||
      d.type?.toLowerCase().includes(searchLower) ||
      d.venture?.name?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching documents`)

    return filtered.map(doc => ({
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
    }))
  } catch (error) {
    console.error('Error searching documents:', error)
    return []
  }
}

async function searchFunds(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const funds = await prisma.fund.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    const filtered = funds.filter(f =>
      f.name?.toLowerCase().includes(searchLower) ||
      f.vintage?.toLowerCase().includes(searchLower) ||
      f.fundType?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching funds`)

    return filtered.map(fund => ({
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
    }))
  } catch (error) {
    console.error('Error searching funds:', error)
    return []
  }
}

async function searchProjects(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const projects = await prisma.project.findMany({
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    const filtered = projects.filter(p =>
      p.name?.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.venture?.name?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching projects`)

    return filtered.map(project => ({
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
    }))
  } catch (error) {
    console.error('Error searching projects:', error)
    return []
  }
}

async function searchGEDSIMetrics(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const gedsiMetrics = await prisma.gEDSIMetric.findMany({
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    const filtered = gedsiMetrics.filter(m =>
      m.metricName?.toLowerCase().includes(searchLower) ||
      m.metricCode?.toLowerCase().includes(searchLower) ||
      m.category?.toLowerCase().includes(searchLower) ||
      m.venture?.name?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching GEDSI metrics`)

    return filtered.map(metric => ({
      id: metric.id,
      title: metric.metricName,
      subtitle: metric.venture.name,
      description: `${metric.category} • ${metric.currentValue}/${metric.targetValue} ${metric.unit}`,
      type: 'gedsi',
      url: `/dashboard/gedsi-tracker?metric=${metric.id}`,
      metadata: {
        status: metric.status
      }
    }))
  } catch (error) {
    console.error('Error searching GEDSI metrics:', error)
    return []
  }
}

async function searchCapitalActivities(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const capitalActivities = await prisma.capitalActivity.findMany({
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    const filtered = capitalActivities.filter(c =>
      c.type?.toLowerCase().includes(searchLower) ||
      c.investorName?.toLowerCase().includes(searchLower) ||
      c.description?.toLowerCase().includes(searchLower) ||
      c.venture?.name?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching capital activities`)

    return filtered.map(activity => ({
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
    }))
  } catch (error) {
    console.error('Error searching capital activities:', error)
    return []
  }
}

async function searchTasks(searchTerm: string): Promise<SearchResult[]> {
  try {
    const searchLower = searchTerm.toLowerCase()
    const tasks = await prisma.task.findMany({
      include: {
        project: {
          select: { name: true }
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    
    const filtered = tasks.filter(t =>
      t.name?.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower) ||
      t.project?.name?.toLowerCase().includes(searchLower)
    )

    console.log(`Found ${filtered.length} matching tasks`)

    return filtered.map(task => ({
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
    }))
  } catch (error) {
    console.error('Error searching tasks:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get search query
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 1) {
      return NextResponse.json({ 
        results: [], 
        total: 0, 
        query: query || '' 
      })
    }

    const searchTerm = query.trim()

    console.log('=== SEARCH START ===')
    console.log('Search term:', searchTerm)
    const [
      ventures,
      users,
      documents,
      funds,
      projects,
      gedsiMetrics,
      capitalActivities,
      tasks
    ] = await Promise.all([
      searchVentures(searchTerm),
      searchUsers(searchTerm),
      searchDocuments(searchTerm),
      searchFunds(searchTerm),
      searchProjects(searchTerm),
      searchGEDSIMetrics(searchTerm),
      searchCapitalActivities(searchTerm),
      searchTasks(searchTerm)
    ])

    
    const results: SearchResult[] = [
      ...ventures,
      ...users,
      ...documents,
      ...funds,
      ...projects,
      ...gedsiMetrics,
      ...capitalActivities,
      ...tasks
    ]

    // Limit to 50 results total
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