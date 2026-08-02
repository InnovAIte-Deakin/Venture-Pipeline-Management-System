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
import { 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  DollarSign,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Download,
  Share2,
  Star,
  Building2,
  Zap,
  Heart,
  Globe,
  Award,
  Shield,
  Lightbulb,
  Sparkles,
  XCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  ArrowRight,
  X
} from "lucide-react"

interface InvestmentRound {
  id: string
  company: string
  roundType: string
  stage: string
  targetAmount: string
  raisedAmount: string
  closingDate: string
  status: "open" | "closing" | "closed" | "cancelled"
  leadInvestor: string
  participants: string[]
  valuation: string
  ownership: number
  documents: number
  lastUpdate: string
  // MIV-specific fields
  gedsiScore: number
  impactScore: number
  sustainabilityScore: number
  founderType: string[]
  inclusionFocus: string
  sustainabilityGoals: string[]
  aiInsights: {
    riskLevel: "low" | "medium" | "high"
    recommendation: string
    keyStrengths: string[]
    areasForImprovement: string[]
  }
  metrics: {
    jobsCreated: number
    communitiesServed: number
    womenLeadership: number
    disabilityInclusive: boolean
    carbonReduction: number
  }
  location: string
  sector: string
}

// Database venture interface (from API)
interface Venture {
  id: string
  name: string
  sector: string
  location: string
  stage: string
  status: string
  contactEmail: string
  pitchSummary?: string
  inclusionFocus?: string
  founderTypes: string // JSON string
  revenue?: number
  fundingRaised?: number
  lastValuation?: number
  gedsiGoals?: any
  aiAnalysis?: any
  createdAt: string
  updatedAt: string
  gedsiMetrics: any[]
  capitalActivities: any[]
  _count: {
    documents: number
    activities: number
    capitalActivities: number
  }
}

