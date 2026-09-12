import {
  INVESTOR_NAMES,
  PIPELINE_STAGE_NAMES,
  STAGE_LABELS,
  STAGE_PROGRESS,
} from "../constants";
import type {
  CapitalRequest,
  CapitalRequestStatus,
  DealPipelineStage,
  InvestorPartner,
  TimelineItem,
  VentureApiItem,
} from "../types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getCapitalStatus(stage: string): CapitalRequestStatus {
  if (["FUNDED", "SERIES_A", "SERIES_B", "SERIES_C"].includes(stage))
    return "Approved";
  if (stage === "DUE_DILIGENCE") return "Pending";
  return "Under Review";
}

function hashString(value: string) {
  return Array.from(value).reduce(
    (hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0,
    0,
  );
}

function formatDate(value: string | number | Date) {
  return new Date(value).toISOString().split("T")[0];
}

function createTimeline(venture: VentureApiItem): TimelineItem[] {
  const datedEvents: Array<[string | null | undefined, string]> = [
    [venture.intakeDate, "Application Submitted"],
    [venture.screeningDate, "Initial Review Completed"],
    [venture.dueDiligenceStart, "Due Diligence Started"],
    [venture.fundedAt, "Funding Completed"],
  ];
  const timeline = datedEvents
    .filter((item): item is [string, string] => Boolean(item[0]))
    .map(([date, event]) => ({ date: formatDate(date), event }));

  return timeline.length
    ? timeline
    : [
        {
          date: formatDate(venture.createdAt ?? Date.now()),
          event: "Application Submitted",
        },
      ];
}

function calculateExpectedDecision(stage: string, submittedDate: string) {
  const daysByStage: Record<string, number> = {
    INTAKE: 30,
    SCREENING: 21,
    DUE_DILIGENCE: 14,
    INVESTMENT_READY: 7,
  };
  return formatDate(
    new Date(submittedDate).getTime() + (daysByStage[stage] ?? 30) * DAY_IN_MS,
  );
}

export function transformVentures(
  ventures: VentureApiItem[],
): CapitalRequest[] {
  return ventures
    .filter(
      (venture) =>
        Boolean(venture.capitalActivities?.length) ||
        Number(venture.fundingRaised) > 0,
    )
    .map((venture) => {
      const status = getCapitalStatus(venture.stage);
      const submittedDate = formatDate(venture.createdAt ?? Date.now());
      const stableIndex = Math.abs(hashString(venture.id));

      return {
        id: `CAP-${venture.id.slice(-8)}`,
        venture: venture.name,
        amount: venture.fundingRaised || 500_000 + (stableIndex % 1_000_000),
        status,
        stage: STAGE_LABELS[venture.stage] ?? "Initial Review",
        progress:
          status === "Approved"
            ? 100
            : status === "Rejected"
              ? 0
              : (STAGE_PROGRESS[venture.stage] ?? 25),
        submittedDate,
        expectedDecision: calculateExpectedDecision(
          venture.stage,
          submittedDate,
        ),
        investor: INVESTOR_NAMES[stableIndex % INVESTOR_NAMES.length],
        timeline: createTimeline(venture),
        documents: (venture.documents ?? []).slice(0, 3).map((document) => ({
          ...document,
          type: document.type.toLowerCase(),
        })),
      };
    });
}

export function generateInvestorPartners(
  capitalRequests: CapitalRequest[],
): InvestorPartner[] {
  const investorMap = new Map<
    string,
    { totalInvested: number; amounts: number[]; sectors: Set<string> }
  >();

  capitalRequests.forEach((request) => {
    const data = investorMap.get(request.investor) ?? {
      totalInvested: 0,
      amounts: [],
      sectors: new Set<string>(),
    };
    data.totalInvested += request.amount;
    data.amounts.push(request.amount);
    const ventureName = request.venture.toLowerCase();
    if (ventureName.includes("health") || ventureName.includes("medical"))
      data.sectors.add("Healthcare & MedTech");
    else if (ventureName.includes("tech") || ventureName.includes("digital"))
      data.sectors.add("Technology & Innovation");
    else if (
      ventureName.includes("climate") ||
      ventureName.includes("environment")
    )
      data.sectors.add("Climate & Environment");
    else if (
      ventureName.includes("agriculture") ||
      ventureName.includes("agri")
    )
      data.sectors.add("Agriculture & Sustainability");
    else if (
      ventureName.includes("education") ||
      ventureName.includes("learning")
    )
      data.sectors.add("Education Technology");
    else data.sectors.add("Impact Investing");
    investorMap.set(request.investor, data);
  });

  return Array.from(investorMap, ([name, data]) => {
    const min = Math.min(...data.amounts);
    const max = Math.max(...data.amounts);
    const ticketSize =
      data.amounts.length > 1
        ? `${formatCurrency(min).replace("$", "")} - ${formatCurrency(max).replace("$", "")}`
        : formatCurrency(min).replace("$", "");
    return {
      name,
      focus: Array.from(data.sectors).join(", "),
      totalInvested: data.totalInvested,
      activeDeals: data.amounts.length,
      avgTicketSize: ticketSize,
      contactPerson: `${name.split(" ")[0] || "Contact"} Partner`,
      email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    };
  }).sort((a, b) => b.totalInvested - a.totalInvested);
}

export function calculateFundingTimeline(capitalRequests: CapitalRequest[]) {
  const stageTimelines = new Map<string, number[]>();
  capitalRequests.forEach((request) => {
    const days = Math.ceil(
      (new Date(request.expectedDecision).getTime() -
        new Date(request.submittedDate).getTime()) /
        DAY_IN_MS,
    );
    stageTimelines.set(request.stage, [
      ...(stageTimelines.get(request.stage) ?? []),
      days,
    ]);
  });
  return Object.fromEntries(
    Array.from(stageTimelines, ([stage, days]) => [
      stage,
      Math.round(days.reduce((total, day) => total + day, 0) / days.length),
    ]),
  ) as Record<string, number>;
}

export function createDealPipelineStages(
  capitalRequests: CapitalRequest[],
): DealPipelineStage[] {
  return PIPELINE_STAGE_NAMES.map((name) => {
    const requests = capitalRequests.filter(
      (request) => request.stage === name,
    );
    return {
      name,
      deals: requests.length,
      capital: requests.reduce((total, request) => total + request.amount, 0),
    };
  });
}
