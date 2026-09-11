import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function requireAdminDevAccess() {
    
  //check whether developer endpoints are enabled
  if (process.env.ENABLE_DEV_ENDPOINTS !== 'true') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  //check whether someone is logged in
  const session = await getServerSession().catch(() => null)

  //get their email from the session
  const email = session?.user?.email

  //if nobody is logged in stop immediately
  if (!email) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  //find that user in the database
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true }
  })

  //if not admin stop
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  return null
}