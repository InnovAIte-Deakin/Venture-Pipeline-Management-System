import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🌱 Starting comprehensive data seeding...')

    // Clear existing data (in order to avoid foreign key constraints)
    try {
      await prisma.activity.deleteMany()
    } catch (e) { console.log('Activities table not found, skipping...') }
    
    try {
      await prisma.emailLog.deleteMany()
    } catch (e) { console.log('EmailLog table not found, skipping...') }
    
    try {
      await prisma.notification.deleteMany()
    } catch (e) { console.log('Notification table not found, skipping...') }
    
    try {
      await prisma.venture.deleteMany()
    } catch (e) { console.log('Venture table not found, skipping...') }
    
    try {
      await prisma.irisMetricCatalog.deleteMany()
    } catch (e) { console.log('IRISMetricCatalog table not found, skipping...') }
    
    try {
      await prisma.user.deleteMany()
    } catch (e) { console.log('User table not found, skipping...') }

    console.log('🧹 Cleared existing data')

    // Create comprehensive test users (idempotent)
    const userSeeds = [
      { name: 'Sarah Chen', email: 'sarah.chen@miv.org', role: 'ADMIN', organization: 'MIV Platform', emailVerified: new Date(), permissions: ['READ', 'WRITE', 'DELETE', 'ADMIN'] },
      { name: 'Michael Rodriguez', email: 'michael.rodriguez@miv.org', role: 'VENTURE_MANAGER', organization: 'MIV Platform', emailVerified: new Date(), permissions: ['READ', 'WRITE'] },
      { name: 'Dr. Aisha Patel', email: 'aisha.patel@miv.org', role: 'GEDSI_ANALYST', organization: 'MIV Platform', emailVerified: new Date(), permissions: ['READ', 'WRITE'] },
      { name: 'James Thompson', email: 'james.thompson@miv.org', role: 'CAPITAL_FACILITATOR', organization: 'MIV Platform', emailVerified: new Date(), permissions: ['READ', 'WRITE'] },
      { name: 'Maria Santos', email: 'maria.santos@investor.com', role: 'EXTERNAL_STAKEHOLDER', organization: 'Impact Ventures Ltd', emailVerified: new Date(), permissions: ['READ'] },
      { name: 'Test User', email: 'test@example.com', role: 'USER', organization: 'Test Org', emailVerified: null as any, permissions: ['READ'] },
    ] as const

    const users = await Promise.all(userSeeds.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, role: u.role as any, organization: u.organization, emailVerified: u.emailVerified as any, permissions: u.permissions as any },
        create: { name: u.name, email: u.email, role: u.role as any, organization: u.organization, emailVerified: u.emailVerified as any, permissions: u.permissions as any }
      })
    ))

    console.log('👥 Created test users')

    // Create comprehensive IRIS metrics catalog
    let irisMetrics: any[] = []
    try {
      irisMetrics = await Promise.all([
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.1' },
        data: {
          code: 'OI.1',
          name: 'Number of individuals reached',
          description: 'Total number of individuals who have been reached by the organization\'s activities',
          category: 'Outcome',
          subcategory: 'Reach',
          unit: 'Individuals',
          definition: 'This metric counts the total number of unique individuals who have been directly or indirectly reached by the organization\'s activities during the reporting period.',
          example: 'A microfinance organization reaches 1,000 individuals through loans, 500 through financial literacy training, and 200 through both services. The total individuals reached is 1,300 (not 1,700).',
          tags: ['reach', 'individuals', 'outcome'],
          isActive: true
        },
        update: {
          name: 'Number of individuals reached',
          description: 'Total number of individuals who have been reached by the organization\'s activities',
          isActive: true
        }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.2' },
        data: {
          code: 'OI.2',
          name: 'Number of individuals served',
          description: 'Total number of individuals who have received products or services from the organization',
          category: 'Outcome',
          subcategory: 'Reach',
          unit: 'Individuals',
          definition: 'This metric counts the total number of unique individuals who have directly received products or services from the organization during the reporting period.',
          example: 'A healthcare organization serves 800 patients with medical consultations and 300 patients with vaccinations. The total individuals served is 1,100.',
          tags: ['serve', 'individuals', 'outcome'],
          isActive: true
        },
        update: {
          name: 'Number of individuals served',
          description: 'Total number of individuals who have received products or services from the organization',
          isActive: true
        }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.3' },
        data: {
          code: 'OI.3',
          name: 'Number of women reached',
          description: 'Total number of women who have been reached by the organization\'s activities',
          category: 'Outcome',
          subcategory: 'Gender',
          unit: 'Women',
          definition: 'This metric counts the total number of unique women who have been directly or indirectly reached by the organization\'s activities during the reporting period.',
          example: 'A women\'s empowerment program reaches 600 women through skills training and 400 women through business development services. The total women reached is 800 (accounting for overlap).',
          tags: ['women', 'gender', 'reach', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of women reached', isActive: true }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.4' },
        data: {
          code: 'OI.4',
          name: 'Number of individuals with disabilities reached',
          description: 'Total number of individuals with disabilities who have been reached by the organization\'s activities',
          category: 'Outcome',
          subcategory: 'Disability',
          unit: 'Individuals',
          definition: 'This metric counts the total number of unique individuals with disabilities who have been reached by the organization\'s activities during the reporting period.',
          example: 'An inclusive education program reaches 150 children with disabilities through specialized learning support and 50 adults with disabilities through vocational training.',
          tags: ['disability', 'inclusion', 'reach', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of individuals with disabilities reached', isActive: true }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.5' },
        data: {
          code: 'OI.5',
          name: 'Number of individuals from underserved populations reached',
          description: 'Total number of individuals from underserved populations who have been reached by the organization\'s activities',
          category: 'Outcome',
          subcategory: 'Social Inclusion',
          unit: 'Individuals',
          definition: 'This metric counts the total number of unique individuals from underserved populations who have been reached by the organization\'s activities during the reporting period.',
          example: 'A community development program reaches 300 individuals from rural areas, 200 from ethnic minority groups, and 150 from low-income households.',
          tags: ['underserved', 'social inclusion', 'reach', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of individuals from underserved populations reached', isActive: true }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.6' },
        data: {
          code: 'OI.6',
          name: 'Number of organizations reached',
          description: 'Total number of organizations that have been reached by the organization\'s activities',
          category: 'Outcome',
          subcategory: 'Reach',
          unit: 'Organizations',
          definition: 'This metric counts the total number of unique organizations that have been reached by the organization\'s activities during the reporting period.',
          example: 'A capacity building program reaches 25 NGOs through training workshops and 15 social enterprises through mentoring services.',
          tags: ['organizations', 'reach', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of organizations reached', isActive: true }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.7' },
        data: {
          code: 'OI.7',
          name: 'Number of individuals whose lives have been improved',
          description: 'Total number of individuals whose lives have been measurably improved by the organization\'s activities',
          category: 'Outcome',
          subcategory: 'Impact',
          unit: 'Individuals',
          definition: 'This metric counts the total number of unique individuals whose lives have been measurably improved by the organization\'s activities during the reporting period.',
          example: 'A livelihood program improves the lives of 500 farmers through increased crop yields and 200 artisans through improved market access.',
          tags: ['impact', 'improvement', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of individuals whose lives have been improved', isActive: true }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.8' },
        data: {
          code: 'OI.8',
          name: 'Number of jobs created',
          description: 'Total number of jobs created by the organization\'s activities',
          category: 'Outcome',
          subcategory: 'Employment',
          unit: 'Jobs',
          definition: 'This metric counts the total number of jobs created by the organization\'s activities during the reporting period.',
          example: 'A social enterprise creates 50 direct jobs and enables 200 indirect jobs through its supply chain partnerships.',
          tags: ['employment', 'jobs', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of jobs created', isActive: true }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.9' },
        data: {
          code: 'OI.9',
          name: 'Number of women employed',
          description: 'Total number of women employed by the organization or its activities',
          category: 'Outcome',
          subcategory: 'Gender',
          unit: 'Women',
          definition: 'This metric counts the total number of women employed by the organization or its activities during the reporting period.',
          example: 'A manufacturing social enterprise employs 80 women directly and creates 120 jobs for women in its supply chain.',
          tags: ['women', 'employment', 'gender', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of women employed', isActive: true }
      }),
      prisma.irisMetricCatalog.upsert({
        where: { code: 'OI.10' },
        data: {
          code: 'OI.10',
          name: 'Number of individuals with disabilities employed',
          description: 'Total number of individuals with disabilities employed by the organization or its activities',
          category: 'Outcome',
          subcategory: 'Disability',
          unit: 'Individuals',
          definition: 'This metric counts the total number of individuals with disabilities employed by the organization or its activities during the reporting period.',
          example: 'An inclusive employment program employs 30 individuals with disabilities directly and places 70 in partner organizations.',
          tags: ['disability', 'employment', 'inclusion', 'outcome'],
          isActive: true
        },
        update: { name: 'Number of individuals with disabilities employed', isActive: true }
      })
    ])
    } catch (e) { 
      console.log('IRIS metrics creation failed, skipping...', e.message)
    }

    console.log('📊 Created IRIS metrics catalog')

    // Create comprehensive ventures with all possible data
    const ventures = await Promise.all([
      prisma.venture.create({
        data: {
          name: 'GreenTech Solutions',
          description: 'A sustainable technology company focused on renewable energy solutions for rural communities in Southeast Asia.',
          stage: 'SERIES_A',
          sector: 'CLEANTECH',
          location: 'Bangkok, Thailand',
          foundingYear: 2020,
          website: 'https://greentech-solutions.com',
          contactEmail: 'contact@greentech-solutions.com',
          contactPhone: '+66-2-123-4567',
          founderTypes: '["Technical Founder", "Business Founder"]',
          teamSize: 25,
          revenue: 2500000,
          fundingRaised: 5000000,
          lastValuation: 15000000,
          stgGoals: ['SDG_7', 'SDG_13', 'SDG_9'],
          gedsiMetricsSummary: {
            womenLeadership: 40,
            womenEmployees: 45,
            disabilityInclusion: 15,
            underservedCommunities: 60,
            genderPayGap: 5,
            accessibilityScore: 85
          },
          financials: {
            revenue: 2500000,
            expenses: 1800000,
            profit: 700000,
            assets: 8000000,
            liabilities: 2000000,
            equity: 6000000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/business-plan.pdf',
            financialStatements: 'https://docs.example.com/financials.pdf',
            pitchDeck: 'https://docs.example.com/pitch-deck.pdf',
            legalDocuments: 'https://docs.example.com/legal.pdf'
          },
          tags: ['renewable energy', 'rural development', 'sustainability', 'technology'],
          status: 'ACTIVE',
          createdById: users[1].id // Michael Rodriguez
        }
      }),
      prisma.venture.create({
        data: {
          name: 'EduForAll',
          description: 'An inclusive education platform providing accessible learning opportunities for children with disabilities in rural areas.',
          stage: 'SEED',
          sector: 'EDTECH',
          location: 'Ho Chi Minh City, Vietnam',
          foundingYear: 2022,
          website: 'https://eduforall.vn',
          contactEmail: 'hello@eduforall.vn',
          contactPhone: '+84-28-987-6543',
          founderTypes: '["Education Founder", "Social Impact Founder"]',
          teamSize: 12,
          revenue: 150000,
          fundingRaised: 800000,
          lastValuation: 3000000,
          stgGoals: ['SDG_4', 'SDG_10', 'SDG_5'],
          gedsiMetricsSummary: {
            womenLeadership: 60,
            womenEmployees: 55,
            disabilityInclusion: 25,
            underservedCommunities: 80,
            genderPayGap: 0,
            accessibilityScore: 95
          },
          financials: {
            revenue: 150000,
            expenses: 200000,
            profit: -50000,
            assets: 1200000,
            liabilities: 300000,
            equity: 900000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/edu-business-plan.pdf',
            financialStatements: 'https://docs.example.com/edu-financials.pdf',
            pitchDeck: 'https://docs.example.com/edu-pitch.pdf'
          },
          status: 'ACTIVE',
          createdById: users[2].id, // Dr. Aisha Patel
          tags: ['education', 'disability inclusion', 'accessibility', 'rural development']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'AgriConnect',
          description: 'A digital platform connecting smallholder farmers with markets, providing fair pricing and sustainable farming practices.',
          stage: 'SERIES_B',
          sector: 'AGRITECH',
          location: 'Jakarta, Indonesia',
          foundingYear: 2019,
          website: 'https://agriconnect.id',
          contactEmail: 'info@agriconnect.id',
          contactPhone: '+62-21-555-0123',
          founderTypes: '["Agricultural Founder", "Tech Founder"]',
          teamSize: 45,
          revenue: 8000000,
          fundingRaised: 12000000,
          lastValuation: 40000000,
          stgGoals: ['SDG_2', 'SDG_8', 'SDG_12', 'SDG_15'],
          gedsiMetricsSummary: {
            womenLeadership: 35,
            womenEmployees: 40,
            disabilityInclusion: 8,
            underservedCommunities: 70,
            genderPayGap: 8,
            accessibilityScore: 70
          },
          financials: {
            revenue: 8000000,
            expenses: 5500000,
            profit: 2500000,
            assets: 15000000,
            liabilities: 5000000,
            equity: 10000000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/agri-business-plan.pdf',
            financialStatements: 'https://docs.example.com/agri-financials.pdf',
            pitchDeck: 'https://docs.example.com/agri-pitch.pdf',
            legalDocuments: 'https://docs.example.com/agri-legal.pdf',
            marketResearch: 'https://docs.example.com/agri-market-research.pdf'
          },
          status: 'ACTIVE',
          createdById: users[3].id, // James Thompson
          tags: ['agriculture', 'smallholder farmers', 'market access', 'sustainability']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'HealthBridge',
          description: 'A telemedicine platform providing healthcare access to underserved communities in remote areas.',
          stage: 'SERIES_A',
          sector: 'HEALTHTECH',
          location: 'Manila, Philippines',
          foundingYear: 2021,
          website: 'https://healthbridge.ph',
          contactEmail: 'contact@healthbridge.ph',
          contactPhone: '+63-2-888-9999',
          founderTypes: '["Healthcare Founder", "Tech Founder"]',
          teamSize: 30,
          revenue: 1200000,
          fundingRaised: 3000000,
          lastValuation: 8000000,
          stgGoals: ['SDG_3', 'SDG_10', 'SDG_9'],
          gedsiMetricsSummary: {
            womenLeadership: 50,
            womenEmployees: 60,
            disabilityInclusion: 12,
            underservedCommunities: 85,
            genderPayGap: 3,
            accessibilityScore: 88
          },
          financials: {
            revenue: 1200000,
            expenses: 900000,
            profit: 300000,
            assets: 4000000,
            liabilities: 1000000,
            equity: 3000000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/health-business-plan.pdf',
            financialStatements: 'https://docs.example.com/health-financials.pdf',
            pitchDeck: 'https://docs.example.com/health-pitch.pdf'
          },
          status: 'ACTIVE',
          createdById: users[1].id, // Michael Rodriguez
          tags: ['healthcare', 'telemedicine', 'rural health', 'accessibility']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'WomenInTech',
          description: 'A coding bootcamp and mentorship program specifically designed for women and girls in technology.',
          stage: 'SEED',
          sector: 'EDTECH',
          location: 'Kuala Lumpur, Malaysia',
          foundingYear: 2023,
          website: 'https://womenintech.my',
          contactEmail: 'hello@womenintech.my',
          contactPhone: '+60-3-777-8888',
          founderTypes: '["Tech Founder", "Education Founder"]',
          teamSize: 8,
          revenue: 80000,
          fundingRaised: 500000,
          lastValuation: 2000000,
          stgGoals: ['SDG_4', 'SDG_5', 'SDG_8', 'SDG_10'],
          gedsiMetricsSummary: {
            womenLeadership: 100,
            womenEmployees: 100,
            disabilityInclusion: 20,
            underservedCommunities: 50,
            genderPayGap: 0,
            accessibilityScore: 90
          },
          financials: {
            revenue: 80000,
            expenses: 120000,
            profit: -40000,
            assets: 600000,
            liabilities: 100000,
            equity: 500000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/wit-business-plan.pdf',
            financialStatements: 'https://docs.example.com/wit-financials.pdf',
            pitchDeck: 'https://docs.example.com/wit-pitch.pdf'
          },
          status: 'ACTIVE',
          createdById: users[2].id, // Dr. Aisha Patel
          tags: ['women in tech', 'coding bootcamp', 'mentorship', 'gender equality']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'EcoWaste Solutions',
          description: 'A waste management and recycling company focused on circular economy principles and community engagement.',
          stage: 'SERIES_B',
          sector: 'CLEANTECH',
          location: 'Singapore',
          foundingYear: 2018,
          website: 'https://ecowaste.sg',
          contactEmail: 'info@ecowaste.sg',
          contactPhone: '+65-6-123-4567',
          founderTypes: '["Environmental Founder", "Business Founder"]',
          teamSize: 60,
          revenue: 15000000,
          fundingRaised: 20000000,
          lastValuation: 60000000,
          stgGoals: ['SDG_11', 'SDG_12', 'SDG_13', 'SDG_15'],
          gedsiMetricsSummary: {
            womenLeadership: 30,
            womenEmployees: 35,
            disabilityInclusion: 10,
            underservedCommunities: 40,
            genderPayGap: 12,
            accessibilityScore: 75
          },
          financials: {
            revenue: 15000000,
            expenses: 11000000,
            profit: 4000000,
            assets: 25000000,
            liabilities: 8000000,
            equity: 17000000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/eco-business-plan.pdf',
            financialStatements: 'https://docs.example.com/eco-financials.pdf',
            pitchDeck: 'https://docs.example.com/eco-pitch.pdf',
            legalDocuments: 'https://docs.example.com/eco-legal.pdf',
            marketResearch: 'https://docs.example.com/eco-market-research.pdf',
            sustainabilityReport: 'https://docs.example.com/eco-sustainability.pdf'
          },
          status: 'ACTIVE',
          createdById: users[3].id, // James Thompson
          tags: ['waste management', 'recycling', 'circular economy', 'sustainability']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'Accessible Finance',
          description: 'A microfinance platform providing accessible financial services to people with disabilities and underserved communities.',
          stage: 'SERIES_A',
          sector: 'FINTECH',
          location: 'Bangkok, Thailand',
          foundingYear: 2021,
          website: 'https://accessiblefinance.com',
          contactEmail: 'contact@accessiblefinance.com',
          contactPhone: '+66-2-987-6543',
          founderTypes: '["Fintech Founder", "Social Impact Founder"]',
          teamSize: 20,
          revenue: 800000,
          fundingRaised: 2000000,
          lastValuation: 5000000,
          stgGoals: ['SDG_1', 'SDG_8', 'SDG_10', 'SDG_16'],
          gedsiMetricsSummary: {
            womenLeadership: 45,
            womenEmployees: 50,
            disabilityInclusion: 30,
            underservedCommunities: 90,
            genderPayGap: 2,
            accessibilityScore: 95
          },
          financials: {
            revenue: 800000,
            expenses: 600000,
            profit: 200000,
            assets: 2500000,
            liabilities: 500000,
            equity: 2000000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/finance-business-plan.pdf',
            financialStatements: 'https://docs.example.com/finance-financials.pdf',
            pitchDeck: 'https://docs.example.com/finance-pitch.pdf'
          },
          status: 'ACTIVE',
          createdById: users[2].id, // Dr. Aisha Patel
          tags: ['microfinance', 'financial inclusion', 'disability', 'accessibility']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'RuralConnect',
          description: 'A digital infrastructure company providing internet connectivity to remote rural communities.',
          stage: 'SEED',
          sector: 'TELECOM',
          location: 'Phnom Penh, Cambodia',
          foundingYear: 2022,
          website: 'https://ruralconnect.kh',
          contactEmail: 'hello@ruralconnect.kh',
          contactPhone: '+855-23-456-789',
          founderTypes: '["Tech Founder", "Infrastructure Founder"]',
          teamSize: 15,
          revenue: 200000,
          fundingRaised: 1000000,
          lastValuation: 3000000,
          stgGoals: ['SDG_9', 'SDG_10', 'SDG_17'],
          gedsiMetricsSummary: {
            womenLeadership: 40,
            womenEmployees: 35,
            disabilityInclusion: 15,
            underservedCommunities: 95,
            genderPayGap: 7,
            accessibilityScore: 80
          },
          financials: {
            revenue: 200000,
            expenses: 300000,
            profit: -100000,
            assets: 1500000,
            liabilities: 400000,
            equity: 1100000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/rural-business-plan.pdf',
            financialStatements: 'https://docs.example.com/rural-financials.pdf',
            pitchDeck: 'https://docs.example.com/rural-pitch.pdf'
          },
          status: 'ACTIVE',
          createdById: users[1].id, // Michael Rodriguez
          tags: ['digital infrastructure', 'rural connectivity', 'internet access', 'digital divide']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'Inclusive Housing',
          description: 'A real estate development company focused on creating accessible and affordable housing for people with disabilities.',
          stage: 'SERIES_B',
          sector: 'PROPTECH',
          location: 'Ho Chi Minh City, Vietnam',
          foundingYear: 2020,
          website: 'https://inclusivehousing.vn',
          contactEmail: 'info@inclusivehousing.vn',
          contactPhone: '+84-28-123-4567',
          founderTypes: '["Real Estate Founder", "Social Impact Founder"]',
          teamSize: 35,
          revenue: 5000000,
          fundingRaised: 8000000,
          lastValuation: 20000000,
          stgGoals: ['SDG_11', 'SDG_10', 'SDG_3'],
          gedsiMetricsSummary: {
            womenLeadership: 35,
            womenEmployees: 40,
            disabilityInclusion: 25,
            underservedCommunities: 60,
            genderPayGap: 6,
            accessibilityScore: 92
          },
          financials: {
            revenue: 5000000,
            expenses: 3500000,
            profit: 1500000,
            assets: 12000000,
            liabilities: 3000000,
            equity: 9000000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/housing-business-plan.pdf',
            financialStatements: 'https://docs.example.com/housing-financials.pdf',
            pitchDeck: 'https://docs.example.com/housing-pitch.pdf',
            legalDocuments: 'https://docs.example.com/housing-legal.pdf',
            marketResearch: 'https://docs.example.com/housing-market-research.pdf'
          },
          status: 'ACTIVE',
          createdById: users[3].id, // James Thompson
          tags: ['affordable housing', 'accessibility', 'real estate', 'inclusion']
        }
      }),
      prisma.venture.create({
        data: {
          name: 'Youth Empowerment Hub',
          description: 'A comprehensive youth development program providing skills training, mentorship, and entrepreneurship support.',
          stage: 'SEED',
          sector: 'EDTECH',
          location: 'Jakarta, Indonesia',
          foundingYear: 2023,
          website: 'https://youthempowerment.id',
          contactEmail: 'hello@youthempowerment.id',
          contactPhone: '+62-21-999-8888',
          founderTypes: '["Education Founder", "Youth Development Founder"]',
          teamSize: 10,
          revenue: 100000,
          fundingRaised: 600000,
          lastValuation: 2500000,
          stgGoals: ['SDG_4', 'SDG_8', 'SDG_10', 'SDG_17'],
          gedsiMetricsSummary: {
            womenLeadership: 60,
            womenEmployees: 55,
            disabilityInclusion: 20,
            underservedCommunities: 75,
            genderPayGap: 0,
            accessibilityScore: 85
          },
          financials: {
            revenue: 100000,
            expenses: 150000,
            profit: -50000,
            assets: 800000,
            liabilities: 200000,
            equity: 600000
          },
          documentsMetadata: {
            businessPlan: 'https://docs.example.com/youth-business-plan.pdf',
            financialStatements: 'https://docs.example.com/youth-financials.pdf',
            pitchDeck: 'https://docs.example.com/youth-pitch.pdf'
          },
          status: 'ACTIVE',
          createdById: users[2].id, // Dr. Aisha Patel
          tags: ['youth development', 'skills training', 'mentorship', 'entrepreneurship']
        }
      })
    ])

    console.log('🚀 Created comprehensive ventures')

    // Create comprehensive activities
    const activities = await Promise.all([
      // User registration activities
      ...users.slice(0, 5).map(user => 
        prisma.activity.create({
          data: {
            userId: user.id,
            type: 'NOTE_ADDED',
            title: 'User Registration',
            description: `${user.name} registered on the MIV platform with role: ${user.role}`,
            metadata: {
              type: 'user_registration',
              userRole: user.role,
              organization: user.organization
            }
          }
        })
      ),
      // Venture creation activities
      ...ventures.slice(0, 5).map(venture => 
        prisma.activity.create({
          data: {
            userId: venture.createdById,
            type: 'VENTURE_CREATED',
            title: 'Venture Created',
            description: `New venture "${venture.name}" was created in the ${venture.sector} sector`,
            metadata: {
              type: 'venture_creation',
              ventureId: venture.id,
              ventureName: venture.name,
              sector: venture.sector,
              stage: venture.stage
            }
          }
        })
      ),
      // GEDSI activities
      ...ventures.slice(0, 3).map(venture => 
        prisma.activity.create({
          data: {
            userId: venture.createdById,
            type: 'METRIC_UPDATED',
            title: 'GEDSI Metrics Updated',
            description: `GEDSI metrics updated for venture "${venture.name}"`,
            metadata: {
              type: 'gedsi_update',
              ventureId: venture.id,
              ventureName: venture.name,
              womenLeadership: venture.gedsiMetricsSummary?.womenLeadership,
              womenEmployees: venture.gedsiMetricsSummary?.womenEmployees
            }
          }
        })
      ),
      // System activities
      prisma.activity.create({
        data: {
          userId: users[0].id, // Sarah Chen (Admin)
          type: 'NOTE_ADDED',
          title: 'System Configuration Updated',
          description: 'System configuration has been updated with new GEDSI metrics and IRIS catalog',
          metadata: {
            type: 'system_config',
            updatedComponents: ['gedsi_metrics', 'iris_catalog', 'notifications']
          }
        }
      }),
      prisma.activity.create({
        data: {
          userId: users[1].id, // Michael Rodriguez
          type: 'NOTE_ADDED',
          title: 'Impact Report Generated',
          description: 'Monthly impact report has been generated for all active ventures',
          metadata: {
            type: 'report_generation',
            reportType: 'monthly_impact',
            venturesCount: ventures.length,
            period: '2024-01'
          }
        }
      })
    ])

    console.log('📝 Created activity logs')

    // Create comprehensive notifications
    const notifications = await Promise.all([
      // Welcome notifications
      ...users.slice(0, 5).map(user => 
        prisma.notification.create({
          data: {
            userId: user.id,
            type: 'WELCOME',
            title: 'Welcome to MIV Platform!',
            message: `Welcome ${user.name}! You now have access to the MIV platform. Explore our features and start managing ventures.`,
            isRead: false,
            metadata: {
              type: 'welcome',
              timestamp: new Date().toISOString()
            }
          }
        })
      ),
      // Venture-related notifications
        prisma.notification.create({
          data: {
            userId: users[1].id, // Michael Rodriguez
            type: 'VENTURE_CREATED',
          title: 'New Venture Added: GreenTech Solutions',
          message: 'A new venture "GreenTech Solutions" has been added to your portfolio. Review the details and provide feedback.',
          isRead: false,
          metadata: {
            ventureId: ventures[0].id,
            ventureName: 'GreenTech Solutions',
            type: 'venture_created'
          }
        }
      }),
      prisma.notification.create({
        data: {
          userId: users[2].id, // Dr. Aisha Patel
          type: 'GEDSI_ALERT',
          title: 'GEDSI Metrics Update Required',
          message: 'The GEDSI metrics for "EduForAll" need to be updated. Please review and submit the latest data.',
          isRead: false,
          metadata: {
            ventureId: ventures[1].id,
            ventureName: 'EduForAll',
            type: 'gedsi_update_required'
          }
        }
      }),
      prisma.notification.create({
        data: {
          userId: users[3].id, // James Thompson
          type: 'FUNDING_OPPORTUNITY',
          title: 'New Funding Opportunity Available',
          message: 'A new funding opportunity matching your venture "AgriConnect" has been identified. Review the details.',
          isRead: false,
          metadata: {
            ventureId: ventures[2].id,
            ventureName: 'AgriConnect',
            type: 'funding_opportunity',
            fundingAmount: 5000000
          }
        }
      }),
      // System notifications
      prisma.notification.create({
        data: {
          userId: users[0].id, // Sarah Chen (Admin)
          type: 'SYSTEM_UPDATE',
          title: 'System Maintenance Scheduled',
          message: 'System maintenance is scheduled for this weekend. The platform will be unavailable from 2 AM to 6 AM on Sunday.',
          isRead: false,
          metadata: {
            type: 'maintenance',
            scheduledDate: '2024-01-14T02:00:00Z',
            duration: '4 hours'
          }
        }
      }),
      prisma.notification.create({
        data: {
          userId: users[4].id, // Maria Santos
          type: 'REPORT_READY',
          title: 'Monthly Impact Report Ready',
          message: 'Your monthly impact report for December 2023 is now available. Download and review the comprehensive analysis.',
          isRead: false,
          metadata: {
            type: 'report',
            reportType: 'monthly_impact',
            period: '2023-12',
            downloadUrl: '/reports/monthly-impact-2023-12.pdf'
          }
        }
      })
    ])

    console.log('🔔 Created notifications')

    // Create comprehensive email logs
    const emailLogs = await Promise.all([
      // Welcome emails
      ...users.slice(0, 5).map(user => 
        prisma.emailLog.create({
          data: {
            to: user.email,
            subject: 'Welcome to MIV Platform',
            template: 'welcome',
            status: 'SENT',
            sentAt: new Date(),
            metadata: {
              userId: user.id,
              userName: user.name,
              type: 'welcome_email'
            }
          }
        })
      ),
      // Weekly update emails
      ...users.slice(0, 3).map(user => 
        prisma.emailLog.create({
          data: {
            to: user.email,
            subject: 'Weekly Update - MIV Platform',
            template: 'weekly_update',
            status: 'SENT',
            sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            metadata: {
              userId: user.id,
              userName: user.name,
              type: 'weekly_update',
              period: '2024-01-01 to 2024-01-07'
            }
          }
        })
      ),
      // STG reminder emails
      ...users.slice(1, 4).map(user => 
        prisma.emailLog.create({
          data: {
            to: user.email,
            subject: 'STG Goals Reminder',
            template: 'stg_reminder',
            status: 'SENT',
            sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            metadata: {
              userId: user.id,
              userName: user.name,
              type: 'stg_reminder',
              venturesCount: 3
            }
          }
        })
      ),
      // Failed email
      prisma.emailLog.create({
        data: {
          to: 'invalid@example.com',
          subject: 'Test Email',
          template: 'test',
          status: 'FAILED',
          sentAt: null,
          errorMessage: 'Invalid email address',
          metadata: {
            type: 'test_email',
            attemptCount: 3
          }
        }
      })
    ])

    console.log('📧 Created email logs')

    return NextResponse.json({
      success: true,
      message: 'Comprehensive test data created successfully!',
      data: {
        users: users.length,
        ventures: ventures.length,
        irisMetrics: irisMetrics.length,
        notifications: notifications.length,
        emailLogs: emailLogs.length,
        activities: activities.length
      },
      testUsers: users.map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.role === 'ADMIN' ? 'admin123' : 
                 user.role === 'VENTURE_MANAGER' ? 'manager123' :
                 user.role === 'GEDSI_ANALYST' ? 'analyst123' :
                 user.role === 'CAPITAL_FACILITATOR' ? 'facilitator123' :
                 user.role === 'EXTERNAL_STAKEHOLDER' ? 'stakeholder123' : 'test123'
      }))
    })

  } catch (error) {
    console.error('Error seeding comprehensive data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed comprehensive data', details: error.message },
      { status: 500 }
    )
  }
}
