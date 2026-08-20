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
import { formatCurrency } from "@/lib/capital-facilitation/transformations"
import type { CapitalRequest } from "@/types/capital-facilitation"
import { Building2 } from "lucide-react"

const statusColors: Record<string, string> = {
  Approved: "bg-green-100 text-green-800 border-green-200",
  "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
}

interface CapitalFacilitationTableProps {
  requests: CapitalRequest[]
}

export function CapitalFacilitationTable({ requests }: CapitalFacilitationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Venture Capital Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Funding stage, capital raised, and investor readiness by venture</p>
      </CardHeader>
      <CardContent>
        {requests.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venture</TableHead>
                  <TableHead>Funding Stage</TableHead>
                  <TableHead>Capital Raised</TableHead>
                  <TableHead>Investor Readiness</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="max-w-[200px] break-words font-medium">{request.venture}</TableCell>
                    <TableCell>{request.stage}</TableCell>
                    <TableCell>{formatCurrency(request.amount)}</TableCell>
                    <TableCell>
                      <div className="flex min-w-[8rem] items-center gap-2">
                        <Progress value={request.progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{request.progress}%</span>
                      </div>
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
