import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/seed-gedsi-metrics - Create comprehensive GEDSI metrics data
export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting GEDSI metrics seeding...');

    // Get all ventures
    const ventures = await prisma.venture.findMany({
      select: { id: true, name: true, sector: true, stage: true }
    });

    if (ventures.length === 0) {
      return NextResponse.json(
        { error: 'No ventures found. Please seed ventures first.' },
        { status: 400 }
      );
    }

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, role: true }
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No users found. Please seed users first.' },
        { status: 400 }
      );
    }

    // Clear existing GEDSI metrics
    await prisma.gEDSIMetric.deleteMany({});
    console.log('🧹 Cleared existing GEDSI metrics');

    const gedsiMetrics = [];

    // Create GEDSI metrics for each venture
    for (const venture of ventures) {
      const metricsPerVenture = Math.floor(Math.random() * 8) + 5; // 5-12 metrics per venture
      const createdBy = users[Math.floor(Math.random() * users.length)];

      for (let i = 0; i < metricsPerVenture; i++) {
        const categories = ['GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING'];
        const statuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'];
        const units = ['percentage', 'count', 'ratio', 'score', 'hours', 'people'];
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const unit = units[Math.floor(Math.random() * units.length)];
        
        // Generate realistic metric names based on category
        const metricNames = {
          'GENDER': [
            'Women in Leadership Positions',
            'Gender Pay Gap',
            'Women Employee Percentage',
            'Gender Diversity Score',
            'Women Board Members',
            'Women in Senior Management',
            'Women Founders/Co-founders',
            'Women Decision Makers',
            'Women Leadership Development',
            'Women Mentorship Programs'
          ],
          'DISABILITY': [
            'Accessibility Score',
            'Employees with Disabilities',
            'Accessible Technology Usage',
            'Disability Inclusion Training Hours',
            'Accessible Facilities Count',
            'Accessibility Compliance Score',
            'Disability Inclusion Index'
          ],
          'SOCIAL_INCLUSION': [
            'Underserved Community Reach',
            'Social Impact Score',
            'Community Engagement Hours',
            'Inclusive Hiring Practices',
            'Social Inclusion Index',
            'Rural Community Reach',
            'Low-Income Community Impact',
            'Minority Community Engagement',
            'Underserved Population Served',
            'Community Development Score'
          ],
          'CROSS_CUTTING': [
            'GEDSI Integration Score',
            'Intersectional Impact Assessment',
            'Multi-dimensional Inclusion Index',
            'Cross-cutting GEDSI Metrics',
            'Integrated Impact Measurement',
            'Holistic Inclusion Score'
          ]
        };

        const metricName = metricNames[category][Math.floor(Math.random() * metricNames[category].length)];
        const metricCode = `GEDSI_${category}_${i + 1}_${venture.id.slice(-4)}`;
        
        // Generate realistic values based on category and venture
        let targetValue, currentValue;
        
        if (unit === 'percentage') {
          targetValue = Math.floor(Math.random() * 40) + 60; // 60-100%
          currentValue = Math.floor(Math.random() * targetValue) + (targetValue * 0.3);
        } else if (unit === 'count') {
          targetValue = Math.floor(Math.random() * 50) + 10; // 10-60
          currentValue = Math.floor(Math.random() * targetValue) + (targetValue * 0.2);
        } else if (unit === 'score') {
          targetValue = Math.floor(Math.random() * 20) + 80; // 80-100
          currentValue = Math.floor(Math.random() * targetValue) + (targetValue * 0.4);
        } else if (unit === 'hours') {
          targetValue = Math.floor(Math.random() * 200) + 50; // 50-250
          currentValue = Math.floor(Math.random() * targetValue) + (targetValue * 0.3);
        } else if (unit === 'people') {
          targetValue = Math.floor(Math.random() * 100) + 20; // 20-120
          currentValue = Math.floor(Math.random() * targetValue) + (targetValue * 0.2);
        } else { // ratio
          targetValue = Math.random() * 2 + 0.5; // 0.5-2.5
          currentValue = Math.random() * targetValue + (targetValue * 0.3);
        }

        // Set verification date if status is COMPLETED or VERIFIED
        const verificationDate = (status === 'COMPLETED' || status === 'VERIFIED') 
          ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Last 90 days
          : null;

        // Generate notes
        const notes = [
          `Baseline measurement for ${metricName.toLowerCase()}`,
          `Target set based on industry standards`,
          `Progress tracking for ${venture.name}`,
          `Quarterly review completed`,
          `Annual assessment in progress`,
          `Stakeholder feedback incorporated`,
          `Best practice implementation`,
          `Continuous improvement focus`
        ];

        gedsiMetrics.push({
          ventureId: venture.id,
          metricCode: metricCode,
          metricName: metricName,
          category: category,
          targetValue: targetValue,
          currentValue: currentValue,
          unit: unit,
          status: status,
          verificationDate: verificationDate,
          notes: notes[Math.floor(Math.random() * notes.length)],
          createdById: createdBy.id
        });
      }
    }

    // Create GEDSI metrics in batches
    const batchSize = 50;
    let createdCount = 0;
    
    for (let i = 0; i < gedsiMetrics.length; i += batchSize) {
      const batch = gedsiMetrics.slice(i, i + batchSize);
      await prisma.gEDSIMetric.createMany({ data: batch });
      createdCount += batch.length;
      console.log(`📊 Created ${createdCount}/${gedsiMetrics.length} GEDSI metrics`);
    }

    // Create some additional metrics for specific ventures to show variety
    const additionalMetrics = [
      {
        ventureId: ventures[0].id,
        metricCode: 'GEDSI_SPECIAL_001',
        metricName: 'Women in Tech Leadership',
        category: 'GENDER',
        targetValue: 50,
        currentValue: 45,
        unit: 'percentage',
        status: 'IN_PROGRESS',
        verificationDate: null,
        notes: 'Focus on increasing women representation in technical leadership roles',
        createdById: users[0].id
      },
      {
        ventureId: ventures[1].id,
        metricCode: 'GEDSI_SPECIAL_002',
        metricName: 'Accessibility Compliance Score',
        category: 'DISABILITY',
        targetValue: 95,
        currentValue: 88,
        unit: 'score',
        status: 'COMPLETED',
        verificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        notes: 'WCAG 2.1 AA compliance achieved',
        createdById: users[1].id
      },
      {
        ventureId: ventures[2].id,
        metricCode: 'GEDSI_SPECIAL_003',
        metricName: 'Rural Community Impact',
        category: 'SOCIAL_INCLUSION',
        targetValue: 1000,
        currentValue: 750,
        unit: 'people',
        status: 'IN_PROGRESS',
        verificationDate: null,
        notes: 'Expanding reach to underserved rural communities',
        createdById: users[2].id
      }
    ];

    await prisma.gEDSIMetric.createMany({ data: additionalMetrics });
    createdCount += additionalMetrics.length;

    console.log(`✅ Created ${createdCount} GEDSI metrics total`);

    // Get summary statistics
    const totalMetrics = await prisma.gEDSIMetric.count();
    const metricsByCategory = await prisma.gEDSIMetric.groupBy({
      by: ['category'],
      _count: { category: true }
    });
    const metricsByStatus = await prisma.gEDSIMetric.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdCount} GEDSI metrics`,
      data: {
        totalMetrics,
        metricsByCategory: metricsByCategory.map(item => ({
          category: item.category,
          count: item._count.category
        })),
        metricsByStatus: metricsByStatus.map(item => ({
          status: item.status,
          count: item._count.status
        })),
        ventures: ventures.length,
        users: users.length
      }
    });

  } catch (error) {
    console.error('Error seeding GEDSI metrics:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
