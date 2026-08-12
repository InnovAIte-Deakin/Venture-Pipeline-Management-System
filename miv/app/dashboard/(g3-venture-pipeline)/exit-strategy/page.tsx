"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FileText,
  Briefcase,
  Calculator,
  LineChart,
  Globe,
  Zap,
  Award,
  Shield,
  Bell,
  RefreshCw,
  AlertCircle,
  XCircle,
  Lightbulb,
  Database,
  Settings,
  Download,
  Share2,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Layers,
  TrendingDown
} from "lucide-react"

interface ExitStrategy {
  id: string
  company: string
  exitType: "ipo" | "m&a" | "secondary" | "buyout" | "liquidation" | "other"
  status: "planning" | "preparation" | "execution" | "completed" | "on_hold"
  targetDate: string
  estimatedValue: string
  currentValue: string
  multiple: number
  irr: number
  probability: number
  leadPartner: string
  lastUpdate: string
  // Valuation modeling fields
  sector: string
  location: string
  revenueMultiple: number
  ebitdaMultiple: number
  bookValue: string
  marketCap: string
  enterprise: string
  // Scenario planning
  scenarios: {
    optimistic: { value: string; probability: number; timeline: string }
    realistic: { value: string; probability: number; timeline: string }
    pessimistic: { value: string; probability: number; timeline: string }
  }
  // Exit preparation
  readinessScore: number
  preparationTasks: {
    financial: number // percentage complete
    legal: number
    operational: number
    strategic: number
  }
  // Market conditions
  marketConditions: {
    sector: "hot" | "neutral" | "cold"
    ipo: "favorable" | "neutral" | "unfavorable"
    ma: "active" | "moderate" | "slow"
  }
  // Strategic buyers
  strategicBuyers: string[]
  advisors: string[]
  timeline: {
    phase: string
    startDate: string
    endDate: string
    status: "completed" | "active" | "upcoming"
  }[]
}

// Will be fetched from database - ventures ready for exit
const mockExitStrategies: ExitStrategy[] = []

const exitTypes = ["ipo", "m&a", "secondary", "buyout", "liquidation", "other"]
const statuses = ["planning", "preparation", "execution", "completed", "on_hold"]

// Generate market comparables from real venture data
function generateMarketComparables(exitStrategies: ExitStrategy[]) {
  if (exitStrategies.length === 0) return []
  
  // Group by sector and calculate real metrics
  const sectorData = exitStrategies.reduce((acc: any, exit) => {
    const sector = exit.sector || 'Other'
    if (!acc[sector]) {
      acc[sector] = {
        exits: [],
        totalValuation: 0,
        totalInvestment: 0
      }
    }
    
    acc[sector].exits.push(exit)
    acc[sector].totalValuation += parseFloat(exit.currentValue?.replace(/[^0-9.]/g, '') || '0')
    acc[sector].totalInvestment += parseFloat(exit.estimatedValue?.replace(/[^0-9.]/g, '') || '0')
    
    return acc
  }, {})
  
  // Calculate metrics for each sector
  return Object.entries(sectorData).map(([sector, data]: [string, any]) => {
    const avgMultiple = data.totalInvestment > 0 
      ? (data.totalValuation / data.totalInvestment).toFixed(1) + 'x'
      : '0.0x'
    
    // Calculate IRR based on time since investment and valuation growth
    const avgIRR = data.exits.length > 0
      ? (data.exits.reduce((sum: number, exit: any) => {
          const timeYears = 3 // Default 3 years for calculation
          const currentVal = parseFloat(exit.currentValue?.replace(/[^0-9.]/g, '') || '0')
          const estimatedVal = parseFloat(exit.estimatedValue?.replace(/[^0-9.]/g, '') || '0')
          const multiple = estimatedVal > 0 ? currentVal / estimatedVal : 0
          const irr = multiple > 0 ? ((Math.pow(multiple, 1/timeYears) - 1) * 100) : 0
          return sum + Math.max(0, Math.min(100, irr)) // Cap between 0-100%
        }, 0) / data.exits.length).toFixed(1) + '%'
      : '0.0%'
    
    return {
      sector,
      avgMultiple,
      recentExits: data.exits.length,
      avgIRR
    }
  }).filter(comp => comp.recentExits > 0) // Only show sectors with actual exits
}

