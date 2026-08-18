"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Fund, LimitedPartner } from "../types/fund-management"

interface OverviewCardsProps {
  funds: Fund[]
  limitedPartners: LimitedPartner[]
  capitalCallsCount: number
  distributionsCount: number
}

export function OverviewCards({ funds, limitedPartners, capitalCallsCount, distributionsCount }: Readonly<OverviewCardsProps>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Funds</CardTitle>
          <CardDescription>Total funds under management</CardDescription>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{funds.length}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LPs</CardTitle>
          <CardDescription>Active limited partners</CardDescription>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{limitedPartners.length}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capital Calls</CardTitle>
          <CardDescription>Open and active capital calls</CardDescription>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{capitalCallsCount}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distributions</CardTitle>
          <CardDescription>Recent distribution events</CardDescription>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">{distributionsCount}</CardContent>
      </Card>
    </div>
  )
}