const mockInvestmentRounds: InvestmentRound[] = [
  {
    id: "ROUND-001",
    company: "TechFlow Solutions",
    roundType: "Series B",
    stage: "Growth",
    targetAmount: "$5.0M",
    raisedAmount: "$4.2M",
    closingDate: "2024-03-31",
    status: "closing",
    leadInvestor: "Sequoia Capital",
    participants: ["MIV Fund", "Andreessen Horowitz", "Accel"],
    valuation: "$25M",
    ownership: 15.5,
    documents: 12,
    lastUpdate: "2 hours ago",
    location: "Bangkok, Thailand",
    sector: "Technology",
    gedsiScore: 78,
    impactScore: 85,
    sustainabilityScore: 82,
    founderType: ["women-led", "youth-led"],
    inclusionFocus: "Digital solutions for underserved communities",
    sustainabilityGoals: ["Digital Inclusion", "Quality Jobs", "Innovation"],
    aiInsights: {
      riskLevel: "medium",
      recommendation: "Strong growth trajectory with good GEDSI alignment. Monitor execution closely.",
      keyStrengths: ["Female leadership", "Proven market traction", "Clear impact metrics"],
      areasForImprovement: ["Increase disability inclusion", "Expand rural reach"]
    },
    metrics: {
      jobsCreated: 145,
      communitiesServed: 23,
      womenLeadership: 60,
      disabilityInclusive: false,
      carbonReduction: 12.5
    }
  },
  {
    id: "ROUND-002",
    company: "GreenEnergy Innovations",
    roundType: "Series A",
    stage: "Early",
    targetAmount: "$2.5M",
    raisedAmount: "$2.5M",
    closingDate: "2024-02-15",
    status: "closed",
    leadInvestor: "MIV Fund",
    participants: ["Climate Fund", "Energy Ventures"],
    valuation: "$12M",
    ownership: 20.8,
    documents: 18,
    lastUpdate: "1 week ago",
    location: "Manila, Philippines",
    sector: "CleanTech",
    gedsiScore: 92,
    impactScore: 96,
    sustainabilityScore: 94,
    founderType: ["rural-focus", "indigenous-led"],
    inclusionFocus: "Clean energy access for rural indigenous communities",
    sustainabilityGoals: ["Climate Action", "Clean Energy", "Indigenous Rights"],
    aiInsights: {
      riskLevel: "low",
      recommendation: "Exceptional GEDSI performance and clear environmental impact. Ideal MIV investment.",
      keyStrengths: ["Indigenous leadership", "Environmental impact", "Community ownership model"],
      areasForImprovement: ["Scale operations", "Strengthen supply chain"]
    },
    metrics: {
      jobsCreated: 89,
      communitiesServed: 45,
      womenLeadership: 55,
      disabilityInclusive: true,
      carbonReduction: 450.2
    }
  },
  {
    id: "ROUND-003",
    company: "HealthTech Pro",
    roundType: "Seed",
    stage: "Seed",
    targetAmount: "$1.0M",
    raisedAmount: "$750K",
    closingDate: "2024-04-30",
    status: "open",
    leadInvestor: "Y Combinator",
    participants: ["MIV Fund", "Angel Investors"],
    valuation: "$5M",
    ownership: 15.0,
    documents: 8,
    lastUpdate: "3 days ago",
    location: "Ho Chi Minh City, Vietnam",
    sector: "Healthcare",
    gedsiScore: 88,
    impactScore: 91,
    sustainabilityScore: 75,
    founderType: ["disability-inclusive", "women-led"],
    inclusionFocus: "Accessible healthcare technology for people with disabilities",
    sustainabilityGoals: ["Health & Wellbeing", "Disability Rights", "Digital Health"],
    aiInsights: {
      riskLevel: "medium",
      recommendation: "Strong social impact focus with innovative accessibility features. Need to improve financial sustainability.",
      keyStrengths: ["Disability inclusion", "Healthcare innovation", "Strong team"],
      areasForImprovement: ["Revenue model", "Market expansion", "Partnerships"]
    },
    metrics: {
      jobsCreated: 32,
      communitiesServed: 18,
      womenLeadership: 70,
      disabilityInclusive: true,
      carbonReduction: 5.8
    }
  },
  {
    id: "ROUND-004",
    company: "FinTech Revolution",
    roundType: "Series C",
    stage: "Growth",
    targetAmount: "$10.0M",
    raisedAmount: "$8.5M",
    closingDate: "2024-01-20",
    status: "closed",
    leadInvestor: "Tiger Global",
    participants: ["MIV Fund", "SoftBank", "Insight Partners"],
    valuation: "$85M",
    ownership: 10.0,
    documents: 25,
    lastUpdate: "2 weeks ago",
    location: "Jakarta, Indonesia",
    sector: "FinTech",
    gedsiScore: 85,
    impactScore: 89,
    sustainabilityScore: 78,
    founderType: ["refugee-led", "youth-led"],
    inclusionFocus: "Financial inclusion for refugees and displaced populations",
    sustainabilityGoals: ["Financial Inclusion", "Refugee Support", "Economic Growth"],
    aiInsights: {
      riskLevel: "low",
      recommendation: "Excellent financial performance with strong social mission. Continue support for expansion.",
      keyStrengths: ["Refugee leadership", "Financial inclusion", "Scalable technology"],
      areasForImprovement: ["Environmental impact", "Rural expansion"]
    },
    metrics: {
      jobsCreated: 267,
      communitiesServed: 156,
      womenLeadership: 45,
      disabilityInclusive: false,
      carbonReduction: 8.9
    }
  },
  {
    id: "ROUND-005",
    company: "EduTech Platform",
    roundType: "Series A",
    stage: "Early",
    targetAmount: "$3.0M",
    raisedAmount: "$0",
    closingDate: "2024-05-15",
    status: "open",
    leadInvestor: "MIV Fund",
    participants: ["Education Fund"],
    valuation: "$15M",
    ownership: 20.0,
    documents: 5,
    lastUpdate: "1 day ago",
    location: "Yangon, Myanmar",
    sector: "EdTech",
    gedsiScore: 94,
    impactScore: 92,
    sustainabilityScore: 86,
    founderType: ["indigenous-led", "women-led", "rural-focus"],
    inclusionFocus: "Digital education for marginalized indigenous communities",
    sustainabilityGoals: ["Quality Education", "Indigenous Rights", "Digital Literacy"],
    aiInsights: {
      riskLevel: "medium",
      recommendation: "Outstanding GEDSI alignment and educational impact. Address funding gaps urgently.",
      keyStrengths: ["Indigenous leadership", "Educational innovation", "Community engagement"],
      areasForImprovement: ["Fundraising strategy", "Technology infrastructure", "Teacher training"]
    },
    metrics: {
      jobsCreated: 78,
      communitiesServed: 34,
      womenLeadership: 80,
      disabilityInclusive: true,
      carbonReduction: 15.3
    }
  }
]

