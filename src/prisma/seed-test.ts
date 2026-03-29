import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Seeding TEST profiles and data (purging old data)...')

  // Purge all app data (keeps IRIS catalog intact)
  await prisma.$transaction([
    prisma.workflowRun.deleteMany(),
    prisma.workflow.deleteMany(),
    prisma.emailLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.capitalActivity.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.document.deleteMany(),
    prisma.gEDSIMetric.deleteMany(),
    prisma.venture.deleteMany(),
  ])

  // Also remove users and auth tables so we start clean for tests
  await prisma.$transaction([
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // Test users with known credentials
  const password = {
    admin: await bcrypt.hash('TestAdmin@123', 10),
    manager: await bcrypt.hash('TestManager@123', 10),
    analyst: await bcrypt.hash('TestAnalyst@123', 10),
    vm: await bcrypt.hash('TestVM@123', 10),
    user: await bcrypt.hash('TestUser@123', 10),
  }

  const [admin, manager, analyst, ventureMgr, testUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'test.admin@miv.org',
        name: 'Test Admin',
        role: 'ADMIN',
        passwordHash: password.admin,
      },
    }),
    prisma.user.create({
      data: {
        email: 'test.manager@miv.org',
        name: 'Test Manager',
        role: 'MANAGER',
        passwordHash: password.manager,
      },
    }),
    prisma.user.create({
      data: {
        email: 'test.analyst@miv.org',
        name: 'Test Analyst',
        role: 'ANALYST',
        passwordHash: password.analyst,
      },
    }),
    prisma.user.create({
      data: {
        email: 'test.venture.manager@miv.org',
        name: 'Test Venture Manager',
        role: 'VENTURE_MANAGER',
        passwordHash: password.vm,
      },
    }),
    prisma.user.create({
      data: {
        email: 'test.user@miv.org',
        name: 'Test User',
        role: 'USER',
        passwordHash: password.user,
      },
    }),
  ])

  console.log('✅ Test users created')

  // Minimal ventures for UI flows
  const ventureA = await prisma.venture.create({
    data: {
      name: 'Test Solar Co',
      sector: 'CleanTech',
      location: 'Da Nang, Vietnam',
      website: 'https://test-solar-co.com',
      contactEmail: 'contact@testsolar.co',
      contactPhone: '+84 999 111 222',
      pitchSummary: 'Affordable solar kits for peri-urban households',
      inclusionFocus: 'Women-led, peri-urban focus',
      founderTypes: JSON.stringify(['women-led']),
      teamSize: 7,
      foundingYear: 2022,
      targetMarket: 'Peri-urban households in central Vietnam',
      revenueModel: 'Direct sales + financing partners',
      revenue: 120000,
      fundingRaised: 80000,
      lastValuation: 900000,
      stgGoals: ['SDG7', 'SDG10'],
      gedsiGoals: ['OI.1', 'OI.2'],
      stage: 'SCREENING',
      createdById: admin.id,
      assignedToId: ventureMgr.id,
      documentsMetadata: { pitchDeck: true },
      tags: ['pilot', 'energy'],
      intakeDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      screeningDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      nextReviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      documentsMetadata: { pitchDeck: true, termSheet: false, dataRoom: true },
      financials: { runwayMonths: 12, burnRate: 25000, arpu: 18, churnPct: 3.2 },
      aiAnalysis: { readinessScore: 78, risks: ['supply chain'], recommendations: ['optimize BOM'] },
    },
  })

  const ventureB = await prisma.venture.create({
    data: {
      name: 'Test Agro Hub',
      sector: 'Agriculture',
      location: 'Hanoi, Vietnam',
      website: 'https://test-agro-hub.com',
      contactEmail: 'hello@agrohub.test',
      pitchSummary: 'Digital extension services for smallholders',
      founderTypes: JSON.stringify(['youth-led', 'disability-inclusive']),
      teamSize: 12,
      foundingYear: 2021,
      targetMarket: 'Smallholders in Red River Delta',
      revenueModel: 'Subscription',
      revenue: 60000,
      fundingRaised: 20000,
      lastValuation: 300000,
      stgGoals: ['SDG2', 'SDG8'],
      gedsiGoals: ['OI.3', 'OI.4'],
      stage: 'INTAKE',
      createdById: analyst.id,
      assignedToId: manager.id,
      tags: ['agri', 'platform'],
      intakeDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      nextReviewAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      documentsMetadata: { pitchDeck: true, farmerSurveys: true },
      financials: { runwayMonths: 8, burnRate: 12000, cac: 9, ltv: 140 },
      aiAnalysis: { readinessScore: 64, risks: ['go-to-market'], recommendations: ['pilot cooperatives'] },
    },
  })

  // Additional ventures across stages/sectors to exercise UI
  const ventureC = await prisma.venture.create({
    data: {
      name: 'Test FinAccess',
      sector: 'FinTech',
      location: 'Phnom Penh, Cambodia',
      website: 'https://test-finaccess.com',
      contactEmail: 'team@finaccess.test',
      pitchSummary: 'Agent banking for unbanked women entrepreneurs',
      founderTypes: JSON.stringify(['women-led']),
      teamSize: 18,
      foundingYear: 2020,
      targetMarket: 'Micro-SMEs in peri-urban Cambodia',
      revenueModel: 'Transaction fees',
      revenue: 420000,
      fundingRaised: 400000,
      lastValuation: 5000000,
      stgGoals: ['SDG1', 'SDG5'],
      gedsiGoals: ['OI.1', 'OI.2', 'OI.6'],
      stage: 'DUE_DILIGENCE',
      createdById: manager.id,
      assignedToId: ventureMgr.id,
      tags: ['fintech', 'women'],
      intakeDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      screeningDate: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000), // ~1 year ago
      dueDiligenceStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      financials: { runwayMonths: 18, burnRate: 60000, takeRatePct: 1.2, txVolume: 4200000 },
      aiAnalysis: { readinessScore: 85, risks: ['regulatory'], recommendations: ['partner with bank'] },
    },
  })

  const ventureD = await prisma.venture.create({
    data: {
      name: 'Test HealthLink',
      sector: 'HealthTech',
      location: 'Ho Chi Minh City, Vietnam',
      website: 'https://test-healthlink.com',
      contactEmail: 'contact@healthlink.test',
      pitchSummary: 'Accessible telehealth for people with disabilities',
      founderTypes: JSON.stringify(['disability-inclusive']),
      teamSize: 10,
      foundingYear: 2019,
      targetMarket: 'Low-income urban populations',
      revenueModel: 'B2G and clinic subscriptions',
      revenue: 210000,
      fundingRaised: 300000,
      lastValuation: 1800000,
      stgGoals: ['SDG3', 'SDG10'],
      gedsiGoals: ['OI.2', 'OI.5'],
      stage: 'INVESTMENT_READY',
      createdById: admin.id,
      assignedToId: manager.id,
      tags: ['health', 'accessibility'],
      intakeDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      screeningDate: new Date(Date.now() - 340 * 24 * 60 * 60 * 1000), // ~1 year ago
      dueDiligenceStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
      dueDiligenceEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      investmentReadyAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      financials: { runwayMonths: 10, burnRate: 35000, clinics: 85 },
      aiAnalysis: { readinessScore: 90, risks: ['interoperability'], recommendations: ['HL7 adapters'] },
    },
  })

  const ventureE = await prisma.venture.create({
    data: {
      name: 'Test EduBridge',
      sector: 'EdTech',
      location: 'Da Lat, Vietnam',
      website: 'https://test-edubridge.com',
      contactEmail: 'info@edubridge.test',
      pitchSummary: 'STEM pathways for rural girls',
      founderTypes: JSON.stringify(['women-led', 'rural-focus']),
      teamSize: 9,
      foundingYear: 2022,
      targetMarket: 'Rural secondary schools',
      revenueModel: 'B2B2C with scholarships',
      revenue: 95000,
      fundingRaised: 120000,
      lastValuation: 700000,
      stgGoals: ['SDG4', 'SDG5'],
      gedsiGoals: ['OI.1', 'OI.3'],
      stage: 'SEED',
      createdById: analyst.id,
      assignedToId: ventureMgr.id,
      tags: ['education', 'girls'],
      intakeDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      screeningDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      financials: { runwayMonths: 14, burnRate: 15000, cohorts: 32 },
      aiAnalysis: { readinessScore: 72, risks: ['scalability'], recommendations: ['train trainers'] },
    },
  })

  const ventureF = await prisma.venture.create({
    data: {
      name: 'Test RecycleNet',
      sector: 'CircularEconomy',
      location: 'Hue, Vietnam',
      website: 'https://test-recyclenet.com',
      contactEmail: 'hello@recyclenet.test',
      pitchSummary: 'Digital marketplace for informal waste pickers',
      founderTypes: JSON.stringify(['social-enterprise']),
      teamSize: 16,
      foundingYear: 2018,
      targetMarket: 'Municipalities and recyclers',
      revenueModel: 'Marketplace fees',
      revenue: 310000,
      fundingRaised: 300000,
      lastValuation: 2500000,
      stgGoals: ['SDG11', 'SDG12'],
      gedsiGoals: ['OI.3', 'OI.6'],
      stage: 'FUNDED',
      createdById: admin.id,
      assignedToId: manager.id,
      tags: ['circular', 'waste'],
      intakeDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      screeningDate: new Date(Date.now() - 340 * 24 * 60 * 60 * 1000), // ~1 year ago
      dueDiligenceStart: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      dueDiligenceEnd: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
      investmentReadyAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
      fundedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      financials: { runwayMonths: 24, burnRate: 45000, gmPct: 44 },
      aiAnalysis: { readinessScore: 88, risks: ['fragmented suppliers'], recommendations: ['collector app'] },
    },
  })

  const ventureG = await prisma.venture.create({
    data: {
      name: 'Test AgroChain ID',
      sector: 'SupplyChain',
      location: 'Jakarta, Indonesia',
      website: 'https://test-agrochain-id.com',
      contactEmail: 'ops@agrochain.id',
      pitchSummary: 'Cold-chain logistics for smallholder co-ops',
      founderTypes: JSON.stringify(['youth-led']),
      teamSize: 22,
      foundingYear: 2020,
      targetMarket: 'Agri co-ops in Java & Sumatra',
      revenueModel: 'Logistics fees + SaaS',
      revenue: 5200000000, // IDR
      fundingRaised: 600000, // IDR
      lastValuation: 45000000000, // IDR
      stgGoals: ['SDG2', 'SDG9'],
      gedsiGoals: ['OI.3'],
      stage: 'SCREENING',
      createdById: manager.id,
      assignedToId: ventureMgr.id,
      tags: ['logistics', 'cold-chain'],
      intakeDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      screeningDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      financials: { runwayMonths: 9, burnRate: 550000000, activeHubs: 12 },
      aiAnalysis: { readinessScore: 68, risks: ['capex'], recommendations: ['lease units'] },
    },
  })

  const ventureH = await prisma.venture.create({
    data: {
      name: 'Test SeaHealth PH',
      sector: 'HealthTech',
      location: 'Cebu, Philippines',
      website: 'https://test-seahealth-ph.com',
      contactEmail: 'team@seahealth.ph',
      pitchSummary: 'Telemedicine for island communities',
      founderTypes: JSON.stringify(['rural-focus']),
      teamSize: 13,
      foundingYear: 2017,
      targetMarket: 'Island barangays in Visayas',
      revenueModel: 'Prepaid consult packs',
      revenue: 18500000, // PHP
      fundingRaised: 800000, // PHP
      lastValuation: 150000000, // PHP
      stgGoals: ['SDG3', 'SDG10'],
      gedsiGoals: ['OI.5'],
      stage: 'SERIES_A',
      createdById: admin.id,
      assignedToId: ventureMgr.id,
      tags: ['telemedicine', 'islands'],
      intakeDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      screeningDate: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000), // ~1 year ago
      dueDiligenceStart: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      dueDiligenceEnd: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
      investmentReadyAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
      fundedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      financials: { runwayMonths: 16, burnRate: 400000, avgConsultFee: 3.5 },
      aiAnalysis: { readinessScore: 82, risks: ['connectivity'], recommendations: ['offline mode'] },
    },
  })


  // Legacy metrics for backward compatibility
  await prisma.gEDSIMetric.createMany({
    data: [
      {
        ventureId: ventureA.id,
        metricCode: 'OI.1',
        metricName: 'Women-led ventures supported',
        category: 'GENDER',
        targetValue: 50,
        currentValue: 10,
        unit: 'ventures',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
      },
      {
        ventureId: ventureB.id,
        metricCode: 'OI.3',
        metricName: 'Rural communities served',
        category: 'SOCIAL_INCLUSION',
        targetValue: 80,
        currentValue: 20,
        unit: 'communities',
        status: 'NOT_STARTED',
        createdById: analyst.id,
      },
      {
        ventureId: ventureC.id,
        metricCode: 'OI.2',
        metricName: 'Ventures with disability inclusion',
        category: 'DISABILITY',
        targetValue: 60,
        currentValue: 35,
        unit: 'ventures',
        status: 'VERIFIED',
        createdById: manager.id,
      },
      {
        ventureId: ventureC.id,
        metricCode: 'OI.6',
        metricName: 'Customers served',
        category: 'CROSS_CUTTING',
        targetValue: 100000,
        currentValue: 42000,
        unit: 'customers',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: manager.id,
      },
      {
        ventureId: ventureD.id,
        metricCode: 'OI.5',
        metricName: 'Accessible service points',
        category: 'DISABILITY',
        targetValue: 120,
        currentValue: 85,
        unit: 'sites',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
      },
      {
        ventureId: ventureE.id,
        metricCode: 'OI.1',
        metricName: 'Girls in STEM programs',
        category: 'GENDER',
        targetValue: 2000,
        currentValue: 450,
        unit: 'students',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: analyst.id,
      },
      {
        ventureId: ventureF.id,
        metricCode: 'OI.3',
        metricName: 'Communities engaged',
        category: 'SOCIAL_INCLUSION',
        targetValue: 150,
        currentValue: 130,
        unit: 'communities',
        status: 'COMPLETED',
        createdById: admin.id,
      },
      {
        ventureId: ventureG.id,
        metricCode: 'OI.3',
        metricName: 'Co-ops onboarded',
        category: 'SOCIAL_INCLUSION',
        targetValue: 75,
        currentValue: 22,
        unit: 'coops',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: manager.id,
      },
      {
        ventureId: ventureH.id,
        metricCode: 'OI.5',
        metricName: 'Clinics connected',
        category: 'DISABILITY',
        targetValue: 90,
        currentValue: 70,
        unit: 'clinics',
        status: 'VERIFIED',
        createdById: admin.id,
      },
    ],
  })

  // Add verification dates to some verified/completed metrics
  const verifiedMetrics = await prisma.gEDSIMetric.findMany({
    where: { status: { in: ['VERIFIED', 'COMPLETED'] } },
    select: { id: true },
  })
  for (const m of verifiedMetrics) {
    await prisma.gEDSIMetric.update({
      where: { id: m.id },
      data: { verificationDate: new Date() },
    })
  }

  // Documents per venture
  // Create additional ventures with more detailed data
  const ventureI = await prisma.venture.create({
    data: {
      name: 'CleanWater Solutions',
      description: 'IoT-enabled water purification systems for rural communities, providing clean drinking water and real-time quality monitoring.',
      sector: 'Water & Sanitation',
      stage: 'SERIES_A',
      status: 'ACTIVE',
      location: 'Bangkok, Thailand',
      website: 'https://cleanwater-solutions.com',
      contactEmail: 'info@cleanwater.ke',
      contactPhone: '+66 2 123 4567',
      fundingRaised: 800000,
      teamSize: 28,
      foundingYear: 2021,
      gedsiGoals: ['OI.1', 'OI.3', 'OI.5'],
      stage: 'SERIES_A',
      createdById: admin.id,
      assignedToId: ventureMgr.id,
      tags: ['water', 'iot', 'rural'],
      intakeDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // 10 months ago
      screeningDate: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000), // ~10 months ago
      dueDiligenceStart: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 5 months ago
      dueDiligenceEnd: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
      investmentReadyAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
      fundedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      documentsMetadata: { pitchDeck: true, termSheet: true, dataRoom: true, waterQualityReports: true },
      financials: { 
        runwayMonths: 18, 
        burnRate: 85000, 
        installations: 150, 
        avgRevenuePerInstallation: 1200,
        customerRetentionRate: 94,
        waterQualityImprovement: 98.5
      },
      aiAnalysis: { 
        readinessScore: 92, 
        risks: ['maintenance logistics'], 
        recommendations: ['predictive maintenance AI', 'local technician training'],
        marketSize: '2.1B',
        competitiveAdvantage: 'IoT integration'
      },
      founderTypes: 'MIXED',
    },
  })

  const ventureJ = await prisma.venture.create({
    data: {
      name: 'GreenTransport Hub',
      description: 'Electric vehicle charging network with renewable energy integration, focusing on last-mile delivery and public transport.',
      sector: 'Transportation',
      stage: 'SEED',
      status: 'ACTIVE',
      location: 'Kuala Lumpur, Malaysia',
      website: 'https://greentransport-hub.com',
      contactEmail: 'hello@greentransport.ng',
      contactPhone: '+60 3 1234 5678',
      fundingRaised: 500000,
      teamSize: 15,
      foundingYear: 2022,
      gedsiGoals: ['OI.2', 'OI.4', 'OI.6'],
      stage: 'SEED',
      createdById: manager.id,
      assignedToId: analyst.id,
      tags: ['transport', 'electric', 'renewable'],
      intakeDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      screeningDate: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000), // ~6 months ago
      nextReviewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      documentsMetadata: { pitchDeck: true, feasibilityStudy: true, pilotResults: true },
      financials: { 
        runwayMonths: 12, 
        burnRate: 45000, 
        chargingStations: 25, 
        dailyChargingSessions: 180,
        avgRevenuePerSession: 8.50,
        carbonOffsetTons: 1250
      },
      aiAnalysis: { 
        readinessScore: 76, 
        risks: ['grid infrastructure'], 
        recommendations: ['battery storage systems', 'partnership with utilities'],
        marketSize: '850M',
        competitiveAdvantage: 'renewable integration'
      },
      founderTypes: 'MIXED',
    },
  })

  const ventureK = await prisma.venture.create({
    data: {
      name: 'AgriTech Analytics',
      description: 'AI-powered crop monitoring and yield prediction platform using satellite imagery and IoT sensors for smallholder farmers.',
      sector: 'Agriculture',
      stage: 'DUE_DILIGENCE',
      status: 'ACTIVE',
      location: 'Singapore, Singapore',
      website: 'https://agritech-analytics.com',
      contactEmail: 'contact@agritech-analytics.ug',
      contactPhone: '+65 6123 4567',
      fundingRaised: 600000,
      teamSize: 22,
      foundingYear: 2021,
      gedsiGoals: ['OI.1', 'OI.3', 'OI.5'],
      stage: 'DUE_DILIGENCE',
      createdById: ventureMgr.id,
      assignedToId: manager.id,
      tags: ['agriculture', 'ai', 'satellite', 'iot'],
      intakeDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000), // 8 months ago
      screeningDate: new Date(Date.now() - 220 * 24 * 60 * 60 * 1000), // ~8 months ago
      dueDiligenceStart: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      nextReviewAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      documentsMetadata: { pitchDeck: true, technicalSpecs: true, pilotData: true, farmerTestimonials: true },
      financials: { 
        runwayMonths: 14, 
        burnRate: 55000, 
        activeFarms: 450, 
        avgYieldIncrease: 23,
        subscriptionRevenue: 180000,
        farmerSatisfactionScore: 4.6
      },
      aiAnalysis: { 
        readinessScore: 84, 
        risks: ['data connectivity'], 
        recommendations: ['offline mode development', 'local data centers'],
        marketSize: '1.8B',
        competitiveAdvantage: 'satellite + IoT fusion'
      },
      founderTypes: 'MIXED',
    },
  })

  const ventureL = await prisma.venture.create({
    data: {
      name: 'EduTech Platform',
      description: 'Comprehensive online learning platform with offline capabilities, focusing on STEM education for underserved communities.',
      sector: 'Education',
      stage: 'INVESTMENT_READY',
      status: 'ACTIVE',
      location: 'Manila, Philippines',
      website: 'https://edutech-platform.com',
      contactEmail: 'info@edutech-platform.gh',
      contactPhone: '+63 2 1234 5678',
      fundingRaised: 700000,
      teamSize: 35,
      foundingYear: 2020,
      gedsiGoals: ['OI.1', 'OI.2', 'OI.4'],
      stage: 'INVESTMENT_READY',
      createdById: admin.id,
      assignedToId: ventureMgr.id,
      tags: ['education', 'stem', 'offline', 'platform'],
      intakeDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000), // 13 months ago
      screeningDate: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000), // ~13 months ago
      dueDiligenceStart: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
      dueDiligenceEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      investmentReadyAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      nextReviewAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      documentsMetadata: { pitchDeck: true, curriculum: true, impactReport: true, teacherTraining: true },
      financials: { 
        runwayMonths: 20, 
        burnRate: 75000, 
        activeStudents: 12500, 
        completionRate: 78,
        avgLearningHours: 45,
        teacherCertifications: 280
      },
      aiAnalysis: { 
        readinessScore: 89, 
        risks: ['content localization'], 
        recommendations: ['local language support', 'cultural adaptation'],
        marketSize: '3.2B',
        competitiveAdvantage: 'offline-first design'
      },
      founderTypes: 'MIXED',
    },
  })

  const ventureM = await prisma.venture.create({
    data: {
      name: 'HealthConnect Mobile',
      description: 'Telemedicine platform with AI diagnostics, connecting rural patients with urban specialists through mobile technology.',
      sector: 'Healthcare',
      stage: 'FUNDED',
      status: 'ACTIVE',
      location: 'Yangon, Myanmar',
      website: 'https://healthconnect-mobile.com',
      contactEmail: 'support@healthconnect.tz',
      contactPhone: '+95 1 123 456',
      fundingRaised: 900000,
      teamSize: 42,
      foundingYear: 2019,
      gedsiGoals: ['OI.2', 'OI.5', 'OI.6'],
      stage: 'FUNDED',
      createdById: manager.id,
      assignedToId: admin.id,
      tags: ['healthcare', 'telemedicine', 'ai', 'mobile'],
      intakeDate: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000), // 16 months ago
      screeningDate: new Date(Date.now() - 480 * 24 * 60 * 60 * 1000), // ~16 months ago
      dueDiligenceStart: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 6.5 months ago
      dueDiligenceEnd: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
      investmentReadyAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
      fundedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      documentsMetadata: { pitchDeck: true, clinicalTrials: true, regulatoryApproval: true, patientData: true },
      financials: { 
        runwayMonths: 24, 
        burnRate: 120000, 
        activePatients: 8500, 
        consultationsPerMonth: 2500,
        avgConsultationFee: 12.50,
        diagnosticAccuracy: 94.2
      },
      aiAnalysis: { 
        readinessScore: 95, 
        risks: ['regulatory compliance'], 
        recommendations: ['expand to neighboring countries', 'partner with insurance'],
        marketSize: '4.1B',
        competitiveAdvantage: 'AI diagnostics integration'
      },
      founderTypes: 'MIXED',
    },
  })

  const ventureN = await prisma.venture.create({
    data: {
      name: 'Renewable Energy Grid',
      description: 'Microgrid solutions combining solar, wind, and battery storage for rural electrification and industrial applications.',
      sector: 'Energy',
      stage: 'SCREENING',
      status: 'ACTIVE',
      location: 'Vientiane, Laos',
      website: 'https://renewable-energy-grid.com',
      contactEmail: 'hello@renewable-grid.et',
      contactPhone: '+856 21 123 456',
      fundingRaised: 400000,
      teamSize: 18,
      foundingYear: 2022,
      gedsiGoals: ['OI.3', 'OI.4', 'OI.6'],
      stage: 'SCREENING',
      createdById: analyst.id,
      assignedToId: manager.id,
      tags: ['energy', 'microgrid', 'renewable', 'rural'],
      intakeDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
      screeningDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      nextReviewAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      documentsMetadata: { pitchDeck: true, feasibilityStudy: true, pilotResults: true },
      financials: { 
        runwayMonths: 8, 
        burnRate: 35000, 
        microgridsDeployed: 12, 
        householdsConnected: 480,
        avgRevenuePerHousehold: 25,
        energyReliability: 99.2
      },
      aiAnalysis: { 
        readinessScore: 71, 
        risks: ['installation complexity'], 
        recommendations: ['simplify installation process', 'local technician training'],
        marketSize: '2.8B',
        competitiveAdvantage: 'hybrid energy optimization'
      },
      founderTypes: 'MIXED',
    },
  })

  const ventureO = await prisma.venture.create({
    data: {
      name: 'FinTech Inclusion',
      description: 'Digital banking platform with micro-lending capabilities, focusing on financial inclusion for women entrepreneurs.',
      sector: 'Financial Services',
      stage: 'SERIES_B',
      status: 'ACTIVE',
      location: 'Bandar Seri Begawan, Brunei',
      website: 'https://fintech-inclusion.com',
      contactEmail: 'contact@fintech-inclusion.rw',
      contactPhone: '+673 123 4567',
      fundingRaised: 600000,
      teamSize: 55,
      foundingYear: 2018,
      gedsiGoals: ['OI.1', 'OI.2', 'OI.6'],
      stage: 'SERIES_B',
      createdById: admin.id,
      assignedToId: ventureMgr.id,
      tags: ['fintech', 'microfinance', 'women', 'banking'],
      intakeDate: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000), // 20 months ago
      screeningDate: new Date(Date.now() - 580 * 24 * 60 * 60 * 1000), // ~20 months ago
      dueDiligenceStart: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // 10 months ago
      dueDiligenceEnd: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      investmentReadyAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
      fundedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      documentsMetadata: { pitchDeck: true, financialStatements: true, regulatoryCompliance: true, impactMetrics: true },
      financials: { 
        runwayMonths: 30, 
        burnRate: 180000, 
        activeUsers: 25000, 
        loansDisbursed: 8500,
        avgLoanSize: 450,
        repaymentRate: 96.8
      },
      aiAnalysis: { 
        readinessScore: 93, 
        risks: ['regulatory changes'], 
        recommendations: ['expand to regional markets', 'develop insurance products'],
        marketSize: '5.2B',
        competitiveAdvantage: 'women-focused approach'
      },
      founderTypes: 'MIXED',
    },
  })

  const allVentures = [ventureA, ventureB, ventureC, ventureD, ventureE, ventureF, ventureG, ventureH, ventureI, ventureJ, ventureK, ventureL, ventureM, ventureN, ventureO]

  // Comprehensive GEDSI metrics for all ventures
  const gedsiMetricsData = []
  
  for (const v of allVentures) {
    // Base metrics for all ventures
    gedsiMetricsData.push(
      {
        ventureId: v.id,
        metricCode: 'OI.1',
        metricName: 'Women in Leadership',
        category: 'GENDER',
        targetValue: 50,
        currentValue: Math.floor(Math.random() * 40) + 20,
        unit: '%',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Strong progress on gender diversity in leadership roles',
      },
      {
        ventureId: v.id,
        metricCode: 'OI.2',
        metricName: 'Community Impact',
        category: 'SOCIAL_INCLUSION',
        targetValue: 1000,
        currentValue: Math.floor(Math.random() * 800) + 200,
        unit: 'people',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Positive community engagement and impact',
      },
      {
        ventureId: v.id,
        metricCode: 'OI.3',
        metricName: 'Rural Reach',
        category: 'SOCIAL_INCLUSION',
        targetValue: 70,
        currentValue: Math.floor(Math.random() * 50) + 30,
        unit: '%',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Strong rural market penetration',
      },
      {
        ventureId: v.id,
        metricCode: 'OI.4',
        metricName: 'Youth Employment',
        category: 'SOCIAL_INCLUSION',
        targetValue: 50,
        currentValue: Math.floor(Math.random() * 40) + 20,
        unit: '%',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Creating opportunities for young people',
      },
      {
        ventureId: v.id,
        metricCode: 'OI.5',
        metricName: 'Environmental Impact',
        category: 'CROSS_CUTTING',
        targetValue: 80,
        currentValue: Math.floor(Math.random() * 60) + 20,
        unit: 'tons CO2 saved',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Significant environmental benefits achieved',
      },
      {
        ventureId: v.id,
        metricCode: 'OI.6',
        metricName: 'Accessibility Score',
        category: 'DISABILITY',
        targetValue: 80,
        currentValue: Math.floor(Math.random() * 40) + 40,
        unit: 'score',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Good accessibility features implemented',
      }
    )

    // Sector-specific metrics
    if (v.sector === 'Healthcare') {
      gedsiMetricsData.push({
        ventureId: v.id,
        metricCode: 'HC.1',
        metricName: 'Patient Outcomes',
        category: 'CROSS_CUTTING',
        targetValue: 90,
        currentValue: Math.floor(Math.random() * 20) + 70,
        unit: '%',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Excellent patient outcome rates',
      })
    } else if (v.sector === 'Education') {
      gedsiMetricsData.push({
        ventureId: v.id,
        metricCode: 'ED.1',
        metricName: 'Learning Outcomes',
        category: 'CROSS_CUTTING',
        targetValue: 85,
        currentValue: Math.floor(Math.random() * 20) + 65,
        unit: '%',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Strong learning achievement rates',
      })
    } else if (v.sector === 'Agriculture') {
      gedsiMetricsData.push({
        ventureId: v.id,
        metricCode: 'AG.1',
        metricName: 'Yield Improvement',
        category: 'CROSS_CUTTING',
        targetValue: 25,
        currentValue: Math.floor(Math.random() * 20) + 10,
        unit: '%',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Significant yield improvements achieved',
      })
    } else if (v.sector === 'Financial Services') {
      gedsiMetricsData.push({
        ventureId: v.id,
        metricCode: 'FS.1',
        metricName: 'Financial Inclusion',
        category: 'CROSS_CUTTING',
        targetValue: 10000,
        currentValue: Math.floor(Math.random() * 8000) + 2000,
        unit: 'new accounts',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Strong financial inclusion impact',
      })
    } else if (v.sector === 'Energy') {
      gedsiMetricsData.push({
        ventureId: v.id,
        metricCode: 'EN.1',
        metricName: 'Clean Energy Access',
        category: 'CROSS_CUTTING',
        targetValue: 1000,
        currentValue: Math.floor(Math.random() * 800) + 200,
        unit: 'households',
        status: Math.random() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
        createdById: admin.id,
        verificationDate: new Date(),
        notes: 'Significant clean energy access provided',
      })
    }
  }

  await prisma.gEDSIMetric.createMany({
    data: gedsiMetricsData
  })

  for (const v of allVentures) {
    await prisma.document.createMany({
      data: [
        {
          ventureId: v.id,
          name: 'Pitch Deck',
          type: 'PITCH_DECK',
          url: `https://example.com/${v.name.replace(/\s+/g, '-').toLowerCase()}-deck.pdf`,
          size: 1024 * 1024,
          mimeType: 'application/pdf',
        },
        {
          ventureId: v.id,
          name: 'Financials',
          type: 'FINANCIAL_STATEMENTS',
          url: `https://example.com/${v.name.replace(/\s+/g, '-').toLowerCase()}-fin.pdf`,
          size: 2 * 1024 * 1024,
          mimeType: 'application/pdf',
        },
        {
          ventureId: v.id,
          name: 'Business Plan',
          type: 'BUSINESS_PLAN',
          url: `https://example.com/${v.name.replace(/\s+/g, '-').toLowerCase()}-bp.pdf`,
          size: 1.5 * 1024 * 1024,
          mimeType: 'application/pdf',
        },
      ],
    })
  }

  // Enhanced capital activities per venture
  for (const v of allVentures) {
    const currency = v.location.includes('Kenya') ? 'KES' :
                    v.location.includes('Nigeria') ? 'NGN' :
                    v.location.includes('Uganda') ? 'UGX' :
                    v.location.includes('Ghana') ? 'GHS' :
                    v.location.includes('Tanzania') ? 'TZS' :
                    v.location.includes('Ethiopia') ? 'ETB' :
                    v.location.includes('Rwanda') ? 'RWF' : 'USD'

    const baseAmount = v.fundingRaised / 4 // Distribute across 4 activities
    const activities = [
      {
        ventureId: v.id,
        type: 'GRANT',
        amount: Math.floor(baseAmount * 0.2),
        currency,
        status: 'COMPLETED',
        description: 'Ecosystem development grant',
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        investorName: 'MIV Pilot Grants',
        terms: { grantType: 'ecosystem', reportingRequired: true },
      },
      {
        ventureId: v.id,
        type: 'DEBT',
        amount: Math.floor(baseAmount * 0.3),
        currency,
        status: 'APPROVED',
        description: 'Revenue-based financing facility',
        date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        investorName: 'Inclusive Capital Partners',
        terms: { tenorMonths: 24, revenueSharePct: 6, gracePeriodMonths: 3 },
      },
      {
        ventureId: v.id,
        type: 'EQUITY',
        amount: Math.floor(baseAmount * 0.4),
        currency,
        status: v.stage === 'FUNDED' || v.stage === 'SERIES_A' || v.stage === 'SERIES_B' ? 'COMPLETED' : 'PENDING',
        description: `${v.stage} round investment`,
        investorName: v.stage === 'SERIES_B' ? 'Growth Capital Fund' : 'Impact Syndicate',
        terms: { 
          boardSeat: v.stage === 'SERIES_A' || v.stage === 'SERIES_B',
          liquidationPreference: v.stage === 'SERIES_B' ? 1.5 : 1.0,
          antiDilution: v.stage === 'SERIES_B'
        },
      },
      {
        ventureId: v.id,
        type: 'CONVERTIBLE_NOTE',
        amount: Math.floor(baseAmount * 0.1),
        currency,
        status: 'APPROVED',
        description: 'Bridge financing note',
        date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
        investorName: 'Catalyst Collective',
        terms: { discountPct: 20, interestPct: 6, maturityMonths: 18 },
      },
    ]

    // Add additional activities for more advanced ventures
    if (v.stage === 'SERIES_A' || v.stage === 'SERIES_B') {
      activities.push({
        ventureId: v.id,
        type: 'EQUITY',
        amount: Math.floor(baseAmount * 0.5),
        currency,
        status: 'COMPLETED',
        description: 'Follow-on investment',
        investorName: 'Strategic Partner Fund',
        terms: { strategicPartnership: true, boardObserver: true },
      })
    }

    // Add grant for early stage ventures
    if (v.stage === 'INTAKE' || v.stage === 'SCREENING') {
      activities.push({
        ventureId: v.id,
        type: 'GRANT',
        amount: Math.floor(baseAmount * 0.15),
        currency,
        status: 'APPROVED',
        description: 'Pre-seed development grant',
        investorName: 'Innovation Foundation',
        terms: { milestoneBased: true, technicalSupport: true },
      })
    }

    await prisma.capitalActivity.createMany({ data: activities })
  }

  // Enhanced activities for all ventures
  for (const v of allVentures) {
    const activities = [
      {
        type: 'VENTURE_UPDATED',
        title: 'Profile Updated',
        description: `${v.name} details refreshed with latest metrics and financials`,
        ventureId: v.id,
        userId: admin.id,
      },
      {
        type: 'DOCUMENT_UPLOADED',
        title: 'Document Added',
        description: 'New pitch deck uploaded with updated financial projections',
        ventureId: v.id,
        userId: manager.id,
      },
      {
        type: 'NOTE_ADDED',
        title: 'Meeting Scheduled',
        description: 'Due diligence meeting with investors scheduled for next week',
        ventureId: v.id,
        userId: ventureMgr.id,
      },
      {
        type: 'STAGE_CHANGED',
        title: 'Status Updated',
        description: `Venture moved to ${v.stage} stage after successful milestone completion`,
        ventureId: v.id,
        userId: admin.id,
      },
      {
        type: 'METRIC_UPDATED',
        title: 'GEDSI Metrics Updated',
        description: 'Updated GEDSI metrics with latest impact measurements',
        ventureId: v.id,
        userId: analyst.id,
      },
      {
        type: 'CAPITAL_ACTIVITY',
        title: 'Funding Received',
        description: `Received ${v.fundingRaised > 1000000 ? 'major' : 'seed'} funding round`,
        ventureId: v.id,
        userId: ventureMgr.id,
      },
      {
        type: 'VENTURE_UPDATED',
        title: 'Team Expansion',
        description: `Added ${Math.floor(Math.random() * 5) + 1} new team members`,
        ventureId: v.id,
        userId: manager.id,
      },
    ]

    // Add sector-specific activities
    if (v.sector === 'Healthcare') {
      activities.push({
        type: 'METRIC_UPDATED',
        title: 'Clinical Trial Update',
        description: 'Phase 2 clinical trial results published',
        ventureId: v.id,
        userId: admin.id,
      })
    } else if (v.sector === 'Education') {
      activities.push({
        type: 'VENTURE_UPDATED',
        title: 'Curriculum Updated',
        description: 'Updated curriculum with new STEM modules',
        ventureId: v.id,
        userId: manager.id,
      })
    } else if (v.sector === 'Agriculture') {
      activities.push({
        type: 'METRIC_UPDATED',
        title: 'Harvest Report',
        description: 'Q3 harvest results show 25% yield improvement',
        ventureId: v.id,
        userId: analyst.id,
      })
    }

    await prisma.activity.createMany({ data: activities })
  }

  // Notifications and email logs to simulate system traffic
  await prisma.notification.createMany({
    data: [
      {
        userId: manager.id,
        type: 'REPORT_READY',
        title: 'Monthly Portfolio Report',
        message: 'Your portfolio report for this month is ready to view.',
      },
      {
        userId: analyst.id,
        type: 'STG_REMINDER',
        title: 'Metric Update Reminder',
        message: 'Please update GEDSI metrics for assigned ventures.',
      },
    ],
  })

  await prisma.emailLog.createMany({
    data: [
      {
        to: 'test.manager@miv.org',
        subject: 'Portfolio Report Ready',
        template: 'report_ready',
        status: 'SENT',
        sentAt: new Date(),
      },
      {
        to: 'test.analyst@miv.org',
        subject: 'Reminder: Update GEDSI Metrics',
        template: 'reminder_metrics',
        status: 'SENT',
        sentAt: new Date(),
      },
    ],
  })

  // A few activities and a notification to validate UI
  await prisma.activity.createMany({
    data: [
      {
        type: 'VENTURE_CREATED',
        title: 'Venture Created',
        description: `Created ${ventureA.name}`,
        ventureId: ventureA.id,
        userId: admin.id,
      },
      {
        type: 'STAGE_CHANGED',
        title: 'Stage Updated',
        description: `${ventureB.name} moved to INTAKE`,
        ventureId: ventureB.id,
        userId: analyst.id,
      },
    ],
  })

  await prisma.notification.create({
    data: {
      userId: ventureMgr.id,
      type: 'VENTURE_CREATED',
      title: 'New assignment',
      message: `${ventureA.name} assigned to you`,
    },
  })

  console.log('✅ Test data seeded.')
  console.log('🔐 Test credentials:')
  console.log(' - test.admin@miv.org / TestAdmin@123')
  console.log(' - test.manager@miv.org / TestManager@123')
  console.log(' - test.analyst@miv.org / TestAnalyst@123')
  console.log(' - test.venture.manager@miv.org / TestVM@123')
  console.log(' - test.user@miv.org / TestUser@123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding test data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


