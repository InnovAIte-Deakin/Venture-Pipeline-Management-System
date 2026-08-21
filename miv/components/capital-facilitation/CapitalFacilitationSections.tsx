"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/capital-facilitation/transformations"
import type { CapitalMetrics, CapitalRequest, InvestorPartner, PipelineStage } from "@/types/capital-facilitation"
import { Building2, DollarSign, FileText, Mail, MessageSquare, Search, Upload, Users } from "lucide-react"

const statusColors: Record<string, string> = {
  Approved: "bg-green-100 text-green-800 border-green-200",
  "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
}

export function CapitalSummaryCards({ metrics, unavailable = false }: { metrics: CapitalMetrics; unavailable?: boolean }) {
  const cards = unavailable
    ? [
        ["Total Capital", "—"],
        ["Active Deals", "—"],
        ["Success Rate", "—"],
        ["Avg Deal Size", "—"],
      ]
    : [
        ["Total Capital", formatCurrency(metrics.totalCapital)],
        ["Active Deals", String(metrics.activeDeals)],
        ["Success Rate", `${metrics.successRate}%`],
        ["Avg Deal Size", formatCurrency(metrics.averageDealSize)],
      ]
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value]) => <Card key={label}><CardContent className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold break-words">{value}</p></CardContent></Card>)}</div>
}

export function PipelineOverview({ stages, hasRequests }: { stages: PipelineStage[]; hasRequests: boolean }) {
  return <Card><CardHeader><CardTitle>Pipeline Overview</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">{hasRequests ? stages.map((stage) => <Card key={stage.name} className={`p-4 text-center ${stage.color}`}><div className="text-2xl font-semibold">{stage.deals}</div><p className="text-sm text-muted-foreground">{stage.name}</p><p className="text-xs text-muted-foreground">{formatCurrency(stage.capital)}</p></Card>) : <EmptyState message="No capital requests found" />}</div></CardContent></Card>
}

