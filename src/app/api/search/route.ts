import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { detectMobileUserAgent, getMobileFlag } from '@/lib/mobile-detect'
import { createCachedResponse, CACHE_CONFIGS } from '@/lib/cache-headers'

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

// Database-level search functions with WHERE clauses
// Filtering now happens at the database level for better performance

async function searchVentures(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const ventures = await prisma.venture.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { sector: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } },
          { contactEmail: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${ventures.length} matching ventures`)

    return ventures.map(venture => ({
      id: venture.id,
      title: venture.name,
      subtitle: venture.sector,
      description: isMobile ? undefined : venture.description || undefined, // Skip description on mobile
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

async function searchUsers(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { organization: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${users.length} matching users`)

    return users.map(user => ({
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

async function searchDocuments(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { type: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { uploadedAt: 'desc' }
    })

    console.log(`Found ${documents.length} matching documents`)

    return documents.map(doc => ({
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

async function searchFunds(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const funds = await prisma.fund.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { vintage: { contains: searchTerm, mode: 'insensitive' } },
          { fundType: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${funds.length} matching funds`)

    return funds.map(fund => ({
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

async function searchProjects(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${projects.length} matching projects`)

    return projects.map(project => ({
      id: project.id,
      title: project.name,
      subtitle: project.venture?.name || 'No venture',
      description: isMobile ? undefined : project.description || undefined, // Skip description on mobile
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

async function searchGEDSIMetrics(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const gedsiMetrics = await prisma.gEDSIMetric.findMany({
      where: {
        OR: [
          { metricName: { contains: searchTerm, mode: 'insensitive' } },
          { metricCode: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${gedsiMetrics.length} matching GEDSI metrics`)

    return gedsiMetrics.map(metric => ({
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

async function searchCapitalActivities(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const capitalActivities = await prisma.capitalActivity.findMany({
      where: {
        OR: [
          { type: { contains: searchTerm, mode: 'insensitive' } },
          { investorName: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        venture: {
          select: { name: true }
        }
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${capitalActivities.length} matching capital activities`)

    return capitalActivities.map(activity => ({
      id: activity.id,
      title: `${activity.type} - ${activity.venture.name}`,
      subtitle: activity.investorName || 'Unknown investor',
      description: isMobile ? undefined : activity.description || undefined, // Skip description on mobile
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

async function searchTasks(searchTerm: string, isMobile: boolean): Promise<SearchResult[]> {
  try {
    // Database-level filtering using WHERE clause
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      include: {
        project: {
          select: { name: true }
        }
      },
      take: isMobile ? 5 : 10, // Limit to 5 results on mobile
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${tasks.length} matching tasks`)

    return tasks.map(task => ({
      id: task.id,
      title: task.name,
      subtitle: task.project.name,
      description: isMobile ? undefined : task.description || undefined, // Skip description on mobile
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
    // Detect mobile user agent
    const { isMobile } = getMobileFlag(request)
    console.log(`Mobile request: ${isMobile}`)

    // Get search query
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 1) {
      const response = NextResponse.json({ 
        results: [], 
        total: 0, 
        query: query || '',
        isMobile
      })
      return createCachedResponse({ 
        results: [], 
        total: 0, 
        query: query || '',
        isMobile
      }, CACHE_CONFIGS.SEARCH)
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
      searchVentures(searchTerm, isMobile),
      searchUsers(searchTerm, isMobile),
      searchDocuments(searchTerm, isMobile),
      searchFunds(searchTerm, isMobile),
      searchProjects(searchTerm, isMobile),
      searchGEDSIMetrics(searchTerm, isMobile),
      searchCapitalActivities(searchTerm, isMobile),
      searchTasks(searchTerm, isMobile)
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

    // Limit to 30 results on mobile, 50 on desktop
    const maxResults = isMobile ? 30 : 50
    const limitedResults = results.slice(0, maxResults)

    return createCachedResponse({
      results: limitedResults,
      total: limitedResults.length,
      query: searchTerm,
      isMobile
    }, CACHE_CONFIGS.SEARCH)

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', results: [], total: 0 },
      { status: 500 }
    )
  }
}
