"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Fund } from "../types/fund-management"

interface FundGridProps {
  funds: Fund[]
}

export function FundGrid({ funds }: Readonly<FundGridProps>) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {funds.map((fund) => (
        <Card key={fund.id}>
          <CardHeader>
            <CardTitle>{fund.name}</CardTitle>
            <CardDescription>{fund.geography} • {fund.fundType}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Committed</p>
                <p className="font-medium">{fund.committedCapital}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Called</p>
                <p className="font-medium">{fund.calledCapital}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distributed</p>
                <p className="font-medium">{fund.distributedCapital}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NAV</p>
                <p className="font-medium">{fund.netAssetValue}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">IRR</p>
                <p className="text-lg font-semibold text-emerald-600">{fund.irr.toFixed(1)}%</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">TVPI</p>
                <p className="text-lg font-semibold">{fund.tvpi.toFixed(2)}x</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">DPI</p>
                <p className="text-lg font-semibold">{fund.dpi.toFixed(2)}x</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Life stage</p>
              <Progress value={Math.min(100, fund.investmentPeriod ? 80 : 60)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
