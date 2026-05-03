import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🌱 Starting detailed venture seeding...')

    // Get existing users
    const users = await prisma.user.findMany()
    if (users.length === 0) {
      throw new Error('No users found. Please seed users first.')
    }

    const adminUser = users.find(u => u.role === 'ADMIN') || users[0]
    const managerUser = users.find(u => u.role === 'VENTURE_MANAGER') || users[1] || users[0]
    const analystUser = users.find(u => u.role === 'GEDSI_ANALYST') || users[2] || users[0]

    // Comprehensive venture data
    const detailedVentures = [
      {
        name: "MedTech Innovations Pte Ltd",
        description: "AI-powered diagnostic platform for early detection of tropical diseases in underserved communities across Southeast Asia",
        sector: "HealthTech",
        location: "Singapore",
        website: "https://medtech-innovations.sg",
        contactEmail: "contact@medtech-innovations.sg",
        contactPhone: "+65-6789-1234",
        pitchSummary: "Revolutionary AI diagnostic platform that uses smartphone cameras and machine learning to detect malaria, dengue, and tuberculosis in remote areas. Our solution reduces diagnosis time from days to minutes and costs 90% less than traditional methods.",
        inclusionFocus: "Healthcare access for rural communities, women's health, and disability-inclusive medical services",
        founderTypes: JSON.stringify(["women-led", "tech-founder", "healthcare-expert"]),
        teamSize: 28,
        foundingYear: 2021,
        targetMarket: "Rural healthcare providers, NGOs, and government health departments across ASEAN",
        revenueModel: "B2B SaaS licensing, diagnostic test fees, and training services",
        revenue: 2800000,
        fundingRaised: 8500000,
        lastValuation: 35000000,
        stgGoals: JSON.stringify(['SDG_3', 'SDG_5', 'SDG_10', 'SDG_17']),
        gedsiGoals: JSON.stringify(['OI.1', 'OI.3', 'OI.4', 'OI.7', 'OI.8']),
        operationalReadiness: {
          businessPlan: true,
          financialProjections: true,
          legalStructure: true,
          teamComposition: true,
          marketResearch: true,
          productDevelopment: true,
          intellectualProperty: true,
          regulatoryCompliance: true
        },
        capitalReadiness: {
          pitchDeck: true,
          financialStatements: true,
          investorMaterials: true,
          dueDiligence: true,
          fundingHistory: true,
          boardStructure: true,
          investorReferences: true
        },
        financials: {
          revenue: 2800000,
          expenses: 2100000,
          profit: 700000,
          assets: 12000000,
          liabilities: 3500000,
          equity: 8500000,
          burnRate: 180000,
          runway: 47,
          grossMargin: 78,
          customerAcquisitionCost: 450,
          lifetimeValue: 12000,
          monthlyRecurringRevenue: 235000
        },
        gedsiMetricsSummary: {
          womenLeadership: 65,
          womenEmployees: 58,
          disabilityInclusion: 22,
          underservedCommunities: 89,
          genderPayGap: 2,
          accessibilityScore: 94,
          communityImpact: 156000,
          jobsCreated: 28,
          womenBeneficiaries: 89000,
          disabilityBeneficiaries: 12000
        },
        documentsMetadata: {
          businessPlan: 'https://docs.medtech.sg/business-plan-2024.pdf',
          financialStatements: 'https://docs.medtech.sg/financials-q4-2023.pdf',
          pitchDeck: 'https://docs.medtech.sg/investor-deck-series-a.pdf',
          legalDocuments: 'https://docs.medtech.sg/incorporation-docs.pdf',
          ipDocuments: 'https://docs.medtech.sg/patent-applications.pdf',
          regulatoryApprovals: 'https://docs.medtech.sg/fda-ce-approvals.pdf'
        },
        tags: ['AI/ML', 'healthcare', 'diagnostics', 'rural health', 'women-led', 'social impact'],
        status: 'ACTIVE',
        stage: 'SERIES_A',
        createdById: adminUser.id,
        assignedToId: managerUser.id,
        intakeDate: new Date('2023-03-15'),
        screeningDate: new Date('2023-04-20'),
        dueDiligenceStart: new Date('2023-05-10'),
        dueDiligenceEnd: new Date('2023-07-15'),
        investmentReadyAt: new Date('2023-08-01'),
        fundedAt: new Date('2023-09-20'),
        nextReviewAt: new Date('2024-03-20')
      },
      {
        name: "GreenEnergy Solutions Indonesia",
        description: "Distributed solar microgrids and energy storage systems for rural electrification with community ownership models",
        sector: "CleanTech",
        location: "Jakarta, Indonesia",
        website: "https://greenenergy-id.com",
        contactEmail: "info@greenenergy-id.com",
        contactPhone: "+62-21-5678-9012",
        pitchSummary: "We build and operate community-owned solar microgrids that provide reliable, affordable electricity to remote villages. Our innovative financing model allows communities to own their energy infrastructure while creating local jobs and reducing carbon emissions by 80%.",
        inclusionFocus: "Rural energy access, women's economic empowerment through energy entrepreneurship, and indigenous community partnerships",
        founderTypes: JSON.stringify(["rural-focus", "sustainability-expert", "community-leader"]),
        teamSize: 45,
        foundingYear: 2020,
        targetMarket: "Rural communities, government rural development programs, and impact investors across Indonesia and Southeast Asia",
        revenueModel: "Equipment sales, installation services, maintenance contracts, and energy-as-a-service subscriptions",
        revenue: 5200000,
        fundingRaised: 12000000,
        lastValuation: 48000000,
        stgGoals: JSON.stringify(['SDG_7', 'SDG_13', 'SDG_1', 'SDG_5', 'SDG_8']),
        gedsiGoals: JSON.stringify(['OI.1', 'OI.5', 'OI.8', 'OI.9']),
        operationalReadiness: {
          businessPlan: true,
          financialProjections: true,
          legalStructure: true,
          teamComposition: true,
          marketResearch: true,
          productDevelopment: true,
          supplyChainManagement: true,
          qualityAssurance: true
        },
        capitalReadiness: {
          pitchDeck: true,
          financialStatements: true,
          investorMaterials: true,
          dueDiligence: false,
          fundingHistory: true,
          boardStructure: true,
          investorReferences: true
        },
        financials: {
          revenue: 5200000,
          expenses: 4100000,
          profit: 1100000,
          assets: 18500000,
          liabilities: 6500000,
          equity: 12000000,
          burnRate: 220000,
          runway: 55,
          grossMargin: 68,
          customerAcquisitionCost: 2800,
          lifetimeValue: 35000,
          monthlyRecurringRevenue: 180000
        },
        gedsiMetricsSummary: {
          womenLeadership: 42,
          womenEmployees: 48,
          disabilityInclusion: 15,
          underservedCommunities: 95,
          genderPayGap: 5,
          accessibilityScore: 72,
          communityImpact: 78000,
          jobsCreated: 156,
          womenBeneficiaries: 45000,
          disabilityBeneficiaries: 3200
        },
        documentsMetadata: {
          businessPlan: 'https://docs.greenenergy-id.com/business-plan.pdf',
          financialStatements: 'https://docs.greenenergy-id.com/financials-2023.pdf',
          pitchDeck: 'https://docs.greenenergy-id.com/series-b-deck.pdf',
          environmentalImpact: 'https://docs.greenenergy-id.com/carbon-impact-report.pdf',
          communityAgreements: 'https://docs.greenenergy-id.com/community-partnerships.pdf'
        },
        tags: ['solar energy', 'microgrids', 'rural electrification', 'community ownership', 'carbon reduction'],
        status: 'ACTIVE',
        stage: 'SERIES_B',
        createdById: managerUser.id,
        assignedToId: analystUser.id,
        intakeDate: new Date('2022-11-10'),
        screeningDate: new Date('2022-12-15'),
        dueDiligenceStart: new Date('2023-01-20'),
        dueDiligenceEnd: new Date('2023-04-10'),
        investmentReadyAt: new Date('2023-05-01'),
        fundedAt: new Date('2023-06-15'),
        nextReviewAt: new Date('2024-06-15')
      },
      {
        name: "FinInclude Digital Banking",
        description: "Mobile-first digital banking platform specifically designed for unbanked populations with biometric authentication and offline capabilities",
        sector: "FinTech",
        location: "Manila, Philippines",
        website: "https://fininclude.ph",
        contactEmail: "hello@fininclude.ph",
        contactPhone: "+63-2-8765-4321",
        pitchSummary: "Digital banking platform that works offline and uses biometric authentication to serve the 70% of Filipinos without bank accounts. Our solution includes micro-savings, micro-loans, remittances, and financial literacy programs, all accessible via basic smartphones.",
        inclusionFocus: "Financial inclusion for unbanked populations, women's economic empowerment, and persons with disabilities",
        founderTypes: JSON.stringify(["fintech-expert", "social-entrepreneur", "disability-advocate"]),
        teamSize: 67,
        foundingYear: 2019,
        targetMarket: "Unbanked individuals, micro-entrepreneurs, overseas Filipino workers, and rural communities across the Philippines",
        revenueModel: "Transaction fees, loan interest, premium account subscriptions, and financial education services",
        revenue: 8900000,
        fundingRaised: 25000000,
        lastValuation: 120000000,
        stgGoals: JSON.stringify(['SDG_1', 'SDG_5', 'SDG_8', 'SDG_10', 'SDG_16']),
        gedsiGoals: JSON.stringify(['OI.1', 'OI.3', 'OI.4', 'OI.5', 'OI.7']),
        operationalReadiness: {
          businessPlan: true,
          financialProjections: true,
          legalStructure: true,
          teamComposition: true,
          marketResearch: true,
          productDevelopment: true,
          regulatoryCompliance: true,
          cybersecurity: true,
          dataPrivacy: true
        },
        capitalReadiness: {
          pitchDeck: true,
          financialStatements: true,
          investorMaterials: true,
          dueDiligence: true,
          fundingHistory: true,
          boardStructure: true,
          investorReferences: true,
          exitStrategy: true
        },
        financials: {
          revenue: 8900000,
          expenses: 7200000,
          profit: 1700000,
          assets: 35000000,
          liabilities: 10000000,
          equity: 25000000,
          burnRate: 580000,
          runway: 43,
          grossMargin: 82,
          customerAcquisitionCost: 12,
          lifetimeValue: 180,
          monthlyRecurringRevenue: 650000,
          activeUsers: 450000,
          transactionVolume: 125000000
        },
        gedsiMetricsSummary: {
          womenLeadership: 58,
          womenEmployees: 62,
          disabilityInclusion: 28,
          underservedCommunities: 98,
          genderPayGap: 1,
          accessibilityScore: 96,
          communityImpact: 450000,
          jobsCreated: 67,
          womenBeneficiaries: 270000,
          disabilityBeneficiaries: 45000
        },
        documentsMetadata: {
          businessPlan: 'https://docs.fininclude.ph/business-strategy.pdf',
          financialStatements: 'https://docs.fininclude.ph/audited-financials.pdf',
          pitchDeck: 'https://docs.fininclude.ph/series-c-presentation.pdf',
          regulatoryApprovals: 'https://docs.fininclude.ph/bsp-license.pdf',
          securityAudit: 'https://docs.fininclude.ph/security-assessment.pdf',
          impactReport: 'https://docs.fininclude.ph/social-impact-2023.pdf'
        },
        tags: ['digital banking', 'financial inclusion', 'mobile payments', 'microfinance', 'biometric auth'],
        status: 'ACTIVE',
        stage: 'SERIES_C',
        createdById: analystUser.id,
        assignedToId: adminUser.id,
        intakeDate: new Date('2022-08-20'),
        screeningDate: new Date('2022-09-30'),
        dueDiligenceStart: new Date('2022-11-15'),
        dueDiligenceEnd: new Date('2023-02-28'),
        investmentReadyAt: new Date('2023-03-15'),
        fundedAt: new Date('2023-05-10'),
        nextReviewAt: new Date('2024-05-10')
      },
      {
        name: "AgriTech Smart Farming Co.",
        description: "IoT-enabled precision agriculture platform with AI-powered crop monitoring, automated irrigation, and marketplace integration for smallholder farmers",
        sector: "AgriTech",
        location: "Ho Chi Minh City, Vietnam",
        website: "https://agritech-smart.vn",
        contactEmail: "contact@agritech-smart.vn",
        contactPhone: "+84-28-3456-7890",
        pitchSummary: "Comprehensive smart farming solution that increases crop yields by 35% while reducing water usage by 40%. Our IoT sensors, AI analytics, and mobile app help smallholder farmers optimize their operations and connect directly to buyers, eliminating middlemen.",
        inclusionFocus: "Smallholder farmer empowerment, women in agriculture, and rural community development",
        founderTypes: JSON.stringify(["agtech-expert", "rural-entrepreneur", "women-led"]),
        teamSize: 38,
        foundingYear: 2020,
        targetMarket: "Smallholder farmers, agricultural cooperatives, and agribusiness companies across Vietnam and Mekong Delta region",
        revenueModel: "Hardware sales, software subscriptions, marketplace transaction fees, and agricultural advisory services",
        revenue: 3400000,
        fundingRaised: 9200000,
        lastValuation: 28000000,
        stgGoals: JSON.stringify(['SDG_2', 'SDG_5', 'SDG_6', 'SDG_8', 'SDG_15']),
        gedsiGoals: JSON.stringify(['OI.1', 'OI.3', 'OI.5', 'OI.8']),
        operationalReadiness: {
          businessPlan: true,
          financialProjections: true,
          legalStructure: true,
          teamComposition: true,
          marketResearch: true,
          productDevelopment: true,
          supplyChainManagement: true,
          customerSupport: true
        },
        capitalReadiness: {
          pitchDeck: true,
          financialStatements: true,
          investorMaterials: true,
          dueDiligence: false,
          fundingHistory: true,
          boardStructure: false,
          investorReferences: true
        },
        financials: {
          revenue: 3400000,
          expenses: 2800000,
          profit: 600000,
          assets: 12500000,
          liabilities: 3300000,
          equity: 9200000,
          burnRate: 195000,
          runway: 47,
          grossMargin: 65,
          customerAcquisitionCost: 85,
          lifetimeValue: 1200,
          monthlyRecurringRevenue: 145000,
          farmerCustomers: 12500,
          hectaresCovered: 45000
        },
        gedsiMetricsSummary: {
          womenLeadership: 72,
          womenEmployees: 55,
          disabilityInclusion: 18,
          underservedCommunities: 88,
          genderPayGap: 3,
          accessibilityScore: 78,
          communityImpact: 12500,
          jobsCreated: 38,
          womenBeneficiaries: 6800,
          disabilityBeneficiaries: 890
        },
        documentsMetadata: {
          businessPlan: 'https://docs.agritech-smart.vn/business-plan.pdf',
          financialStatements: 'https://docs.agritech-smart.vn/financials.pdf',
          pitchDeck: 'https://docs.agritech-smart.vn/investor-deck.pdf',
          productDemo: 'https://docs.agritech-smart.vn/product-demo.mp4',
          farmerTestimonials: 'https://docs.agritech-smart.vn/farmer-stories.pdf',
          impactStudy: 'https://docs.agritech-smart.vn/yield-improvement-study.pdf'
        },
        tags: ['precision agriculture', 'IoT sensors', 'AI analytics', 'smallholder farmers', 'sustainable farming'],
        status: 'ACTIVE',
        stage: 'SERIES_A',
        createdById: managerUser.id,
        assignedToId: analystUser.id,
        intakeDate: new Date('2023-01-12'),
        screeningDate: new Date('2023-02-20'),
        dueDiligenceStart: new Date('2023-03-15'),
        dueDiligenceEnd: new Date('2023-06-30'),
        investmentReadyAt: new Date('2023-07-15'),
        fundedAt: new Date('2023-09-05'),
        nextReviewAt: new Date('2024-09-05')
      },
      {
        name: "EduAccess Learning Platform",
        description: "Adaptive learning platform with offline capabilities, sign language support, and culturally relevant content for inclusive education",
        sector: "EdTech",
        location: "Kuala Lumpur, Malaysia",
        website: "https://eduaccess.my",
        contactEmail: "info@eduaccess.my",
        contactPhone: "+60-3-2345-6789",
        pitchSummary: "AI-powered adaptive learning platform that personalizes education for students with disabilities, rural learners, and marginalized communities. Features include sign language interpretation, braille support, offline functionality, and content in 15 local languages.",
        inclusionFocus: "Inclusive education for students with disabilities, rural education access, and multicultural learning",
        founderTypes: JSON.stringify(["disability-advocate", "education-expert", "tech-entrepreneur"]),
        teamSize: 52,
        foundingYear: 2021,
        targetMarket: "Schools, NGOs, government education departments, and families across Southeast Asia",
        revenueModel: "School licensing, individual subscriptions, government contracts, and content partnerships",
        revenue: 4100000,
        fundingRaised: 11500000,
        lastValuation: 42000000,
        stgGoals: JSON.stringify(['SDG_4', 'SDG_5', 'SDG_10', 'SDG_16']),
        gedsiGoals: JSON.stringify(['OI.1', 'OI.3', 'OI.4', 'OI.5']),
        operationalReadiness: {
          businessPlan: true,
          financialProjections: true,
          legalStructure: true,
          teamComposition: true,
          marketResearch: true,
          productDevelopment: true,
          contentDevelopment: true,
          accessibilityCompliance: true
        },
        capitalReadiness: {
          pitchDeck: true,
          financialStatements: true,
          investorMaterials: true,
          dueDiligence: true,
          fundingHistory: true,
          boardStructure: true,
          investorReferences: false
        },
        financials: {
          revenue: 4100000,
          expenses: 3500000,
          profit: 600000,
          assets: 15800000,
          liabilities: 4300000,
          equity: 11500000,
          burnRate: 285000,
          runway: 40,
          grossMargin: 78,
          customerAcquisitionCost: 45,
          lifetimeValue: 850,
          monthlyRecurringRevenue: 285000,
          activeStudents: 89000,
          schoolPartners: 450
        },
        gedsiMetricsSummary: {
          womenLeadership: 68,
          womenEmployees: 64,
          disabilityInclusion: 35,
          underservedCommunities: 92,
          genderPayGap: 0,
          accessibilityScore: 98,
          communityImpact: 89000,
          jobsCreated: 52,
          womenBeneficiaries: 45000,
          disabilityBeneficiaries: 28000
        },
        documentsMetadata: {
          businessPlan: 'https://docs.eduaccess.my/strategic-plan.pdf',
          financialStatements: 'https://docs.eduaccess.my/financials.pdf',
          pitchDeck: 'https://docs.eduaccess.my/series-b-deck.pdf',
          accessibilityAudit: 'https://docs.eduaccess.my/accessibility-report.pdf',
          educationalImpact: 'https://docs.eduaccess.my/learning-outcomes-study.pdf',
          parentalFeedback: 'https://docs.eduaccess.my/parent-teacher-feedback.pdf'
        },
        tags: ['inclusive education', 'adaptive learning', 'accessibility', 'multilingual', 'offline learning'],
        status: 'ACTIVE',
        stage: 'SERIES_B',
        createdById: analystUser.id,
        assignedToId: managerUser.id,
        intakeDate: new Date('2022-12-05'),
        screeningDate: new Date('2023-01-15'),
        dueDiligenceStart: new Date('2023-02-20'),
        dueDiligenceEnd: new Date('2023-05-15'),
        investmentReadyAt: new Date('2023-06-01'),
        fundedAt: new Date('2023-08-20'),
        nextReviewAt: new Date('2024-08-20')
      },
      {
        name: "WasteToWealth Circular Solutions",
        description: "Comprehensive waste management ecosystem with community recycling centers, plastic-to-fuel technology, and circular economy marketplace",
        sector: "CleanTech",
        location: "Bangkok, Thailand",
        website: "https://wastetowealth.th",
        contactEmail: "contact@wastetowealth.th",
        contactPhone: "+66-2-987-6543",
        pitchSummary: "End-to-end waste management solution that converts plastic waste into fuel while creating jobs for waste collectors. Our community recycling centers process 500 tons/month and have created 200+ jobs for marginalized communities.",
        inclusionFocus: "Waste collector empowerment, women's cooperatives, and environmental justice",
        founderTypes: JSON.stringify(["environmental-engineer", "social-entrepreneur", "community-organizer"]),
        teamSize: 78,
        foundingYear: 2019,
        targetMarket: "Municipal governments, waste management companies, and industrial manufacturers across Thailand and ASEAN",
        revenueModel: "Waste processing fees, recycled material sales, fuel production, and consulting services",
        revenue: 12500000,
        fundingRaised: 18000000,
        lastValuation: 65000000,
        stgGoals: JSON.stringify(['SDG_11', 'SDG_12', 'SDG_13', 'SDG_8', 'SDG_5']),
        gedsiGoals: JSON.stringify(['OI.1', 'OI.5', 'OI.8', 'OI.9']),
        operationalReadiness: {
          businessPlan: true,
          financialProjections: true,
          legalStructure: true,
          teamComposition: true,
          marketResearch: true,
          productDevelopment: true,
          operationsManagement: true,
          environmentalCompliance: true
        },
        capitalReadiness: {
          pitchDeck: true,
          financialStatements: true,
          investorMaterials: true,
          dueDiligence: true,
          fundingHistory: true,
          boardStructure: true,
          investorReferences: true,
          exitStrategy: false
        },
        financials: {
          revenue: 12500000,
          expenses: 9800000,
          profit: 2700000,
          assets: 28000000,
          liabilities: 10000000,
          equity: 18000000,
          burnRate: 450000,
          runway: 40,
          grossMargin: 58,
          customerAcquisitionCost: 2500,
          lifetimeValue: 45000,
          monthlyRecurringRevenue: 890000,
          wasteProcessed: 6000,
          recyclingCenters: 12
        },
        gedsiMetricsSummary: {
          womenLeadership: 45,
          womenEmployees: 52,
          disabilityInclusion: 25,
          underservedCommunities: 85,
          genderPayGap: 4,
          accessibilityScore: 82,
          communityImpact: 2500,
          jobsCreated: 245,
          womenBeneficiaries: 1200,
          disabilityBeneficiaries: 180
        },
        documentsMetadata: {
          businessPlan: 'https://docs.wastetowealth.th/business-plan.pdf',
          financialStatements: 'https://docs.wastetowealth.th/financials.pdf',
          pitchDeck: 'https://docs.wastetowealth.th/series-c-deck.pdf',
          environmentalImpact: 'https://docs.wastetowealth.th/carbon-reduction-report.pdf',
          technologyPatents: 'https://docs.wastetowealth.th/patent-portfolio.pdf',
          communityImpact: 'https://docs.wastetowealth.th/community-impact-study.pdf'
        },
        tags: ['circular economy', 'waste management', 'plastic recycling', 'community empowerment', 'clean technology'],
        status: 'ACTIVE',
        stage: 'SERIES_C',
        createdById: adminUser.id,
        assignedToId: managerUser.id,
        intakeDate: new Date('2022-06-10'),
        screeningDate: new Date('2022-07-25'),
        dueDiligenceStart: new Date('2022-09-01'),
        dueDiligenceEnd: new Date('2022-12-15'),
        investmentReadyAt: new Date('2023-01-10'),
        fundedAt: new Date('2023-03-25'),
        nextReviewAt: new Date('2024-03-25')
      }
    ]

    const createdVentures = []
    let totalActivitiesCreated = 0

    // Create detailed ventures
    for (const ventureData of detailedVentures) {
      console.log(`🏢 Creating venture: ${ventureData.name}`)
      
      const venture = await prisma.venture.create({
        data: ventureData
      })
      
      createdVentures.push(venture)

      // Create comprehensive activities for each venture
      const activities = [
        {
          ventureId: venture.id,
          userId: ventureData.createdById,
          type: 'VENTURE_CREATED',
          title: 'Venture Application Submitted',
          description: `${venture.name} submitted their venture application with comprehensive business plan and financial projections`,
          metadata: {
            type: 'venture_creation',
            sector: venture.sector,
            stage: venture.stage,
            fundingRaised: venture.fundingRaised
          }
        },
        {
          ventureId: venture.id,
          userId: ventureData.assignedToId || ventureData.createdById,
          type: 'NOTE_ADDED',
          title: 'Initial Screening Completed',
          description: `Completed initial screening assessment. Venture shows strong potential in ${venture.sector} sector with solid team and market opportunity`,
          metadata: {
            type: 'screening',
            outcome: 'passed',
            score: Math.floor(Math.random() * 20) + 80
          }
        },
        {
          ventureId: venture.id,
          userId: ventureData.assignedToId || ventureData.createdById,
          type: 'NOTE_ADDED',
          title: 'Due Diligence Process Initiated',
          description: `Started comprehensive due diligence process covering financial, legal, technical, and GEDSI aspects`,
          metadata: {
            type: 'due_diligence',
            phase: 'financial_review',
            expectedDuration: '90 days'
          }
        },
        {
          ventureId: venture.id,
          userId: analystUser.id,
          type: 'METRIC_ADDED',
          title: 'GEDSI Assessment Completed',
          description: `Completed comprehensive GEDSI assessment. Strong performance in inclusion metrics with score of ${ventureData.gedsiMetricsSummary.accessibilityScore}%`,
          metadata: {
            type: 'gedsi_assessment',
            gedsiScore: ventureData.gedsiMetricsSummary.accessibilityScore,
            womenLeadership: ventureData.gedsiMetricsSummary.womenLeadership,
            disabilityInclusion: ventureData.gedsiMetricsSummary.disabilityInclusion
          }
        },
        {
          ventureId: venture.id,
          userId: managerUser.id,
          type: 'STAGE_CHANGED',
          title: 'Investment Committee Approval',
          description: `Investment committee approved funding for ${venture.name}. Investment amount: $${(venture.fundingRaised / 1000000).toFixed(1)}M`,
          metadata: {
            type: 'investment_approval',
            amount: venture.fundingRaised,
            stage: venture.stage,
            valuation: venture.lastValuation
          }
        },
        {
          ventureId: venture.id,
          userId: adminUser.id,
          type: 'CAPITAL_ACTIVITY',
          title: 'Funding Round Completed',
          description: `Successfully completed ${venture.stage} funding round. Venture is now part of MIV portfolio with strong growth trajectory`,
          metadata: {
            type: 'funding_completion',
            amount: venture.fundingRaised,
            stage: venture.stage,
            nextMilestone: 'quarterly_review'
          }
        }
      ]

      for (const activityData of activities) {
        await prisma.activity.create({
          data: {
            ...activityData,
            createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Random date within last 6 months
          }
        })
        totalActivitiesCreated++
      }
    }

    console.log(`✅ Successfully created ${createdVentures.length} detailed ventures with ${totalActivitiesCreated} activities`)

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdVentures.length} detailed ventures!`,
      data: {
        venturesCreated: createdVentures.length,
        activitiesCreated: totalActivitiesCreated,
        totalFunding: createdVentures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0),
        averageTeamSize: Math.round(createdVentures.reduce((sum, v) => sum + (v.teamSize || 0), 0) / createdVentures.length),
        sectorBreakdown: createdVentures.reduce((acc: any, v) => {
          acc[v.sector] = (acc[v.sector] || 0) + 1
          return acc
        }, {}),
        stageBreakdown: createdVentures.reduce((acc: any, v) => {
          acc[v.stage] = (acc[v.stage] || 0) + 1
          return acc
        }, {}),
        ventures: createdVentures.map(v => ({
          id: v.id,
          name: v.name,
          sector: v.sector,
          stage: v.stage,
          location: v.location,
          fundingRaised: v.fundingRaised,
          teamSize: v.teamSize,
          revenue: v.revenue
        }))
      }
    })

  } catch (error) {
    console.error('Error seeding detailed ventures:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed detailed ventures', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
