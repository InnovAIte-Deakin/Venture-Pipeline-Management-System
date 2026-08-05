import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { blockProductionRoute } from '@/lib/development-route-guard'

const prisma = new PrismaClient()

export async function GET() {
  const blocked = blockProductionRoute('/api/test-db')
  if (blocked) return blocked

  try {
    // Test database connection
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}
