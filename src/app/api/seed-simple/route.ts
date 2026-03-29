import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🌱 Starting simple data seeding...')

    // Create a simple test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN',
        permissions: ['READ', 'WRITE', 'DELETE', 'ADMIN']
      }
    })

    console.log('✅ Created test user:', user.email)

    return NextResponse.json({
      success: true,
      message: 'Simple test data created successfully!',
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          password: 'test123'
        }
      }
    })

  } catch (error) {
    console.error('Error seeding simple data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed simple data', details: error.message },
      { status: 500 }
    )
  }
}
