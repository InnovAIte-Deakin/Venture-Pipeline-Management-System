import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json({
      success: true,
      current: { cpu: 45, memory: 60, disk: 75 },
      history: Array.from({ length: 12 }).map((_, i) => ({
        monthIndex: i + 1,
        cpu: 40 + (i % 5),
        memory: 55 + (i % 4),
        disk: 70 + (i % 6),
      })),
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load performance' }, { status: 500 })
  }
}
