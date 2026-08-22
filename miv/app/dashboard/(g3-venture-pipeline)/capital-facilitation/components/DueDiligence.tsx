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
import { dueDiligenceDemo, dueDiligenceSummaryDemo } from "../lib/demo-data"

const statusColors: Record<string, string> = {
  Complete: "bg-green-100 text-green-800 border-green-200",
  "In Review": "bg-blue-100 text-blue-800 border-blue-200",
  Pending: "bg-gray-100 text-gray-800 border-gray-200",
  "Ready for Decision": "bg-green-100 text-green-800 border-green-200",
  "Attention Required": "bg-red-100 text-red-800 border-red-200",
}

export function DueDiligence() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Due Diligence</h2>
        <p className="text-sm text-muted-foreground">
          Monitor investment due diligence requirements and completion status.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dueDiligenceSummaryDemo.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold break-words">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Due Diligence Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[64rem]">
              <TableHeader>
                <TableRow>
                  <TableHead>Venture</TableHead>
                  <TableHead>Financial Review</TableHead>
                  <TableHead>Legal Review</TableHead>
                  <TableHead>Business Model</TableHead>
                  <TableHead>Impact Assessment</TableHead>
                  <TableHead>Documentation</TableHead>
                  <TableHead>Overall Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dueDiligenceDemo.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="max-w-[200px] break-words font-medium">{record.ventureName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.financialReview] || ""}>
                        {record.financialReview}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.legalReview] || ""}>
                        {record.legalReview}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.businessModel] || ""}>
                        {record.businessModel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.impactAssessment] || ""}>
                        {record.impactAssessment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.documentation] || ""}>
                        {record.documentation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[record.overallStatus] || ""}>
                        {record.overallStatus}
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
