import { NextRequest, NextResponse } from 'next/server'
import { requirePayloadUser } from '../_lib/payload-api'

async function findAll(payload: any, user: any, collection: string, extra: Record<string, unknown> = {}) {
  const result = await payload.find({
    collection,
    limit: 200,
    depth: 1,
    overrideAccess: false,
    user,
    ...extra,
  })

  return result.docs
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requirePayloadUser(request)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const includeCapitalActivities = searchParams.get('includeCapitalActivities') === 'true'
    const includeLPs = searchParams.get('includeLPs') === 'true'

    const [
      funds,
      ventures,
      capitalActivities,
      capitalCalls,
      distributions,
      workflows,
      lifecyclePhases,
      operationTasks,
      reports,
      limitedPartners,
    ] = await Promise.all([
      findAll(auth.payload, auth.user, 'funds', { sort: '-updatedAt' }).catch(() => []),
      findAll(auth.payload, auth.user, 'ventures', { sort: '-createdAt' }).catch(() => []),
      findAll(auth.payload, auth.user, 'capitalActivities', { sort: '-createdAt' }).catch(() => []),
      findAll(auth.payload, auth.user, 'capitalCalls', { sort: '-createdAt' }).catch(() => []),
      findAll(auth.payload, auth.user, 'distributions', { sort: '-createdAt' }).catch(() => []),
      findAll(auth.payload, auth.user, 'fundWorkflows', { sort: '-createdAt' }).catch(() => []),
      findAll(auth.payload, auth.user, 'fundLifecyclePhases', { sort: 'phase' }).catch(() => []),
      findAll(auth.payload, auth.user, 'fundOperationTasks', { sort: '-createdAt' }).catch(() => []),
      findAll(auth.payload, auth.user, 'reports', { sort: '-createdAt' }).catch(() => []),
      includeLPs ? findAll(auth.payload, auth.user, 'limitedPartners', { sort: '-createdAt' }).catch(() => []) : [],
    ])

    const totalFunding = capitalActivities.reduce((sum: number, activity: any) => {
      return sum + (Number(activity.amount) || 0)
    }, 0)

    return NextResponse.json({
      funds,
      capitalCalls: includeCapitalActivities ? capitalCalls : [],
      distributions: includeCapitalActivities ? distributions : [],
      limitedPartners: includeLPs ? limitedPartners : [],
      workflows,
      lifecyclePhases,
      operationTasks,
      reports,
      ventures,
      summary: {
        totalFunds: funds.length,
        totalAUM: totalFunding,
        totalVentures: ventures.length,
        totalCapitalActivities: capitalActivities.length,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching backend fund management data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