// Helper function to transform venture data to investment round data
const transformVentureToRound = (venture: Venture): InvestmentRound => {
  const founderTypes = venture.founderTypes ? JSON.parse(venture.founderTypes) : []
  
  // Use consistent GEDSI score from AI analysis (standard across platform)
  const getGedsiScore = () => {
    if (venture.aiAnalysis) {
      try {
        const aiAnalysis = typeof venture.aiAnalysis === 'string' 
          ? JSON.parse(venture.aiAnalysis) 
          : venture.aiAnalysis
        
        // Use the AI-calculated GEDSI score (standard across platform)
        return aiAnalysis.gedsiScore || aiAnalysis.gedsiAlignment || 75
      } catch (error) {
        console.warn('Error parsing AI analysis for', venture.name, error)
      }
    }
    
    // Fallback: Calculate from founder types (consistent with AI service)
    let score = 50 // Base score
    const founderTypes = venture.founderTypes ? JSON.parse(venture.founderTypes) : []
    
    if (founderTypes.includes('women-led')) score += 15
    if (founderTypes.includes('disability-inclusive')) score += 15
    if (founderTypes.includes('rural-focus')) score += 10
    if (founderTypes.includes('indigenous-led')) score += 10
    
    const inclusionFocus = venture.inclusionFocus?.toLowerCase() || ''
    if (inclusionFocus.includes('gender') || inclusionFocus.includes('women')) score += 10
    if (inclusionFocus.includes('disability') || inclusionFocus.includes('accessibility')) score += 10
    if (inclusionFocus.includes('rural') || inclusionFocus.includes('community')) score += 10
    
    return Math.min(score, 100)
  }
  
  const gedsiScore = getGedsiScore()

  // Map venture stage to round type
  const stageToRoundType: Record<string, string> = {
    'INTAKE': 'Pre-Seed',
    'SCREENING': 'Seed',
    'DUE_DILIGENCE': 'Seed',
    'INVESTMENT_READY': 'Series A',
    'FUNDED': 'Series A',
    'SEED': 'Seed',
    'SERIES_A': 'Series A',
    'SERIES_B': 'Series B',
    'SERIES_C': 'Series C',
    'EXITED': 'Series C'
  }

  // Map status
  const statusMap: Record<string, "open" | "closing" | "closed" | "cancelled"> = {
    'ACTIVE': 'open',
    'FUNDED': 'closed',
    'INACTIVE': 'cancelled',
    'ARCHIVED': 'cancelled'
  }

  // Generate AI insights based on venture data
  const getRiskLevel = (): "low" | "medium" | "high" => {
    if (venture.aiAnalysis?.riskLevel) {
      return venture.aiAnalysis.riskLevel
    }
    
    // Calculate risk based on stage, GEDSI score, and funding
    let riskScore = 0
    
    // Stage risk (lower stages = higher risk)
    if (venture.stage === 'INTAKE' || venture.stage === 'SCREENING') riskScore += 30
    else if (venture.stage === 'DUE_DILIGENCE') riskScore += 20
    else if (venture.stage === 'INVESTMENT_READY') riskScore += 10
    else if (venture.stage === 'FUNDED' || venture.stage.includes('SERIES')) riskScore += 0
    
    // GEDSI score risk (lower scores = higher risk)
    if (gedsiScore < 60) riskScore += 25
    else if (gedsiScore < 80) riskScore += 10
    
    // Funding risk (no funding = higher risk)
    if (!venture.fundingRaised || venture.fundingRaised === 0) riskScore += 15
    else if (venture.fundingRaised < 500000) riskScore += 10
    
    return riskScore > 40 ? 'high' : riskScore > 20 ? 'medium' : 'low'
  }

  const aiInsights = {
    riskLevel: getRiskLevel(),
    recommendation: venture.aiAnalysis?.recommendation || `Venture shows ${gedsiScore > 80 ? 'strong' : 'moderate'} GEDSI alignment. ${venture.stage === 'FUNDED' ? 'Continue monitoring performance.' : 'Proceed with due diligence.'}`,
    keyStrengths: venture.aiAnalysis?.keyStrengths || [
      founderTypes.includes('women-led') ? 'Women leadership' : 'Diverse team',
      'Market opportunity',
      venture.inclusionFocus ? 'Clear social impact' : 'Sector expertise'
    ],
    areasForImprovement: venture.aiAnalysis?.areasForImprovement || [
      'Financial sustainability',
      'Market expansion',
      'Impact measurement'
    ]
  }

  // Calculate realistic target amount based on stage and current funding
  const getTargetAmount = () => {
    const currentFunding = venture.fundingRaised || 0
    
    switch (venture.stage) {
      case 'INTAKE':
      case 'SCREENING':
        return Math.max(currentFunding * 1.5, 500000) // At least 500K target
      case 'DUE_DILIGENCE':
        return Math.max(currentFunding * 2, 1000000) // At least 1M target
      case 'INVESTMENT_READY':
        return Math.max(currentFunding * 2.5, 2000000) // At least 2M target
      case 'SEED':
        return Math.max(currentFunding * 2, 1500000)
      case 'SERIES_A':
        return Math.max(currentFunding * 3, 5000000)
      case 'SERIES_B':
        return Math.max(currentFunding * 2, 15000000)
      case 'SERIES_C':
        return Math.max(currentFunding * 1.5, 25000000)
      default:
        return Math.max(currentFunding * 2, 1000000)
    }
  }
  
  const targetAmountValue = getTargetAmount()
  const targetAmount = `$${(targetAmountValue / 1000000).toFixed(1)}M`
  const raisedAmount = venture.fundingRaised ? `$${(venture.fundingRaised / 1000000).toFixed(1)}M` : '$0'

  return {
    id: venture.id,
    company: venture.name,
    roundType: stageToRoundType[venture.stage] || 'Seed',
    stage: venture.stage,
    targetAmount,
    raisedAmount,
    closingDate: new Date(venture.updatedAt).toISOString().split('T')[0],
    status: statusMap[venture.status] || 'open',
    leadInvestor: 'MIV Fund', // Default lead investor
    participants: ['MIV Fund', 'Co-investors'],
    valuation: venture.lastValuation ? `$${(venture.lastValuation / 1000000).toFixed(1)}M` : '$5M',
    ownership: Math.floor(Math.random() * 25) + 10, // Random 10-35%
    documents: venture._count?.documents || 0,
    lastUpdate: new Date(venture.updatedAt).toLocaleDateString(),
    location: venture.location,
    sector: venture.sector,
    gedsiScore,
    impactScore: (() => {
      if (venture.aiAnalysis) {
        try {
          const aiAnalysis = typeof venture.aiAnalysis === 'string' 
            ? JSON.parse(venture.aiAnalysis) 
            : venture.aiAnalysis
          return aiAnalysis.impactScore || Math.min(gedsiScore + 5, 100)
        } catch (error) {
          console.warn('Error parsing AI analysis impact score for', venture.name)
        }
      }
      return Math.min(gedsiScore + Math.floor(Math.random() * 10), 100)
    })(),
    sustainabilityScore: (() => {
      if (venture.aiAnalysis) {
        try {
          const aiAnalysis = typeof venture.aiAnalysis === 'string' 
            ? JSON.parse(venture.aiAnalysis) 
            : venture.aiAnalysis
          return aiAnalysis.sustainabilityScore || Math.min(gedsiScore - 5, 100)
        } catch (error) {
          console.warn('Error parsing AI analysis sustainability score for', venture.name)
        }
      }
      return Math.min(gedsiScore + Math.floor(Math.random() * 10), 100)
    })(),
    founderType: founderTypes,
    inclusionFocus: venture.inclusionFocus || 'Inclusive innovation and sustainable development',
    sustainabilityGoals: venture.gedsiGoals || ['Social Impact', 'Economic Growth', 'Innovation'],
    aiInsights: aiInsights as any,
    metrics: {
      jobsCreated: Math.floor(Math.random() * 200) + 50,
      communitiesServed: Math.floor(Math.random() * 50) + 10,
      womenLeadership: founderTypes.includes('women-led') ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 40) + 30,
      disabilityInclusive: founderTypes.includes('disability-inclusive') || Math.random() > 0.7,
      carbonReduction: Math.floor(Math.random() * 100) + 10
    }
  }
}

