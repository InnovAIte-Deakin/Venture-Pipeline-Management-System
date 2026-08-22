import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🎯 Starting GEDSI score improvements for portfolio companies...')

    // Get all portfolio companies with their current GEDSI metrics
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
      },
      orderBy: { name: 'asc' }
    })

    console.log(`📊 Found ${ventures.length} portfolio companies`)

    // Get a user to assign as updater of metrics
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    }) || await prisma.user.findFirst()

    if (!user) {
      throw new Error('No user found to assign as metric updater')
    }

    let totalUpdates = 0
    const improvements = []

    // Improve GEDSI scores for selected companies
    for (const venture of ventures) {
      // Skip if no GEDSI metrics exist
      if (venture.gedsiMetrics.length === 0) {
        console.log(`⏭️  Skipping ${venture.name} - no GEDSI metrics to improve`)
        continue
      }

      // Calculate current average score
      const currentAvgScore = venture.gedsiMetrics.reduce((sum, metric) => 
        sum + (metric.currentValue || 0), 0) / venture.gedsiMetrics.length

      // Decide which companies to improve (improve about 60% of them)
      const shouldImprove = Math.random() > 0.4

      if (!shouldImprove) {
        console.log(`⏭️  Skipping ${venture.name} - randomly selected to keep current performance`)
        continue
      }

      console.log(`🎯 Improving GEDSI scores for ${venture.name} (current avg: ${currentAvgScore.toFixed(1)})`)

      let ventureUpdates = 0
      const ventureImprovements = []

      // Update each metric for this venture
      for (const metric of venture.gedsiMetrics) {
        // Determine improvement strategy based on current performance
        let improvementFactor = 1
        let newStatus = metric.status

        if (metric.currentValue < metric.targetValue * 0.5) {
          // Low performance - significant improvement
          improvementFactor = 1.5 + Math.random() * 0.8 // 1.5x to 2.3x improvement
          newStatus = 'IN_PROGRESS'
        } else if (metric.currentValue < metric.targetValue * 0.8) {
          // Medium performance - moderate improvement
          improvementFactor = 1.2 + Math.random() * 0.5 // 1.2x to 1.7x improvement
          newStatus = 'COMPLETED'
        } else if (metric.currentValue < metric.targetValue) {
          // Good performance - small improvement to reach or exceed target
          improvementFactor = 1.1 + Math.random() * 0.3 // 1.1x to 1.4x improvement
          newStatus = 'VERIFIED'
        } else {
          // Already at or above target - small boost
          improvementFactor = 1.05 + Math.random() * 0.15 // 1.05x to 1.2x improvement
          newStatus = 'VERIFIED'
        }

        // Calculate new value
        const newValue = Math.min(
          Math.floor(metric.currentValue * improvementFactor),
          Math.floor(metric.targetValue * 1.2) // Don't exceed 120% of target
        )

        // Only update if there's actual improvement
        if (newValue > metric.currentValue) {
          await prisma.gEDSIMetric.update({
            where: { id: metric.id },
            data: {
              currentValue: newValue,
              status: newStatus,
              notes: `${metric.notes || ''} [Updated: Improved from ${metric.currentValue} to ${newValue} - ${new Date().toLocaleDateString()}]`.trim(),
              updatedAt: new Date()
            }
          })

          ventureImprovements.push({
            metricCode: metric.metricCode,
            metricName: metric.metricName,
            oldValue: metric.currentValue,
            newValue: newValue,
            improvement: newValue - metric.currentValue,
            oldStatus: metric.status,
            newStatus: newStatus
          })

          ventureUpdates++
          totalUpdates++
        }
      }

      if (ventureUpdates > 0) {
        // Calculate new average score
        const updatedMetrics = await prisma.gEDSIMetric.findMany({
          where: { ventureId: venture.id }
        })
        const newAvgScore = updatedMetrics.reduce((sum, metric) => 
          sum + (metric.currentValue || 0), 0) / updatedMetrics.length

        improvements.push({
          ventureName: venture.name,
          stage: venture.stage,
          sector: venture.sector,
          metricsUpdated: ventureUpdates,
          oldAvgScore: currentAvgScore,
          newAvgScore: newAvgScore,
          improvement: newAvgScore - currentAvgScore,
          improvements: ventureImprovements
        })

        // Create activity log for the improvement
        await prisma.activity.create({
          data: {
            ventureId: venture.id,
            userId: user.id,
            type: 'METRIC_UPDATED',
            title: 'GEDSI Metrics Improved',
            description: `GEDSI metrics improved for ${venture.name}. Average score increased from ${currentAvgScore.toFixed(1)} to ${newAvgScore.toFixed(1)} (+${(newAvgScore - currentAvgScore).toFixed(1)})`,
            metadata: {
              type: 'gedsi_improvement',
              ventureName: venture.name,
              oldAvgScore: currentAvgScore,
              newAvgScore: newAvgScore,
              metricsUpdated: ventureUpdates,
              improvements: ventureImprovements
            }
          }
        })

        console.log(`✅ Improved ${venture.name}: ${currentAvgScore.toFixed(1)} → ${newAvgScore.toFixed(1)} (+${(newAvgScore - currentAvgScore).toFixed(1)})`)
      }
    }

    // Calculate overall improvement statistics
    const totalImprovement = improvements.reduce((sum, imp) => sum + imp.improvement, 0)
    const avgImprovement = improvements.length > 0 ? totalImprovement / improvements.length : 0

    console.log(`🎉 Successfully improved GEDSI scores for ${improvements.length} companies with ${totalUpdates} metric updates`)

    return NextResponse.json({
      success: true,
      message: `GEDSI scores improved for ${improvements.length} portfolio companies!`,
      data: {
        companiesImproved: improvements.length,
        totalMetricUpdates: totalUpdates,
        averageImprovement: Math.round(avgImprovement * 10) / 10,
        totalPortfolioCompanies: ventures.length,
        improvementRate: Math.round((improvements.length / ventures.length) * 100),
        topImprovements: improvements
          .sort((a, b) => b.improvement - a.improvement)
          .slice(0, 5)
          .map(imp => ({
            company: imp.ventureName,
            stage: imp.stage,
            sector: imp.sector,
            oldScore: Math.round(imp.oldAvgScore * 10) / 10,
            newScore: Math.round(imp.newAvgScore * 10) / 10,
            improvement: Math.round(imp.improvement * 10) / 10
          }))
      },
      detailedImprovements: improvements
    })

  } catch (error) {
    console.error('Error improving GEDSI scores:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to improve GEDSI scores', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
