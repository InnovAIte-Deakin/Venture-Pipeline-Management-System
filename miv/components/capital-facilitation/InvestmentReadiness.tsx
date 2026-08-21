"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { investmentReadinessDemo } from "@/lib/capital-facilitation/demo-data"

const readinessCategories = [
  "Pitch Deck",
  "Financial Model",
  "Business Plan",
  "Data Room",
  "Impact Metrics",
  "Legal Documentation",
]

const statusColors: Record<string, string> = {
  Complete: "bg-green-100 text-green-800 border-green-200",
  "In Review": "bg-blue-100 text-blue-800 border-blue-200",
  Pending: "bg-gray-100 text-gray-800 border-gray-200",
  "Investor Ready": "bg-green-100 text-green-800 border-green-200",
  Preparing: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export function InvestmentReadiness() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Investment Readiness</h2>
        <p className="text-sm text-muted-foreground">
          Assess whether ventures are prepared for investor engagement and capital raising.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {readinessCategories.map((category) => (
          <Card key={category} className="bg-muted/40">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium break-words">{category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Venture Readiness Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[56rem]">
              <TableHeader>
                <TableRow>
                  <TableHead>Venture</TableHead>
                  <TableHead>Pitch Deck</TableHead>
                  <TableHead>Financial Model</TableHead>
                  <TableHead>Data Room</TableHead>
                  <TableHead>Legal</TableHead>
                  <TableHead>Readiness Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentReadinessDemo.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="max-w-[200px] break-words font-medium">{record.ventureName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.pitchDeck] || ""}>
                        {record.pitchDeck}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.financialModel] || ""}>
                        {record.financialModel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.dataRoom] || ""}>
                        {record.dataRoom}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.legal] || ""}>
                        {record.legal}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-[8rem] items-center gap-2">
                        <Progress value={record.readinessScore} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{record.readinessScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.status] || ""}>
                        {record.status}
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
