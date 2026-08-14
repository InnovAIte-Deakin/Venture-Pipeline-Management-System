import { ArrowDownRight, ArrowUpRight, BarChart3, Edit, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getFundStatusBadge } from "@/lib/fund-management/status"
import { parseFinancialAmount } from "@/lib/fund-management/calculations"
import type { Fund } from "@/types/fund-management"

interface FundsTableProps {
  funds: Fund[]
  onSelectFund: (fund: Fund) => void
}

export function FundsTable({ funds, onSelectFund }: FundsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funds ({funds.length})</CardTitle>
        <CardDescription>Overview of all funds and their performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead>Vintage</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Called</TableHead>
                <TableHead>Distributed</TableHead>
                <TableHead>IRR</TableHead>
                <TableHead>TVPI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.map((fund) => {
                const committed = parseFinancialAmount(fund.committedCapital)
                const calledPercentage = committed > 0 ? (parseFinancialAmount(fund.calledCapital) / committed) * 100 : 0

                return (
                  <TableRow key={fund.id}>
                    <TableCell>
                      <div>
                        <div className="max-w-64 truncate font-medium" title={fund.name}>{fund.name}</div>
                        <div className="text-sm text-muted-foreground">{fund.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{fund.vintage}</TableCell>
                    <TableCell className="font-medium">{fund.size}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{fund.calledCapital}</div>
                        <div className="text-sm text-muted-foreground">{calledPercentage.toFixed(1)}%</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{fund.distributedCapital}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${fund.irr > 0 ? "text-green-600" : "text-red-600"}`}>
                        {fund.irr > 0 ? "+" : ""}
                        {fund.irr.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{fund.tvpi.toFixed(2)}x</span>
                        {fund.tvpi > 1 ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell>{getFundStatusBadge(fund.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                          {fund.fundManager ? fund.fundManager.split(" ").map((namePart) => namePart[0]).join("") : "FM"}
                        </div>
                        <span className="text-sm">{fund.fundManager || "Fund Manager"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onSelectFund(fund)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
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
