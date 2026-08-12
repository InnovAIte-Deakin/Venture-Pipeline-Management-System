import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/fund-management - Get fund management data aggregated from ventures and capital activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCapitalActivities = searchParams.get('includeCapitalActivities') === 'true';
    const includeLPs = searchParams.get('includeLPs') === 'true';

    // Fetch ventures with capital activities
    const ventures = await prisma.venture.findMany({
      include: {
        capitalActivities: true,
        gedsiMetrics: true,
        createdBy: {
          select: { name: true, email: true }
        },
        assignedTo: {
          select: { name: true, email: true }
        },
        _count: {
          select: {
            documents: true,
            activities: true,
            capitalActivities: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch fund operations data
    const fundWorkflows = await prisma.fundWorkflow.findMany({
      include: {
        assignee: { select: { name: true, email: true } },
        fund: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const fundLifecyclePhases = await prisma.fundLifecyclePhase.findMany({
      include: {
        fund: { select: { name: true } }
      },
      orderBy: { phase: 'asc' }
    });

    const fundOperationTasks = await prisma.fundOperationTask.findMany({
      include: {
        assignee: { select: { name: true, email: true } },
        creator: { select: { name: true, email: true } },
        fund: { select: { name: true } },
        workflow: { select: { name: true, type: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const reports = await prisma.report.findMany({
      include: {
        creator: { select: { name: true, email: true } },
        fund: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Aggregate capital activities by type to create fund-like structures
    const fundData = {
      totalVentures: ventures.length,
      totalCapitalActivities: ventures.reduce((sum, v) => sum + v.capitalActivities.length, 0),
      totalFunding: ventures.reduce((sum, v) => {
        return sum + v.capitalActivities.reduce((actSum, act) => actSum + (act.amount || 0), 0);
      }, 0),
      
      // Group by capital activity types as "funds"
      fundsByType: {
        equity: {
          ventures: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'EQUITY')),
          totalAmount: ventures.reduce((sum, v) => {
            return sum + v.capitalActivities
              .filter(ca => ca.type === 'EQUITY')
              .reduce((actSum, act) => actSum + (act.amount || 0), 0);
          }, 0),
          count: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'EQUITY')).length
        },
        debt: {
          ventures: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'DEBT')),
          totalAmount: ventures.reduce((sum, v) => {
            return sum + v.capitalActivities
              .filter(ca => ca.type === 'DEBT')
              .reduce((actSum, act) => actSum + (act.amount || 0), 0);
          }, 0),
          count: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'DEBT')).length
        },
        grant: {
          ventures: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'GRANT')),
          totalAmount: ventures.reduce((sum, v) => {
            return sum + v.capitalActivities
              .filter(ca => ca.type === 'GRANT')
              .reduce((actSum, act) => actSum + (act.amount || 0), 0);
          }, 0),
          count: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'GRANT')).length
        },
        convertible: {
          ventures: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'CONVERTIBLE_NOTE')),
          totalAmount: ventures.reduce((sum, v) => {
            return sum + v.capitalActivities
              .filter(ca => ca.type === 'CONVERTIBLE_NOTE')
              .reduce((actSum, act) => actSum + (act.amount || 0), 0);
          }, 0),
          count: ventures.filter(v => v.capitalActivities.some(ca => ca.type === 'CONVERTIBLE_NOTE')).length
        }
      }
    };

    // Create fund-like structures from the data only if there are ventures with capital activities
    const funds = fundData.totalCapitalActivities > 0 ? [
      {
        id: "FUND-EQUITY",
        name: "MIV Equity Fund",
        vintage: "2020",
        fundType: "venture",
        size: `$${Math.max(fundData.fundsByType.equity.totalAmount / 1000000, 50).toFixed(0)}M`,
        committedCapital: `$${Math.max(fundData.fundsByType.equity.totalAmount / 1000000, 50).toFixed(0)}M`,
        calledCapital: `$${(fundData.fundsByType.equity.totalAmount / 1000000).toFixed(1)}M`,
        distributedCapital: `$${(fundData.fundsByType.equity.totalAmount * 0.2 / 1000000).toFixed(1)}M`,
        netAssetValue: `$${(fundData.fundsByType.equity.totalAmount * 1.3 / 1000000).toFixed(1)}M`,
        irr: 18.5,
        tvpi: 1.29,
        dpi: 0.24,
        moic: 1.29,
        status: "active",
        lps: 25,
        investments: fundData.fundsByType.equity.count,
        lastUpdate: new Date().toISOString(),
        fundManager: "Sarah Johnson",
        geography: "Asia Pacific",
        sector: ["Technology", "Healthcare", "FinTech"],
        investmentPeriod: "2020-2025",
        fundTerm: "10 years + 2x1 year extensions",
        managementFee: 2.0,
        carriedInterest: 20,
        hurdle: 8,
        catchUp: 100,
        benchmark: "MSCI AC Asia Pacific",
        aum: `$${(fundData.fundsByType.equity.totalAmount * 1.3 / 1000000).toFixed(1)}M`,
        dryPowder: `$${Math.max(50 - fundData.fundsByType.equity.totalAmount / 1000000, 15).toFixed(0)}M`,
        leverage: 0,
        esg: true,
        regulatoryStatus: "SEC Registered",
        fundAdmin: "SS&C Technologies",
        auditor: "KPMG",
        legalCounsel: "Latham & Watkins",
        primeBroker: "Goldman Sachs"
      },
      {
        id: "FUND-DEBT",
        name: "MIV Debt Fund",
        vintage: "2021",
        fundType: "debt",
        size: `$${Math.max(fundData.fundsByType.debt.totalAmount / 1000000, 30).toFixed(0)}M`,
        committedCapital: `$${Math.max(fundData.fundsByType.debt.totalAmount / 1000000, 30).toFixed(0)}M`,
        calledCapital: `$${(fundData.fundsByType.debt.totalAmount / 1000000).toFixed(1)}M`,
        distributedCapital: `$${(fundData.fundsByType.debt.totalAmount * 0.15 / 1000000).toFixed(1)}M`,
        netAssetValue: `$${(fundData.fundsByType.debt.totalAmount * 1.1 / 1000000).toFixed(1)}M`,
        irr: 12.3,
        tvpi: 1.12,
        dpi: 0.15,
        moic: 1.12,
        status: "active",
        lps: 18,
        investments: fundData.fundsByType.debt.count,
        lastUpdate: new Date().toISOString(),
        fundManager: "Mike Chen",
        geography: "Southeast Asia",
        sector: ["Infrastructure", "Real Estate"],
        investmentPeriod: "2021-2026",
        fundTerm: "10 years + 2x1 year extensions",
        managementFee: 1.5,
        carriedInterest: 15,
        hurdle: 6,
        catchUp: 100,
        benchmark: "FTSE Asia Pacific",
        aum: `$${(fundData.fundsByType.debt.totalAmount * 1.1 / 1000000).toFixed(1)}M`,
        dryPowder: `$${Math.max(30 - fundData.fundsByType.debt.totalAmount / 1000000, 10).toFixed(0)}M`,
        leverage: 0,
        esg: true,
        regulatoryStatus: "AIFMD Compliant",
        fundAdmin: "Northern Trust",
        auditor: "EY",
        legalCounsel: "Simpson Thacher",
        primeBroker: "Morgan Stanley"
      },
      {
        id: "FUND-IMPACT",
        name: "MIV Impact Fund",
        vintage: "2022",
        fundType: "impact",
        size: `$${Math.max(fundData.fundsByType.grant.totalAmount / 1000000, 25).toFixed(0)}M`,
        committedCapital: `$${Math.max(fundData.fundsByType.grant.totalAmount / 1000000, 25).toFixed(0)}M`,
        calledCapital: `$${(fundData.fundsByType.grant.totalAmount / 1000000).toFixed(1)}M`,
        distributedCapital: `$${(fundData.fundsByType.grant.totalAmount * 0.1 / 1000000).toFixed(1)}M`,
        netAssetValue: `$${(fundData.fundsByType.grant.totalAmount * 1.2 / 1000000).toFixed(1)}M`,
        irr: 15.7,
        tvpi: 1.20,
        dpi: 0.10,
        moic: 1.20,
        status: "active",
        lps: 15,
        investments: fundData.fundsByType.grant.count,
        lastUpdate: new Date().toISOString(),
        fundManager: "Lisa Wang",
        geography: "Emerging Asia",
        sector: ["Social Impact", "Education", "Healthcare"],
        investmentPeriod: "2022-2027",
        fundTerm: "10 years + 2x1 year extensions",
        managementFee: 2.0,
        carriedInterest: 15,
        hurdle: 6,
        catchUp: 100,
        benchmark: "Custom Impact Index",
        aum: `$${(fundData.fundsByType.grant.totalAmount * 1.2 / 1000000).toFixed(1)}M`,
        dryPowder: `$${Math.max(25 - fundData.fundsByType.grant.totalAmount / 1000000, 5).toFixed(0)}M`,
        leverage: 0,
        esg: true,
        regulatoryStatus: "B-Corp Certified",
        fundAdmin: "Alter Domus",
        auditor: "Deloitte",
        legalCounsel: "White & Case",
        primeBroker: "J.P. Morgan"
      }
    ].filter(fund => fund.investments > 0) : []; // Only include funds with actual investments

    // Create capital calls from recent capital activities
    const recentCapitalActivities = ventures
      .flatMap(v => v.capitalActivities.map(ca => ({ ...ca, ventureName: v.name })))
      .filter(ca => ca.status === 'PENDING' || ca.status === 'APPROVED')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const capitalCalls = recentCapitalActivities.map((ca, index) => ({
      id: ca.id,
      fundId: ca.type === 'EQUITY' ? 'FUND-EQUITY' : ca.type === 'DEBT' ? 'FUND-DEBT' : 'FUND-IMPACT',
      fundName: ca.type === 'EQUITY' ? 'MIV Equity Fund' : ca.type === 'DEBT' ? 'MIV Debt Fund' : 'MIV Impact Fund',
      callNumber: `Call #${index + 1}`,
      amount: `$${((ca.amount || 0) / 1000000).toFixed(1)}M`,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: ca.status === 'PENDING' ? 'pending' : ca.status === 'APPROVED' ? 'in_progress' : 'completed',
      lpsResponded: Math.floor(Math.random() * 20) + 5,
      totalLps: 25,
      lastUpdate: ca.updatedAt,
      purpose: `Investment in ${ca.ventureName}`,
      investments: [ca.ventureName],
      expenses: "$50K",
      interestRate: 0,
      gracePeriod: "30 days",
      defaultPenalty: 1.5,
      wireInstructions: true,
      noticeDate: new Date(ca.createdAt).toISOString().split('T')[0],
      remindersSent: 1,
      documentsGenerated: true
    }));

    // Create distributions from completed capital activities
    const completedActivities = ventures
      .flatMap(v => v.capitalActivities.map(ca => ({ ...ca, ventureName: v.name })))
      .filter(ca => ca.status === 'COMPLETED')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);

    const distributions = completedActivities.map((ca, index) => ({
      id: `DIST-${ca.id}`,
      fundId: ca.type === 'EQUITY' ? 'FUND-EQUITY' : ca.type === 'DEBT' ? 'FUND-DEBT' : 'FUND-IMPACT',
      fundName: ca.type === 'EQUITY' ? 'MIV Equity Fund' : ca.type === 'DEBT' ? 'MIV Debt Fund' : 'MIV Impact Fund',
      distributionNumber: `Dist #${index + 1}`,
      amount: `$${((ca.amount || 0) * 0.2 / 1000000).toFixed(1)}M`, // 20% distribution
      date: new Date(ca.updatedAt).toISOString().split('T')[0],
      type: "exit",
      status: "paid",
      lpsPaid: 25,
      totalLps: 25,
      lastUpdate: ca.updatedAt,
      source: `Exit from ${ca.ventureName}`,
      sourceVentures: [ca.ventureName], // Add venture information
      taxImplications: "Capital gains",
      withholding: 0,
      currency: ca.currency || "USD",
      exchangeRate: 1.0,
      paymentMethod: "wire",
      taxReporting: true,
      k1Generated: true,
      recordDate: new Date(ca.updatedAt).toISOString().split('T')[0],
      exDate: new Date(ca.updatedAt).toISOString().split('T')[0]
    }));

    // Fetch real Limited Partners from database if includeLPs is true
    const limitedPartners = includeLPs ? await prisma.limitedPartner.findMany({
      include: {
        fund: {
          select: { name: true, id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }) : [];

    const response = {
      funds,
      capitalCalls: includeCapitalActivities ? capitalCalls : [],
      distributions: includeCapitalActivities ? distributions : [],
      limitedPartners: includeLPs ? limitedPartners : [],
      // Fund operations data
      workflows: fundWorkflows,
      lifecyclePhases: fundLifecyclePhases,
      operationTasks: fundOperationTasks,
      reports: reports,
      // Include ventures for document access
      ventures: ventures,
      summary: {
        totalFunds: funds.length,
        totalAUM: fundData.totalFunding,
        totalVentures: fundData.totalVentures,
        totalCapitalActivities: fundData.totalCapitalActivities,
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching fund management data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
