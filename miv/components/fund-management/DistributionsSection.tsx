import { Calendar, Download, Edit, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDistributionStatusBadge } from "@/lib/fund-management/status"
import type { Distribution } from "@/types/fund-management"

interface DistributionsSectionProps {
  distributions: Distribution[]
}

export function DistributionsSection({ distributions }: DistributionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distributions</CardTitle>
        <CardDescription>Track fund distributions and LP payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead>Distribution</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>LP Payments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributions.map((distribution) => {
                const paymentRate = (distribution.lpsPaid / distribution.totalLps) * 100

                return (
                  <TableRow key={distribution.id}>
                    <TableCell>
                      <div className="font-medium">{distribution.fundName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{distribution.distributionNumber}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{distribution.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{distribution.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{distribution.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={paymentRate} className="h-2 w-16" />
                        <span className="text-sm">{distribution.lpsPaid}/{distribution.totalLps}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getDistributionStatusBadge(distribution.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{distribution.lastUpdate}</span>
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
