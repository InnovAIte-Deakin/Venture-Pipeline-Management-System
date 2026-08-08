import { Calendar, Download, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getCapitalCallStatusBadge } from "@/lib/fund-management/status"
import type { CapitalCall } from "@/types/fund-management"

interface CapitalCallsSectionProps {
  capitalCalls: CapitalCall[]
}

export function CapitalCallsSection({ capitalCalls }: CapitalCallsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Calls</CardTitle>
        <CardDescription>Track capital calls and LP responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead>Call Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>LP Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capitalCalls.map((call) => {
                const responseRate = (call.lpsResponded / call.totalLps) * 100

                return (
                  <TableRow key={call.id}>
                    <TableCell>
                      <div className="font-medium">{call.fundName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{call.callNumber}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{call.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{call.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={responseRate} className="h-2 w-16" />
                        <span className="text-sm">{call.lpsResponded}/{call.totalLps}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getCapitalCallStatusBadge(call.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{call.lastUpdate}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
