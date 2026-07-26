import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('📋 Adding detailed capital activities and documents to ventures...')

    // Get all ventures
    const ventures = await prisma.venture.findMany({
      include: {
        capitalActivities: true,
        documents: true,
        createdBy: true
      }
    })

    console.log(`📊 Found ${ventures.length} ventures to enhance`)

    let totalCapitalActivities = 0
    let totalDocuments = 0

    for (const venture of ventures) {
      console.log(`💼 Adding details to ${venture.name}`)

      // Create capital activities based on venture stage
      const capitalActivities = []
      
      if (venture.stage === 'SEED' || venture.stage === 'SERIES_A' || venture.stage === 'SERIES_B' || venture.stage === 'SERIES_C') {
        capitalActivities.push(
          {
            ventureId: venture.id,
            type: 'EQUITY',
            amount: venture.fundingRaised || 1000000,
            currency: 'USD',
            description: `${venture.stage} equity funding round completed`,
            date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
            status: 'COMPLETED',
            investorName: venture.stage === 'SEED' ? 'Angel Group Asia' : 
                         venture.stage === 'SERIES_A' ? 'Venture Partners SEA' :
                         venture.stage === 'SERIES_B' ? 'Growth Capital Partners' :
                         'International Impact Fund',
            terms: {
              investorType: venture.stage === 'SEED' ? 'ANGEL' : venture.stage === 'SERIES_A' ? 'VC' : 'INSTITUTIONAL',
              equityPercentage: venture.stage === 'SEED' ? 15 : venture.stage === 'SERIES_A' ? 20 : 25,
              valuation: venture.lastValuation || venture.fundingRaised * 4,
              useOfFunds: ['product development', 'team expansion', 'market expansion']
            }
          }
        )

        // Add convertible note if Series B or C
        if (venture.stage === 'SERIES_B' || venture.stage === 'SERIES_C') {
          capitalActivities.push(
            {
              ventureId: venture.id,
              type: 'CONVERTIBLE_NOTE',
              amount: Math.floor(venture.fundingRaised * 0.3),
              currency: 'USD',
              description: 'Convertible note from strategic investors',
              date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
              status: 'COMPLETED',
              investorName: 'Strategic Impact Partners',
              terms: {
                conversionCap: venture.lastValuation * 1.2,
                discountRate: 20,
                maturityDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
                investorType: 'STRATEGIC'
              }
            }
          )
        }
      }

      // Add grant funding for impact ventures
      if (venture.sector === 'HealthTech' || venture.sector === 'EdTech' || venture.sector === 'CleanTech') {
        capitalActivities.push(
          {
            ventureId: venture.id,
            type: 'GRANT',
            amount: Math.floor(Math.random() * 500000) + 100000, // $100K - $600K
            currency: 'USD',
            description: `Impact grant for ${venture.sector.toLowerCase()} innovation`,
            date: new Date(Date.now() - Math.random() * 270 * 24 * 60 * 60 * 1000),
            status: 'COMPLETED',
            investorName: venture.sector === 'HealthTech' ? 'Global Health Innovation Fund' :
                        venture.sector === 'EdTech' ? 'Education Impact Foundation' :
                        'Climate Action Grant Program',
            terms: {
              grantProvider: venture.sector === 'HealthTech' ? 'Global Health Innovation Fund' :
                            venture.sector === 'EdTech' ? 'Education Impact Foundation' :
                            'Climate Action Grant Program',
              purpose: 'social impact acceleration',
              investorType: 'FOUNDATION'
            }
          }
        )
      }

      // Create capital activities
      for (const activityData of capitalActivities) {
        await prisma.capitalActivity.create({
          data: activityData
        })
        totalCapitalActivities++
      }

      // Create documents
      const documents = [
        {
          ventureId: venture.id,
          name: 'Business Plan 2024',
          type: 'BUSINESS_PLAN',
          url: `https://docs.${venture.name.toLowerCase().replace(/\s+/g, '')}.com/business-plan-2024.pdf`,
          uploadedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          size: Math.floor(Math.random() * 5000000) + 1000000, // 1-6MB
          mimeType: 'application/pdf'
        },
        {
          ventureId: venture.id,
          name: 'Financial Statements Q4 2023',
          type: 'FINANCIAL_STATEMENTS',
          url: `https://docs.${venture.name.toLowerCase().replace(/\s+/g, '')}.com/financials-q4-2023.pdf`,
          uploadedAt: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000),
          size: Math.floor(Math.random() * 2000000) + 500000,
          mimeType: 'application/pdf'
        },
        {
          ventureId: venture.id,
          name: 'Investor Pitch Deck',
          type: 'PITCH_DECK',
          url: `https://docs.${venture.name.toLowerCase().replace(/\s+/g, '')}.com/pitch-deck-latest.pdf`,
          uploadedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
          size: Math.floor(Math.random() * 15000000) + 5000000, // 5-20MB
          mimeType: 'application/pdf'
        },
        {
          ventureId: venture.id,
          name: 'Market Research Report',
          type: 'MARKET_RESEARCH',
          url: `https://docs.${venture.name.toLowerCase().replace(/\s+/g, '')}.com/market-research-2023.pdf`,
          uploadedAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
          size: Math.floor(Math.random() * 3000000) + 1000000,
          mimeType: 'application/pdf'
        }
      ]

      // Add sector-specific documents
      if (venture.sector === 'HealthTech') {
        documents.push({
          ventureId: venture.id,
          name: 'FDA Regulatory Approval',
          type: 'LEGAL_DOCUMENTS',
          url: `https://docs.${venture.name.toLowerCase().replace(/\s+/g, '')}.com/fda-approval.pdf`,
          uploadedAt: new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000),
          size: Math.floor(Math.random() * 1000000) + 500000,
          mimeType: 'application/pdf'
        })
      }

      if (venture.sector === 'FinTech') {
        documents.push({
          ventureId: venture.id,
          name: 'Banking License Certificate',
          type: 'LEGAL_DOCUMENTS',
          url: `https://docs.${venture.name.toLowerCase().replace(/\s+/g, '')}.com/banking-license.pdf`,
          uploadedAt: new Date(Date.now() - Math.random() * 300 * 24 * 60 * 60 * 1000),
          size: Math.floor(Math.random() * 800000) + 200000,
          mimeType: 'application/pdf'
        })
      }

      if (venture.sector === 'CleanTech') {
        documents.push({
          ventureId: venture.id,
          name: 'Environmental Impact Assessment',
          type: 'OTHER',
          url: `https://docs.${venture.name.toLowerCase().replace(/\s+/g, '')}.com/environmental-impact.pdf`,
          uploadedAt: new Date(Date.now() - Math.random() * 150 * 24 * 60 * 60 * 1000),
          size: Math.floor(Math.random() * 4000000) + 2000000,
          mimeType: 'application/pdf'
        })
      }

      // Create documents
      for (const docData of documents) {
        await prisma.document.create({
          data: docData
        })
        totalDocuments++
      }
    }

    console.log(`✅ Successfully added ${totalCapitalActivities} capital activities and ${totalDocuments} documents`)

    return NextResponse.json({
      success: true,
      message: `Successfully enhanced ${ventures.length} ventures with detailed capital activities and documents!`,
      data: {
        venturesEnhanced: ventures.length,
        capitalActivitiesAdded: totalCapitalActivities,
        documentsAdded: totalDocuments,
        averageCapitalActivitiesPerVenture: Math.round((totalCapitalActivities / ventures.length) * 10) / 10,
        averageDocumentsPerVenture: Math.round((totalDocuments / ventures.length) * 10) / 10,
        totalFundingTracked: ventures.reduce((sum: number, v: { fundingRaised?: number | null }) => sum + (v.fundingRaised || 0), 0),
        documentTypes: {
          businessPlans: ventures.length,
          financialStatements: ventures.length,
          pitchDecks: ventures.length,
          impactReports: ventures.length,
          sectorSpecific: ventures.filter((v: { sector?: string | null }) => ['HealthTech', 'FinTech', 'CleanTech'].includes(v.sector || '')).length
        }
      }
    })

  } catch (error) {
    console.error('Error adding venture details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add venture details', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
