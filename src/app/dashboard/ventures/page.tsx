"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  DollarSign,
  Target,
  MapPin,
  Calendar,
  RefreshCw,
  Download,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface Venture {
  id: string
  name: string
  description: string
  sector: string
  location: string
  stage: string
  status: string
  fundingAmount: number
  teamSize: number
  foundedYear: number
  gedsiScore: number
  createdAt: string
  updatedAt: string
}

export default function VenturesPage() {
  const router = useRouter()
  const [ventures, setVentures] = useState<Venture[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [sectorFilter, setSectorFilter] = useState("all")

  // Fetch ventures data
  useEffect(() => {
    const fetchVentures = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/ventures')
        if (response.ok) {
          const data = await response.json()
          setVentures(data)
        } else {
          // Handle API error
          setError('Failed to fetch ventures from database')
          setVentures([])
        }
      } catch (error) {
        console.error('Failed to fetch ventures:', error)
        setError('Database connection failed')
        setVentures([])
      } finally {
        setLoading(false)
      }
    }

    fetchVentures()
  }, [])

  // Error state for failed API calls
  const [error, setError] = useState<string | null>(null)

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'IDEA': 'bg-blue-100 text-blue-800',
      'VALIDATION': 'bg-yellow-100 text-yellow-800',
      'EARLY_GROWTH': 'bg-green-100 text-green-800',
      'SCALE_UP': 'bg-purple-100 text-purple-800',
      'MATURE': 'bg-gray-100 text-gray-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'SUSPENDED': 'bg-red-100 text-red-800',
      'ARCHIVED': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleViewVenture = (ventureId: string) => {
    router.push(`/dashboard/ventures/${ventureId}`)
  }

  // Filter ventures based on search and filters
  const filteredVentures = ventures.filter(venture => {
    const matchesSearch = venture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venture.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venture.sector.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || venture.status === statusFilter
    const matchesStage = stageFilter === "all" || venture.stage === stageFilter
    const matchesSector = sectorFilter === "all" || venture.sector.toLowerCase() === sectorFilter.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesStage && matchesSector
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ventures...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventures</h1>
          <p className="text-gray-600 mt-1">Manage and track all ventures in the pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/venture-intake">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Venture
            </Button>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Database Connection Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && ventures.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Ventures Found</h3>
            <p className="text-muted-foreground mb-6">
              Start building your portfolio by adding your first venture to the pipeline.
            </p>
            <Button onClick={() => window.location.href = '/dashboard/venture-intake'}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Venture
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards - Only show when we have data */}
      {!loading && !error && ventures.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Ventures</p>
                  <p className="text-2xl font-bold">{ventures.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(ventures.reduce((sum, v) => sum + (v.fundingAmount || 0), 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Team Members</p>
                  <p className="text-2xl font-bold">
                    {ventures.reduce((sum, v) => sum + (v.teamSize || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg GEDSI Score</p>
                  <p className="text-2xl font-bold">
                    {ventures.length > 0 ? Math.round(ventures.reduce((sum, v) => sum + (v.gedsiScore || 0), 0) / ventures.length) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Ventures</CardTitle>
          <CardDescription>Search and filter ventures by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ventures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="IDEA">Idea</SelectItem>
                <SelectItem value="VALIDATION">Validation</SelectItem>
                <SelectItem value="EARLY_GROWTH">Early Growth</SelectItem>
                <SelectItem value="SCALE_UP">Scale Up</SelectItem>
                <SelectItem value="MATURE">Mature</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="cleantech">CleanTech</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ventures Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Ventures ({filteredVentures.length})</CardTitle>
          <CardDescription>Click on any venture to view detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venture</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Funding</TableHead>
                  <TableHead>GEDSI Score</TableHead>
                  <TableHead>Team Size</TableHead>
                  <TableHead>Founded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentures.map((venture) => (
                  <TableRow 
                    key={venture.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleViewVenture(venture.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{venture.name}</p>
                          <p className="text-sm text-gray-500">{venture.sector}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStageColor(venture.stage)}>
                        {venture.stage.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(venture.status)}>
                        {venture.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{venture.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(venture.fundingAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              venture.gedsiScore >= 80 ? 'bg-green-500' : 
                              venture.gedsiScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${venture.gedsiScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{venture.gedsiScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{venture.teamSize}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{venture.foundedYear}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleViewVenture(venture.id)
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Venture
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredVentures.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No ventures found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
