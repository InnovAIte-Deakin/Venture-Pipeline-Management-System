"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LimitedPartner } from "../types/fund-management"

interface LPSummaryProps {
  limitedPartners: LimitedPartner[]
  onSelectLP: (lp: LimitedPartner) => void
}

export function LPSummary({ limitedPartners, onSelectLP }: Readonly<LPSummaryProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Limited Partner Snapshot</CardTitle>
        <CardDescription>Key investor relationships at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {limitedPartners.map((lp) => (
            <button
              key={lp.id}
              type="button"
              onClick={() => onSelectLP(lp)}
              className="w-full rounded-xl border p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{lp.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {lp.type.replace('_', ' ')} • {lp.country}
                  </div>
                </div>
                <Badge variant="outline">{lp.status}</Badge>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Commitment</p>
                  <p className="font-medium">{lp.commitment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">IRR</p>
                  <p className="font-medium">{lp.irr.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">TVPI</p>
                  <p className="font-medium">{lp.tvpi.toFixed(2)}x</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
