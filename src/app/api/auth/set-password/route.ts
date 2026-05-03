import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const hash = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('set-password error:', error)
    return NextResponse.json({ error: 'Internal server error', details: String((error as any)?.message || error) }, { status: 500 })
  }
}


