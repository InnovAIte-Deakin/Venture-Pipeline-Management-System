"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { capitalInvestorsDemo } from "@/lib/capital-facilitation/demo-data"

const engagementColors: Record<string, string> = {
  "Initial Discussion": "bg-gray-100 text-gray-800 border-gray-200",
  Interested: "bg-blue-100 text-blue-800 border-blue-200",
  "Due Diligence": "bg-purple-100 text-purple-800 border-purple-200",
  "Investor Ready": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Committed: "bg-green-100 text-green-800 border-green-200",
}

export function CapitalInvestors() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Investor Engagement</h2>
        <p className="text-sm text-muted-foreground">
          Track prospective investors, investment interest and engagement status.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Investor Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[56rem]">
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Investor Type</TableHead>
                  <TableHead>Sector Interest</TableHead>
                  <TableHead>Preferred Stage</TableHead>
                  <TableHead>Indicative Interest</TableHead>
                  <TableHead>Engagement Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capitalInvestorsDemo.map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell className="max-w-[200px] break-words font-medium">{investor.investorName}</TableCell>
                    <TableCell>{investor.investorType}</TableCell>
                    <TableCell className="max-w-[180px] break-words">{investor.sectorInterest}</TableCell>
                    <TableCell>{investor.preferredStage}</TableCell>
                    <TableCell>{investor.indicativeInterest}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={engagementColors[investor.engagementStatus] || ""}>
                        {investor.engagementStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
