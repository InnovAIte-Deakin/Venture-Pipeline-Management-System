import { NextRequest, NextResponse } from 'next/server'
import irisCatalog from '@/lib/iris-catalog.json'
import { prisma } from '@/lib/prisma'

type CatalogItem = {
  code: string
  name: string
  description?: string
  unit?: string
  categories?: string[]
  tags?: string[]
}

function suggestGedsiCategory(item: CatalogItem): 'Gender' | 'Disability' | 'Social Inclusion' | 'Cross-cutting' | undefined {
  const hay = `${item.code} ${item.name} ${item.description || ''}`.toLowerCase()
  if (/(women|female|gender)/.test(hay)) return 'Gender'
  if (/(disabil|accessib)/.test(hay)) return 'Disability'
  if (/(rural|low\s*income|minorit|indigen|youth|poor|underserv)/.test(hay)) return 'Social Inclusion'
  return 'Cross-cutting'
}

async function ensureCatalogSeeded() {
  const currentCount = await prisma.iRISMetricCatalog.count().catch(() => 0)
  const catalog = irisCatalog as any[]
  if (currentCount >= catalog.length) return

  const codes = catalog.map((m) => m.code)
  const existing = await prisma.iRISMetricCatalog.findMany({ select: { code: true }, where: { code: { in: codes } } })
  const existingSet = new Set(existing.map(e => e.code))
  const items = catalog
    .filter((m) => !existingSet.has(m.code))
    .map((m) => ({
      code: m.code,
      name: m.name,
      description: m.description || null,
      unit: m.unit || null,
      category: Array.isArray(m.categories) ? m.categories[0] : undefined,
      tags: Array.isArray(m.tags) ? m.tags : undefined,
    }))
  if (items.length === 0) return
  // Insert in chunks to avoid SQLite param limits
  const chunkSize = 200
  for (let i = 0; i < items.length; i += chunkSize) {
    await prisma.iRISMetricCatalog.createMany({ data: items.slice(i, i + chunkSize) })
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureCatalogSeeded()
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const code = (searchParams.get('code') || '').trim()
    const limit = Math.max(1, Math.min(200, parseInt(searchParams.get('limit') || '20')))

    if (code) {
      const item = await prisma.iRISMetricCatalog.findFirst({ where: { code } })
      if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const ci: CatalogItem = {
        code: item.code,
        name: item.name,
        description: item.description || undefined,
        unit: item.unit || undefined,
        categories: Array.isArray(item.categories as any) ? (item.categories as any) : [],
        tags: Array.isArray(item.tags as any) ? (item.tags as any) : [],
      }
      return NextResponse.json({
        ...ci,
        gedsiSuggestion: suggestGedsiCategory(ci)
      })
    }

    // Simple LIKE-based search
    const queried = await prisma.iRISMetricCatalog.findMany({
      where: q ? {
        OR: [
          { code: { contains: q } },
          { name: { contains: q } },
          { description: { contains: q } }
        ]
      } : {},
      take: limit,
      orderBy: { code: 'asc' }
    })

    const sliced = queried.map(item => {
      const ci: CatalogItem = {
        code: item.code,
        name: item.name,
        unit: item.unit || '',
        description: item.description || '',
      }
      return {
        ...ci,
        gedsiSuggestion: suggestGedsiCategory(ci)
      }
    })

    const total = q ? await prisma.iRISMetricCatalog.count({
      where: {
        OR: [
          { code: { contains: q } },
          { name: { contains: q } },
          { description: { contains: q } }
        ]
      }
    }) : await prisma.iRISMetricCatalog.count()

    return NextResponse.json({ results: sliced, total })
  } catch (e) {
    console.error('IRIS metrics search error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

