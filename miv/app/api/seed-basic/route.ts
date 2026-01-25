import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🌱 Starting basic data seeding...')

    // Create a simple test user
    const user = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        organization: 'Test Organization',
        emailVerified: new Date(),
        permissions: ['READ', 'WRITE', 'DELETE', 'ADMIN']
      }
    })

    console.log('✅ Created test user:', user.email)

    // Create a simple venture
    const venture = await prisma.venture.create({
      data: {
        name: 'Test Venture',
        description: 'A test venture for comprehensive testing',
        sector: 'TECHNOLOGY',
        location: 'Test City',
        contactEmail: 'contact@testventure.com',
        contactPhone: '+1-555-0123',
        teamSize: 5,
        foundingYear: 2023,
        revenue: 100000,
        fundingRaised: 500000,
        lastValuation: 2000000,
        stgGoals: ['SDG_8', 'SDG_9'],
        gedsiMetricsSummary: {
          womenLeadership: 50,
          womenEmployees: 60,
          disabilityInclusion: 20,
          underservedCommunities: 70
        },
        financials: {
          revenue: 100000,
          expenses: 80000,
          profit: 20000
        },
        documentsMetadata: {
          businessPlan: 'https://example.com/business-plan.pdf',
          pitchDeck: 'https://example.com/pitch-deck.pdf'
        },
        tags: ['technology', 'innovation', 'test'],
        status: 'ACTIVE',
        stage: 'SEED',
        createdById: user.id
      }
    })

    console.log('✅ Created test venture:', venture.name)

    return NextResponse.json({
      success: true,
      message: 'Basic test data created successfully!',
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization
        },
        venture: {
          name: venture.name,
          sector: venture.sector,
          stage: venture.stage
        }
      }
    })

  } catch (error) {
    console.error('Error seeding basic data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed basic data', details: error.message },
      { status: 500 }
    )
  }
}
