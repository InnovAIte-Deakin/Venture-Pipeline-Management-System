import { Activity, Clock, Mail, Shield, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CapitalCall, Distribution, Fund, LimitedPartner } from "../types/fund-management"

interface FundSummaryCardsProps {
  funds: Fund[]
  limitedPartners: LimitedPartner[]
  capitalCalls: CapitalCall[]
  distributions: Distribution[]
  averageIRR: number
}

export function FundSummaryCards({ funds, limitedPartners, capitalCalls, distributions, averageIRR }: FundSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{capitalCalls.length + distributions.length}</div>
          <p className="text-xs text-muted-foreground">{capitalCalls.length} capital calls, {distributions.length} distributions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{funds.filter((fund) => fund.status === "fundraising" || fund.lastUpdate?.includes("overdue")).length}</div>
          <p className="text-xs text-muted-foreground">Require immediate attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">LP Communications</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{limitedPartners.length * 2}</div>
          <p className="text-xs text-muted-foreground">Sent this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{funds.length === 0 ? "0%" : `${Math.round((funds.filter((fund) => fund.status === "active").length / funds.length) * 100)}%`}</div>
          <p className="text-xs text-muted-foreground">{funds.length === 0 ? "No funds to assess" : "Requirements status"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fund Performance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageIRR.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Average IRR across funds</p>
        </CardContent>
      </Card>
    </div>
  )
}
