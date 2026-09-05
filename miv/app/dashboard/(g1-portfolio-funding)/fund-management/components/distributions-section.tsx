"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { Distribution } from "../types/fund-management"
import { DistributionMobileCard } from "./distribution-mobile-card"

interface DistributionsSectionProps {
  distributions: Distribution[]
  loading?: boolean
}

export function DistributionsSection({ distributions, loading = false }: Readonly<DistributionsSectionProps>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewType, setViewType] = useState<"cards" | "table">("cards")

  const filteredDistributions = distributions.filter((dist) => {
    const matchesSearch =
      dist.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.distributionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || dist.type === selectedType
    const matchesStatus = selectedStatus === "all" || dist.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "announced":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exit":
        return "bg-emerald-100 text-emerald-800"
      case "dividend":
        return "bg-green-100 text-green-800"
      case "refinancing":
        return "bg-blue-100 text-blue-800"
      case "return_of_capital":
        return "bg-purple-100 text-purple-800"
      case "other":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search distributions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="exit">Exit</SelectItem>
            <SelectItem value="dividend">Dividend</SelectItem>
            <SelectItem value="refinancing">Refinancing</SelectItem>
            <SelectItem value="return_of_capital">Return of Capital</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="announced">Announced</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Distribution
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
        <div className="hidden gap-4 sm:grid md:grid-cols-2">
          {filteredDistributions.map((dist) => (
            <Card key={dist.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{dist.fundName}</CardTitle>
                    <CardDescription>{dist.distributionNumber}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(dist.status)}>
                    {dist.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Distribution Amount</p>
                  <p className="text-2xl font-bold text-emerald-600">{dist.amount}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Type</p>
                    <Badge className={getTypeColor(dist.type)}>
                      {dist.type.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Date</p>
                    <p className="font-semibold">{dist.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Source</p>
                    <p className="font-semibold">{dist.source || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">LPs Paid</p>
                    <p className="font-semibold">
                      {dist.lpsPaid} of {dist.totalLps}
                    </p>
                  </div>
                </div>

                {dist.taxImplications && (
                  <div className="text-xs">
                    <p className="text-muted-foreground mb-1">Tax Implications</p>
                    <p>{dist.taxImplications}</p>
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
            <CardTitle>Distributions</CardTitle>
            <CardDescription>{filteredDistributions.length} distributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead>Distribution #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>LPs Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDistributions.map((dist) => (
                    <TableRow key={dist.id}>
                      <TableCell className="font-medium">{dist.fundName}</TableCell>
                      <TableCell>{dist.distributionNumber}</TableCell>
                      <TableCell className="font-semibold text-emerald-600">
                        {dist.amount}
                      </TableCell>
                      <TableCell>{dist.date}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(dist.type)}>
                          {dist.type.replaceAll("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {dist.lpsPaid} of {dist.totalLps}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(dist.status)}>
                          {dist.status}
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
        {filteredDistributions.map((dist) => (
          <DistributionMobileCard key={dist.id} distribution={dist} />
        ))}
      </div>

      {/* No Results */}
      {filteredDistributions.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No distributions found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

