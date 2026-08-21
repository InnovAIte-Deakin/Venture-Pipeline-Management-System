"use client"

import { useMemo, useState } from "react"
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
import { CapitalFilters } from "@/components/capital-facilitation/CapitalFilters"
import {
  capitalRequestsDemo,
  fundingStageOptions,
  requestStatusOptions,
} from "@/lib/capital-facilitation/demo-data"
import { FileText } from "lucide-react"

const ALL_STAGES = fundingStageOptions[0]
const ALL_STATUSES = requestStatusOptions[0]

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusColors: Record<string, string> = {
  Open: "bg-blue-100 text-blue-800 border-blue-200",
  Preparing: "bg-gray-100 text-gray-800 border-gray-200",
  Fundraising: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Investor Review": "bg-purple-100 text-purple-800 border-purple-200",
  Closed: "bg-green-100 text-green-800 border-green-200",
}

export function CapitalRequests() {
  const [search, setSearch] = useState("")
  const [fundingStage, setFundingStage] = useState(ALL_STAGES)
  const [status, setStatus] = useState(ALL_STATUSES)

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase()
    return capitalRequestsDemo.filter((request) => {
      const matchesSearch = !query || request.ventureName.toLowerCase().includes(query)
      const matchesStage = fundingStage === ALL_STAGES || request.fundingStage === fundingStage
      const matchesStatus = status === ALL_STATUSES || request.status === status
      return matchesSearch && matchesStage && matchesStatus
    })
  }, [search, fundingStage, status])

  const resetFilters = () => {
    setSearch("")
    setFundingStage(ALL_STAGES)
    setStatus(ALL_STATUSES)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Capital Requests</h2>
        <p className="text-sm text-muted-foreground">
          Review venture funding requirements, requested amounts and capital request status.
        </p>
      </div>
      <CapitalFilters
        search={search}
        onSearchChange={setSearch}
        fundingStage={fundingStage}
        onFundingStageChange={setFundingStage}
        status={status}
        onStatusChange={setStatus}
        fundingStageOptions={fundingStageOptions}
        statusOptions={requestStatusOptions}
        onReset={resetFilters}
      />
      <Card>
        <CardHeader>
          <CardTitle>Requested Funding</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[64rem]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Venture</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>Amount Requested</TableHead>
                    <TableHead>Funding Stage</TableHead>
                    <TableHead>Target Close</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="max-w-[200px] break-words font-medium">{request.ventureName}</TableCell>
                      <TableCell>{request.requestType}</TableCell>
                      <TableCell>{request.amountRequested}</TableCell>
                      <TableCell>{request.fundingStage}</TableCell>
                      <TableCell>{request.targetClose}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityColors[request.priority] || ""}>
                          {request.priority}
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
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">No capital requests match your filters</h3>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
