import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data for idempotent local seeding
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

  // Create sample users
  const passwordAdmin = await bcrypt.hash('Admin@123', 10)
  const passwordAnalyst = await bcrypt.hash('Analyst@123', 10)
  const passwordManager = await bcrypt.hash('Manager@123', 10)
  const passwordVM = await bcrypt.hash('VentureMgr@123', 10)

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@miv.org' },
    update: {},
    create: {
      email: 'admin@miv.org',
      name: 'Admin User',
      role: 'ADMIN',
      passwordHash: passwordAdmin,
      notificationPreferences: {
        email: true,
        inApp: true,
        weeklyDigest: true,
      },
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'analyst@miv.org' },
    update: {},
    create: {
      email: 'analyst@miv.org',
      name: 'Analyst User',
      role: 'ANALYST',
      passwordHash: passwordAnalyst,
      notificationPreferences: {
        email: true,
        inApp: true,
      },
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'manager@miv.org' },
    update: {},
    create: {
      email: 'manager@miv.org',
      name: 'Portfolio Manager',
      role: 'MANAGER',
      passwordHash: passwordManager,
    },
  })

  const user4 = await prisma.user.upsert({
    where: { email: 'venture.manager@miv.org' },
    update: {},
    create: {
      email: 'venture.manager@miv.org',
      name: 'Venture Manager',
      role: 'VENTURE_MANAGER',
      passwordHash: passwordVM,
    },
  })

  console.log('✅ Users created')

  // Create sample ventures
  const ventures = [
    {
      name: 'GreenTech Solutions',
      sector: 'CleanTech',
      location: 'Ho Chi Minh City, Vietnam',
      contactEmail: 'contact@greentech.vn',
      contactPhone: '+84 123 456 789',
      pitchSummary: 'Innovative solar panel technology for rural electrification',
      inclusionFocus: 'Women-led venture focusing on rural communities',
      founderTypes: JSON.stringify(['women-led', 'rural-focus']),
      teamSize: 8,
      foundingYear: 2022,
      targetMarket: 'Rural communities in Vietnam and Cambodia',
      revenueModel: 'B2B and B2C solar panel sales',
      revenue: 250000,
      fundingRaised: 150000,
      lastValuation: 1200000,
      operationalReadiness: {
        businessPlan: true,
        financialProjections: true,
        legalStructure: true,
        teamComposition: true,
        marketResearch: true,
      },
      capitalReadiness: {
        pitchDeck: true,
        financialStatements: true,
        investorMaterials: false,
        dueDiligence: false,
        fundingHistory: false,
      },
      gedsiGoals: ['OI.1', 'OI.2', 'OI.3'],
      challenges: 'Limited access to capital and technical expertise',
      supportNeeded: 'Investment readiness support and technical mentorship',
      timeline: '6-12 months to Series A',
      stage: 'SCREENING' as const,
      createdById: user1.id,
      assignedToId: user4.id,
      intakeDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      screeningDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      nextReviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'EcoFarm Vietnam',
      sector: 'Agriculture',
      location: 'Hanoi, Vietnam',
      contactEmail: 'info@ecofarm.vn',
      contactPhone: '+84 987 654 321',
      pitchSummary: 'Sustainable farming solutions for smallholder farmers',
      inclusionFocus: 'Supporting farmers with disabilities and women farmers',
      founderTypes: JSON.stringify(['disability-inclusive', 'women-led']),
      teamSize: 5,
      foundingYear: 2021,
      targetMarket: 'Smallholder farmers in Vietnam',
      revenueModel: 'Subscription-based farming services',
      revenue: 90000,
      fundingRaised: 20000,
      lastValuation: 400000,
      operationalReadiness: {
        businessPlan: true,
        financialProjections: false,
        legalStructure: true,
        teamComposition: true,
        marketResearch: true,
      },
      capitalReadiness: {
        pitchDeck: true,
        financialStatements: false,
        investorMaterials: false,
        dueDiligence: false,
        fundingHistory: false,
      },
      gedsiGoals: ['OI.1', 'OI.4', 'OI.5'],
      challenges: 'Limited market access and technology adoption',
      supportNeeded: 'Market access support and technology training',
      timeline: '12-18 months to seed funding',
      stage: 'INTAKE' as const,
      createdById: user2.id,
      assignedToId: user3.id,
      intakeDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextReviewAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'TechStart Cambodia',
      sector: 'FinTech',
      location: 'Phnom Penh, Cambodia',
      contactEmail: 'hello@techstart.kh',
      contactPhone: '+855 123 456 789',
      pitchSummary: 'Digital payment solutions for underserved communities',
      inclusionFocus: 'Financial inclusion for rural and marginalized communities',
      founderTypes: JSON.stringify(['youth-led', 'rural-focus']),
      teamSize: 14,
      foundingYear: 2023,
      targetMarket: 'Unbanked populations in Cambodia',
      revenueModel: 'Transaction fees and subscription services',
      revenue: 380000,
      fundingRaised: 550000,
      lastValuation: 3500000,
      operationalReadiness: {
        businessPlan: true,
        financialProjections: true,
        legalStructure: true,
        teamComposition: true,
        marketResearch: true,
      },
      capitalReadiness: {
        pitchDeck: true,
        financialStatements: true,
        investorMaterials: true,
        dueDiligence: true,
        fundingHistory: true,
      },
      gedsiGoals: ['OI.1', 'OI.2', 'OI.6'],
      challenges: 'Regulatory compliance and user adoption',
      supportNeeded: 'Regulatory guidance and market expansion support',
      timeline: '3-6 months to Series A',
      stage: 'DUE_DILIGENCE' as const,
      createdById: user1.id,
      assignedToId: user4.id,
      intakeDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      screeningDate: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000),
      dueDiligenceStart: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      nextReviewAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const ventureData of ventures) {
    const venture = await prisma.venture.create({
      data: ventureData,
    })

    console.log(`✅ Venture created: ${venture.name}`)

    // Create sample GEDSI metrics for each venture
    const gedsiMetrics = [
      {
        metricCode: 'OI.1',
        metricName: 'Number of women-led ventures supported',
        category: 'GENDER' as const,
        targetValue: 100,
        currentValue: 25,
        unit: 'ventures',
        status: 'IN_PROGRESS' as const,
        notes: 'On track to meet target',
        ventureId: venture.id,
        createdById: user1.id,
      },
      {
        metricCode: 'OI.2',
        metricName: 'Number of ventures with disability inclusion',
        category: 'DISABILITY' as const,
        targetValue: 50,
        currentValue: 15,
        unit: 'ventures',
        status: 'IN_PROGRESS' as const,
        notes: 'Need to increase focus on disability inclusion',
        ventureId: venture.id,
        createdById: user1.id,
      },
      {
        metricCode: 'OI.3',
        metricName: 'Number of rural communities served',
        category: 'SOCIAL_INCLUSION' as const,
        targetValue: 200,
        currentValue: 75,
        unit: 'communities',
        status: 'VERIFIED' as const,
        notes: 'Exceeding expectations in rural outreach',
        ventureId: venture.id,
        createdById: user2.id,
      },
    ]

    for (const metricData of gedsiMetrics) {
      await prisma.gEDSIMetric.create({
        data: metricData,
      })
    }

    // Create sample activities
    const activities = [
      {
        type: 'VENTURE_CREATED' as const,
        title: 'Venture Created',
        description: `New venture "${venture.name}" was added to the pipeline`,
        ventureId: venture.id,
        userId: venture.createdById,
      },
      {
        type: 'METRIC_ADDED' as const,
        title: 'GEDSI Metrics Added',
        description: 'Initial GEDSI metrics were configured for the venture',
        ventureId: venture.id,
        userId: user1.id,
      },
      {
        type: 'NOTE_ADDED' as const,
        title: 'AI Analysis Completed',
        description: 'AI-powered analysis of venture readiness and GEDSI alignment completed',
        ventureId: venture.id,
        userId: user1.id,
        metadata: {
          type: 'ai_analysis',
          category: 'readiness',
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        },
      },
    ]

    for (const activityData of activities) {
      await prisma.activity.create({
        data: activityData,
      })
    }

    // Create sample documents
    const documents = [
      {
        name: 'Pitch Deck',
        type: 'PITCH_DECK' as const,
        url: 'https://example.com/pitch-deck.pdf',
        size: 2048576, // 2MB
        mimeType: 'application/pdf',
        ventureId: venture.id,
      },
      {
        name: 'Business Plan',
        type: 'BUSINESS_PLAN' as const,
        url: 'https://example.com/business-plan.pdf',
        size: 1048576, // 1MB
        mimeType: 'application/pdf',
        ventureId: venture.id,
      },
    ]

    for (const documentData of documents) {
      await prisma.document.create({
        data: documentData,
      })
    }

    // Capital activities per venture
    const capitalActivities = [
      {
        type: 'GRANT' as const,
        amount: 50000,
        currency: 'USD',
        status: 'APPROVED' as const,
        description: 'Seed grant for pilot expansion',
        date: new Date(),
        investorName: 'MIV Seed Fund',
        ventureId: venture.id,
      },
      {
        type: 'EQUITY' as const,
        amount: 300000,
        currency: 'USD',
        status: 'PENDING' as const,
        description: 'Negotiating terms for Series Seed',
        date: new Date(),
        investorName: 'Impact Angels Network',
        terms: { liquidationPreference: '1x non-participating' },
        ventureId: venture.id,
      },
    ]

    for (const ca of capitalActivities) {
      await prisma.capitalActivity.create({ data: ca })
    }
  }

  console.log('✅ Sample data created successfully!')

  // Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        type: 'WELCOME',
        title: 'Welcome to MIV Platform',
        message: 'Your admin account has been set up.',
      },
      {
        userId: user2.id,
        type: 'WEEKLY_UPDATE',
        title: 'Weekly Update Ready',
        message: 'Your weekly venture analytics are available.',
      },
    ],
  })

  // Email logs
  await prisma.emailLog.createMany({
    data: [
      {
        to: 'admin@miv.org',
        subject: 'Welcome to MIV',
        template: 'welcome',
        status: 'SENT',
        sentAt: new Date(),
      },
      {
        to: 'analyst@miv.org',
        subject: 'Weekly Digest',
        template: 'weekly_digest',
        status: 'SENT',
        sentAt: new Date(),
      },
    ],
  })

  // Basic workflow and a run
  const wf = await prisma.workflow.create({
    data: {
      name: 'GEDSI Metric Verification',
      description: 'Verify GEDSI metrics monthly and notify assigned owners',
      definition: {
        trigger: { type: 'cron', cron: '0 9 1 * *' },
        steps: [
          { id: 'collect', type: 'collectMetrics' },
          { id: 'verify', type: 'verifyAgainstTargets' },
          { id: 'notify', type: 'sendNotifications' },
        ],
      },
      createdById: user1.id,
    },
  })

  await prisma.workflowRun.create({
    data: {
      workflowId: wf.id,
      status: 'SUCCEEDED',
      input: { month: new Date().getMonth() + 1 },
      output: { verified: 12, alerts: 3 },
      finishedAt: new Date(),
    },
  })

  // Seed IRIS metric catalog from JSON
  try {
    const catalogPath = path.join(process.cwd(), 'lib', 'iris-catalog.json')
    if (fs.existsSync(catalogPath)) {
      const raw = fs.readFileSync(catalogPath, 'utf-8')
      const parsed = JSON.parse(raw)

      // Normalize to array
      const items: any[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.data)
        ? parsed.data
        : Object.values(parsed || {})

      const records = items
        .map((item) => {
          const code = item.code || item.MetricCode || item.metricCode || item.id
          const name = item.name || item.MetricName || item.metricName || item.title
          const description = item.description || item.MetricDefinition || item.definition || item.desc
          const unit = item.unit || item.Unit || item.measure || item.measurementUnit
          const tags = item.tags || item.Tags || []

          if (!code || !name) return null
          return {
            code: String(code),
            name: String(name),
            description: description ? String(description) : null,
            unit: unit ? String(unit) : null,
            tags: tags ? JSON.parse(JSON.stringify(tags)) : undefined,
          }
        })
        .filter(Boolean) as Array<{
        code: string
        name: string
        description?: string | null
        unit?: string | null
        categories?: unknown
        tags?: unknown
      }>

      if (records.length > 0) {
        let inserted = 0
        for (const rec of records) {
          await prisma.iRISMetricCatalog.upsert({
            where: { code: rec.code },
            update: {
              name: rec.name,
              description: rec.description ?? undefined,
              unit: rec.unit ?? undefined,
              tags: rec.tags,
            },
            create: rec,
          })
          inserted += 1
        }
        const count = await prisma.iRISMetricCatalog.count()
        console.log(`✅ IRIS catalog seeded/updated. Processed: ${inserted}, Total rows: ${count}`)
      } else {
        console.warn('⚠️ IRIS catalog JSON parsed but produced 0 records.')
      }
    } else {
      console.warn('⚠️ IRIS catalog JSON not found at lib/iris-catalog.json')
    }
  } catch (err) {
    console.error('❌ Failed to seed IRIS catalog:', err)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 