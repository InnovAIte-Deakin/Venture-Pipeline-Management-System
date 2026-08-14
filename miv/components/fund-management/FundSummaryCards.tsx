import { Activity, Banknote, CircleDollarSign, Landmark, TrendingUp, WalletCards } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatFinancialValue } from "@/lib/fund-management/calculations"
import type { FundMetrics } from "@/types/fund-management"

export function FundSummaryCards({ metrics }: { metrics: FundMetrics }) {
  const cards = [
    { label: "Total Funds", value: metrics.totalFunds.toLocaleString(), detail: "Funds under management", icon: Landmark },
    { label: "Active Funds", value: metrics.activeFunds.toLocaleString(), detail: "Currently investing", icon: Activity },
    { label: "Committed Capital", value: formatFinancialValue(metrics.totalCommittedCapital), detail: "Total investor commitments", icon: WalletCards },
    { label: "Called Capital", value: formatFinancialValue(metrics.totalCalledCapital), detail: "Capital deployed or called", icon: Banknote },
    { label: "Distributed Capital", value: formatFinancialValue(metrics.totalDistributedCapital), detail: "Returned to investors", icon: CircleDollarSign },
    { label: "Average IRR", value: `${Number.isFinite(metrics.averageIRR) ? metrics.averageIRR.toFixed(1) : "0.0"}%`, detail: "Across all funds", icon: TrendingUp },
  ]
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{cards.map(({ label, value, detail, icon: Icon }) => <Card key={label} className="h-full border-muted/70 shadow-sm"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle><span className="rounded-md bg-blue-50 p-2 text-blue-600"><Icon className="h-4 w-4" /></span></CardHeader><CardContent><div className="break-words text-2xl font-bold tracking-tight">{value}</div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}</div>
}