export function CapitalRequestsSection({ requests, selectedRequest, onSelect }: { requests: CapitalRequest[]; selectedRequest: CapitalRequest | null; onSelect: (request: CapitalRequest) => void }) {
  return <Card><CardHeader><CardTitle>Capital Requests</CardTitle><p className="text-sm text-muted-foreground">Current funding requests</p></CardHeader><CardContent><div className="space-y-4">{requests.length ? requests.map((request) => <button type="button" key={request.id} className={`w-full rounded-lg border p-4 text-left transition-colors ${selectedRequest?.id === request.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`} onClick={() => onSelect(request)}><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-medium break-words">{request.venture}</h3><p className="text-sm text-muted-foreground break-words">{request.investor}</p></div><Badge variant="outline" className={statusColors[request.status] || ""}>{request.status}</Badge></div><div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><Metric label="Amount" value={formatCurrency(request.amount)} /><Metric label="Stage" value={request.stage} /><div><p className="text-muted-foreground">Progress</p><div className="flex items-center gap-2"><Progress value={request.progress} className="h-2 flex-1" /><span className="text-xs">{request.progress}%</span></div></div><Metric label="Due Date" value={request.expectedDecision} /></div></button>) : <EmptyState icon={<Building2 className="mb-4 h-12 w-12" />} message="No capital requests found" />}</div></CardContent></Card>
}

export function RequestDetails({ request }: { request: CapitalRequest | null }) {
  if (!request) return null
  return <Card><CardHeader><CardTitle>Request Details</CardTitle><p className="text-sm text-muted-foreground break-words">{request.venture}</p></CardHeader><CardContent className="space-y-4"><div className="text-center"><div className="break-words text-3xl font-bold text-blue-600">{formatCurrency(request.amount)}</div><p className="text-sm text-muted-foreground">Requested Amount</p></div><div className="space-y-3"><div className="flex justify-between gap-4 text-sm"><span>Current Stage</span><span className="font-medium text-right">{request.stage}</span></div><Progress value={request.progress} className="h-2" /></div><div className="space-y-2 border-t pt-4"><h4 className="font-medium">Timeline</h4>{request.timeline.map((item) => <div key={`${item.date}-${item.event}`} className="text-sm"><span className="text-muted-foreground">{item.date}</span> {item.event}</div>)}</div><div className="space-y-2 border-t pt-4"><h4 className="font-medium">Documents</h4>{request.documents.length ? request.documents.map((doc) => <div key={`${doc.url}-${doc.name}`} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="flex min-w-0 items-center gap-2 break-words"><FileText className="h-4 w-4 shrink-0 text-gray-500" />{doc.name}</span><Button variant="ghost" size="sm" asChild><a href={doc.url} target="_blank" rel="noopener noreferrer">View</a></Button></div>) : <p className="text-sm text-muted-foreground">No documents attached.</p>}</div><div className="flex flex-col gap-2 border-t pt-4 sm:flex-row"><Button className="flex-1"><Upload className="mr-2 h-4 w-4" />Upload Document</Button><Button variant="outline" className="flex-1"><MessageSquare className="mr-2 h-4 w-4" />Add Note</Button></div></CardContent></Card>
}

export function InvestorNetwork({ investors, query, onQueryChange }: { investors: InvestorPartner[]; query: string; onQueryChange: (query: string) => void }) {
  const filtered = investors.filter((investor) => `${investor.name} ${investor.focus} ${investor.contactPerson}`.toLowerCase().includes(query.toLowerCase()))
  return <Card><CardHeader><CardTitle>Investor Partners</CardTitle><p className="text-sm text-muted-foreground">Our network of investment partners</p><div className="relative mt-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search investors..." value={query} onChange={(event) => onQueryChange(event.target.value)} className="pl-10" /></div></CardHeader><CardContent><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{filtered.length ? filtered.map((investor) => <Card key={investor.name}><CardContent className="p-4"><div className="flex min-w-0 items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">{investor.name.substring(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><h3 className="font-medium break-words">{investor.name}</h3><p className="break-words text-sm text-muted-foreground">{investor.focus}</p><div className="mt-3 space-y-2 text-sm"><Metric label="Total Invested" value={formatCurrency(investor.totalInvested)} /><Metric label="Active Deals" value={String(investor.activeDeals)} /><Metric label="Ticket Size" value={investor.avgTicketSize} /></div><div className="mt-3 flex flex-wrap gap-2 border-t pt-3"><Button size="sm"><Mail className="mr-1 h-4 w-4" />Contact</Button><Button size="sm" variant="outline"><FileText className="mr-1 h-4 w-4" />View</Button></div></div></div></CardContent></Card>) : <EmptyState icon={<Users className="mb-4 h-12 w-12" />} message="No investors found" />}</div></CardContent></Card>
}

export function AnalyticsSection({ fundingTimeline, investors, sectorDistribution, statusCounts }: { fundingTimeline: Record<string, number>; investors: InvestorPartner[]; sectorDistribution: Array<{ sector: string; percentage: number }>; statusCounts: Record<string, number> }) {
  return <div className="grid gap-4 md:grid-cols-2">{<AnalyticsCard title="Funding Timeline" subtitle="Average days to close">{Object.keys(fundingTimeline).length ? Object.entries(fundingTimeline).map(([stage, days]) => <Metric key={stage} label={stage} value={`${days} days`} />) : <EmptyState message="No funding timeline data available" />}</AnalyticsCard>}{<AnalyticsCard title="Top Investors" subtitle="By total investment">{investors.length ? investors.slice(0, 4).map((investor) => <Metric key={investor.name} label={investor.name} value={formatCurrency(investor.totalInvested)} />) : <EmptyState message="No investor data available" />}</AnalyticsCard>}{<AnalyticsCard title="Sector Distribution" subtitle="Funding by sector">{sectorDistribution.map((item) => <Metric key={item.sector} label={item.sector} value={`${item.percentage}%`} />)}</AnalyticsCard>}{<AnalyticsCard title="Deal Status" subtitle="Current pipeline status">{Object.entries(statusCounts).map(([status, count]) => <Metric key={status} label={status} value={String(count)} />)}</AnalyticsCard>}</div>
}

function AnalyticsCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <Card><CardHeader><CardTitle>{title}</CardTitle><p className="text-sm text-muted-foreground">{subtitle}</p></CardHeader><CardContent className="space-y-3">{children}</CardContent></Card> }
function Metric({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-4"><span className="text-muted-foreground break-words">{label}</span><span className="break-words text-right font-medium">{value}</span></div> }
function EmptyState({ icon = <DollarSign className="mb-2 h-10 w-10" />, message }: { icon?: React.ReactNode; message: string }) { return <div className="col-span-full flex flex-col items-center justify-center py-8 text-center text-muted-foreground">{icon}<p>{message}</p></div> }