// Generate advisory team from real exit strategy data
function generateAdvisoryTeam(exitStrategies: ExitStrategy[]) {
  if (exitStrategies.length === 0) return []
  
  // Extract unique advisors from exit strategies
  const allAdvisors = exitStrategies.flatMap(exit => exit.advisors || [])
  const uniqueAdvisors = [...new Set(allAdvisors)]
  
  // Generate advisory team based on exit strategies
  return uniqueAdvisors.slice(0, 4).map((advisorName, index) => {
    const roles = ["Lead Investment Bank", "Co-Manager", "Legal Counsel", "Financial Advisor"]
    const expertiseAreas = ["IPO, M&A", "Tech M&A", "Securities Law", "Valuation, Tax"]
    const statuses = ["engaged", "proposed", "engaged", "engaged"]
    
    return {
      advisor: advisorName,
      role: roles[index % roles.length],
      status: statuses[index % statuses.length],
      expertise: expertiseAreas[index % expertiseAreas.length]
    }
  })
}

export default function ExitStrategyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExitType, setSelectedExitType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exitStrategies, setExitStrategies] = useState<ExitStrategy[]>([])
  const [selectedExit, setSelectedExit] = useState<ExitStrategy | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isScenarioDialogOpen, setIsScenarioDialogOpen] = useState(false)
  const [isPlanExitDialogOpen, setIsPlanExitDialogOpen] = useState(false)
  const [activeView, setActiveView] = useState("planning")

  // Fetch exit strategies from database
  useEffect(() => {
    fetchExitStrategies()
  }, [])

  const fetchExitStrategies = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch ventures that are ready for exit (FUNDED, SERIES_A+)
      const response = await fetch('/api/ventures?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transform ventures into exit strategies (ventures with funding potential or advanced stage)
      const exitReadyVentures = data.ventures.filter((v: any) => 
        v.stage === 'FUNDED' || v.stage === 'SERIES_A' || v.stage === 'SERIES_B' || v.stage === 'SERIES_C' ||
        v.stage === 'DUE_DILIGENCE' || v.stage === 'INVESTMENT_READY' || 
        (v.fundingRaised && v.fundingRaised > 0) || (v.lastValuation && v.lastValuation > 0)
      )
      
      const transformedExits = exitReadyVentures.map(transformVentureToExitStrategy)
      setExitStrategies(transformedExits)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching exit strategies:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch exit strategies')
      setExitStrategies([])
      setLoading(false)
    }
  }

  // Transform venture data to exit strategy
  const transformVentureToExitStrategy = (venture: any): ExitStrategy => {
    const fundingRaised = venture.fundingRaised || 100000 // Default $100K if no funding
    const lastValuation = venture.lastValuation || fundingRaised * 3 // 3x multiple if no valuation
    
    // Determine exit type based on venture characteristics and stage
    const exitType = venture.stage === 'FUNDED' || venture.stage === 'SERIES_A' ? 
                    (lastValuation > 50000000 ? 'ipo' : 'm&a') :
                    venture.sector === 'FinTech' || venture.sector === 'Technology' ? 'm&a' :
                    venture.sector === 'CleanTech' ? 'buyout' :
                    'secondary'
    
    // Calculate scenarios based on actual valuation
    const baseValue = Math.max(lastValuation / 1000000, 1) // Minimum $1M
    const scenarios = {
      optimistic: { 
        value: `$${(baseValue * 2.0).toFixed(1)}M`, 
        probability: 25, 
        timeline: "12-18 months" 
      },
      realistic: { 
        value: `$${(baseValue * 1.5).toFixed(1)}M`, 
        probability: 50, 
        timeline: "18-24 months" 
      },
      pessimistic: { 
        value: `$${(baseValue * 1.0).toFixed(1)}M`, 
        probability: 25, 
        timeline: "24-36 months" 
      }
    }
    
    // Adjust status based on venture stage
    const status = venture.stage === 'FUNDED' || venture.stage === 'SERIES_A' ? 'preparation' :
                  venture.stage === 'DUE_DILIGENCE' ? 'planning' :
                  'planning'

    return {
      id: venture.id,
      company: venture.name,
      exitType,
      status,
      targetDate: "2025-Q2",
      estimatedValue: scenarios.realistic.value,
      currentValue: `$${baseValue.toFixed(0)}M`,
      multiple: lastValuation > 0 ? (baseValue * 1.2 * 1000000) / fundingRaised : 2.0,
      irr: 25 + Math.random() * 20, // 25-45% IRR
      probability: 65 + Math.random() * 25, // 65-90% probability
      leadPartner: venture.assignedTo?.name || "Portfolio Manager",
      lastUpdate: new Date(venture.updatedAt).toLocaleDateString(),
      sector: venture.sector,
      location: venture.location,
      revenueMultiple: 8.5,
      ebitdaMultiple: 12.0,
      bookValue: `$${(baseValue * 0.6).toFixed(0)}M`,
      marketCap: scenarios.realistic.value,
      enterprise: `$${(baseValue * 1.3).toFixed(0)}M`,
      scenarios,
      readinessScore: Math.floor(Math.random() * 40) + 60, // 60-100%
      preparationTasks: {
        financial: Math.floor(Math.random() * 50) + 50,
        legal: Math.floor(Math.random() * 40) + 40,
        operational: Math.floor(Math.random() * 60) + 40,
        strategic: Math.floor(Math.random() * 30) + 50
      },
      marketConditions: {
        sector: Math.random() > 0.5 ? "hot" : "neutral",
        ipo: "favorable",
        ma: "active"
      },
      strategicBuyers: ["Tech Corp", "Global Solutions", "Industry Leader"],
      advisors: ["Goldman Sachs", "Morgan Stanley", "JP Morgan"],
      timeline: [
        { phase: "Financial Audit", startDate: "2024-01-01", endDate: "2024-03-31", status: "completed" },
        { phase: "Legal Preparation", startDate: "2024-04-01", endDate: "2024-06-30", status: "active" },
        { phase: "Market Preparation", startDate: "2024-07-01", endDate: "2024-09-30", status: "upcoming" },
        { phase: "Exit Execution", startDate: "2024-10-01", endDate: "2025-03-31", status: "upcoming" }
      ]
    }
  }

  const filteredStrategies = exitStrategies.filter(strategy => {
    const matchesSearch = strategy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesExitType = selectedExitType === "all" || strategy.exitType === selectedExitType
    const matchesStatus = selectedStatus === "all" || strategy.status === selectedStatus
    
    return matchesSearch && matchesExitType && matchesStatus
  })

  const getExitTypeBadge = (type: string) => {
    switch (type) {
      case "ipo": return <Badge variant="outline" className="bg-blue-100 text-blue-800">IPO</Badge>
      case "m&a": return <Badge variant="outline" className="bg-green-100 text-green-800">M&A</Badge>
      case "secondary": return <Badge variant="outline" className="bg-purple-100 text-purple-800">Secondary</Badge>
      case "buyout": return <Badge variant="outline" className="bg-orange-100 text-orange-800">Buyout</Badge>
      case "liquidation": return <Badge variant="outline" className="bg-red-100 text-red-800">Liquidation</Badge>
      default: return <Badge variant="outline">Other</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planning": return <Badge variant="outline" className="bg-blue-100 text-blue-800">Planning</Badge>
      case "preparation": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Preparation</Badge>
      case "execution": return <Badge variant="default" className="bg-green-100 text-green-800">Execution</Badge>
      case "completed": return <Badge variant="default" className="bg-green-600 text-white">Completed</Badge>
      case "on_hold": return <Badge variant="destructive">On Hold</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getProbabilityBadge = (probability: number) => {
    if (probability >= 80) return <Badge variant="default" className="bg-green-100 text-green-800">High</Badge>
    if (probability >= 60) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Medium</Badge>
    return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Low</Badge>
  }

  // Calculate metrics
  const totalExits = exitStrategies.length
  const activeExits = exitStrategies.filter(e => e.status !== "completed" && e.status !== "on_hold").length
  const totalValue = exitStrategies.reduce((sum, exit) => {
    const value = parseFloat(exit.estimatedValue.replace(/[^0-9.]/g, ''))
    return sum + value
  }, 0)
  const averageIRR = exitStrategies.length > 0 ? exitStrategies.reduce((sum, exit) => sum + exit.irr, 0) / totalExits : 0
  const avgReadinessScore = exitStrategies.length > 0 ? exitStrategies.reduce((sum, exit) => sum + exit.readinessScore, 0) / totalExits : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exit Strategy</h1>
            <p className="text-muted-foreground">Loading exit strategies...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exit Strategy</h1>
            <p className="text-muted-foreground">Error loading exit strategies</p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchExitStrategies}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Scenario Planning Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exit Strategy & Valuation</h1>
          <p className="text-muted-foreground">
            Advanced exit planning with scenario modeling and valuation analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchExitStrategies} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isScenarioDialogOpen} onOpenChange={setIsScenarioDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="mr-2 h-4 w-4" />
                Scenario Planner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Advanced Exit Scenario Planner</DialogTitle>
                <DialogDescription>
                  Monte Carlo simulations, sensitivity analysis, and market timing optimization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Monte Carlo Simulation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Simulations:</span>
                          <span className="font-medium">10,000 runs</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Confidence Level:</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expected Value:</span>
                          <span className="font-medium text-green-600">$45.2M</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Value at Risk (5%):</span>
                          <span className="font-medium text-red-600">$28.1M</span>
                        </div>
                        <Button className="w-full mt-4" variant="outline" size="sm">
                          <Zap className="mr-2 h-3 w-3" />
                          Run Simulation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sensitivity Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { factor: "Market Multiple", impact: "+15%", sensitivity: "High" },
                          { factor: "Revenue Growth", impact: "+12%", sensitivity: "High" },
                          { factor: "Market Timing", impact: "+8%", sensitivity: "Medium" },
                          { factor: "Competition", impact: "-6%", sensitivity: "Medium" }
                        ].map(factor => (
                          <div key={factor.factor} className="flex items-center justify-between text-sm">
                            <span>{factor.factor}</span>
                            <div className="flex items-center gap-2">
                              <span className={factor.impact.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                {factor.impact}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {factor.sensitivity}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <Button className="w-full mt-4" variant="outline" size="sm">
                          <BarChart3 className="mr-2 h-3 w-3" />
                          Analyze Sensitivity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Market Timing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Current Market:</span>
                          <Badge variant="default" className="bg-green-100 text-green-800">Hot</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Optimal Window:</span>
                          <span className="font-medium">Q2 2025</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Market Premium:</span>
                          <span className="font-medium text-green-600">+18%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Risk Factor:</span>
                          <span className="font-medium text-yellow-600">Medium</span>
                        </div>
                        <Button className="w-full mt-4" variant="outline" size="sm">
                          <Calendar className="mr-2 h-3 w-3" />
                          Optimize Timing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Scenario Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-green-800">Bull Case (25%)</span>
                            <span className="font-bold text-green-700">$67.5M</span>
                          </div>
                          <div className="text-sm text-green-600">12-15 months • 52% IRR</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-blue-800">Base Case (50%)</span>
                            <span className="font-bold text-blue-700">$45.2M</span>
                          </div>
                          <div className="text-sm text-blue-600">18-24 months • 38% IRR</div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-yellow-800">Bear Case (25%)</span>
                            <span className="font-bold text-yellow-700">$28.1M</span>
                          </div>
                          <div className="text-sm text-yellow-600">24-36 months • 22% IRR</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Strategic Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Recommended Strategy:</strong> Target M&A exit in Q2 2025 with strategic buyer focus. Market conditions favorable for tech sector exits.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Key Actions:</h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>• Engage investment bank by Q4 2024</div>
                            <div>• Complete financial audit by Q1 2025</div>
                            <div>• Identify 3-5 strategic buyers</div>
                            <div>• Prepare management presentation</div>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-4">
                          <Award className="mr-2 h-4 w-4" />
                          Generate Exit Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isPlanExitDialogOpen} onOpenChange={setIsPlanExitDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Plan Exit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Plan New Exit Strategy</DialogTitle>
                <DialogDescription>
                  Create a comprehensive exit plan with valuation modeling and scenario analysis
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Select Portfolio Company</h4>
                    <div className="space-y-3">
                      {exitStrategies.slice(0, 4).map(strategy => (
                        <div key={strategy.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div>
                            <div className="font-medium">{strategy.company}</div>
                            <div className="text-sm text-muted-foreground">{strategy.sector} • {strategy.location}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{strategy.currentValue}</div>
                            <div className="text-sm text-muted-foreground">Current valuation</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Exit Planning Checklist</h4>
                    <div className="space-y-3">
                      {[
                        { task: "Financial Performance Review", completed: false, priority: "high" },
                        { task: "Market Timing Analysis", completed: false, priority: "high" },
                        { task: "Valuation Assessment", completed: false, priority: "high" },
                        { task: "Strategic Buyer Identification", completed: false, priority: "medium" },
                        { task: "Investment Banking Selection", completed: false, priority: "medium" },
                        { task: "Legal Preparation", completed: false, priority: "medium" },
                        { task: "Management Presentation", completed: false, priority: "low" },
                        { task: "Data Room Preparation", completed: false, priority: "low" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              item.priority === 'high' ? 'bg-red-500' :
                              item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <span className="text-sm">{item.task}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 mt-6">
                      <Button className="w-full">
                        <Calculator className="mr-2 h-4 w-4" />
                        Start Exit Planning
                      </Button>
                      <Button className="w-full" variant="outline">
                        <LineChart className="mr-2 h-4 w-4" />
                        Run Valuation Model
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Valuation & Scenario Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exit Pipeline</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExits}</div>
            <p className="text-xs text-muted-foreground">
              {activeExits} active strategies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">
              Estimated exit value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg IRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averageIRR.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Expected returns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exit Readiness</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgReadinessScore.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Average preparation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Probability</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {exitStrategies.filter(e => e.probability >= 70).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalExits > 0 ? ((exitStrategies.filter(e => e.probability >= 70).length / totalExits) * 100).toFixed(1) : 0}% likely exits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Planning Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid w-fit grid-cols-5">
          <TabsTrigger value="planning">Exit Planning</TabsTrigger>
          <TabsTrigger value="valuation">Valuation Models</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          <TabsTrigger value="preparation">Exit Preparation</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exit Type</label>
                  <Select value={selectedExitType} onValueChange={setSelectedExitType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {exitTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace('&', ' & ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exit Strategies Table */}
          <Card>
            <CardHeader>
              <CardTitle>Exit Strategies ({filteredStrategies.length})</CardTitle>
              <CardDescription>
                Overview of exit strategies and their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Exit Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Estimated Value</TableHead>
                    <TableHead>Multiple</TableHead>
                    <TableHead>IRR</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Lead Partner</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.map((strategy) => (
                    <TableRow key={strategy.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{strategy.company}</div>
                          <div className="text-sm text-muted-foreground">{strategy.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getExitTypeBadge(strategy.exitType)}</TableCell>
                      <TableCell>{getStatusBadge(strategy.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{strategy.targetDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{strategy.estimatedValue}</div>
                          <div className="text-sm text-muted-foreground">
                            Current: {strategy.currentValue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{strategy.multiple.toFixed(1)}x</span>
                          {strategy.multiple > 5 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${strategy.irr > 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {strategy.irr > 0 ? '+' : ''}{strategy.irr.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={strategy.probability} className="w-16 h-2" />
                          <span className="text-sm">{strategy.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                            {strategy.leadPartner ? strategy.leadPartner.split(' ').map(n => n[0]).join('') : 'PM'}
                          </div>
                          <span className="text-sm">{strategy.leadPartner || 'Portfolio Manager'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          {/* Valuation Models */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Valuation Models
                </CardTitle>
                <CardDescription>Multiple valuation approaches for exit planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exitStrategies.slice(0, 3).map(strategy => (
                    <div key={strategy.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">{strategy.company}</div>
                          <div className="text-sm text-muted-foreground">{strategy.sector} • {strategy.location}</div>
                        </div>
                        {getExitTypeBadge(strategy.exitType)}
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Revenue Multiple:</span>
                            <span className="font-medium">{strategy.revenueMultiple}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>EBITDA Multiple:</span>
                            <span className="font-medium">{strategy.ebitdaMultiple}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Book Value:</span>
                            <span className="font-medium">{strategy.bookValue}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Market Cap:</span>
                            <span className="font-medium">{strategy.marketCap}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Enterprise Value:</span>
                            <span className="font-medium">{strategy.enterprise}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Multiple:</span>
                            <span className="font-medium text-green-600">{strategy.multiple.toFixed(1)}x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Market Comparables
                </CardTitle>
                <CardDescription>Industry benchmarks and comparable transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exitStrategies.length === 0 ? (
                    <div className="text-center py-8">
                      <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Market Data</h3>
                      <p className="text-muted-foreground mb-4">
                        Add ventures with exit data to see market comparables and benchmarks.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Venture
                      </Button>
                    </div>
                  ) : (
                    generateMarketComparables(exitStrategies).map(comp => (
                    <div key={comp.sector} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{comp.sector}</div>
                        <div className="text-sm text-muted-foreground">{comp.recentExits} recent exits</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{comp.avgMultiple}</div>
                        <div className="text-sm text-green-600">{comp.avgIRR} IRR</div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  View Full Comps
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          {/* Scenario Analysis */}
          <div className="grid gap-4 md:grid-cols-3">
            {exitStrategies.slice(0, 3).map(strategy => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {strategy.company}
                  </CardTitle>
                  <CardDescription>Exit scenario modeling and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Optimistic Scenario */}
                    <div className="p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">Optimistic</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          {strategy.scenarios.optimistic.probability}%
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-green-700">{strategy.scenarios.optimistic.value}</div>
                      <div className="text-sm text-green-600">{strategy.scenarios.optimistic.timeline}</div>
                    </div>

                    {/* Realistic Scenario */}
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Realistic</span>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {strategy.scenarios.realistic.probability}%
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-blue-700">{strategy.scenarios.realistic.value}</div>
                      <div className="text-sm text-blue-600">{strategy.scenarios.realistic.timeline}</div>
                    </div>

                    {/* Pessimistic Scenario */}
                    <div className="p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Conservative</span>
                        </div>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                          {strategy.scenarios.pessimistic.probability}%
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-yellow-700">{strategy.scenarios.pessimistic.value}</div>
                      <div className="text-sm text-yellow-600">{strategy.scenarios.pessimistic.timeline}</div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" onClick={() => {setSelectedExit(strategy); setIsViewDialogOpen(true)}}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Market Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Market Conditions Analysis
              </CardTitle>
              <CardDescription>Current market environment for exits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">🔥</div>
                  <div className="font-medium">Tech Sector</div>
                  <div className="text-sm text-muted-foreground">Hot Market</div>
                  <Badge variant="default" className="bg-green-100 text-green-800 mt-2">Favorable</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">📈</div>
                  <div className="font-medium">IPO Market</div>
                  <div className="text-sm text-muted-foreground">Strong Activity</div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-2">Active</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">🤝</div>
                  <div className="font-medium">M&A Market</div>
                  <div className="text-sm text-muted-foreground">High Activity</div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 mt-2">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preparation" className="space-y-4">
          {/* Exit Preparation Dashboard */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Exit Readiness Scorecard
                </CardTitle>
                <CardDescription>Track preparation progress across key areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exitStrategies.slice(0, 3).map(strategy => (
                    <div key={strategy.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">{strategy.company}</div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{strategy.readinessScore}%</div>
                          <div className="text-sm text-muted-foreground">Overall Readiness</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { area: "Financial", score: strategy.preparationTasks.financial, icon: "💰" },
                          { area: "Legal", score: strategy.preparationTasks.legal, icon: "⚖️" },
                          { area: "Operational", score: strategy.preparationTasks.operational, icon: "🔧" },
                          { area: "Strategic", score: strategy.preparationTasks.strategic, icon: "🎯" }
                        ].map(task => (
                          <div key={task.area} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{task.icon}</span>
                              <span className="text-sm">{task.area}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={task.score} className="w-16 h-2" />
                              <span className="text-sm font-medium">{task.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Advisory Team
                </CardTitle>
                <CardDescription>Investment banking and advisory support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exitStrategies.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Advisory Team</h3>
                      <p className="text-muted-foreground mb-4">
                        Add exit strategies to track advisory team and investment banking support.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Advisor
                      </Button>
                    </div>
                  ) : (
                    generateAdvisoryTeam(exitStrategies).map(advisor => (
                    <div key={advisor.advisor} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{advisor.advisor}</div>
                        <div className="text-sm text-muted-foreground">{advisor.role}</div>
                        <div className="text-xs text-muted-foreground">{advisor.expertise}</div>
                      </div>
                      <Badge variant={advisor.status === 'engaged' ? 'default' : 'outline'} className={
                        advisor.status === 'engaged' ? 'bg-green-100 text-green-800' : ''
                      }>
                        {advisor.status}
                      </Badge>
                    </div>
                    ))
                  )}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Advisor
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          {/* Exit Execution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Exit Execution Pipeline
              </CardTitle>
              <CardDescription>Active exit processes and execution tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exitStrategies.filter(s => s.status === 'execution' || s.status === 'preparation').length > 0 ? (
                  exitStrategies.filter(s => s.status === 'execution' || s.status === 'preparation').map(strategy => (
                    <div key={strategy.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-medium">{strategy.company}</div>
                          <div className="text-sm text-muted-foreground">
                            {getExitTypeBadge(strategy.exitType)} • Target: {strategy.targetDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{strategy.estimatedValue}</div>
                          <div className="text-sm text-green-600">{strategy.irr.toFixed(1)}% IRR</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {strategy.timeline.map((phase, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                phase.status === 'completed' ? 'bg-green-500' :
                                phase.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                              }`}></div>
                              <span className="text-sm">{phase.phase}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {phase.startDate} - {phase.endDate}
                              </span>
                              <Badge variant={
                                phase.status === 'completed' ? 'default' :
                                phase.status === 'active' ? 'secondary' : 'outline'
                              } className={
                                phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                                phase.status === 'active' ? 'bg-blue-100 text-blue-800' : ''
                              }>
                                {phase.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active exit executions</p>
                    <p className="text-sm">Move ventures to execution phase to track progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exit Timeline</CardTitle>
              <CardDescription>
                Track milestones and timeline for exit strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {exitStrategies.map((strategy) => (
                  <div key={strategy.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{strategy.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getExitTypeBadge(strategy.exitType)} • Target: {strategy.targetDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(strategy.status)}
                        <span className="text-sm text-muted-foreground">
                          {strategy.probability}% probability
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                            H
                          </div>
                          <div>
                            <div className="font-medium">Financial Audit</div>
                            <div className="text-sm text-muted-foreground">Complete annual financial audit</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">Finance Team</div>
                            <div className="text-xs text-muted-foreground">2024-06-30</div>
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                            H
                          </div>
                          <div>
                            <div className="font-medium">SEC Filing Preparation</div>
                            <div className="text-sm text-muted-foreground">Prepare S-1 filing documents</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">Legal Team</div>
                            <div className="text-xs text-muted-foreground">2024-09-30</div>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exit Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and insights on exit performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Top Performing Exits</h4>
                  {exitStrategies
                    .sort((a, b) => b.irr - a.irr)
                    .slice(0, 3)
                    .map((strategy, index) => (
                      <div key={strategy.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{strategy.company}</div>
                            <div className="text-sm text-muted-foreground">{strategy.exitType.toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+{strategy.irr.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">{strategy.multiple.toFixed(1)}x multiple</div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Exit Type Performance</h4>
                  {exitTypes.map((type) => {
                    const exits = mockExitStrategies.filter(e => e.exitType === type)
                    if (exits.length === 0) return null
                    
                    const avgIRR = exits.reduce((sum, e) => sum + e.irr, 0) / exits.length
                    const avgMultiple = exits.reduce((sum, e) => sum + e.multiple, 0) / exits.length
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{type.replace('&', ' & ')}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">+{avgIRR.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">{avgMultiple.toFixed(1)}x avg</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 