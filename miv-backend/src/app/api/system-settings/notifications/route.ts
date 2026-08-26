import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    const body = await req.json()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, mock save (later move to DB)
    return NextResponse.json({
      success: true,
      saved: body,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to save notifications' }, { status: 500 })
  }
}
