import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  try {
    // Dev: allow without auth by taking first user
    const session = await getServerSession().catch(() => null)
    let email: string | null = null
    if (session?.user?.email) email = session.user.email

    let user
    if (email) {
      user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, role: true, organization: true, createdAt: true, updatedAt: true } })
    } else {
      user = await prisma.user.findFirst({ select: { id: true, name: true, email: true, role: true, organization: true, createdAt: true, updatedAt: true } })
    }
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    console.error('GET /api/users/me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, organization } = body

    // Dev: select first user to update if no session
    const session = await getServerSession().catch(() => null)
    const email: string | null = session?.user?.email || null
    const user = email ? await prisma.user.findUnique({ where: { email } }) : await prisma.user.findFirst()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const updated = await prisma.user.update({ where: { id: user.id }, data: { name, organization } })
    return NextResponse.json({ ok: true, user: { id: updated.id, name: updated.name, email: updated.email, organization: updated.organization } })
  } catch (error) {
    console.error('PUT /api/users/me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


