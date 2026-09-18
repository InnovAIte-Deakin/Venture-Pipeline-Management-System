"use client"

import { Fund, CapitalCall, Distribution } from "../types/fund-management"
import { CapitalCallMobileCard } from "./capital-call-mobile-card"
import { DistributionMobileCard } from "./distribution-mobile-card"
import { FundMobileCard } from "./fund-mobile-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"

interface ResponsiveListProps {
  type: "funds" | "capital-calls" | "distributions"
  data: Fund[] | CapitalCall[] | Distribution[]
  onView?: (item: any) => void
}

export function ResponsiveList({ type, data, onView }: Readonly<ResponsiveListProps>) {
  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        {type === "funds" &&
          (data as Fund[]).map((fund) => (
            <FundMobileCard key={fund.id} fund={fund} onView={() => onView?.(fund)} />
          ))}

        {type === "capital-calls" &&
          (data as CapitalCall[]).map((call) => (
            <CapitalCallMobileCard key={call.id} call={call} />
          ))}

        {type === "distributions" &&
          (data as Distribution[]).map((dist) => (
            <DistributionMobileCard key={dist.id} distribution={dist} />
          ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {type === "funds" && (
                <>
                  <TableHead>Fund</TableHead>
                  <TableHead>Vintage</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Called</TableHead>
                  <TableHead>Distributed</TableHead>
                  <TableHead>IRR</TableHead>
                  <TableHead>TVPI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </>
              )}
              {type === "capital-calls" && (
                <>
                  <TableHead>Fund</TableHead>
                  <TableHead>Call Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>LP Response</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </>
              )}
              {type === "distributions" && (
                <>
                  <TableHead>Fund</TableHead>
                  <TableHead>Distribution</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>LP Payments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {type === "funds" &&
              (data as Fund[]).map((fund) => (
                <TableRow key={fund.id}>
                  <TableCell>
                    <div className="font-medium">{fund.name}</div>
                  </TableCell>
                  <TableCell>{fund.vintage}</TableCell>
                  <TableCell className="font-medium">{fund.size}</TableCell>
                  <TableCell>{fund.calledCapital}</TableCell>
                  <TableCell>{fund.distributedCapital}</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">
                      {fund.irr > 0 ? "+" : ""}
                      {fund.irr.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{fund.tvpi.toFixed(2)}x</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {fund.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
