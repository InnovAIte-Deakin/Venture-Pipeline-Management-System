import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function monthsAgoDate(monthsAgo: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  // normalize to middle of month
  d.setDate(15)
  d.setHours(12, 0, 0, 0)
  return d
}

export async function POST(_request: NextRequest) {
  try {
    // Ensure Sarah exists
    let sarah = await prisma.user.findUnique({ where: { email: 'sarah.chen@miv.org' } })
    if (!sarah) {
      sarah = await prisma.user.create({
        data: {
          name: 'Sarah Chen',
          email: 'sarah.chen@miv.org',
          role: 'ADMIN',
        }
      })
    }

    // Create or update a few ventures over past months assigned to/created by Sarah
    const ventureNames = [
      'AgriFlow Cambodia',
      'SolarTech Laos',
      'MicroFin Vietnam',
      'HealthAccess Myanmar',
      'EdTech Thailand'
    ]

    const ventures = [] as any[]
    for (let i = 0; i < ventureNames.length; i++) {
      const name = ventureNames[i]
      const createdAt = monthsAgoDate(5 - i)
      const location = ['Phnom Penh, Cambodia','Vientiane, Laos','Hanoi, Vietnam','Yangon, Myanmar','Bangkok, Thailand'][i]
      const stage = i >= 3 ? 'SERIES_A' : i >= 1 ? 'REVIEW' : 'ASSESSMENT'
      const contactEmail = `${name.toLowerCase().replace(/\s+/g,'')}@example.com`
      const existing = await prisma.venture.findFirst({ where: { name } })
      let venture
      if (existing) {
        venture = await prisma.venture.update({
          where: { id: existing.id },
          data: {
            sector: i % 2 === 0 ? 'Agriculture' : 'CleanTech',
            location,
            contactEmail,
            founderTypes: JSON.stringify(['women-led','disability-inclusive']),
            createdById: sarah.id,
            assignedToId: sarah.id,
            status: 'ACTIVE',
            stage,
            updatedAt: new Date(),
          }
        })
      } else {
        venture = await prisma.venture.create({
          data: {
            name,
            sector: i % 2 === 0 ? 'Agriculture' : 'CleanTech',
            location,
            contactEmail,
            founderTypes: JSON.stringify(['women-led','disability-inclusive']),
            createdById: sarah.id,
            assignedToId: sarah.id,
            status: 'ACTIVE',
            stage,
            createdAt,
            updatedAt: createdAt,
          }
        })
      }
      ventures.push(venture)
    }

    // Create GEDSI metrics for each venture across categories and statuses
    const categories: any[] = ['GENDER','DISABILITY','SOCIAL_INCLUSION','CROSS_CUTTING']
    let createdMetrics = 0
    for (const v of ventures) {
      for (let j = 0; j < categories.length; j++) {
        const code = `PI-${v.id.slice(0,4)}-${j}`
        await prisma.gEDSIMetric.upsert({
          where: { metricCode_ventureId: { metricCode: code, ventureId: v.id } },
          update: {
            status: j % 3 === 0 ? 'COMPLETED' : j % 3 === 1 ? 'IN_PROGRESS' : 'VERIFIED',
            currentValue: 10 + j * 5,
            targetValue: 30 + j * 5,
          },
          create: {
            ventureId: v.id,
            metricCode: code,
            metricName: `Sample Metric ${j+1}`,
            category: categories[j],
            unit: 'units',
            targetValue: 30 + j * 5,
            currentValue: 10 + j * 5,
            notes: 'Seeded for analytics demo',
            createdById: sarah.id,
            status: j % 3 === 0 ? 'COMPLETED' : j % 3 === 1 ? 'IN_PROGRESS' : 'VERIFIED',
          }
        })
        createdMetrics++
      }
    }

    // Add recent activities to feed feature usage
    const activityTypes: any[] = ['VENTURE_CREATED','METRIC_ADDED','NOTE_ADDED']
    for (const v of ventures) {
      for (const t of activityTypes) {
        await prisma.activity.create({
          data: {
            ventureId: v.id,
            userId: sarah.id,
            type: t,
            title: t === 'VENTURE_CREATED' ? 'Venture Created' : t === 'METRIC_ADDED' ? 'GEDSI Metric Added' : 'Assessment Note',
            description: 'Seeded activity to support analytics charts',
            createdAt: monthsAgoDate(Math.max(0, 5 - ventures.indexOf(v))),
            metadata: { seeded: true, feature: t }
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seeded Sarah analytics sample data',
      data: {
        ventures: ventures.length,
        metrics: createdMetrics,
        activities: ventures.length * 3,
        user: { id: sarah.id, email: sarah.email }
      }
    })
  } catch (e: any) {
    console.error('seed-sarah-analytics error:', e)
    return NextResponse.json({ success: false, error: e.message || 'Internal error' }, { status: 500 })
  }
}


