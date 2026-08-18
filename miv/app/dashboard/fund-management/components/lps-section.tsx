"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Mail } from "lucide-react"
import { LimitedPartner } from "../types/fund-management"
import { LPDialog } from "./lp-dialog"

interface LPsSectionProps {
  limitedPartners: LimitedPartner[]
  loading?: boolean
}

export function LPsSection({ limitedPartners, loading = false }: Readonly<LPsSectionProps>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLP, setSelectedLP] = useState<LimitedPartner | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewType, setViewType] = useState<"cards" | "table">("cards")

  // Filter LPs
  const filteredLPs = limitedPartners.filter((lp) => {
    const matchesSearch =
      lp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lp.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || lp.type === selectedType
    const matchesStatus = selectedStatus === "all" || lp.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectLP = (lp: LimitedPartner) => {
    setSelectedLP(lp)
    setIsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "defaulted":
        return "bg-red-100 text-red-800"
      case "transferred":
        return "bg-blue-100 text-blue-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getKycColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
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
            placeholder="Search LPs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="LP Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pension">Pension Fund</SelectItem>
            <SelectItem value="endowment">Endowment</SelectItem>
            <SelectItem value="foundation">Foundation</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="sovereign">Sovereign Fund</SelectItem>
            <SelectItem value="family_office">Family Office</SelectItem>
            <SelectItem value="fund_of_funds">Fund of Funds</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="defaulted">Defaulted</SelectItem>
            <SelectItem value="transferred">Transferred</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add LP
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
          {filteredLPs.map((lp) => (
            <Card
              key={lp.id}
              className="cursor-pointer hover:border-slate-400 transition"
              onClick={() => handleSelectLP(lp)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{lp.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {lp.type.replaceAll("_", " ")} • {lp.country}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(lp.status)}>
                    {lp.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Commitment</p>
                    <p className="font-semibold">{lp.commitment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IRR</p>
                    <p className="font-semibold text-green-600">{lp.irr.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">TVPI</p>
                    <p className="font-semibold">{lp.tvpi.toFixed(2)}x</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className={getKycColor(lp.kycStatus)}>
                    KYC: {lp.kycStatus}
                  </Badge>
                  {lp.accredited && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      Accredited
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{lp.email}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewType === "table" && (
        <Card className="hidden sm:block">
          <CardHeader>
            <CardTitle>Limited Partners</CardTitle>
            <CardDescription>{filteredLPs.length} partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LP Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Commitment</TableHead>
                    <TableHead>IRR</TableHead>
                    <TableHead>TVPI</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLPs.map((lp) => (
                    <TableRow
                      key={lp.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => handleSelectLP(lp)}
                    >
                      <TableCell className="font-medium">{lp.name}</TableCell>
                      <TableCell className="text-sm">
                        {lp.type.replaceAll("_", " ")}
                      </TableCell>
                      <TableCell>{lp.country}</TableCell>
                      <TableCell className="font-medium">{lp.commitment}</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {lp.irr.toFixed(1)}%
                      </TableCell>
                      <TableCell>{lp.tvpi.toFixed(2)}x</TableCell>
                      <TableCell>
                        <Badge className={getKycColor(lp.kycStatus)}>
                          {lp.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lp.status)}>
                          {lp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectLP(lp)
                          }}
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
        {filteredLPs.map((lp) => (
          <Card
            key={lp.id}
            className="cursor-pointer"
            onClick={() => handleSelectLP(lp)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium">{lp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lp.type.replaceAll("_", " ")}
                  </p>
                </div>
                <Badge className={`${getStatusColor(lp.status)} text-xs`}>
                  {lp.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <p className="text-muted-foreground">Commitment</p>
                  <p className="font-semibold">{lp.commitment}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">IRR</p>
                  <p className="font-semibold text-green-600">{lp.irr.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">TVPI</p>
                  <p className="font-semibold">{lp.tvpi.toFixed(2)}x</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredLPs.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No limited partners found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* LP Dialog */}
      <LPDialog
        open={isDialogOpen}
        selectedLP={selectedLP}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}

