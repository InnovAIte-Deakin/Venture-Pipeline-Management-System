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
import type { CapitalFacilitationRecord } from "../types"
import { Building2 } from "lucide-react"

const statusColors: Record<string, string> = {
  "Investor Ready": "bg-blue-100 text-blue-800 border-blue-200",
  Preparing: "bg-gray-100 text-gray-800 border-gray-200",
  Fundraising: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Due Diligence": "bg-purple-100 text-purple-800 border-purple-200",
  Funded: "bg-green-100 text-green-800 border-green-200",
}

const readinessColors: Record<string, string> = {
  Ready: "bg-green-100 text-green-800 border-green-200",
  "In Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Preparing: "bg-gray-100 text-gray-800 border-gray-200",
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount)

interface CapitalFacilitationTableProps {
  requests: CapitalFacilitationRecord[]
}

export function CapitalFacilitationTable({ requests }: CapitalFacilitationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Venture Portfolio</CardTitle>
        <p className="text-sm text-muted-foreground">
          Funding requirements, secured capital and investor readiness by venture.
        </p>
      </CardHeader>
      <CardContent>
        {requests.length ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[64rem]">
              <TableHeader>
                <TableRow>
                  <TableHead>Venture</TableHead>
                  <TableHead>Funding Stage</TableHead>
                  <TableHead>Capital Required</TableHead>
                  <TableHead>Capital Secured</TableHead>
                  <TableHead>Funding Gap</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Investor Readiness</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="max-w-[200px] break-words font-medium">{request.ventureName}</TableCell>
                    <TableCell>{request.fundingStage}</TableCell>
                    <TableCell>{formatCurrency(request.capitalRequired)}</TableCell>
                    <TableCell>{formatCurrency(request.capitalSecured)}</TableCell>
                    <TableCell>{formatCurrency(request.fundingGap)}</TableCell>
                    <TableCell>
                      <div className="flex min-w-[8rem] items-center gap-2">
                        <Progress value={request.progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{request.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={readinessColors[request.investorReadiness] || ""}>
                        {request.investorReadiness}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[request.status] || ""}>
                        {request.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-medium">No capital facilitation records available</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Venture funding information will appear here once capital requirements and investment data are available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
