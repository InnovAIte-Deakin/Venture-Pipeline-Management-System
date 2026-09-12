// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Removing current ventures and restoring old ones...')

  // Clean existing data including optional components
  await prisma.$transaction([
    prisma.workflowRun.deleteMany(),
    prisma.workflow.deleteMany(),
    prisma.task.deleteMany(),
    prisma.project.deleteMany(),
    prisma.teamEvent.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.fundInvestment.deleteMany(),
    prisma.distribution.deleteMany(),
    prisma.capitalCall.deleteMany(),
    prisma.limitedPartner.deleteMany(),
    prisma.fund.deleteMany(),
    prisma.customDashboard.deleteMany(),
    prisma.capitalActivity.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.document.deleteMany(),
    prisma.gEDSIMetric.deleteMany(),
    prisma.venture.deleteMany(),
  ])

  console.log('✅ Cleaned existing ventures')

  // Get existing users
  const users = await prisma.user.findMany()
  const user1 = users.find(u => u.email === 'admin@miv.org') || users[0]
  const user2 = users.find(u => u.email === 'analyst@miv.org') || users[1] || users[0]
  const user3 = users.find(u => u.email === 'manager@miv.org') || users[2] || users[0]
  const user4 = users.find(u => u.email === 'venture.manager@miv.org') || users[3] || users[0]

  // Create old/original sample ventures
  const oldVentures = [
    {
      name: 'TechStart Innovations',
      sector: 'Technology',
      location: 'Singapore',
      contactEmail: 'contact@techstart.sg',
      contactPhone: '+65 6123 4567',
      pitchSummary: 'AI-powered fintech solutions for SMEs in Southeast Asia',
      inclusionFocus: 'Digital financial inclusion for underbanked populations',
      founderTypes: JSON.stringify(['tech-led', 'diversity-focused']),
      teamSize: 12,
      foundingYear: 2021,
      targetMarket: 'SMEs and underbanked individuals in ASEAN',
      revenueModel: 'SaaS subscription and transaction fees',
      revenue: 180000,
      fundingRaised: 850000,
      lastValuation: 5200000,
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
        dueDiligence: false,
        fundingHistory: true,
      },
      gedsiGoals: ['OI.1', 'OI.6', 'OI.7'],
      challenges: 'Regulatory compliance across multiple jurisdictions',
      supportNeeded: 'Legal guidance and Series A preparation',
      timeline: '6-9 months to Series A',
      stage: 'DUE_DILIGENCE' as const,
      createdById: user1.id,
      assignedToId: user4.id,
      intakeDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      screeningDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
      dueDiligenceStart: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      nextReviewAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'HealthTech Solutions',
      sector: 'Healthcare',
      location: 'Manila, Philippines',
      contactEmail: 'info@healthtech.ph',
      contactPhone: '+63 2 8123 4567',
      pitchSummary: 'Telemedicine platform connecting rural patients with urban specialists',
      inclusionFocus: 'Healthcare access for remote and underserved communities',
      founderTypes: JSON.stringify(['women-led', 'healthcare-focused']),
      teamSize: 8,
      foundingYear: 2020,
      targetMarket: 'Rural communities in Philippines and Indonesia',
      revenueModel: 'Subscription-based telemedicine services',
      revenue: 95000,
      fundingRaised: 320000,
      lastValuation: 2100000,
      operationalReadiness: {
        businessPlan: true,
        financialProjections: true,
        legalStructure: true,
        teamComposition: true,
        marketResearch: false,
      },
      capitalReadiness: {
        pitchDeck: true,
        financialStatements: false,
        investorMaterials: false,
        dueDiligence: false,
        fundingHistory: false,
      },
      gedsiGoals: ['OI.1', 'OI.3', 'OI.8'],
      challenges: 'Scaling technology infrastructure and regulatory approval',
      supportNeeded: 'Technical mentorship and regulatory guidance',
      timeline: '12-15 months to seed extension',
      stage: 'SCREENING' as const,
      createdById: user2.id,
      assignedToId: user3.id,
      intakeDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      screeningDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      nextReviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'EduTech Academy',
      sector: 'Education',
      location: 'Bangkok, Thailand',
      contactEmail: 'hello@edutech.th',
      contactPhone: '+66 2 123 4567',
      pitchSummary: 'Online vocational training platform for youth in emerging markets',
      inclusionFocus: 'Skills training for disadvantaged youth and women',
      founderTypes: JSON.stringify(['youth-led', 'education-focused']),
      teamSize: 6,
      foundingYear: 2022,
      targetMarket: 'Youth aged 18-25 in Thailand, Vietnam, and Cambodia',
      revenueModel: 'Course fees and corporate training contracts',
      revenue: 45000,
      fundingRaised: 75000,
      lastValuation: 800000,
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
      gedsiGoals: ['OI.4', 'OI.5', 'OI.7'],
      challenges: 'Content localization and user acquisition',
      supportNeeded: 'Marketing support and content development guidance',
      timeline: '18-24 months to seed funding',
      stage: 'INTAKE' as const,
      createdById: user1.id,
      assignedToId: user2.id,
      intakeDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      nextReviewAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'AgriTech Innovations',
      sector: 'Agriculture',
      location: 'Jakarta, Indonesia',
      contactEmail: 'contact@agritech.id',
      contactPhone: '+62 21 123 4567',
      pitchSummary: 'Smart farming solutions using IoT and data analytics',
      inclusionFocus: 'Supporting smallholder farmers and rural cooperatives',
      founderTypes: JSON.stringify(['rural-focus', 'tech-enabled']),
      teamSize: 10,
      foundingYear: 2021,
      targetMarket: 'Smallholder farmers across Indonesia and Malaysia',
      revenueModel: 'Hardware sales and data subscription services',
      revenue: 125000,
      fundingRaised: 450000,
      lastValuation: 3200000,
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
      gedsiGoals: ['OI.3', 'OI.5', 'OI.6'],
      challenges: 'Hardware cost optimization and farmer adoption',
      supportNeeded: 'Supply chain optimization and go-to-market strategy',
      timeline: '3-6 months to Series A',
      stage: 'INVESTMENT_READY' as const,
      createdById: user1.id,
      assignedToId: user4.id,
      intakeDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
      screeningDate: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000),
      dueDiligenceStart: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      dueDiligenceEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      investmentReadyAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextReviewAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ]

  // Create ventures with associated data
  for (const ventureData of oldVentures) {
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
        currentValue: Math.floor(Math.random() * 40) + 20,
        unit: 'ventures',
        status: 'IN_PROGRESS' as const,
        notes: 'Making good progress toward gender inclusion goals',
        ventureId: venture.id,
        createdById: user1.id,
      },
      {
        metricCode: 'OI.2',
        metricName: 'Number of ventures with disability inclusion',
        category: 'DISABILITY' as const,
        targetValue: 50,
        currentValue: Math.floor(Math.random() * 20) + 10,
        unit: 'ventures',
        status: 'IN_PROGRESS' as const,
        notes: 'Implementing accessibility features and inclusive hiring',
        ventureId: venture.id,
        createdById: user1.id,
      },
      {
        metricCode: 'OI.3',
        metricName: 'Number of rural communities served',
        category: 'SOCIAL_INCLUSION' as const,
        targetValue: 200,
        currentValue: Math.floor(Math.random() * 80) + 40,
        unit: 'communities',
        status: 'VERIFIED' as const,
        notes: 'Strong outreach in rural areas with measurable impact',
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
        amount: Math.floor(Math.random() * 80000) + 20000,
        currency: 'USD',
        status: 'APPROVED' as const,
        description: 'Seed grant for market validation',
        date: new Date(),
        investorName: 'MIV Seed Fund',
        ventureId: venture.id,
      },
      {
        type: venture.stage === 'INVESTMENT_READY' ? 'EQUITY' as const : 'CONVERTIBLE_NOTE' as const,
        amount: venture.fundingRaised || Math.floor(Math.random() * 500000) + 100000,
        currency: 'USD',
        status: venture.stage === 'INVESTMENT_READY' ? 'PENDING' as const : 'COMPLETED' as const,
        description: venture.stage === 'INVESTMENT_READY' ? 'Series A preparation' : 'Seed round completed',
        date: new Date(),
        investorName: venture.stage === 'INVESTMENT_READY' ? 'Strategic Partners' : 'Angel Investors',
        terms: { liquidationPreference: '1x non-participating' },
        ventureId: venture.id,
      },
    ]

    for (const ca of capitalActivities) {
      await prisma.capitalActivity.create({ data: ca })
    }
  }

  console.log('✅ Old ventures restored successfully!')

  // Create a basic workflow
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

  console.log('✅ Workflow and sample run created')

  // Create Custom Dashboards
  const dashboards = [
    {
      name: 'Portfolio Performance Dashboard',
      description: 'Real-time portfolio performance and key metrics tracking',
      category: 'Portfolio',
      widgets: {
        layout: 'grid',
        widgets: [
          { id: 'w1', type: 'metric', title: 'Total AUM', position: { x: 0, y: 0 }, size: 'medium' },
          { id: 'w2', type: 'chart', title: 'Performance Trend', position: { x: 1, y: 0 }, size: 'large' },
          { id: 'w3', type: 'table', title: 'Top Performers', position: { x: 0, y: 1 }, size: 'large' }
        ]
      },
      isPublic: true,
      isFavorite: true,
      tags: ['portfolio', 'performance', 'metrics'],
      createdById: user1.id
    },
    {
      name: 'GEDSI Impact Tracker',
      description: 'Gender equality, diversity, and social inclusion metrics dashboard',
      category: 'Impact',
      widgets: {
        layout: 'grid',
        widgets: [
          { id: 'w1', type: 'progress', title: 'GEDSI Completion Rate', position: { x: 0, y: 0 }, size: 'medium' },
          { id: 'w2', type: 'chart', title: 'Impact by Category', position: { x: 1, y: 0 }, size: 'large' }
        ]
      },
      isPublic: false,
      isFavorite: true,
      tags: ['gedsi', 'impact', 'diversity'],
      createdById: user2.id
    }
  ]

  for (const dashboard of dashboards) {
    await prisma.customDashboard.create({ data: dashboard })
  }
  console.log('✅ Custom dashboards created')

  // Create Funds
  const funds = [
    {
      name: 'MIV Equity Fund I',
      vintage: '2020',
      size: 50000000, // $50M
      committedCapital: 50000000,
      calledCapital: 32000000,
      distributedCapital: 8000000,
      netAssetValue: 42000000,
      irr: 18.5,
      tvpi: 1.31,
      dpi: 0.25,
      moic: 1.31,
      status: 'ACTIVE',
      fundType: 'VENTURE',
      geography: 'Asia Pacific',
      sectors: ['Technology', 'Healthcare', 'FinTech'],
      investmentPeriod: '2020-2025',
      fundTerm: '10 years + 2x1 year extensions',
      managementFee: 2.0,
      carriedInterest: 20,
      hurdle: 8,
      benchmark: 'MSCI AC Asia Pacific',
      aum: 42000000,
      dryPowder: 18000000,
      leverage: 0,
      esg: true,
      regulatoryStatus: 'SEC Registered',
      fundAdmin: 'SS&C Technologies',
      auditor: 'KPMG',
      legalCounsel: 'Latham & Watkins',
      primeBroker: 'Goldman Sachs',
      managerId: user1.id
    },
    {
      name: 'MIV Impact Fund',
      vintage: '2022',
      size: 25000000, // $25M
      committedCapital: 25000000,
      calledCapital: 15000000,
      distributedCapital: 2000000,
      netAssetValue: 18000000,
      irr: 15.2,
      tvpi: 1.20,
      dpi: 0.13,
      moic: 1.20,
      status: 'ACTIVE',
      fundType: 'IMPACT',
      geography: 'Southeast Asia',
      sectors: ['Social Impact', 'Education', 'Healthcare'],
      investmentPeriod: '2022-2027',
      fundTerm: '10 years + 2x1 year extensions',
      managementFee: 2.0,
      carriedInterest: 15,
      hurdle: 6,
      benchmark: 'Custom Impact Index',
      aum: 18000000,
      dryPowder: 10000000,
      leverage: 0,
      esg: true,
      regulatoryStatus: 'B-Corp Certified',
      fundAdmin: 'Alter Domus',
      auditor: 'Deloitte',
      legalCounsel: 'White & Case',
      primeBroker: 'J.P. Morgan',
      managerId: user2.id
    }
  ]

  const createdFunds = []
  for (const fund of funds) {
    const createdFund = await prisma.fund.create({ data: fund })
    createdFunds.push(createdFund)
  }
  console.log('✅ Funds created')

  // Create Limited Partners
  const limitedPartners = [
    {
      name: 'Asia Development Bank',
      type: 'DEVELOPMENT',
      commitment: 10000000,
      called: 6500000,
      distributed: 1200000,
      nav: 8200000,
      irr: 17.2,
      tvpi: 1.26,
      dpi: 0.18,
      country: 'Philippines',
      currency: 'USD',
      contactPerson: 'Maria Santos',
      email: 'm.santos@adb.org',
      phone: '+63-2-632-4444',
      status: 'ACTIVE',
      investmentDate: new Date('2020-03-15'),
      lastCapitalCall: new Date('2024-01-15'),
      lastDistribution: new Date('2023-12-01'),
      riskRating: 'LOW',
      kycStatus: 'APPROVED',
      accredited: true,
      fundId: createdFunds[0].id
    },
    {
      name: 'Singapore GIC',
      type: 'SOVEREIGN',
      commitment: 8000000,
      called: 5200000,
      distributed: 950000,
      nav: 6500000,
      irr: 19.1,
      tvpi: 1.35,
      dpi: 0.22,
      country: 'Singapore',
      currency: 'USD',
      contactPerson: 'Lim Wei Ming',
      email: 'wm.lim@gic.com.sg',
      phone: '+65-6889-8888',
      status: 'ACTIVE',
      investmentDate: new Date('2020-02-01'),
      lastCapitalCall: new Date('2024-01-15'),
      lastDistribution: new Date('2023-11-15'),
      riskRating: 'LOW',
      kycStatus: 'APPROVED',
      accredited: true,
      fundId: createdFunds[0].id
    }
  ]

  for (const lp of limitedPartners) {
    await prisma.limitedPartner.create({ data: lp })
  }
  console.log('✅ Limited partners created')

  // Create Capital Calls
  const capitalCalls = [
    {
      callNumber: 'Call #4',
      amount: 2500000,
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      purpose: 'Investment in TechStart Innovations and AgriTech Innovations',
      investments: ['TechStart Innovations', 'AgriTech Innovations'],
      expenses: 50000,
      interestRate: 0,
      gracePeriod: 30,
      defaultPenalty: 1.5,
      wireInstructions: true,
      noticeDate: new Date(),
      remindersSent: 0,
      documentsGenerated: true,
      lpsResponded: 0,
      totalLps: 25,
      fundId: createdFunds[0].id
    }
  ]

  for (const call of capitalCalls) {
    await prisma.capitalCall.create({ data: call })
  }
  console.log('✅ Capital calls created')

  // Create Projects
  const projects = [
    {
      name: 'Portfolio Management System Upgrade',
      description: 'Upgrade the portfolio management system with new analytics and reporting features',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      progress: 65,
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      budget: 150000,
      tags: ['technology', 'portfolio', 'analytics'],
      leadId: user1.id
    },
    {
      name: 'GEDSI Impact Assessment Framework',
      description: 'Develop comprehensive framework for assessing and tracking GEDSI impact across portfolio',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      progress: 0,
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      budget: 75000,
      tags: ['gedsi', 'impact', 'framework'],
      leadId: user2.id
    }
  ]

  const createdProjects = []
  for (const project of projects) {
    const createdProject = await prisma.project.create({ data: project })
    createdProjects.push(createdProject)
  }
  console.log('✅ Projects created')

  // Create Tasks
  const tasks = [
    {
      name: 'Design new dashboard interface',
      description: 'Create mockups and wireframes for the new portfolio dashboard',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      estimatedHours: 40,
      actualHours: 25,
      tags: ['design', 'ui/ux'],
      notes: 'Working with design team on user feedback integration',
      projectId: createdProjects[0].id,
      assignedToId: user3.id,
      createdById: user1.id
    },
    {
      name: 'Implement backend API endpoints',
      description: 'Develop REST API endpoints for new analytics features',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      estimatedHours: 60,
      tags: ['backend', 'api'],
      projectId: createdProjects[0].id,
      assignedToId: user4.id,
      createdById: user1.id
    }
  ]

  for (const task of tasks) {
    await prisma.task.create({ data: task })
  }
  console.log('✅ Tasks created')

  // Create Announcements
  const announcements = [
    {
      title: 'Q4 Portfolio Review Meeting',
      content: 'Join us for the quarterly portfolio review meeting on December 15th at 2 PM. We will discuss performance metrics, GEDSI impact assessments, and upcoming investment opportunities.',
      priority: 'HIGH',
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      authorId: user1.id
    },
    {
      title: 'New GEDSI Reporting Guidelines',
      content: 'Updated GEDSI reporting guidelines are now available in the resources section. Please review and implement for all new venture assessments.',
      priority: 'MEDIUM',
      isActive: true,
      authorId: user2.id
    }
  ]

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement })
  }
  console.log('✅ Announcements created')

  // Create Team Events
  const events = [
    {
      title: 'Monthly Team Standup',
      description: 'Monthly team standup to discuss progress, challenges, and upcoming priorities',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      location: 'Conference Room A / Zoom',
      isAllDay: false,
      isRecurring: true,
      recurrence: { type: 'monthly', interval: 1 },
      organizerId: user1.id
    },
    {
      title: 'GEDSI Training Workshop',
      description: 'Comprehensive training on GEDSI assessment and implementation strategies',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      time: '9:00 AM',
      location: 'Training Center',
      isAllDay: true,
      isRecurring: false,
      organizerId: user2.id
    }
  ]

  for (const event of events) {
    await prisma.teamEvent.create({ data: event })
  }
  console.log('✅ Team events created')

  console.log('🎉 All optional components created successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error restoring old ventures:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
