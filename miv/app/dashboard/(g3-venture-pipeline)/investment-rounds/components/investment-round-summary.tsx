import { Activity, Building2, DollarSign, Globe, Heart, Shield, Star, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FOUNDER_TYPES, SECTORS } from "@/app/dashboard/(g3-venture-pipeline)/investment-rounds/libs/constants"
import { percentage } from "@/app/dashboard/(g3-venture-pipeline)/investment-rounds/libs/calculations"
import type { InvestmentRound, InvestmentRoundSummary, RiskLevel, RoundStatus } from "@/app/dashboard/(g3-venture-pipeline)/investment-rounds/libs/types"
import { gedsiScoreClass, RiskIcon, StatusIcon } from "./round-presentation"

export function InvestmentRoundKpis({ summary: s }: { summary: InvestmentRoundSummary }) {
  const cards = [
    ["Total Rounds", s.totalRounds, `${s.openRounds} open, ${s.closedRounds} closed`, TrendingUp, ""],
    ["GEDSI Score", s.avgGedsiScore.toFixed(0), "Average across all rounds", Heart, gedsiScoreClass(s.avgGedsiScore)],
    ["Impact Score", s.avgImpactScore.toFixed(0), "Social impact rating", Globe, "text-blue-600"],
    ["Jobs Created", s.totalJobsCreated, `Across ${s.totalCommunitiesServed} communities`, Users, "text-green-600"],
    ["Women-Led", s.womenLedRounds, `${s.womenLedPercentage.toFixed(0)}% of rounds`, Star, "text-purple-600"],
    ["Raised Amount", `$${s.totalRaisedAmount.toFixed(1)}M`, `${s.raisedPercentage.toFixed(1)}% of $${s.totalTargetAmount.toFixed(1)}M target`, DollarSign, ""],
  ] as const
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">{cards.map(([title, value, detail, Icon, color]) =>
    <Card key={title}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className={`text-2xl font-bold ${color}`}>{value}</div><p className="text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}</div>
}

function DistributionCard({ title, icon: Icon, children }: { title: string; icon: typeof Heart; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5" />{title}</CardTitle></CardHeader><CardContent><div className="space-y-4">{children}</div></CardContent></Card>
}
function Count({ count, total }: { count: number; total: number }) { return <div className="flex items-center gap-2"><span className="text-sm font-medium">{count}</span><span className="text-xs text-muted-foreground">({percentage(count, total).toFixed(1)}%)</span></div> }

export function InvestmentRoundDistributions({ rounds }: { rounds: InvestmentRound[] }) {
  return <div className="grid gap-4 md:grid-cols-4">
    <DistributionCard title="Founder Diversity" icon={Heart}>{FOUNDER_TYPES.slice(0, 5).map((type) => { const count = rounds.filter((r) => r.founderType.includes(type)).length; return <div key={type} className="flex items-center justify-between"><span className="text-sm capitalize">{type.replace("-", " ")}</span><Count count={count} total={rounds.length} /></div> })}</DistributionCard>
    <DistributionCard title="Sector Distribution" icon={Building2}>{SECTORS.slice(0, 6).map((sector) => { const count = rounds.filter((r) => r.sector === sector).length; return <div key={sector} className="flex items-center justify-between"><span className="text-sm">{sector}</span><Count count={count} total={rounds.length} /></div> })}</DistributionCard>
    <DistributionCard title="Risk Assessment" icon={Shield}>{(["low", "medium", "high"] as RiskLevel[]).map((level) => { const count = rounds.filter((r) => r.aiInsights.riskLevel === level).length; return <div key={level} className="flex items-center justify-between"><div className="flex items-center gap-2"><RiskIcon level={level} /><span className="text-sm capitalize">{level} Risk</span></div><Count count={count} total={rounds.length} /></div> })}</DistributionCard>
    <DistributionCard title="Status Overview" icon={Activity}>{(["open", "closing", "closed", "cancelled"] as RoundStatus[]).map((status) => { const count = rounds.filter((r) => r.status === status).length; return <div key={status} className="flex items-center justify-between"><div className="flex items-center gap-2"><StatusIcon status={status} /><span className="text-sm capitalize">{status}</span></div><Count count={count} total={rounds.length} /></div> })}</DistributionCard>
  </div>
}
