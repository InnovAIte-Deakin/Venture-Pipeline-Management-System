"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { CapitalCall } from "../types/fund-management"
import { Progress } from "@/components/ui/progress"
import { CapitalCallMobileCard } from "./capital-call-mobile-card"

interface CapitalCallsSectionProps {
  capitalCalls: CapitalCall[]
  loading?: boolean
}

export function CapitalCallsSection({ capitalCalls, loading = false }: Readonly<CapitalCallsSectionProps>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewType, setViewType] = useState<"cards" | "table">("cards")

  const filteredCalls = capitalCalls.filter((call) => {
    const matchesSearch =
      call.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.callNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || call.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search capital calls..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <div />

        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Capital Call
        </Button>
      </div>

      {/* View Toggle */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant={viewType === "cards" ? "default" : "outline"}
          onClick={() => setViewType("cards")}
        >
          Cards View
        </Button>
        <Button
          variant={viewType === "table" ? "default" : "outline"}
          onClick={() => setViewType("table")}
        >
          Table View
        </Button>
      </div>

      {/* Cards View */}
      {viewType === "cards" && (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCalls.map((call) => (
            <Card key={call.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{call.fundName}</CardTitle>
                    <CardDescription>{call.callNumber}</CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusIcon(call.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold">LP Responses</p>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <Progress
                    value={(call.lpsResponded / call.totalLps) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {call.lpsResponded} of {call.totalLps} LPs responded
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Amount</p>
                    <p className="font-semibold">{call.amount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Due Date</p>
                    <p className="font-semibold">{call.dueDate}</p>
                  </div>
                </div>

                {call.purpose && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Purpose</p>
                    <p className="text-sm">{call.purpose}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewType === "table" && (
        <Card className="hidden sm:block">
          <CardHeader>
            <CardTitle>Capital Calls</CardTitle>
            <CardDescription>{filteredCalls.length} capital calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead>Call #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>LP Response</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">{call.fundName}</TableCell>
                      <TableCell>{call.callNumber}</TableCell>
                      <TableCell>{call.amount}</TableCell>
                      <TableCell>{call.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20">
                            <Progress
                              value={(call.lpsResponded / call.totalLps) * 100}
                              className="h-2"
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {call.lpsResponded}/{call.totalLps}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(call.status)}>
                          {call.status.replaceAll("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile View */}
      <div className="sm:hidden space-y-2">
        {filteredCalls.map((call) => (
          <CapitalCallMobileCard key={call.id} call={call} />
        ))}
      </div>

      {/* No Results */}
      {filteredCalls.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No capital calls found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

