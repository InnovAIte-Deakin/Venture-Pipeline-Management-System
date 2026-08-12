"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Heart, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Users,
  Target,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  GraduationCap,
  Briefcase,
  Leaf,
  RefreshCw,
  TrendingUp,
  Award,
  Lightbulb,
  Shield,
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  Sparkles,
  LineChart,
  PieChart,
  BarChart,
  ArrowRight,
  ExternalLink
} from "lucide-react"
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart as RechartsPieChart, Cell, BarChart as RechartsBarChart, Bar } from "recharts"

interface SocialImpactMetric {
  id: string
  company: string
  metric: string
  category: string
  value: number
  unit: string
  target: number
  status: "on_track" | "behind" | "ahead" | "critical"
  trend: "up" | "down" | "stable"
  lastUpdate: string
}

interface Venture {
  id: string
  name: string
  sector: string
  location: string
  stage: string
  status: string
  fundingRaised: number | null
  lastValuation: number | null
  revenue: number | null
  teamSize: number | null
  foundingYear: number | null
  inclusionFocus: string | null
  founderTypes: string
  gedsiMetrics: GEDSIMetric[]
  createdAt: string
  updatedAt: string
  // Calculated fields from centralized service
  gedsiScore?: number | null
  socialImpactScore?: number | null
  gedsiComplianceRate?: number | null
  totalBeneficiaries?: number | null
  jobsCreated?: number | null
  womenEmpowered?: number | null
  disabilityInclusive?: number | null
  youthEngaged?: number | null
  calculatedAt?: string | null
}

