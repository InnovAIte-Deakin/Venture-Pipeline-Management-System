import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🌱 Starting GEDSI metrics seeding for portfolio companies...')

    // Get all portfolio companies (ventures with portfolio stages)
    const portfolioStages = ['FUNDED', 'EXITED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SEED']
    const ventures = await prisma.venture.findMany({
      where: {
        stage: {
          in: portfolioStages
        }
      },
      include: {
        gedsiMetrics: true,
        createdBy: true
      }
    })

    console.log(`📊 Found ${ventures.length} portfolio companies`)

    // Get a user to assign as creator of metrics
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    }) || await prisma.user.findFirst()

    if (!user) {
      throw new Error('No user found to assign as metric creator')
    }

    // Define common GEDSI metrics for portfolio companies
    const gedsiMetricTemplates = [
      {
        metricCode: 'OI.1',
        metricName: 'Number of individuals reached',
        category: 'SOCIAL_INCLUSION' as const,
        unit: 'Individuals'
      },
      {
        metricCode: 'OI.3',
        metricName: 'Number of women reached',
        category: 'GENDER' as const,
        unit: 'Women'
      },
      {
        metricCode: 'OI.4',
        metricName: 'Number of individuals with disabilities reached',
        category: 'DISABILITY' as const,
        unit: 'Individuals'
      },
      {
        metricCode: 'OI.8',
        metricName: 'Number of jobs created',
        category: 'CROSS_CUTTING' as const,
        unit: 'Jobs'
      },
      {
        metricCode: 'OI.9',
        metricName: 'Number of women employed',
        category: 'GENDER' as const,
        unit: 'Women'
      },
      {
        metricCode: 'OI.10',
        metricName: 'Number of individuals with disabilities employed',
        category: 'DISABILITY' as const,
        unit: 'Individuals'
      }
    ]

    let totalMetricsCreated = 0

    // Create GEDSI metrics for each venture
    for (const venture of ventures) {
      // Skip if venture already has GEDSI metrics
      if (venture.gedsiMetrics.length > 0) {
        console.log(`⏭️  Skipping ${venture.name} - already has ${venture.gedsiMetrics.length} GEDSI metrics`)
        continue
      }

      console.log(`🎯 Creating GEDSI metrics for ${venture.name}`)

      // Create 3-4 metrics per venture with realistic values based on stage
      const metricsToCreate = gedsiMetricTemplates.slice(0, Math.floor(Math.random() * 2) + 3) // 3-4 metrics

      for (const template of metricsToCreate) {
        // Generate realistic values based on venture stage and sector
        let targetValue = 100
        let currentValue = 50

        // Adjust values based on stage
        if (venture.stage === 'SERIES_B' || venture.stage === 'EXITED') {
          targetValue = Math.floor(Math.random() * 1000) + 500 // 500-1500
          currentValue = Math.floor(targetValue * (0.6 + Math.random() * 0.4)) // 60-100% of target
        } else if (venture.stage === 'SERIES_A' || venture.stage === 'FUNDED') {
          targetValue = Math.floor(Math.random() * 500) + 200 // 200-700
          currentValue = Math.floor(targetValue * (0.4 + Math.random() * 0.5)) // 40-90% of target
        } else if (venture.stage === 'SEED') {
          targetValue = Math.floor(Math.random() * 200) + 50 // 50-250
          currentValue = Math.floor(targetValue * (0.2 + Math.random() * 0.6)) // 20-80% of target
        }

        // Adjust for specific metrics
        if (template.metricCode === 'OI.8' || template.metricCode === 'OI.9' || template.metricCode === 'OI.10') {
          // Job-related metrics should be smaller
          targetValue = Math.floor(targetValue * 0.1)
          currentValue = Math.floor(currentValue * 0.1)
        }

        // Determine status based on current vs target
        let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'COMPLETED' = 'IN_PROGRESS'
        if (currentValue === 0) status = 'NOT_STARTED'
        else if (currentValue >= targetValue) status = 'VERIFIED'
        else if (currentValue >= targetValue * 0.8) status = 'COMPLETED'

        // Create the metric
        await prisma.gEDSIMetric.create({
          data: {
            ventureId: venture.id,
            metricCode: template.metricCode,
            metricName: template.metricName,
            category: template.category,
            targetValue,
            currentValue,
            unit: template.unit,
            status,
            notes: `Metric tracking for ${venture.name} - ${template.metricName.toLowerCase()}`,
            createdById: user.id,
          }
        })

        totalMetricsCreated++
      }

      // Create activity log for the venture
      await prisma.activity.create({
        data: {
          ventureId: venture.id,
          userId: user.id,
          type: 'METRIC_UPDATED',
          title: 'GEDSI Metrics Initialized',
          description: `GEDSI metrics have been initialized for ${venture.name}`,
          metadata: {
            type: 'gedsi_initialization',
            metricsCount: metricsToCreate.length,
            ventureName: venture.name,
            stage: venture.stage
          }
        }
      })
    }

    console.log(`✅ Successfully created ${totalMetricsCreated} GEDSI metrics for ${ventures.length} portfolio companies`)

    return NextResponse.json({
      success: true,
      message: 'GEDSI metrics seeded successfully for portfolio companies!',
      data: {
        venturesProcessed: ventures.length,
        metricsCreated: totalMetricsCreated,
        averageMetricsPerVenture: Math.round(totalMetricsCreated / ventures.length * 10) / 10
      }
    })

  } catch (error) {
    console.error('Error seeding GEDSI metrics:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed GEDSI metrics', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