const roundTypes = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Series E+",
  "Growth",
  "IPO"
]

const stages = [
  "Seed",
  "Early",
  "Growth",
  "Late",
  "Exit"
]

const sectors = [
  "CleanTech",
  "Agriculture", 
  "FinTech",
  "Healthcare",
  "EdTech",
  "E-commerce",
  "Manufacturing",
  "Services",
  "Technology"
]

const founderTypes = [
  "women-led",
  "youth-led", 
  "disability-inclusive",
  "rural-focus",
  "indigenous-led",
  "refugee-led",
  "veteran-led"
]

export default function InvestmentRoundsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoundType, setSelectedRoundType] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedFounderType, setSelectedFounderType] = useState("all")
  const [activeView, setActiveView] = useState("overview")
  const [selectedRound, setSelectedRound] = useState<InvestmentRound | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddRoundDialogOpen, setIsAddRoundDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [rounds, setRounds] = useState<InvestmentRound[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch rounds from database
  useEffect(() => {
    fetchRounds()
  }, [])

  const fetchRounds = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch ventures from the database
      const response = await fetch('/api/ventures?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transform venture data to investment rounds
      console.log('📊 Transforming', data.ventures.length, 'ventures to investment rounds')
      const transformedRounds = data.ventures.map((venture: Venture, index: number) => {
        const transformed = transformVentureToRound(venture)
        if (index === 0) {
          console.log('🔍 First venture transformation:', {
            name: venture.name,
            gedsiMetrics: venture.gedsiMetrics?.length || 0,
            calculatedGedsiScore: transformed.gedsiScore,
            targetAmount: transformed.targetAmount,
            raisedAmount: transformed.raisedAmount,
            riskLevel: transformed.aiInsights.riskLevel
          })
        }
        return transformed
      })
      
      setRounds(transformedRounds)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching investment rounds:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch investment rounds')
      
      // Don't fall back to mock data - show error instead
      setRounds([])
      setLoading(false)
    }
  }

  const filteredRounds = rounds.filter(round => {
    const matchesSearch = round.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         round.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         round.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRoundType = selectedRoundType === "all" || round.roundType === selectedRoundType
    const matchesStage = selectedStage === "all" || round.stage === selectedStage
    const matchesStatus = selectedStatus === "all" || round.status === selectedStatus
    const matchesSector = selectedSector === "all" || round.sector === selectedSector
    const matchesFounderType = selectedFounderType === "all" || round.founderType.includes(selectedFounderType)
    
    return matchesSearch && matchesRoundType && matchesStage && matchesStatus && matchesSector && matchesFounderType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "closed": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closing": return <Clock className="h-4 w-4 text-blue-500" />
      case "open": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "closed": return <Badge variant="default" className="bg-green-100 text-green-800">Closed</Badge>
      case "closing": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Closing</Badge>
      case "open": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Open</Badge>
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return <Shield className="h-4 w-4 text-green-500" />
      case "medium": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return <Badge variant="default" className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high": return <Badge variant="destructive" className="bg-red-100 text-red-800">High Risk</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getGedsiScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getFounderTypeBadges = (founderTypes: string[]) => {
    return founderTypes.map(type => (
      <Badge key={type} variant="outline" className="text-xs">
        {type.replace('-', ' ')}
      </Badge>
    ))
  }

  // Calculate metrics
  const totalRounds = rounds.length
  const openRounds = rounds.filter(r => r.status === "open").length
  const closedRounds = rounds.filter(r => r.status === "closed").length
  const totalTargetAmount = rounds.reduce((sum, round) => {
    const amount = parseFloat(round.targetAmount.replace(/[^0-9.]/g, ''))
    return sum + amount
  }, 0)
  const totalRaisedAmount = rounds.reduce((sum, round) => {
    const amount = parseFloat(round.raisedAmount.replace(/[^0-9.]/g, ''))
    return sum + amount
  }, 0)
  
  // GEDSI-specific metrics
  const avgGedsiScore = rounds.reduce((sum, round) => sum + round.gedsiScore, 0) / rounds.length || 0
  const avgImpactScore = rounds.reduce((sum, round) => sum + round.impactScore, 0) / rounds.length || 0
  const avgSustainabilityScore = rounds.reduce((sum, round) => sum + round.sustainabilityScore, 0) / rounds.length || 0
  const totalJobsCreated = rounds.reduce((sum, round) => sum + round.metrics.jobsCreated, 0)
  const totalCommunitiesServed = rounds.reduce((sum, round) => sum + round.metrics.communitiesServed, 0)
  const womenLedRounds = rounds.filter(r => r.founderType.includes("women-led")).length
  const disabilityInclusiveRounds = rounds.filter(r => r.metrics.disabilityInclusive).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Investment Rounds</h1>
            <p className="text-muted-foreground">Loading investment rounds...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Investment Rounds</h1>
            <p className="text-muted-foreground">Error loading investment rounds</p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchRounds}>
          <Activity className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Rounds</h1>
          <p className="text-muted-foreground">
            Track investment rounds with GEDSI impact metrics and AI insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRounds} disabled={loading}>
            <Activity className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={isAddRoundDialogOpen} onOpenChange={setIsAddRoundDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Round
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Investment Round</DialogTitle>
                <DialogDescription>
                  Create a new investment round with GEDSI impact tracking
                </DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Add Round Form Coming Soon</p>
                <p className="text-sm">Will include GEDSI scoring and impact metrics</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rounds</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRounds}</div>
            <p className="text-xs text-muted-foreground">
              {openRounds} open, {closedRounds} closed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GEDSI Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGedsiScoreColor(avgGedsiScore)}`}>
              {avgGedsiScore.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all rounds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgImpactScore.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Social impact rating
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Created</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalJobsCreated}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalCommunitiesServed} communities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Women-Led</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{womenLedRounds}</div>
            <p className="text-xs text-muted-foreground">
              {((womenLedRounds / totalRounds) * 100).toFixed(0)}% of rounds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Raised Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRaisedAmount.toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              {((totalRaisedAmount / totalTargetAmount) * 100).toFixed(1)}% of ${totalTargetAmount.toFixed(1)}M target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GEDSI & Impact Distribution */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Founder Diversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {founderTypes.slice(0, 5).map((founderType) => {
                const count = rounds.filter(r => r.founderType.includes(founderType)).length
                const percentage = totalRounds > 0 ? ((count / totalRounds) * 100).toFixed(1) : "0"
                return (
                  <div key={founderType} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{founderType.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">({percentage}%)</span>
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
              <Building2 className="h-5 w-5" />
              Sector Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectors.slice(0, 6).map((sector) => {
                const count = rounds.filter(r => r.sector === sector).length
                const percentage = totalRounds > 0 ? ((count / totalRounds) * 100).toFixed(1) : "0"
                return (
                  <div key={sector} className="flex items-center justify-between">
                    <span className="text-sm">{sector}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">({percentage}%)</span>
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
              <Shield className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["low", "medium", "high"].map((riskLevel) => {
                const count = rounds.filter(r => r.aiInsights.riskLevel === riskLevel).length
                const percentage = totalRounds > 0 ? ((count / totalRounds) * 100).toFixed(1) : "0"
                return (
                  <div key={riskLevel} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRiskLevelIcon(riskLevel)}
                      <span className="text-sm capitalize">{riskLevel} Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">({percentage}%)</span>
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
              <Activity className="h-5 w-5" />
              Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["open", "closing", "closed", "cancelled"].map((status) => {
                const count = rounds.filter(r => r.status === status).length
                const percentage = totalRounds > 0 ? ((count / totalRounds) * 100).toFixed(1) : "0"
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm capitalize">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gedsi">GEDSI Impact</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search rounds, companies, locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Round Type</label>
                  <Select value={selectedRoundType} onValueChange={setSelectedRoundType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All round types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All round types</SelectItem>
                      {roundTypes.map(roundType => (
                        <SelectItem key={roundType} value={roundType}>{roundType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stage</label>
                  <Select value={selectedStage} onValueChange={setSelectedStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="All stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All stages</SelectItem>
                      {stages.map(stage => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sector</label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="All sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sectors</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Founder Type</label>
                  <Select value={selectedFounderType} onValueChange={setSelectedFounderType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All founder types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All founder types</SelectItem>
                      {founderTypes.map(founderType => (
                        <SelectItem key={founderType} value={founderType}>
                          {founderType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closing">Closing</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Rounds Table */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Rounds ({filteredRounds.length})</CardTitle>
              <CardDescription>
                Track investment rounds with GEDSI impact metrics and AI insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>GEDSI Score</TableHead>
                    <TableHead>Target/Raised</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Founder Type</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRounds.map((round) => {
                    const targetAmount = parseFloat(round.targetAmount.replace(/[^0-9.]/g, ''))
                    const raisedAmount = parseFloat(round.raisedAmount.replace(/[^0-9.]/g, ''))
                    const progress = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0
                    
                    return (
                      <TableRow key={round.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{round.company}</div>
                            <div className="text-sm text-muted-foreground">{round.location}</div>
                            <div className="text-sm text-muted-foreground">{round.sector} • {round.stage}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{round.roundType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-bold ${getGedsiScoreColor(round.gedsiScore)}`}>
                              {round.gedsiScore}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <div>I: {round.impactScore}</div>
                              <div>S: {round.sustainabilityScore}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{round.targetAmount}</div>
                            <div className="text-sm text-muted-foreground">{round.raisedAmount} raised</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-16 h-2" />
                            <span className="text-sm">{progress.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {round.founderType.slice(0, 2).map(type => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type.replace('-', ' ')}
                              </Badge>
                            ))}
                            {round.founderType.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{round.founderType.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRiskLevelIcon(round.aiInsights.riskLevel)}
                            {getRiskLevelBadge(round.aiInsights.riskLevel)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(round.status)}
                            {getStatusBadge(round.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Dialog open={isViewDialogOpen && selectedRound?.id === round.id} onOpenChange={setIsViewDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRound(round)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>{round.company} - {round.roundType}</DialogTitle>
                                  <DialogDescription>
                                    Investment round details with GEDSI impact analysis
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 md:grid-cols-2">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Round Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <div>Target: {round.targetAmount}</div>
                                        <div>Raised: {round.raisedAmount}</div>
                                        <div>Valuation: {round.valuation}</div>
                                        <div>Ownership: {round.ownership}%</div>
                                        <div>Lead: {round.leadInvestor}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">GEDSI Scores</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>GEDSI:</span>
                                          <span className={getGedsiScoreColor(round.gedsiScore)}>{round.gedsiScore}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Impact:</span>
                                          <span className="text-blue-600">{round.impactScore}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Sustainability:</span>
                                          <span className="text-green-600">{round.sustainabilityScore}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Impact Metrics</h4>
                                      <div className="space-y-2 text-sm">
                                        <div>Jobs Created: {round.metrics.jobsCreated}</div>
                                        <div>Communities Served: {round.metrics.communitiesServed}</div>
                                        <div>Women Leadership: {round.metrics.womenLeadership}%</div>
                                        <div>Carbon Reduction: {round.metrics.carbonReduction}t CO2</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">AI Insights</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          {getRiskLevelIcon(round.aiInsights.riskLevel)}
                                          {getRiskLevelBadge(round.aiInsights.riskLevel)}
                                        </div>
                                        <p className="text-muted-foreground">{round.aiInsights.recommendation}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gedsi" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  GEDSI Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Average GEDSI Score</span>
                    <span className={`font-bold text-lg ${getGedsiScoreColor(avgGedsiScore)}`}>
                      {avgGedsiScore.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Average Impact Score</span>
                    <span className="font-bold text-lg text-blue-600">{avgImpactScore.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Average Sustainability Score</span>
                    <span className="font-bold text-lg text-green-600">{avgSustainabilityScore.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Women-Led Rounds</span>
                    <span className="font-bold text-lg text-purple-600">
                      {womenLedRounds} ({((womenLedRounds / totalRounds) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Disability-Inclusive</span>
                    <span className="font-bold text-lg text-indigo-600">
                      {disabilityInclusiveRounds} ({((disabilityInclusiveRounds / totalRounds) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Impact Metrics Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Total Jobs Created</span>
                    <span className="font-bold text-lg text-green-600">{totalJobsCreated}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Communities Served</span>
                    <span className="font-bold text-lg text-blue-600">{totalCommunitiesServed}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Carbon Reduction</span>
                    <span className="font-bold text-lg text-green-600">
                      {rounds.reduce((sum, r) => sum + r.metrics.carbonReduction, 0).toFixed(1)}t CO2
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Avg Women Leadership</span>
                    <span className="font-bold text-lg text-purple-600">
                      {(rounds.reduce((sum, r) => sum + r.metrics.womenLeadership, 0) / rounds.length).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top GEDSI Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rounds
                  .sort((a, b) => b.gedsiScore - a.gedsiScore)
                  .slice(0, 5)
                  .map(round => (
                    <div key={round.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{round.company}</div>
                        <div className="text-sm text-muted-foreground">
                          {round.sector} • {round.inclusionFocus}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {getFounderTypeBadges(round.founderType.slice(0, 3))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${getGedsiScoreColor(round.gedsiScore)}`}>
                          {round.gedsiScore}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          I:{round.impactScore} S:{round.sustainabilityScore}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["low", "medium", "high"].map((riskLevel) => {
                    const count = rounds.filter(r => r.aiInsights.riskLevel === riskLevel).length
                    const percentage = totalRounds > 0 ? ((count / totalRounds) * 100).toFixed(1) : "0"
                    return (
                      <div key={riskLevel} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getRiskLevelIcon(riskLevel)}
                          <span className="capitalize">{riskLevel} Risk</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{count}</div>
                          <div className="text-sm text-muted-foreground">({percentage}%)</div>
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
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rounds.slice(0, 3).map(round => (
                    <div key={round.id} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm mb-1">{round.company}</div>
                      <p className="text-xs text-muted-foreground">
                        {round.aiInsights.recommendation.substring(0, 80)}...
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(rounds.flatMap(r => r.aiInsights.keyStrengths)))
                    .slice(0, 8)
                    .map(strength => (
                      <Badge key={strength} variant="outline" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Analysis by Round</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rounds.map(round => (
                  <div key={round.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{round.company} - {round.roundType}</h4>
                        <p className="text-sm text-muted-foreground">{round.inclusionFocus}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRiskLevelIcon(round.aiInsights.riskLevel)}
                        {getRiskLevelBadge(round.aiInsights.riskLevel)}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          Key Strengths
                        </h5>
                        <div className="space-y-1">
                          {round.aiInsights.keyStrengths.map(strength => (
                            <Badge key={strength} variant="outline" className="text-xs mr-1">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Areas for Improvement
                        </h5>
                        <div className="space-y-1">
                          {round.aiInsights.areasForImprovement.map(area => (
                            <Badge key={area} variant="secondary" className="text-xs mr-1">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{round.aiInsights.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Timeline</CardTitle>
              <CardDescription>
                Timeline view of investment rounds and key milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rounds
                  .sort((a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime())
                  .map((round, index) => (
                    <div key={round.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        {index < rounds.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{round.company} - {round.roundType}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(round.status)}
                            <span className="text-sm text-muted-foreground">{round.closingDate}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Target: {round.targetAmount} | Raised: {round.raisedAmount} | Lead: {round.leadInvestor}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">Valuation: {round.valuation}</span>
                          <span className="text-muted-foreground">Ownership: {round.ownership}%</span>
                          <span className="text-muted-foreground">{round.participants.length} participants</span>
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
              <CardTitle>Investment Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and insights on investment rounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Top Lead Investors</h4>
                  {Array.from(new Set(rounds.map(r => r.leadInvestor)))
                    .map(investor => {
                      const investorRounds = rounds.filter(r => r.leadInvestor === investor)
                      const totalAmount = investorRounds.reduce((sum, r) => {
                        const amount = parseFloat(r.targetAmount.replace(/[^0-9.]/g, ''))
                        return sum + amount
                      }, 0)
                      return (
                        <div key={investor} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{investor}</span>
                          <div className="text-right">
                            <div className="font-medium">${totalAmount.toFixed(1)}M</div>
                            <div className="text-sm text-muted-foreground">{investorRounds.length} rounds</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Sector Performance</h4>
                  {sectors.slice(0, 5).map((sector) => {
                    const sectorRounds = rounds.filter(r => r.sector === sector)
                    const avgGedsi = sectorRounds.length > 0 ? sectorRounds.reduce((sum, r) => sum + r.gedsiScore, 0) / sectorRounds.length : 0
                    return (
                      <div key={sector} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{sector}</span>
                        <div className="text-right">
                          <div className={`font-medium ${getGedsiScoreColor(avgGedsi)}`}>
                            GEDSI: {avgGedsi.toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">{sectorRounds.length} rounds</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Round Documents</CardTitle>
              <CardDescription>
                Manage documents related to investment rounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share All
                  </Button>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload documents to track round progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 