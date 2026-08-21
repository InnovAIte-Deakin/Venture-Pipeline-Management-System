import { calculateCapitalProgress, getCapitalStage, getCapitalStatus } from "@/lib/capital-facilitation/calculations"
import type {
  CapitalApiVenture,
  CapitalDocument,
  CapitalRequest,
  InvestorPartner,
} from "@/types/capital-facilitation"

const investorByStage: Record<string, string> = {
  INTAKE: "Social Impact Ventures",
  SCREENING: "Southeast Asia Growth Fund",
  DUE_DILIGENCE: "Impact Capital Partners",
  INVESTMENT_READY: "Climate Action Capital",
  FUNDED: "Green Ventures Fund",
  SEED: "Green Ventures Fund",
  SERIES_A: "Impact Capital Partners",
  SERIES_B: "Impact Capital Partners",
  SERIES_C: "Impact Capital Partners",
}

const daysUntilDecision: Record<string, number> = {
  INTAKE: 30,
  SCREENING: 21,
  DUE_DILIGENCE: 14,
  INVESTMENT_READY: 7,
}

const toDateString = (value: string | null | undefined, fallback: Date): string => {
  const date = value ? new Date(value) : fallback
  return Number.isNaN(date.getTime()) ? fallback.toISOString().split("T")[0] : date.toISOString().split("T")[0]
}

const createTimeline = (venture: CapitalApiVenture, today: Date): CapitalRequest["timeline"] => {
  const timeline: CapitalRequest["timeline"] = []
  if (venture.intakeDate) timeline.push({ date: toDateString(venture.intakeDate, today), event: "Application Submitted" })
  if (venture.screeningDate) timeline.push({ date: toDateString(venture.screeningDate, today), event: "Initial Review Completed" })
  if (venture.dueDiligenceStart) timeline.push({ date: toDateString(venture.dueDiligenceStart, today), event: "Due Diligence Started" })
  if (venture.fundedAt) timeline.push({ date: toDateString(venture.fundedAt, today), event: "Funding Completed" })
  return timeline.length ? timeline : [{ date: today.toISOString().split("T")[0], event: "Application Submitted" }]
}

const createDocuments = (documents: CapitalApiVenture["documents"]): CapitalDocument[] =>
  (documents || []).slice(0, 3).flatMap((document) =>
    document.name && document.url
      ? [{ name: document.name, url: document.url, type: (document.type || "document").toLowerCase() }]
      : [],
  )

export const transformVentureToCapitalRequest = (venture: CapitalApiVenture, today = new Date()): CapitalRequest => {
  const sourceStage = venture.stage || "INTAKE"
  const status = getCapitalStatus(sourceStage)
  const decisionDate = new Date(today)
  decisionDate.setDate(decisionDate.getDate() + (daysUntilDecision[sourceStage] || 30))
  const amount = typeof venture.fundingRaised === "number" && venture.fundingRaised > 0 ? venture.fundingRaised : 500000

  return {
    id: `CAP-${venture.id.slice(-8)}`,
    venture: venture.name || "Unnamed venture",
    amount,
    status,
    stage: getCapitalStage(sourceStage),
    progress: calculateCapitalProgress(sourceStage, status),
    submittedDate: toDateString(venture.createdAt, today),
    expectedDecision: decisionDate.toISOString().split("T")[0],
    investor: investorByStage[sourceStage] || "Social Impact Ventures",
    timeline: createTimeline(venture, today),
    documents: createDocuments(venture.documents),
  }

}

const getSector = (ventureName: string): string => {
  const name = ventureName.toLowerCase()
  if (name.includes("health") || name.includes("medical")) return "Healthcare & MedTech"
  if (name.includes("tech") || name.includes("digital")) return "Technology & Innovation"
  if (name.includes("climate") || name.includes("environment")) return "Climate & Environment"
  if (name.includes("agriculture") || name.includes("agri")) return "Agriculture & Sustainability"
  if (name.includes("education") || name.includes("learning")) return "Education Technology"
  return "Impact Investing"
}

export const generateInvestorPartners = (requests: CapitalRequest[]): InvestorPartner[] => {
  const investors = new Map<string, { amounts: number[]; sectors: Set<string> }>()
  requests.forEach((request) => {
    const data = investors.get(request.investor) || { amounts: [], sectors: new Set<string>() }
    data.amounts.push(request.amount)
    data.sectors.add(getSector(request.venture))
    investors.set(request.investor, data)
  })

  return Array.from(investors.entries())
    .map(([name, data]) => {
      const totalInvested = data.amounts.reduce((sum, amount) => sum + amount, 0)
      const minAmount = Math.min(...data.amounts)
      const maxAmount = Math.max(...data.amounts)
      const ticketSize = data.amounts.length > 1 ? `${formatCurrency(minAmount)} - ${formatCurrency(maxAmount)}` : formatCurrency(minAmount)
      const domain = `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`
      return {
        name,
        focus: Array.from(data.sectors).join(", ") || "General Impact",
        totalInvested,
        activeDeals: data.amounts.length,
        avgTicketSize: ticketSize.replace("$", ""),
        contactPerson: `${name.split(" ")[0] || "Contact"} Partner`,
        email: `contact@${domain}`,
      }
    })
    .sort((a, b) => b.totalInvested - a.totalInvested)
}

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0)
