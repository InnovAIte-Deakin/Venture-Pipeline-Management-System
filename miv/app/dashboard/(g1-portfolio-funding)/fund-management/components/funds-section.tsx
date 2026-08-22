"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Download } from "lucide-react"
import { Fund } from "../types/fund-management"
import { FundGrid } from "./fund-grid"
import { FundMobileCard } from "./fund-mobile-card"
import { FundDetailDialog } from "./fund-detail-dialog"

interface FundsSectionProps {
  funds: Fund[]
  loading?: boolean
}

export function FundsSection({ funds, loading = false }: Readonly<FundsSectionProps>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFundType, setSelectedFundType] = useState("all")
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [viewType, setViewType] = useState<"grid" | "table">("grid")

  // Filter funds based on search and filters
  const filteredFunds = funds.filter((fund) => {
    const matchesSearch =
      fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.fundManager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || fund.status === selectedStatus
    const matchesType = selectedFundType === "all" || fund.fundType === selectedFundType

    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewFund = (fund: Fund) => {
    setSelectedFund(fund)
    setIsFundDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "fundraising":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "winding_down":
        return "bg-orange-100 text-orange-800"
      case "liquidated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search funds..."
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
            <SelectItem value="fundraising">Fundraising</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="winding_down">Winding Down</SelectItem>
            <SelectItem value="liquidated">Liquidated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedFundType} onValueChange={setSelectedFundType}>
          <SelectTrigger>
            <SelectValue placeholder="Fund Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="venture">Venture</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="buyout">Buyout</SelectItem>
            <SelectItem value="impact">Impact</SelectItem>
            <SelectItem value="debt">Debt</SelectItem>
          </SelectContent>
        </Select>

        <div className="hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" className="flex-1">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* View Toggle for Desktop */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant={viewType === "grid" ? "default" : "outline"}
          onClick={() => setViewType("grid")}
        >
          Grid View
        </Button>
        <Button
          variant={viewType === "table" ? "default" : "outline"}
          onClick={() => setViewType("table")}
        >
          Table View
        </Button>
        <Button className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Fund
        </Button>
      </div>

      {/* Grid View - Desktop */}
      {viewType === "grid" && (
        <div className="hidden sm:block">
          <FundGrid funds={filteredFunds} />
        </div>
      )}

      {/* Table View - Desktop */}
      {viewType === "table" && (
        <Card className="hidden sm:block">
          <CardHeader>
            <CardTitle>Funds Overview</CardTitle>
            <CardDescription>{filteredFunds.length} funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund Name</TableHead>
                    <TableHead>Vintage</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Called</TableHead>
                    <TableHead>IRR</TableHead>
                    <TableHead>TVPI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFunds.map((fund) => (
                    <TableRow key={fund.id}>
                      <TableCell className="font-medium">{fund.name}</TableCell>
                      <TableCell>{fund.vintage}</TableCell>
                      <TableCell>{fund.size}</TableCell>
                      <TableCell>{fund.calledCapital}</TableCell>
                      <TableCell className="text-green-600 font-medium">{fund.irr.toFixed(1)}%</TableCell>
                      <TableCell>{fund.tvpi.toFixed(2)}x</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(fund.status)}>
                          {fund.status.replaceAll("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFund(fund)}
                        >
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
        {filteredFunds.map((fund) => (
          <FundMobileCard
            key={fund.id}
            fund={fund}
            onView={() => handleViewFund(fund)}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredFunds.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No funds found matching your filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Fund Detail Dialog */}
      <FundDetailDialog
        fund={selectedFund}
        open={isFundDialogOpen}
        onOpenChange={setIsFundDialogOpen}
      />
    </div>
  )
}

