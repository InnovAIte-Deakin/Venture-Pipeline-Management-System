import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🌱 Starting basic data seeding...')

    // Clear existing data
    console.log('🧹 Clearing existing ventures...')
    await prisma.venture.deleteMany({})
    console.log('✅ Cleared ventures')

    console.log('🧹 Clearing existing users...')
    await prisma.user.deleteMany({})
    console.log('✅ Cleared users')

    // Create first test user (Admin)
    const user1 = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'admin2@test.com',
        role: 'ADMIN',
        organization: 'Test Organization',
        emailVerified: new Date(),
        permissions: ['READ', 'WRITE', 'DELETE', 'ADMIN']
      }
    })

    console.log('✅ Created user 1:', user1.email)

    // Create second test user (Manager)
    const user2 = await prisma.user.create({
      data: {
        name: 'Project Manager',
        email: 'manager@test.com',
        role: 'MANAGER',
        organization: 'Test Organization',
        emailVerified: new Date(),
        permissions: ['READ', 'WRITE']
      }
    })

    console.log('✅ Created user 2:', user2.email)

    // Create third test user (Viewer)
    const user3 = await prisma.user.create({
      data: {
        name: 'Data Analyst',
        email: 'analyst@test.com',
        role: 'USER',
        organization: 'Test Organization',
        emailVerified: new Date(),
        permissions: ['READ']
      }
    })

    console.log('✅ Created user 3:', user3.email)

    // Create first venture
    const venture1 = await prisma.venture.create({
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
        createdById: user1.id
      }
    })

    console.log('✅ Created venture 1:', venture1.name)

    // Create second venture
    const venture2 = await prisma.venture.create({
      data: {
        name: 'GreenEnergy Solutions',
        description: 'Renewable energy solutions for sustainable development',
        sector: 'ENERGY',
        location: 'San Francisco, CA',
        contactEmail: 'contact@greenenergy.com',
        contactPhone: '+1-555-0456',
        teamSize: 12,
        foundingYear: 2022,
        revenue: 250000,
        fundingRaised: 1500000,
        lastValuation: 5000000,
        stgGoals: ['SDG_7', 'SDG_13'],
        gedsiMetricsSummary: {
          womenLeadership: 45,
          womenEmployees: 55,
          disabilityInclusion: 15,
          underservedCommunities: 60
        },
        financials: {
          revenue: 250000,
          expenses: 180000,
          profit: 70000
        },
        documentsMetadata: {
          businessPlan: 'https://example.com/greenenergy-plan.pdf',
          pitchDeck: 'https://example.com/greenenergy-pitch.pdf'
        },
        tags: ['energy', 'sustainability', 'renewable'],
        status: 'ACTIVE',
        stage: 'INTAKE',
        createdById: user2.id
      }
    })

    console.log('✅ Created venture 2:', venture2.name)

    // Create third venture
    const venture3 = await prisma.venture.create({
      data: {
        name: 'HealthTech Innovations',
        description: 'Digital health solutions for underserved communities',
        sector: 'HEALTHCARE',
        location: 'Nairobi, Kenya',
        contactEmail: 'contact@healthtech.com',
        contactPhone: '+254-555-0789',
        teamSize: 8,
        foundingYear: 2021,
        revenue: 150000,
        fundingRaised: 800000,
        lastValuation: 3000000,
        stgGoals: ['SDG_3', 'SDG_10'],
        gedsiMetricsSummary: {
          womenLeadership: 60,
          womenEmployees: 65,
          disabilityInclusion: 25,
          underservedCommunities: 85
        },
        financials: {
          revenue: 150000,
          expenses: 100000,
          profit: 50000
        },
        documentsMetadata: {
          businessPlan: 'https://example.com/healthtech-plan.pdf',
          pitchDeck: 'https://example.com/healthtech-pitch.pdf'
        },
        tags: ['healthcare', 'digital-health', 'africa'],
        status: 'ACTIVE',
        stage: 'SERIES_A',
        createdById: user3.id
      }
    })

    console.log('✅ Created venture 3:', venture3.name)

    return NextResponse.json({
      success: true,
      message: 'Basic test data created successfully!',
      data: {
        users: [
          {
            name: user1.name,
            email: user1.email,
            role: user1.role,
            organization: user1.organization
          },
          {
            name: user2.name,
            email: user2.email,
            role: user2.role,
            organization: user2.organization
          },
          {
            name: user3.name,
            email: user3.email,
            role: user3.role,
            organization: user3.organization
          }
        ],
        ventures: [
          {
            name: venture1.name,
            sector: venture1.sector,
            stage: venture1.stage,
            createdBy: user1.name
          },
          {
            name: venture2.name,
            sector: venture2.sector,
            stage: venture2.stage,
            createdBy: user2.name
          },
          {
            name: venture3.name,
            sector: venture3.sector,
            stage: venture3.stage,
            createdBy: user3.name
          }
        ]
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