interface GEDSIMetric {
  id: string
  ventureId: string
  metricCode: string
  metricName: string
  category: 'GENDER' | 'DISABILITY' | 'SOCIAL_INCLUSION' | 'CROSS_CUTTING'
  currentValue: number
  targetValue: number
  unit: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'COMPLETED'
  verificationDate: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

interface SocialImpactData {
  totalBeneficiaries: number
  jobsCreated: number
  communitiesServed: number
  womenEmpowered: number
  disabilityInclusive: number
  youthEngaged: number
}


const categories = [
  "Workforce",
  "Community", 
  "Health",
  "Education",
  "Financial",
  "Environment"
]

export default function SocialImpactPage() {
  const [ventures, setVentures] = useState<Venture[]>([])
  const [gedsiMetrics, setGedsiMetrics] = useState<GEDSIMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    fetchSocialImpactData()
  }, [])

  const fetchSocialImpactData = async () => {
    try {
      setLoading(true)
      
      // Fetch ventures with GEDSI metrics
      const venturesResponse = await fetch('/api/ventures?limit=100')
      if (venturesResponse.ok) {
        const data = await venturesResponse.json()
        const ventureData = data.ventures || []
        setVentures(ventureData)
        
        // Extract all GEDSI metrics
        const allGedsiMetrics: GEDSIMetric[] = []
        ventureData.forEach((venture: Venture) => {
          if (venture.gedsiMetrics && venture.gedsiMetrics.length > 0) {
            allGedsiMetrics.push(...venture.gedsiMetrics)
          }
        })
        setGedsiMetrics(allGedsiMetrics)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching social impact data:', error)
      setLoading(false)
    }
  }

  // Use centralized calculations from database
  const socialImpactData = useMemo((): SocialImpactData => {
    // Sum up calculated values from all ventures
    const totalBeneficiaries = ventures.reduce((sum, v) => sum + (v.totalBeneficiaries || 0), 0)
    const jobsCreated = ventures.reduce((sum, v) => sum + (v.jobsCreated || 0), 0)
    const womenEmpowered = ventures.reduce((sum, v) => sum + (v.womenEmpowered || 0), 0)
    const disabilityInclusive = ventures.reduce((sum, v) => sum + (v.disabilityInclusive || 0), 0)
    const youthEngaged = ventures.reduce((sum, v) => sum + (v.youthEngaged || 0), 0)
    
    // Calculate communities served based on unique locations
    const uniqueLocations = new Set(ventures.map(v => v.location.split(',')[0])).size
    const communitiesServed = uniqueLocations * 2 + ventures.filter(v => 
      v.sector === 'Agriculture' || v.sector === 'HealthTech'
    ).length * 3
    
    return {
      totalBeneficiaries,
      jobsCreated,
      communitiesServed,
      womenEmpowered,
      disabilityInclusive,
      youthEngaged
    }
  }, [ventures])

  const filteredVentures = ventures.filter(venture =>
    venture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venture.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (venture.inclusionFocus && venture.inclusionFocus.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on_track": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "ahead": return <ArrowUpRight className="h-4 w-4 text-blue-500" />
      case "behind": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on_track": return <Badge variant="default" className="bg-green-100 text-green-800">On Track</Badge>
      case "ahead": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Ahead</Badge>
      case "behind": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Behind</Badge>
      case "critical": return <Badge variant="destructive">Critical</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "down": return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case "stable": return <Activity className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Workforce": return <Users className="h-4 w-4" />
      case "Community": return <Globe className="h-4 w-4" />
      case "Health": return <Heart className="h-4 w-4" />
      case "Education": return <GraduationCap className="h-4 w-4" />
      case "Financial": return <Briefcase className="h-4 w-4" />
      case "Environment": return <Leaf className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Social Impact Dashboard
          </h1>
          <p className="text-muted-foreground">
            Measuring social outcomes, GEDSI impact, and community engagement across portfolio ventures
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => fetchSocialImpactData()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="mr-2 h-4 w-4" />
            Track Impact
        </Button>
        </div>
      </div>

      {/* Enhanced Social Impact Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total Beneficiaries</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{socialImpactData.totalBeneficiaries.toLocaleString()}</div>
            <p className="text-xs text-purple-600">
              People directly impacted by portfolio
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Jobs Created</CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{socialImpactData.jobsCreated}</div>
            <p className="text-xs text-green-600">
              Quality employment opportunities
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Communities Served</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{socialImpactData.communitiesServed}</div>
            <p className="text-xs text-blue-600">
              Communities with active programs
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Women Empowered</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{socialImpactData.womenEmpowered}</div>
            <p className="text-xs text-orange-600">
              Through leadership & programs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Content Tabs */}
      <Tabs defaultValue="impact-overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="impact-overview">Impact Overview</TabsTrigger>
          <TabsTrigger value="gedsi-metrics">GEDSI Metrics</TabsTrigger>
          <TabsTrigger value="venture-impact">Venture Impact</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="impact-overview" className="space-y-4">
          {/* Key Impact Highlights */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Key Social Impact Highlights
                </span>
              </CardTitle>
              <CardDescription>Notable achievements across the portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-white/80 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserCheck className="h-5 w-5 text-pink-600" />
                    <span className="font-medium text-pink-800">Gender Impact</span>
                  </div>
                  <div className="text-2xl font-bold text-pink-700">{socialImpactData.womenEmpowered}</div>
                  <p className="text-sm text-pink-600">Women empowered through programs</p>
                </div>

                <div className="p-4 bg-white/80 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Disability Inclusion</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{socialImpactData.disabilityInclusive}</div>
                  <p className="text-sm text-blue-600">People with disabilities included</p>
                </div>

                <div className="p-4 bg-white/80 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Youth Engagement</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{socialImpactData.youthEngaged}</div>
                  <p className="text-sm text-green-600">Young people engaged</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector Impact Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Impact by Sector
                </CardTitle>
                <CardDescription>Social impact distribution across venture sectors</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(ventures.map(v => v.sector))).map((sector) => {
                    const sectorVentures = ventures.filter(v => v.sector === sector)
                    const sectorBeneficiaries = sectorVentures.reduce((sum, v) => {
                      const funding = v.fundingRaised || 100000
                      const teamSize = v.teamSize || 5
                      switch (v.sector) {
                        case 'HealthTech': return sum + Math.floor(funding / 50) + (teamSize * 200)
                        case 'FinTech': return sum + Math.floor(funding / 25) + (teamSize * 300)
                        case 'EdTech': return sum + Math.floor(funding / 100) + (teamSize * 150)
                        case 'Agriculture': return sum + Math.floor(funding / 200) + (teamSize * 100)
                        default: return sum + Math.floor(funding / 150) + (teamSize * 50)
                      }
                    }, 0)
                    
                    return (
                      <div key={sector} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">{sector}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{sectorBeneficiaries.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{sectorVentures.length} ventures</div>
                        </div>
                      </div>
                    )
                  })}
                          </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  GEDSI Category Progress
                </CardTitle>
                <CardDescription>Progress across GEDSI categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING'].map((category) => {
                    const categoryMetrics = gedsiMetrics.filter(m => m.category === category)
                    const completedMetrics = categoryMetrics.filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED')
                    const progress = categoryMetrics.length > 0 ? (completedMetrics.length / categoryMetrics.length) * 100 : 0
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{category.replace('_', ' ')}</span>
                          <span>{completedMetrics.length}/{categoryMetrics.length}</span>
                          </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {progress.toFixed(0)}% completed
                          </div>
                          </div>
                    )
                  })}
                </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="gedsi-metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                GEDSI Metrics Tracking
              </CardTitle>
              <CardDescription>Gender Equality, Disability, and Social Inclusion metrics across portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gedsiMetrics.length === 0 ? (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No GEDSI metrics tracked yet. Start tracking to measure social impact.</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add GEDSI Metric
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gedsiMetrics.map((metric) => (
                      <div key={metric.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Badge 
                              className={`${
                                metric.category === 'GENDER' ? 'bg-pink-100 text-pink-800' :
                                metric.category === 'DISABILITY' ? 'bg-blue-100 text-blue-800' :
                                metric.category === 'SOCIAL_INCLUSION' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {metric.category.replace('_', ' ')}
                            </Badge>
                            <span className="font-medium">{metric.metricName}</span>
                          </div>
                          <Badge 
                            className={`${
                              metric.status === 'VERIFIED' || metric.status === 'COMPLETED' ? 'bg-green-600' :
                              metric.status === 'IN_PROGRESS' ? 'bg-yellow-600' : 'bg-gray-600'
                            } text-white`}
                          >
                            {metric.status.replace('_', ' ')}
                          </Badge>
                  </div>
                  
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Value</p>
                            <p className="font-semibold">{metric.currentValue} {metric.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Target Value</p>
                            <p className="font-semibold">{metric.targetValue} {metric.unit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={(metric.currentValue / metric.targetValue) * 100} className="flex-1 h-2" />
                              <span className="text-sm font-medium">
                                {((metric.currentValue / metric.targetValue) * 100).toFixed(0)}%
                              </span>
                    </div>
                    </div>
                  </div>
                  
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Metric Code: {metric.metricCode}</span>
                          <span>Venture: {ventures.find(v => v.id === metric.ventureId)?.name || 'Unknown'}</span>
                    </div>
                    </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venture-impact" className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Ventures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by venture name, sector, or inclusion focus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Venture Impact Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVentures.map((venture) => {
              const founderTypes = (() => {
                try {
                  return JSON.parse(venture.founderTypes || '[]')
                } catch {
                  return []
                }
              })()
              
              const ventureMetrics = gedsiMetrics.filter(m => m.ventureId === venture.id)
              const completedMetrics = ventureMetrics.filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED').length
              
              // Calculate beneficiaries for this venture
              const funding = venture.fundingRaised || 100000
              const teamSize = venture.teamSize || 5
              let beneficiaries = 0
              
              switch (venture.sector) {
                case 'HealthTech': beneficiaries = Math.floor(funding / 50) + (teamSize * 200); break
                case 'FinTech': beneficiaries = Math.floor(funding / 25) + (teamSize * 300); break
                case 'EdTech': beneficiaries = Math.floor(funding / 100) + (teamSize * 150); break
                case 'Agriculture': beneficiaries = Math.floor(funding / 200) + (teamSize * 100); break
                default: beneficiaries = Math.floor(funding / 150) + (teamSize * 50)
              }
              
              return (
                <Card key={venture.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{venture.name}</CardTitle>
                      <Badge variant="outline">{venture.sector}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {venture.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {venture.inclusionFocus && (
                        <div className="p-2 bg-purple-50 rounded">
                          <p className="text-sm font-medium text-purple-800">Inclusion Focus</p>
                          <p className="text-xs text-purple-600">{venture.inclusionFocus}</p>
                    </div>
                      )}
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-sm font-semibold text-blue-600">{beneficiaries.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Beneficiaries</div>
                  </div>
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-sm font-semibold text-green-600">{ventureMetrics.length}</div>
                          <div className="text-xs text-muted-foreground">GEDSI Metrics</div>
                    </div>
                        <div className="p-2 bg-orange-50 rounded">
                          <div className="text-sm font-semibold text-orange-600">{completedMetrics}</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>
                  
                      {founderTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {founderTypes.map((type: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Team: {venture.teamSize || 'N/A'}</span>
                        <span>Stage: {venture.stage}</span>
                </div>
              </div>
            </CardContent>
          </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>Portfolio Social Performance</CardTitle>
                <CardDescription>Overall social impact performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">GEDSI Completion Rate</span>
                    <span className="text-2xl font-semibold">
                      {gedsiMetrics.length > 0 ? 
                        ((gedsiMetrics.filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED').length / gedsiMetrics.length) * 100).toFixed(0) 
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={gedsiMetrics.length > 0 ? 
                      (gedsiMetrics.filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED').length / gedsiMetrics.length) * 100 
                      : 0} 
                    className="h-2" 
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Inclusive Ventures</span>
                    <span className="text-2xl font-semibold">
                      {ventures.filter(v => v.inclusionFocus).length}/{ventures.length}
                    </span>
                  </div>
                  <Progress 
                    value={(ventures.filter(v => v.inclusionFocus).length / Math.max(ventures.length, 1)) * 100} 
                    className="h-2" 
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Average Impact per Venture</span>
                    <span className="text-2xl font-semibold">
                      {Math.floor(socialImpactData.totalBeneficiaries / Math.max(ventures.length, 1)).toLocaleString()}
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Impact Drivers</CardTitle>
                <CardDescription>Ventures with highest social impact scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ventures
                    .map(venture => {
                      const funding = venture.fundingRaised || 100000
                      const teamSize = venture.teamSize || 5
                      let beneficiaries = 0
                      
                      switch (venture.sector) {
                        case 'HealthTech': beneficiaries = Math.floor(funding / 50) + (teamSize * 200); break
                        case 'FinTech': beneficiaries = Math.floor(funding / 25) + (teamSize * 300); break
                        case 'EdTech': beneficiaries = Math.floor(funding / 100) + (teamSize * 150); break
                        case 'Agriculture': beneficiaries = Math.floor(funding / 200) + (teamSize * 100); break
                        default: beneficiaries = Math.floor(funding / 150) + (teamSize * 50)
                      }
                      
                      return {
                        ...venture,
                        beneficiaries,
                        impactScore: beneficiaries + (venture.gedsiMetrics?.filter(m => m.status === 'VERIFIED' || m.status === 'COMPLETED').length || 0) * 100
                      }
                    })
                    .sort((a, b) => b.impactScore - a.impactScore)
                    .slice(0, 5)
                    .map((venture, index) => (
                      <div key={venture.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{venture.name}</div>
                            <div className="text-sm text-muted-foreground">{venture.sector}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-purple-600">{venture.beneficiaries.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Beneficiaries</div>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 