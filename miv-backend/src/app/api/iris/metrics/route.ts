import { NextRequest, NextResponse } from 'next/server'
import { compactWhere, getPagination, requirePayloadUser, textSearch } from '../../_lib/payload-api'

type CatalogItem = {
  code: string
  name: string
  description?: string
  unit?: string
  categories?: string[]
  tags?: string[]
}

function suggestGedsiCategory(item: CatalogItem) {
  const hay = `${item.code} ${item.name} ${item.description || ''}`.toLowerCase()
  if (/(women|female|gender)/.test(hay)) return 'Gender'
  if (/(disabil|accessib)/.test(hay)) return 'Disability'
  if (/(rural|low\s*income|minorit|indigen|youth|poor|underserv)/.test(hay)) {
    return 'Social Inclusion'
  }
  return 'Cross-cutting'
}

function normalizeCatalogItem(item: any) {
  const normalized = {
    code: item.code,
    name: item.name,
    description: item.description || '',
    unit: item.unit || '',
    categories: item.category ? [item.category] : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
  }

  return {
    ...normalized,
    gedsiSuggestion: suggestGedsiCategory(normalized),
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { page, limit, searchParams } = getPagination(request, 20)
    const q = (searchParams.get('q') || '').trim()
    const code = (searchParams.get('code') || '').trim()

    if (code) {
      const found = await auth.payload.find({
        collection: 'irisMetricCatalog',
        where: { code: { equals: code } },
        limit: 1,
        overrideAccess: false,
        user: auth.user,
      })

      if (!found.docs[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(normalizeCatalogItem(found.docs[0]))
    }

    const metrics = await auth.payload.find({
      collection: 'irisMetricCatalog',
      where: compactWhere([textSearch(['code', 'name', 'description'], q), { isActive: { equals: true } }]),
      page,
      limit,
      sort: 'code',
      overrideAccess: false,
      user: auth.user,
    })

    return NextResponse.json({
      results: metrics.docs.map(normalizeCatalogItem),
      total: metrics.totalDocs,
      page,
      limit,
      totalPages: metrics.totalPages,
    })
  } catch (error) {
    console.error('IRIS metrics backend search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
