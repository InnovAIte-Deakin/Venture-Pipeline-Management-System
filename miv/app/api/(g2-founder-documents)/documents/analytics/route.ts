import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/documents/analytics - Get document analytics and statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const ventureId = searchParams.get('ventureId');

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Base where clause
    const baseWhere: any = {};
    if (ventureId && ventureId !== 'all') {
      baseWhere.ventureId = ventureId;
    }

    // Get overall statistics
    const [
      totalDocuments,
      recentDocuments,
      documentsByType,
      documentsByVenture,
      documentsBySize,
      uploadTrends,
      topVentures,
      storageUsage
    ] = await Promise.all([
      // Total documents
      prisma.document.count({ where: baseWhere }),

      // Recent documents (within period)
      prisma.document.count({
        where: {
          ...baseWhere,
          uploadedAt: { gte: startDate }
        }
      }),

      // Documents by type
      prisma.document.groupBy({
        by: ['type'],
        where: baseWhere,
        _count: { _all: true },
        _sum: { size: true }
      }),

      // Documents by venture
      prisma.document.groupBy({
        by: ['ventureId'],
        where: baseWhere,
        _count: { _all: true },
        _sum: { size: true }
      }).then(results => results.slice(0, 10)),

      // Documents by size range
      getDocumentsBySize(baseWhere),

      // Upload trends (daily uploads over period)
      getUploadTrends(baseWhere, periodDays),

      // Top ventures by document count
      getTopVenturesByDocuments(baseWhere),

      // Storage usage
      getStorageUsage(baseWhere)
    ]);

    // Get venture names for document stats
    const ventureIds = documentsByVenture.map(item => item.ventureId);
    const ventures = await prisma.venture.findMany({
      where: { id: { in: ventureIds } },
      select: { id: true, name: true, sector: true, stage: true }
    });

    const ventureMap = ventures.reduce((acc, venture) => {
      acc[venture.id] = venture;
      return acc;
    }, {} as Record<string, any>);

    // Transform documents by venture data
    const documentsByVentureWithNames = documentsByVenture.map(item => ({
      ...item,
      venture: ventureMap[item.ventureId] || { name: 'Unknown Venture', sector: 'Unknown', stage: 'Unknown' }
    }));

    // Calculate growth rates
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays);
    
    const previousPeriodDocuments = await prisma.document.count({
      where: {
        ...baseWhere,
        uploadedAt: { 
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    });

    const growthRate = previousPeriodDocuments > 0 
      ? ((recentDocuments - previousPeriodDocuments) / previousPeriodDocuments) * 100 
      : recentDocuments > 0 ? 100 : 0;

    // Document status distribution (computed based on venture stages)
    const statusDistribution = await getDocumentStatusDistribution(baseWhere);

    return NextResponse.json({
      summary: {
        totalDocuments,
        recentDocuments,
        growthRate: Math.round(growthRate * 100) / 100,
        averageFileSize: storageUsage.totalSize > 0 ? Math.round(storageUsage.totalSize / totalDocuments) : 0,
        totalStorageUsed: storageUsage.totalSize,
        totalStorageFormatted: formatFileSize(storageUsage.totalSize),
      },
      charts: {
        documentsByType: documentsByType.map(item => ({
          type: item.type,
          count: item._count._all,
          size: item._sum.size || 0,
          sizeFormatted: formatFileSize(item._sum.size || 0),
          percentage: Math.round((item._count._all / totalDocuments) * 100)
        })),
        documentsByVenture: documentsByVentureWithNames.slice(0, 10).map(item => ({
          ventureId: item.ventureId,
          ventureName: item.venture.name,
          sector: item.venture.sector,
          stage: item.venture.stage,
          count: item._count._all,
          size: item._sum.size || 0,
          sizeFormatted: formatFileSize(item._sum.size || 0),
          percentage: Math.round((item._count._all / totalDocuments) * 100)
        })),
        documentsBySize,
        uploadTrends,
        statusDistribution
      },
      insights: {
        topVentures: topVentures.slice(0, 5),
        mostCommonType: documentsByType.reduce((max, item) => 
          item._count._all > (max?._count._all || 0) ? item : max, documentsByType[0])?.type || 'N/A',
        averageDocumentsPerVenture: Math.round(totalDocuments / Math.max(documentsByVentureWithNames.length, 1)),
        storageEfficiency: calculateStorageEfficiency(documentsByType),
        recentActivity: recentDocuments > 0,
      },
      period: {
        days: periodDays,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching document analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getDocumentsBySize(baseWhere: any) {
  const documents = await prisma.document.findMany({
    where: baseWhere,
    select: { size: true }
  });

  const sizeRanges = {
    'Small (< 1MB)': 0,
    'Medium (1-5MB)': 0,
    'Large (5-10MB)': 0,
    'Very Large (> 10MB)': 0
  };

  documents.forEach(doc => {
    const size = doc.size || 0;
    if (size < 1024 * 1024) {
      sizeRanges['Small (< 1MB)']++;
    } else if (size < 5 * 1024 * 1024) {
      sizeRanges['Medium (1-5MB)']++;
    } else if (size < 10 * 1024 * 1024) {
      sizeRanges['Large (5-10MB)']++;
    } else {
      sizeRanges['Very Large (> 10MB)']++;
    }
  });

  return Object.entries(sizeRanges).map(([range, count]) => ({
    range,
    count,
    percentage: Math.round((count / documents.length) * 100) || 0
  }));
}

async function getUploadTrends(baseWhere: any, days: number) {
  const trends = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = await prisma.document.count({
      where: {
        ...baseWhere,
        uploadedAt: {
          gte: date,
          lt: nextDate
        }
      }
    });

    trends.push({
      date: date.toISOString().split('T')[0],
      count,
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }

  return trends;
}

async function getTopVenturesByDocuments(baseWhere: any) {
  const topVentures = await prisma.venture.findMany({
    where: baseWhere.ventureId ? { id: baseWhere.ventureId } : {},
    include: {
      documents: {
        select: {
          id: true,
          name: true,
          type: true,
          size: true,
          uploadedAt: true
        }
      },
      _count: {
        select: { documents: true }
      }
    },
    orderBy: {
      documents: { _count: 'desc' }
    },
    take: 10
  });

  return topVentures.map(venture => ({
    id: venture.id,
    name: venture.name,
    sector: venture.sector,
    stage: venture.stage,
    documentCount: venture._count.documents,
    totalSize: venture.documents.reduce((sum, doc) => sum + (doc.size || 0), 0),
    totalSizeFormatted: formatFileSize(venture.documents.reduce((sum, doc) => sum + (doc.size || 0), 0)),
    recentDocuments: venture.documents.filter(doc => {
      const daysSince = (Date.now() - new Date(doc.uploadedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length
  }));
}

async function getStorageUsage(baseWhere: any) {
  const result = await prisma.document.aggregate({
    where: baseWhere,
    _sum: { size: true },
    _count: { _all: true }
  });

  return {
    totalSize: result._sum.size || 0,
    documentCount: result._count._all || 0
  };
}

async function getDocumentStatusDistribution(baseWhere: any) {
  // Get documents with venture information to compute status
  const documents = await prisma.document.findMany({
    where: baseWhere,
    include: {
      venture: {
        select: { stage: true }
      }
    }
  });

  const statusCounts = {
    pending: 0,
    review: 0,
    approved: 0,
    needs_update: 0
  };

  documents.forEach(doc => {
    const daysSinceUpload = Math.floor((Date.now() - new Date(doc.uploadedAt).getTime()) / (1000 * 60 * 60 * 24));
    
    if (doc.venture.stage === 'FUNDED') {
      statusCounts.approved++;
    } else if (doc.venture.stage === 'DUE_DILIGENCE' || doc.venture.stage === 'INVESTMENT_READY') {
      statusCounts.review++;
    } else if (daysSinceUpload > 30) {
      statusCounts.needs_update++;
    } else {
      statusCounts.pending++;
    }
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / documents.length) * 100) || 0
  }));
}

function calculateStorageEfficiency(documentsByType: any[]) {
  // Calculate average file size per type to determine efficiency
  const efficiencyScores = documentsByType.map(item => {
    const avgSize = item._sum.size ? item._sum.size / item._count._all : 0;
    const efficiency = avgSize < 5 * 1024 * 1024 ? 'Good' : avgSize < 10 * 1024 * 1024 ? 'Fair' : 'Poor';
    return { type: item.type, avgSize, efficiency };
  });

  const goodCount = efficiencyScores.filter(s => s.efficiency === 'Good').length;
  const totalTypes = efficiencyScores.length;
  
  return {
    score: Math.round((goodCount / Math.max(totalTypes, 1)) * 100),
    details: efficiencyScores
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
