"use client"

import React, { useState, useEffect } from "react"
import { calculateGEDSIScore } from "@/lib/gedsi-utils"
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
  Activity, 
  Filter, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  DollarSign,
  Target,
  Calendar,
  Sparkles,
  Heart,
  Globe,
  Award,
  FileText,
  MessageSquare,
  ArrowRight,
  BarChart3,
  Zap,
  Shield,
  Lightbulb,
  X
} from "lucide-react"

interface Deal {
  id: string
  company: string
  stage: string
  sector: string
  location: string
  dealSize: string
  probability: number
  expectedClose: string
  team: string[]
  lastActivity: string
  status: "active" | "paused" | "closed" | "lost"
  // MIV-specific fields
  gedsiScore: number
  impactScore: number
  readinessScore: number
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
  }
}

const mockDeals: Deal[] = [
  {
    id: "DEAL-001",
    company: "EcoTech Solutions",
    stage: "Due Diligence",
    sector: "CleanTech",
    location: "Bangkok, Thailand",
    dealSize: "$2.5M",
    probability: 75,
    expectedClose: "2024-03-15",
    team: ["Sarah Johnson", "Mike Chen"],
    lastActivity: "2 hours ago",
    status: "active",
    gedsiScore: 85,
    impactScore: 92,
    readinessScore: 78,
    founderType: ["women-led", "rural-focus"],
    inclusionFocus: "Sustainable technology for rural communities",
    sustainabilityGoals: ["Climate Action", "Clean Energy", "Rural Development"],
    aiInsights: {
      riskLevel: "low",
      recommendation: "Strong GEDSI alignment and clear impact potential. Recommend proceeding to term sheet.",
      keyStrengths: ["Female leadership", "Rural market focus", "Proven sustainability model"],
      areasForImprovement: ["Financial projections need strengthening", "Team expansion required"]
    },
    metrics: {
      jobsCreated: 150,
      communitiesServed: 25,
      womenLeadership: 60,
      disabilityInclusive: true
    }
  },
  {
    id: "DEAL-002",
    company: "InclusiveFinance Pro",
    stage: "Term Sheet",
    sector: "FinTech",
    location: "Manila, Philippines",
    dealSize: "$5.0M",
    probability: 90,
    expectedClose: "2024-02-28",
    team: ["Maria Santos", "David Kim", "Lisa Wang"],
    lastActivity: "1 day ago",
    status: "active",
    gedsiScore: 94,
    impactScore: 88,
    readinessScore: 89,
    founderType: ["women-led", "disability-inclusive"],
    inclusionFocus: "Financial services for underbanked communities",
    sustainabilityGoals: ["Financial Inclusion", "Gender Equality", "Disability Rights"],
    aiInsights: {
      riskLevel: "low",
      recommendation: "Exceptional GEDSI performance and market-ready solution. Fast-track for investment.",
      keyStrengths: ["Strong financial inclusion model", "Disability-inclusive design", "Proven market traction"],
      areasForImprovement: ["Regulatory compliance documentation", "Scale-up strategy refinement"]
    },
    metrics: {
      jobsCreated: 320,
      communitiesServed: 45,
      womenLeadership: 75,
      disabilityInclusive: true
    }
  },
  {
    id: "DEAL-003",
    company: "AgriTech Innovations",
    stage: "Investment Readiness",
    sector: "Agriculture",
    location: "Ho Chi Minh City, Vietnam",
    dealSize: "$1.8M",
    probability: 65,
    expectedClose: "2024-04-10",
    team: ["Nguyen Tran", "Alex Rodriguez"],
    lastActivity: "3 days ago",
    status: "active",
    gedsiScore: 72,
    impactScore: 85,
    readinessScore: 62,
    founderType: ["youth-led", "rural-focus"],
    inclusionFocus: "Smart farming solutions for smallholder farmers",
    sustainabilityGoals: ["Food Security", "Climate Resilience", "Rural Livelihoods"],
    aiInsights: {
      riskLevel: "medium",
      recommendation: "Good impact potential but needs investment readiness improvement.",
      keyStrengths: ["Innovative agtech solution", "Strong rural market understanding", "Youth leadership"],
      areasForImprovement: ["Business plan refinement", "Financial modeling", "GEDSI metrics expansion"]
    },
    metrics: {
      jobsCreated: 85,
      communitiesServed: 12,
      womenLeadership: 40,
      disabilityInclusive: false
    }
  },
  {
    id: "DEAL-004",
    company: "HealthAccess Network",
    stage: "Investment Committee",
    sector: "Healthcare",
    location: "Jakarta, Indonesia",
    dealSize: "$8.2M",
    probability: 80,
    expectedClose: "2024-03-20",
    team: ["Dr. Sari Indira", "Tom Wilson", "Emma Davis"],
    lastActivity: "5 hours ago",
    status: "active",
    gedsiScore: 88,
    impactScore: 95,
    readinessScore: 85,
    founderType: ["women-led", "disability-inclusive"],
    inclusionFocus: "Accessible healthcare for remote and disabled communities",
    sustainabilityGoals: ["Health Equity", "Disability Rights", "Rural Healthcare"],
    aiInsights: {
      riskLevel: "low",
      recommendation: "Outstanding impact venture with strong GEDSI alignment. Highly recommended for investment.",
      keyStrengths: ["Exceptional impact potential", "Strong medical expertise", "Proven accessibility features"],
      areasForImprovement: ["Market expansion strategy", "Technology scalability"]
    },
    metrics: {
      jobsCreated: 280,
      communitiesServed: 65,
      womenLeadership: 70,
      disabilityInclusive: true
    }
  },
  {
    id: "DEAL-005",
    company: "EduBridge Platform",
    stage: "Portfolio",
    sector: "EdTech",
    location: "Yangon, Myanmar",
    dealSize: "$3.1M",
    probability: 100,
    expectedClose: "2024-01-15",
    team: ["Thant Zin", "Mike Chen", "Lisa Wang"],
    lastActivity: "1 week ago",
    status: "closed",
    gedsiScore: 91,
    impactScore: 87,
    readinessScore: 92,
    founderType: ["indigenous-led", "women-led"],
    inclusionFocus: "Digital education for marginalized communities",
    sustainabilityGoals: ["Quality Education", "Digital Inclusion", "Indigenous Rights"],
    aiInsights: {
      riskLevel: "low",
      recommendation: "Successful investment with strong portfolio performance. Consider follow-on funding.",
      keyStrengths: ["Strong educational impact", "Indigenous leadership", "Proven scalability"],
      areasForImprovement: ["Continue monitoring user engagement", "Expand to new regions"]
    },
    metrics: {
      jobsCreated: 420,
      communitiesServed: 78,
      womenLeadership: 65,
      disabilityInclusive: true
    }
  }
]

const stages = [
  "Intake",
  "Screening",
  "Due Diligence", 
  "Investment Ready",
  "Funded",
  "Series A",
  "Series B",
  "Series C",
  "Exited"
]

const sectors = [
  "CleanTech",
  "Agriculture", 
  "FinTech",
  "Healthcare",
  "Education",
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

export default function DealFlowPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFounderType, setSelectedFounderType] = useState("all")
  const [activeView, setActiveView] = useState("overview")
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDealDialogOpen, setIsAddDealDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStageForFilter, setSelectedStageForFilter] = useState<string | null>(null)
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)
  const [stageDealsDialog, setStageDealsDialog] = useState<{open: boolean, stage: string, deals: Deal[]}>({
    open: false,
    stage: '',
    deals: []
  })

  // Fetch deals from database
  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      
      // Fetch ventures from the database
      const response = await fetch('/api/ventures?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      const ventures = data.ventures || []
      
      console.log(`📊 Found ${ventures.length} ventures for deal flow`)
      
      // Debug: Log venture stages
      const stageBreakdown = ventures.reduce((acc: any, venture: any) => {
        acc[venture.stage || 'UNDEFINED'] = (acc[venture.stage || 'UNDEFINED'] || 0) + 1
        return acc
      }, {})
      console.log('🎭 Venture stages in database:', stageBreakdown)
      
      // Transform ventures into deals
      const transformedDeals: Deal[] = ventures.map((venture: any) => {
        // Calculate deal-specific metrics using proper GEDSI calculation
        const gedsiScore = (() => {
          if (venture.gedsiMetrics?.length > 0) {
            // Use proper GEDSI score calculation from gedsi-utils
            try {
              return calculateGEDSIScore(venture)
            } catch (e) {
              // Fallback: Calculate from GEDSI metrics with proper bounds
              const validMetrics = venture.gedsiMetrics
                .map((metric: any) => {
                  const value = metric.currentValue || metric.value || 0
                  // Normalize values that might be percentages (0-100) or raw scores
                  return typeof value === 'number' && value > 0 
                    ? Math.min(100, Math.max(0, value > 1 ? (value > 100 ? value / 10 : value) : value * 100))
                    : 0
                })
                .filter((score: number) => score > 0)
              
              return validMetrics.length > 0 
                ? Math.round(validMetrics.reduce((sum: number, score: number) => sum + score, 0) / validMetrics.length)
                : Math.floor(Math.random() * 40) + 60
            }
          }
          return Math.floor(Math.random() * 40) + 60
        })()

        const impactScore = calculateImpactScore(venture)
        const readinessScore = calculateReadinessScore(venture)
        const aiInsights = generateDealAIInsights(venture, gedsiScore, impactScore)
        
        // Map venture stage to deal stage
        const dealStage = mapVentureStageToDealer(venture.stage)
        
        // Calculate deal size based on funding and stage
        const dealSize = venture.fundingRaised 
          ? `$${(venture.fundingRaised / 1000000).toFixed(1)}M`
          : `$${(Math.random() * 5 + 0.5).toFixed(1)}M`

        return {
          id: venture.id,
          company: venture.name,
          stage: dealStage,
          sector: venture.sector || 'Technology',
          location: venture.location || 'Southeast Asia',
          dealSize,
          probability: calculateDealProbability(venture.stage, gedsiScore, impactScore),
          expectedClose: calculateExpectedClose(venture.stage),
          team: getAssignedTeam(venture),
          lastActivity: getLastActivity(venture),
          status: mapVentureStatusToDealer(venture.status) as "active" | "paused" | "closed" | "lost",
          gedsiScore: Math.min(100, Math.max(0, Math.round(gedsiScore))),
          impactScore: Math.min(100, Math.max(15, Math.round(impactScore))),
          readinessScore: Math.round(readinessScore),
          founderType: parseFounderTypes(venture.founderTypes),
          inclusionFocus: venture.inclusionFocus || 'Impact-focused venture',
          sustainabilityGoals: parseSustainabilityGoals(venture.stgGoals),
          aiInsights,
          metrics: {
            jobsCreated: venture.jobsCreated || venture.gedsiMetricsSummary?.jobsCreated || 0,
            communitiesServed: venture.totalBeneficiaries || venture.gedsiMetricsSummary?.communityImpact || 0,
            womenLeadership: venture.womenEmpowered || venture.gedsiMetricsSummary?.womenLeadership || 0,
            disabilityInclusive: (venture.disabilityInclusive || venture.gedsiMetricsSummary?.disabilityInclusion || 0) > 0
          }
        }
      })
      
      setDeals(transformedDeals)
      
      // Debug: Log transformed deal stages
      const dealStageBreakdown = transformedDeals.reduce((acc: any, deal: any) => {
        acc[deal.stage || 'UNDEFINED'] = (acc[deal.stage || 'UNDEFINED'] || 0) + 1
        return acc
      }, {})
      console.log('🎯 Deal stages after transformation:', dealStageBreakdown)
      console.log(`✅ Successfully loaded ${transformedDeals.length} deals from database`)
    } catch (err) {
      console.error('❌ Error fetching deals:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to load deals: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Enhanced IRIS+ Framework Impact Score Calculation
  const calculateImpactScore = (venture: any) => {
    let score = 0
    const maxScore = 100
    
    // 1. GEDSI Leadership & Governance (25 points max)
    let leadershipScore = 0
    try {
      const founderTypes = Array.isArray(venture.founderTypes) 
        ? venture.founderTypes 
        : JSON.parse(venture.founderTypes || '[]')
      
      if (founderTypes.includes('women-led')) leadershipScore += 10 // IRIS+ OI.1
      if (founderTypes.includes('disability-inclusive')) leadershipScore += 8 // IRIS+ OI.6
      if (founderTypes.includes('indigenous-led')) leadershipScore += 7 // IRIS+ OI.11
      if (founderTypes.includes('youth-led')) leadershipScore += 5 // IRIS+ OI.12
      if (founderTypes.includes('lgbtq-led')) leadershipScore += 5 // IRIS+ OI.14
    } catch (e) {
      // Fallback: check venture name/description for leadership indicators
      const ventureText = `${venture.name || ''} ${venture.description || ''}`.toLowerCase()
      if (ventureText.includes('women') || ventureText.includes('female')) leadershipScore += 8
      if (ventureText.includes('disability') || ventureText.includes('accessible')) leadershipScore += 6
      if (ventureText.includes('youth') || ventureText.includes('young')) leadershipScore += 4
    }
    score += Math.min(leadershipScore, 25)

    // 2. Social Impact & Inclusion (30 points max)
    let socialImpactScore = 0
    const inclusionFocus = (venture.inclusionFocus || '').toLowerCase()
    
    // Geographic inclusion (IRIS+ OI.10)
    if (inclusionFocus.includes('rural') || inclusionFocus.includes('underserved') || 
        inclusionFocus.includes('remote') || inclusionFocus.includes('community')) {
      socialImpactScore += 8
    }
    
    // Economic inclusion (IRIS+ OI.13)
    if (inclusionFocus.includes('low-income') || inclusionFocus.includes('poverty') || 
        inclusionFocus.includes('financial inclusion') || inclusionFocus.includes('microfinance')) {
      socialImpactScore += 8
    }
    
    // Healthcare access (sector-specific)
    if (inclusionFocus.includes('healthcare') || inclusionFocus.includes('medical') || 
        inclusionFocus.includes('health access')) {
      socialImpactScore += 7
    }
    
    // Education access (sector-specific)
    if (inclusionFocus.includes('education') || inclusionFocus.includes('learning') || 
        inclusionFocus.includes('skills development')) {
      socialImpactScore += 7
    }
    
    // Add bonus for multiple inclusion areas
    const inclusionAreas = [
      inclusionFocus.includes('gender'),
      inclusionFocus.includes('disability'),
      inclusionFocus.includes('rural'),
      inclusionFocus.includes('youth'),
      inclusionFocus.includes('education'),
      inclusionFocus.includes('healthcare')
    ].filter(Boolean).length
    
    if (inclusionAreas >= 3) socialImpactScore += 5 // Multi-dimensional impact
    score += Math.min(socialImpactScore, 30)

    // 3. GEDSI Metrics Implementation (20 points max)
    let metricsScore = 0
    if (venture.gedsiMetrics?.length > 0) {
      const totalMetrics = venture.gedsiMetrics.length
      const verifiedMetrics = venture.gedsiMetrics.filter((m: any) => 
        m.status === 'VERIFIED' || m.status === 'COMPLETED'
      ).length
      
      // Base points for having metrics
      metricsScore += Math.min(totalMetrics * 2, 12) // Up to 12 points for quantity
      
      // Bonus points for verification (IRIS+ verification requirement)
      if (verifiedMetrics > 0) {
        const verificationRate = verifiedMetrics / totalMetrics
        metricsScore += Math.round(verificationRate * 8) // Up to 8 points for verification
      }
    }
    score += Math.min(metricsScore, 20)

    // 4. Sustainable Development Goals Alignment (15 points max)
    let sdgScore = 0
    try {
      const goals = JSON.parse(venture.gedsiGoals || venture.sustainabilityGoals || '[]')
      if (goals.length > 0) {
        sdgScore += Math.min(goals.length * 2, 10) // Up to 10 points for SDG alignment
        
        // Bonus for high-impact SDGs
        const highImpactSDGs = goals.filter((goal: string) => 
          goal.toLowerCase().includes('gender equality') ||
          goal.toLowerCase().includes('decent work') ||
          goal.toLowerCase().includes('reduced inequalities') ||
          goal.toLowerCase().includes('sustainable cities') ||
          goal.toLowerCase().includes('climate action')
        )
        sdgScore += Math.min(highImpactSDGs.length * 2, 5) // Up to 5 bonus points
      }
    } catch (e) {
      // Fallback: infer from sector and focus
      if (venture.sector?.toLowerCase().includes('cleantech') || 
          venture.sector?.toLowerCase().includes('sustainability')) {
        sdgScore += 6
      }
      if (inclusionFocus.length > 0) sdgScore += 4
    }
    score += Math.min(sdgScore, 15)

    // 5. Operational Impact Evidence (10 points max)
    let evidenceScore = 0
    
    // Jobs created (IRIS+ employment metrics)
    const jobsCreated = venture.metrics?.jobsCreated || 0
    if (jobsCreated > 0) {
      evidenceScore += Math.min(Math.floor(jobsCreated / 10), 4) // 1 point per 10 jobs, max 4
    }
    
    // Communities served (IRIS+ reach metrics)
    const communities = venture.metrics?.communitiesServed || 0
    if (communities > 0) {
      evidenceScore += Math.min(Math.floor(communities / 5), 3) // 1 point per 5 communities, max 3
    }
    
    // Accessibility compliance
    if (venture.metrics?.disabilityInclusive) {
      evidenceScore += 3 // IRIS+ OI.8 compliance
    }
    
    score += Math.min(evidenceScore, 10)

    // Apply sector-specific multipliers
    const sectorMultipliers: Record<string, number> = {
      'healthcare': 1.1,    // Higher impact potential
      'education': 1.1,     // High social impact
      'agriculture': 1.05,  // Rural development impact
      'fintech': 1.05,      // Financial inclusion
      'cleantech': 1.05,    // Environmental + social
      'default': 1.0
    }
    
    const sector = venture.sector?.toLowerCase() || ''
    const multiplier = Object.entries(sectorMultipliers).find(([key]) => 
      sector.includes(key)
    )?.[1] || sectorMultipliers.default
    
    score = Math.round(score * multiplier)
    
    // Debug logging for impact score calculation
    if (venture.name?.includes('Inclusive Learning Technologies')) {
      console.log('🎯 Impact Score Debug for', venture.name, {
        leadershipScore,
        socialImpactScore,
        metricsScore,
        sdgScore,
        evidenceScore,
        totalScore: score,
        multiplier,
        finalScore: Math.max(15, Math.min(score, maxScore)),
        venture: {
          founderTypes: venture.founderTypes,
          inclusionFocus: venture.inclusionFocus,
          gedsiMetrics: venture.gedsiMetrics?.length || 0,
          sector: venture.sector
        }
      })
    }
    
    // Ensure score is within bounds and provide minimum viable score
    return Math.max(15, Math.min(score, maxScore))
  }

  const calculateReadinessScore = (venture: any) => {
    let score = 60
    if (venture.operationalReadiness) {
      const readyItems = Object.values(venture.operationalReadiness).filter(Boolean).length
      score += readyItems * 5
    }
    if (venture.capitalReadiness) {
      const readyItems = Object.values(venture.capitalReadiness).filter(Boolean).length
      score += readyItems * 3
    }
    return Math.min(score, 100)
  }

  const mapVentureStageToDealer = (stage: string) => {
    const stageMap: { [key: string]: string } = {
      'INTAKE': 'Intake',
      'SCREENING': 'Screening', 
      'DUE_DILIGENCE': 'Due Diligence',
      'INVESTMENT_READY': 'Investment Ready',
      'FUNDED': 'Funded',
      'SEED': 'Funded', // Seed companies are funded
      'SERIES_A': 'Series A',
      'SERIES_B': 'Series B', 
      'SERIES_C': 'Series C',
      'EXITED': 'Exited'
    }
    return stageMap[stage] || 'Intake' // Default to Intake for unknown stages
  }

  const mapVentureStatusToDealer = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'active',
      'INACTIVE': 'paused',
      'ARCHIVED': 'closed'
    }
    return statusMap[status] || 'active'
  }

  const calculateDealProbability = (stage: string, gedsiScore: number, impactScore: number) => {
    let baseProbability = 30
    
    // Stage-based probability
    const stageProbabilities: { [key: string]: number } = {
      'INTAKE': 20,
      'SCREENING': 35,
      'DUE_DILIGENCE': 65,
      'INVESTMENT_READY': 85,
      'FUNDED': 100,
      'SEED': 80,
      'SERIES_A': 85,
      'SERIES_B': 90,
      'SERIES_C': 95
    }
    
    baseProbability = stageProbabilities[stage] || 30
    
    // Adjust based on scores
    if (gedsiScore > 80) baseProbability += 10
    if (impactScore > 85) baseProbability += 5
    
    return Math.min(baseProbability, 100)
  }

  const calculateExpectedClose = (stage: string) => {
    const daysFromNow = (() => {
      switch (stage) {
        case 'INTAKE': return Math.random() * 180 + 120 // 4-10 months
        case 'SCREENING': return Math.random() * 120 + 90 // 3-7 months
        case 'DUE_DILIGENCE': return Math.random() * 90 + 30 // 1-4 months
        case 'INVESTMENT_READY': return Math.random() * 60 + 15 // 2 weeks - 2.5 months
        default: return Math.random() * 90 + 30
      }
    })()
    
    const closeDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
    return closeDate.toISOString().split('T')[0]
  }

  const getAssignedTeam = (venture: any) => {
    const team = []
    if (venture.createdBy?.name) team.push(venture.createdBy.name)
    if (venture.assignedTo?.name) team.push(venture.assignedTo.name)
    if (team.length === 0) team.push('Unassigned')
    return team
  }

  const getLastActivity = (venture: any) => {
    if (venture.updatedAt) {
      const diffMs = Date.now() - new Date(venture.updatedAt).getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffHours < 1) return 'Less than 1 hour ago'
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays < 7) return `${diffDays} days ago`
      return `${Math.floor(diffDays / 7)} weeks ago`
    }
    return 'Unknown'
  }

  const parseFounderTypes = (founderTypesJson: string) => {
    try {
      return JSON.parse(founderTypesJson || '[]')
    } catch {
      return []
    }
  }

  const parseSustainabilityGoals = (stgGoalsJson: string) => {
    try {
      const goals = JSON.parse(stgGoalsJson || '[]')
      return goals.map((goal: string) => goal.replace('SDG_', 'SDG '))
    } catch {
      return ['Sustainable Development']
    }
  }

  const generateDealAIInsights = (venture: any, gedsiScore: number, impactScore: number) => {
    const keyStrengths: string[] = []
    const areasForImprovement: string[] = []
    let riskLevel: "low" | "medium" | "high" = "medium"
    let recommendation = "Continue monitoring and provide targeted support"

    // Enhanced GEDSI Analysis
    if (gedsiScore >= 85) {
      keyStrengths.push("🎯 Exceptional GEDSI leadership and governance structure")
      keyStrengths.push("📊 Strong compliance with IRIS+ GEDSI standards")
      riskLevel = "low"
    } else if (gedsiScore >= 70) {
      keyStrengths.push("✅ Good GEDSI foundation with clear leadership commitment")
    } else if (gedsiScore < 50) {
      areasForImprovement.push("⚠️ GEDSI integration requires fundamental restructuring")
      areasForImprovement.push("📋 Implement IRIS+ OI.16 GEDSI policy adoption")
      riskLevel = "high"
    }

    // Enhanced Impact Score Analysis (based on new 5-component system)
    if (impactScore >= 90) {
      keyStrengths.push("🌟 Outstanding multi-dimensional social impact across all IRIS+ categories")
      keyStrengths.push("🏆 Verified metrics demonstrate measurable community outcomes")
      recommendation = "Premium impact venture - fast-track for investment committee"
      riskLevel = "low"
    } else if (impactScore >= 75) {
      keyStrengths.push("📈 Strong social impact with verified IRIS+ metrics implementation")
      keyStrengths.push("🎯 Clear SDG alignment and measurable community benefits")
      recommendation = "High-potential impact venture - recommend due diligence advancement"
    } else if (impactScore >= 60) {
      keyStrengths.push("💡 Solid impact foundation with room for metric enhancement")
      areasForImprovement.push("📊 Expand IRIS+ metrics tracking and verification (OI.15-18)")
      recommendation = "Moderate impact potential - provide metrics development support"
    } else if (impactScore < 45) {
      areasForImprovement.push("🚨 Critical impact deficiency - requires comprehensive restructuring")
      areasForImprovement.push("📋 Implement basic IRIS+ framework (OI.1-14) before advancement")
      areasForImprovement.push("🎯 Establish clear SDG alignment and measurement systems")
      recommendation = "High-risk venture - intensive impact development required"
      riskLevel = "high"
    }

    // Leadership & Founder Analysis (IRIS+ OI.1, OI.6, OI.11, OI.12, OI.14)
    try {
      const founderTypes = Array.isArray(venture.founderTypes) 
        ? venture.founderTypes 
        : JSON.parse(venture.founderTypes || '[]')
      
      if (founderTypes.includes("women-led")) {
        keyStrengths.push("👩‍💼 Women-led venture aligns with IRIS+ OI.1 objectives")
      }
      if (founderTypes.includes("disability-inclusive")) {
        keyStrengths.push("♿ Disability-inclusive leadership supports IRIS+ OI.6 compliance")
      }
      if (founderTypes.includes("indigenous-led")) {
        keyStrengths.push("🌍 Indigenous leadership enhances IRIS+ OI.11 social inclusion")
      }
      if (founderTypes.includes("youth-led")) {
        keyStrengths.push("🌟 Youth leadership supports IRIS+ OI.12 generational inclusion")
      }
      if (founderTypes.length === 0) {
        areasForImprovement.push("👥 Diversify leadership to enhance GEDSI representation")
      }
    } catch (e) {
      areasForImprovement.push("📝 Clarify founder demographic information for IRIS+ compliance")
    }

    // Operational Impact Evidence Analysis
    const jobsCreated = venture.metrics?.jobsCreated || venture.gedsiMetricsSummary?.jobsCreated || 0
    const communities = venture.metrics?.communitiesServed || venture.gedsiMetricsSummary?.communitiesServed || 0
    
    if (jobsCreated > 50) {
      keyStrengths.push(`💼 Significant employment impact: ${jobsCreated} jobs created`)
    } else if (jobsCreated > 0) {
      keyStrengths.push(`💼 Positive employment impact: ${jobsCreated} jobs created`)
    } else {
      areasForImprovement.push("💼 Establish job creation metrics and tracking systems")
    }
    
    if (communities > 10) {
      keyStrengths.push(`🏘️ Broad community reach: ${communities} communities served`)
    } else if (communities > 0) {
      keyStrengths.push(`🏘️ Community impact: ${communities} communities served`)
    } else {
      areasForImprovement.push("🏘️ Develop community impact measurement and tracking")
    }

    // Business Fundamentals Analysis
    if (venture.revenue > 1000000) keyStrengths.push("💰 Proven revenue generation capability")
    if (venture.teamSize > 20) keyStrengths.push("👥 Experienced and scalable team structure")
    
    // Operational Readiness
    if (!venture.operationalReadiness?.businessPlan) areasForImprovement.push("📄 Business plan requires updating and completion")
    if (!venture.capitalReadiness?.dueDiligence) areasForImprovement.push("📋 Due diligence documentation incomplete")

    // Risk Assessment & Final Recommendations
    const combinedScore = (gedsiScore + impactScore) / 2
    
    if (combinedScore >= 85) {
      recommendation = "🚀 Exceptional GEDSI+Impact alignment - recommend immediate advancement to investment committee"
      riskLevel = "low"
    } else if (combinedScore >= 70) {
      recommendation = "✅ Strong GEDSI+Impact foundation - proceed with standard due diligence"
      riskLevel = "low"
    } else if (combinedScore >= 55) {
      recommendation = "⚡ Moderate potential - provide targeted IRIS+ framework support before advancement"
      riskLevel = "medium"
    } else {
      recommendation = "🔄 Requires comprehensive GEDSI+Impact development - consider intensive support program"
      riskLevel = "high"
      areasForImprovement.push("📈 Establish baseline IRIS+ metrics before re-evaluation")
    }

    return {
      riskLevel,
      recommendation,
      keyStrengths: keyStrengths.length > 0 ? keyStrengths.slice(0, 5) : ["🌱 Emerging opportunity with development potential"],
      areasForImprovement: areasForImprovement.length > 0 ? areasForImprovement.slice(0, 4) : ["📊 Continue current progress and metrics development"]
    }
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.inclusionFocus.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = selectedStage === "all" || deal.stage === selectedStage
    const matchesSector = selectedSector === "all" || deal.sector === selectedSector
    const matchesStatus = selectedStatus === "all" || deal.status === selectedStatus
    const matchesFounderType = selectedFounderType === "all" || deal.founderType.includes(selectedFounderType)
    
    return matchesSearch && matchesStage && matchesSector && matchesStatus && matchesFounderType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "paused": return <Clock className="h-4 w-4 text-yellow-500" />
      case "closed": return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "lost": return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case "paused": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case "closed": return <Badge variant="outline" className="bg-blue-100 text-blue-800">Closed</Badge>
      case "lost": return <Badge variant="destructive">Lost</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const totalDeals = deals.length
  const activeDeals = deals.filter(d => d.status === "active").length
  const totalValue = deals.reduce((sum, deal) => {
    const value = parseFloat(deal.dealSize.replace(/[^0-9.]/g, ''))
    return sum + (isNaN(value) ? 0 : value)
  }, 0)
  
  // Enhanced metric calculations with proper validation
  const avgGedsiScore = totalDeals > 0 ? 
    Math.min(100, Math.max(0, deals.reduce((sum, deal) => {
      const score = typeof deal.gedsiScore === 'number' && !isNaN(deal.gedsiScore) ? deal.gedsiScore : 0
      return sum + Math.min(100, Math.max(0, score))
    }, 0) / totalDeals)) : 0
    
  const avgImpactScore = totalDeals > 0 ? 
    Math.min(100, Math.max(0, deals.reduce((sum, deal) => {
      const score = typeof deal.impactScore === 'number' && !isNaN(deal.impactScore) ? deal.impactScore : 0
      return sum + Math.min(100, Math.max(0, score))
    }, 0) / totalDeals)) : 0
    
  const totalJobsCreated = deals.reduce((sum, deal) => {
    const jobs = typeof deal.metrics?.jobsCreated === 'number' && !isNaN(deal.metrics.jobsCreated) ? deal.metrics.jobsCreated : 0
    return sum + Math.max(0, jobs)
  }, 0)
  
  const totalCommunitiesServed = deals.reduce((sum, deal) => {
    const communities = typeof deal.metrics?.communitiesServed === 'number' && !isNaN(deal.metrics.communitiesServed) ? deal.metrics.communitiesServed : 0
    return sum + Math.max(0, communities)
  }, 0)
  
  const womenLedDeals = deals.filter(d => Array.isArray(d.founderType) && d.founderType.includes("women-led")).length
  const disabilityInclusiveDeals = deals.filter(d => d.metrics?.disabilityInclusive === true).length

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsViewDialogOpen(true)
  }

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsEditDialogOpen(true)
  }

  const handleExportPipeline = async () => {
    setIsExporting(true)
    
    // Simulate export process
    try {
      // In a real implementation, this would call an API to generate the export
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a CSV-like content for demo
      const csvContent = [
        'Company,Stage,Sector,Deal Size,GEDSI Score,Impact Score,Location,Inclusion Focus',
        ...filteredDeals.map(deal => 
          `"${deal.company}","${deal.stage}","${deal.sector}","${deal.dealSize}",${deal.gedsiScore},${deal.impactScore},"${deal.location}","${deal.inclusionFocus}"`
        )
      ].join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `miv-pipeline-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleAddNewDeal = () => {
    setIsAddDealDialogOpen(true)
  }

  const handleStageClick = (stage: string, stageDeals: Deal[]) => {
    setStageDealsDialog({
      open: true,
      stage,
      deals: stageDeals
    })
  }

  const handleStageFilter = (stage: string) => {
    if (selectedStageForFilter === stage) {
      setSelectedStageForFilter(null)
      setSelectedStage("all")
    } else {
      setSelectedStageForFilter(stage)
      setSelectedStage(stage)
    }
  }

  const getStageDealsForMovement = (fromStage: string, toStage: string) => {
    // In a real app, this would track deals that moved between stages recently
    const fromDeals = deals.filter(d => d.stage === fromStage)
    const toDeals = deals.filter(d => d.stage === toStage)
    
    // Simulate recent movements (in production, this would come from audit logs)
    const movements = Math.min(fromDeals.length, toDeals.length, 3)
    return movements
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Loading deal flow from database...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Error:</strong> {error}
            <Button variant="link" className="p-0 h-auto text-red-600 underline ml-2" onClick={fetchDeals}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      {!loading && !error && (
        <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deal Flow</h1>
          <p className="text-muted-foreground">
            Manage and track your impact venture pipeline with GEDSI analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleExportPipeline}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Export Pipeline
              </>
            )}
          </Button>
          <Button onClick={handleAddNewDeal}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Deal
        </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
                  {activeDeals} active deals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">${totalValue.toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
                  Average: ${(totalValue / totalDeals).toFixed(1)}M per deal
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-pink-500 bg-gradient-to-r from-pink-50 to-white dark:from-pink-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">GEDSI Score</CardTitle>
                <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {avgGedsiScore > 0 ? avgGedsiScore.toFixed(1) : '0'}%
                </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {womenLedDeals} women-led ventures
            </p>
            <div className="mt-2">
              <Progress value={avgGedsiScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Impact Score</CardTitle>
                <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {avgImpactScore > 0 ? avgImpactScore.toFixed(1) : '0'}%
                </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {totalCommunitiesServed} communities served
            </p>
            <div className="mt-2">
              <Progress value={avgImpactScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Impact Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jobs Created</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalJobsCreated}</div>
                <p className="text-xs text-muted-foreground">
                  Across all portfolio ventures
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Communities</CardTitle>
                <Globe className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCommunitiesServed}</div>
                <p className="text-xs text-muted-foreground">
                  Communities served
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Women-Led</CardTitle>
                <Heart className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{womenLedDeals}</div>
                <p className="text-xs text-muted-foreground">
                  {totalDeals > 0 ? ((womenLedDeals / totalDeals) * 100).toFixed(1) : '0'}% of portfolio
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disability Inclusive</CardTitle>
                <Shield className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{disabilityInclusiveDeals}</div>
                <p className="text-xs text-muted-foreground">
                  {totalDeals > 0 ? ((disabilityInclusiveDeals / totalDeals) * 100).toFixed(1) : '0'}% of portfolio
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                      placeholder="Search deals, companies, focus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {founderTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Pipeline Flow Analysis
          </CardTitle>
          <CardDescription>
            Interactive venture pipeline with conversion rates and flow metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalDeals === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No deals found in pipeline</p>
              <p className="text-sm text-muted-foreground">Add ventures to see pipeline flow analysis</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pipeline Flow Diagram */}
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground">DEAL FLOW PROGRESSION</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>High Conversion</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Bottleneck</span>
                    </div>
                  </div>
                </div>
                
                {/* Interactive Flow Chart */}
                <div className="flex items-center justify-between relative">
                  {stages.slice(0, 6).map((stage, index) => {
                    const stageDeals = deals.filter(d => d.stage === stage)
                    const nextStageDeals = index < stages.length - 1 ? deals.filter(d => d.stage === stages[index + 1]) : []
                    const conversionRate = index < stages.length - 1 && stageDeals.length > 0 
                      ? ((nextStageDeals.length / stageDeals.length) * 100).toFixed(0)
                      : null
                    
                    const isBottleneck = stageDeals.length > 0 && conversionRate && parseFloat(conversionRate) < 30
                    const isHighConversion = conversionRate && parseFloat(conversionRate) > 70
                    const isSelected = selectedStageForFilter === stage
                    const isHovered = hoveredStage === stage
                    const recentMovements = index > 0 ? getStageDealsForMovement(stages[index - 1], stage) : 0
                    
                    return (
                      <div key={stage} className="flex-1 relative">
                        {/* Stage Card - Now Interactive */}
                        <div 
                          className={`
                            relative bg-white border-2 rounded-lg p-4 text-center transition-all duration-200 cursor-pointer
                            hover:shadow-xl hover:scale-105 transform
                            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                            ${isBottleneck ? 'border-red-200 bg-red-50 hover:bg-red-100' : 
                              isHighConversion ? 'border-green-200 bg-green-50 hover:bg-green-100' : 
                              'border-blue-200 bg-blue-50 hover:bg-blue-100'}
                            ${isHovered ? 'shadow-lg' : ''}
                          `}
                          onClick={() => handleStageClick(stage, stageDeals)}
                          onMouseEnter={() => setHoveredStage(stage)}
                          onMouseLeave={() => setHoveredStage(null)}
                          title={`Click to view ${stageDeals.length} deals in ${stage} stage`}
                        >
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            {stage}
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            {stageDeals.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {totalDeals > 0 ? ((stageDeals.length / totalDeals) * 100).toFixed(0) : 0}% of total
                          </div>
                          
                          {/* Recent Movement Indicator */}
                          {recentMovements > 0 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                              {recentMovements}
                            </div>
                          )}
                          
                          {/* Stage indicator dot */}
                          <div className={`
                            absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white transition-all duration-200
                            ${isSelected ? 'w-5 h-5 ring-2 ring-blue-300' : ''}
                            ${isBottleneck ? 'bg-red-500' : 
                              isHighConversion ? 'bg-green-500' : 
                              'bg-blue-500'}
                          `}></div>
                          
                          {/* Interactive Overlay */}
                          {isHovered && (
                            <div className="absolute inset-0 bg-white bg-opacity-10 rounded-lg pointer-events-none" />
                          )}
                        </div>
                        
                        {/* Enhanced Arrow and Conversion Rate */}
                        {index < stages.slice(0, 6).length - 1 && (
                          <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                            <div className="flex items-center">
                              <ArrowRight className={`
                                h-4 w-4 transition-all duration-200
                                ${isBottleneck ? 'text-red-500' : 
                                  isHighConversion ? 'text-green-500' : 
                                  'text-blue-500'}
                                ${(hoveredStage === stage || hoveredStage === stages[index + 1]) ? 'scale-125' : ''}
                              `} />
                            </div>
                            {conversionRate && (
                              <div className={`
                                absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium px-2 py-1 rounded transition-all duration-200
                                ${(hoveredStage === stage || hoveredStage === stages[index + 1]) ? 'scale-110 font-bold' : ''}
                                ${isBottleneck ? 'bg-red-100 text-red-700' : 
                                  isHighConversion ? 'bg-green-100 text-green-700' : 
                                  'bg-blue-100 text-blue-700'}
                              `}>
                                {conversionRate}%
                              </div>
                            )}
                            
                            {/* Movement Animation */}
                            {recentMovements > 0 && (
                              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping" 
                                     style={{
                                       left: '50%',
                                       top: '50%',
                                       animationDelay: '0s',
                                       animationDuration: '2s'
                                     }} />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Quick Action Button */}
                        {isHovered && stageDeals.length > 0 && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-6 px-2 bg-white shadow-md"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStageFilter(stage)
                              }}
                            >
                              {isSelected ? 'Clear Filter' : 'Filter Deals'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Pipeline Metrics */}
              <div className="grid gap-4 md:grid-cols-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalDeals}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {deals.filter(d => ['Funded', 'Series A', 'Series B', 'Series C'].includes(d.stage)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Funded Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {totalDeals > 0 ? 
                      (((deals.filter(d => ['Funded', 'Series A', 'Series B', 'Series C'].includes(d.stage)).length) / totalDeals) * 100).toFixed(1) 
                      : '0.0'}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(avgGedsiScore)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg GEDSI Score</div>
                </div>
              </div>
              
              {/* Stage Performance Indicators */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">STAGE PERFORMANCE ANALYSIS</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {(() => {
                    const bottlenecks = []
                    const highPerformers = []
                    
                    for (let i = 0; i < stages.slice(0, 5).length; i++) {
                      const currentStage = stages[i]
                      const nextStage = stages[i + 1]
                      const currentDeals = deals.filter(d => d.stage === currentStage)
                      const nextDeals = deals.filter(d => d.stage === nextStage)
                      
                      if (currentDeals.length > 0 && nextDeals.length > 0) {
                        const conversionRate = (nextDeals.length / currentDeals.length) * 100
                        
                        if (conversionRate < 30 && currentDeals.length > 2) {
                          bottlenecks.push({
                            from: currentStage,
                            to: nextStage,
                            rate: conversionRate.toFixed(0),
                            deals: currentDeals.length
                          })
                        } else if (conversionRate > 70) {
                          highPerformers.push({
                            from: currentStage,
                            to: nextStage,
                            rate: conversionRate.toFixed(0),
                            deals: currentDeals.length
                          })
                        }
                      }
                    }
                    
                    return (
                      <>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-red-700">Bottlenecks Detected</span>
                          </div>
                          {bottlenecks.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No significant bottlenecks detected</p>
                          ) : (
                            <div className="space-y-1">
                              {bottlenecks.map((bottleneck, idx) => (
                                <div key={idx} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                                  {bottleneck.from} → {bottleneck.to}: {bottleneck.rate}% conversion ({bottleneck.deals} deals)
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">High Performers</span>
                          </div>
                          {highPerformers.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No high-performing transitions identified</p>
                          ) : (
                            <div className="space-y-1">
                              {highPerformers.map((performer, idx) => (
                                <div key={idx} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                  {performer.from} → {performer.to}: {performer.rate}% conversion ({performer.deals} deals)
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deals ({filteredDeals.length})</CardTitle>
          <CardDescription>
                Manage your impact venture pipeline deals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                    <TableHead>Venture</TableHead>
                <TableHead>Stage</TableHead>
                    <TableHead>Impact Scores</TableHead>
                <TableHead>Deal Size</TableHead>
                    <TableHead>Founder Type</TableHead>
                <TableHead>Team</TableHead>
                    <TableHead>AI Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deal.company}</div>
                      <div className="text-sm text-muted-foreground">{deal.location}</div>
                          <div className="text-xs text-muted-foreground mt-1">{deal.inclusionFocus}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{deal.stage}</Badge>
                  </TableCell>
                  <TableCell>
                        <div className="space-y-1">
                    <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 text-pink-500" />
                            <span className="text-xs">GEDSI: {deal.gedsiScore}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-green-500" />
                            <span className="text-xs">Impact: {deal.impactScore}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-blue-500" />
                            <span className="text-xs">Ready: {deal.readinessScore}%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{deal.dealSize}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {deal.founderType.slice(0, 2).map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type.replace('-', ' ')}
                            </Badge>
                          ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {deal.team.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-600"
                        >
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {deal.team.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{deal.team.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                      <TableCell>
                        <Badge 
                          variant={deal.aiInsights.riskLevel === "low" ? "default" : 
                                 deal.aiInsights.riskLevel === "medium" ? "secondary" : "destructive"}
                          className={
                            deal.aiInsights.riskLevel === "low" ? "bg-green-100 text-green-800" :
                            deal.aiInsights.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }
                        >
                          {deal.aiInsights.riskLevel}
                        </Badge>
                      </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deal.status)}
                      {getStatusBadge(deal.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDeal(deal)}
                          >
                        <Eye className="h-4 w-4" />
                      </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditDeal(deal)}
                          >
                        <Edit className="h-4 w-4" />
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

        <TabsContent value="impact" className="space-y-6">
          {/* Impact Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  Impact Metrics Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Jobs Created</span>
                    <span className="font-medium">{totalJobsCreated.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Communities Served</span>
                    <span className="font-medium">{totalCommunitiesServed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average GEDSI Score</span>
                    <span className="font-medium">{avgGedsiScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Impact Score</span>
                    <span className="font-medium">{avgImpactScore.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  GEDSI Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Women-Led Ventures</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{womenLedDeals}</span>
                      <Badge variant="secondary">
                        {((womenLedDeals / totalDeals) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disability Inclusive</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{disabilityInclusiveDeals}</span>
                      <Badge variant="secondary">
                        {((disabilityInclusiveDeals / totalDeals) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Youth-Led Ventures</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {deals.filter(d => d.founderType.includes("youth-led")).length}
                      </span>
                      <Badge variant="secondary">
                        {totalDeals > 0 ? ((deals.filter(d => d.founderType.includes("youth-led")).length / totalDeals) * 100).toFixed(1) : 0}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rural Focus</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {deals.filter(d => d.founderType.includes("rural-focus")).length}
                      </span>
                      <Badge variant="secondary">
                        {totalDeals > 0 ? ((deals.filter(d => d.founderType.includes("rural-focus")).length / totalDeals) * 100).toFixed(1) : 0}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Details by Venture */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Details by Venture</CardTitle>
              <CardDescription>
                Detailed impact metrics for each venture in the pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{deal.company}</h4>
                        <p className="text-sm text-muted-foreground">{deal.inclusionFocus}</p>
                      </div>
                      <Badge variant="outline">{deal.stage}</Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Jobs Created</p>
                        <p className="font-medium">{deal.metrics.jobsCreated.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Communities</p>
                        <p className="font-medium">{deal.metrics.communitiesServed}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Women Leadership</p>
                        <p className="font-medium">{deal.metrics.womenLeadership}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Disability Inclusive</p>
                        <div className="flex items-center gap-1">
                          {deal.metrics.disabilityInclusive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {deal.metrics.disabilityInclusive ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-1">
                        {deal.sustainabilityGoals.map((goal, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Low Risk Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deals.filter(d => d.aiInsights.riskLevel === "low").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalDeals > 0 ? ((deals.filter(d => d.aiInsights.riskLevel === "low").length / totalDeals) * 100).toFixed(1) : 0}% of portfolio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Medium Risk Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deals.filter(d => d.aiInsights.riskLevel === "medium").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalDeals > 0 ? ((deals.filter(d => d.aiInsights.riskLevel === "medium").length / totalDeals) * 100).toFixed(1) : 0}% of portfolio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  High Risk Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deals.filter(d => d.aiInsights.riskLevel === "high").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalDeals > 0 ? ((deals.filter(d => d.aiInsights.riskLevel === "high").length / totalDeals) * 100).toFixed(1) : 0}% of portfolio
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered insights and recommendations for each venture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deals.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{deal.company}</h4>
                        <p className="text-sm text-muted-foreground">{deal.location}</p>
                      </div>
                      <Badge 
                        variant={deal.aiInsights.riskLevel === "low" ? "default" : 
                               deal.aiInsights.riskLevel === "medium" ? "secondary" : "destructive"}
                        className={
                          deal.aiInsights.riskLevel === "low" ? "bg-green-100 text-green-800" :
                          deal.aiInsights.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }
                      >
                        {deal.aiInsights.riskLevel} risk
                      </Badge>
                    </div>
                    
                    <Alert className="mb-4">
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        {deal.aiInsights.recommendation}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Key Strengths
                        </h5>
                        <ul className="space-y-1">
                          {deal.aiInsights.keyStrengths.map((strength, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <ArrowRight className="h-4 w-4 text-orange-500" />
                          Areas for Improvement
                        </h5>
                        <ul className="space-y-1">
                          {deal.aiInsights.areasForImprovement.map((area, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Deal Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedDeal?.company}
            </DialogTitle>
            <DialogDescription>
              Detailed view of venture information and metrics
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeal && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Company:</span>
                      <span className="font-medium">{selectedDeal.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Deal ID:</span>
                      <span className="font-medium">{selectedDeal.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="font-medium">{selectedDeal.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sector:</span>
                      <Badge variant="outline">{selectedDeal.sector}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stage:</span>
                      <Badge variant="outline">{selectedDeal.stage}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Deal Size:</span>
                      <span className="font-medium text-lg">{selectedDeal.dealSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Probability:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDeal.probability} className="w-20 h-2" />
                        <span className="font-medium">{selectedDeal.probability}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Impact Scores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Heart className="h-4 w-4 text-pink-500" />
                        GEDSI Score:
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDeal.gedsiScore} className="w-20 h-2" />
                        <span className="font-medium">{selectedDeal.gedsiScore}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Globe className="h-4 w-4 text-green-500" />
                        Impact Score:
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDeal.impactScore} className="w-20 h-2" />
                        <span className="font-medium">{selectedDeal.impactScore}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Target className="h-4 w-4 text-blue-500" />
                        Readiness Score:
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDeal.readinessScore} className="w-20 h-2" />
                        <span className="font-medium">{selectedDeal.readinessScore}%</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-2">AI Risk Assessment:</p>
                      <Badge 
                        variant={selectedDeal.aiInsights.riskLevel === "low" ? "default" : 
                               selectedDeal.aiInsights.riskLevel === "medium" ? "secondary" : "destructive"}
                        className={
                          selectedDeal.aiInsights.riskLevel === "low" ? "bg-green-100 text-green-800" :
                          selectedDeal.aiInsights.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }
                      >
                        {selectedDeal.aiInsights.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Inclusion Focus */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inclusion Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedDeal.inclusionFocus}</p>
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">Founder Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDeal.founderType.map((type, index) => (
                        <Badge key={index} variant="secondary">
                          {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedDeal.metrics.jobsCreated.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Jobs Created</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedDeal.metrics.communitiesServed}
                      </div>
                      <p className="text-sm text-muted-foreground">Communities Served</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">
                        {selectedDeal.metrics.womenLeadership}%
                      </div>
                      <p className="text-sm text-muted-foreground">Women Leadership</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedDeal.metrics.disabilityInclusive ? "✓" : "✗"}
                      </div>
                      <p className="text-sm text-muted-foreground">Disability Inclusive</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sustainability Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sustainability Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedDeal.sustainabilityGoals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    AI Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      {selectedDeal.aiInsights.recommendation}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Key Strengths
                      </h4>
                      <ul className="space-y-1">
                        {selectedDeal.aiInsights.keyStrengths.map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1 text-orange-600">
                        <ArrowRight className="h-4 w-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {selectedDeal.aiInsights.areasForImprovement.map((area, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {selectedDeal.team.map((member, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-sm font-medium text-blue-600"
                        >
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Team Members:</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDeal.team.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Deal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit {selectedDeal?.company}
            </DialogTitle>
            <DialogDescription>
              Update venture information and metrics
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeal && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Mode:</strong> This is a read-only demo. In the full version, you would be able to edit venture details, update scores, change stages, and modify team information.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input value={selectedDeal.company} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stage</label>
                  <Select value={selectedDeal.stage} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stage => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sector</label>
                  <Select value={selectedDeal.sector} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deal Size</label>
                  <Input value={selectedDeal.dealSize} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GEDSI Score (%)</label>
                  <Input value={selectedDeal.gedsiScore} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Impact Score (%)</label>
                  <Input value={selectedDeal.impactScore} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Inclusion Focus</label>
                <Input value={selectedDeal.inclusionFocus} disabled />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button disabled>
                  Save Changes (Demo)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Deal Dialog */}
      <Dialog open={isAddDealDialogOpen} onOpenChange={setIsAddDealDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Deal
            </DialogTitle>
            <DialogDescription>
              Create a new venture deal in the pipeline
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Mode:</strong> This form demonstrates the add new deal functionality. In the full version, this would create a new deal record in the database.
              </AlertDescription>
            </Alert>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name *</label>
                    <Input placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deal Size *</label>
                    <Input placeholder="e.g., $2.5M" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sector *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location *</label>
                    <Input placeholder="City, Country" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stage *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map(stage => (
                          <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expected Close Date</label>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GEDSI Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GEDSI & Impact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Inclusion Focus *</label>
                  <Input placeholder="Describe the venture's inclusion focus" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Founder Types</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {founderTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <input type="checkbox" id={type} className="rounded" />
                        <label htmlFor={type} className="text-sm">
                          {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GEDSI Score (%)</label>
                    <Input type="number" min="0" max="100" placeholder="0-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Impact Score (%)</label>
                    <Input type="number" min="0" max="100" placeholder="0-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Readiness Score (%)</label>
                    <Input type="number" min="0" max="100" placeholder="0-100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expected Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Jobs to be Created</label>
                    <Input type="number" min="0" placeholder="Number of jobs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Communities to Serve</label>
                    <Input type="number" min="0" placeholder="Number of communities" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Women Leadership (%)</label>
                    <Input type="number" min="0" max="100" placeholder="0-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Disability Inclusive</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team Members</label>
                  <Input placeholder="Enter team member names (comma separated)" />
                  <p className="text-xs text-muted-foreground">
                    Enter names separated by commas, e.g., "John Doe, Jane Smith, Alex Johnson"
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDealDialogOpen(false)}>
                Cancel
              </Button>
              <Button disabled>
                Create Deal (Demo)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stage Deals Dialog */}
      <Dialog open={stageDealsDialog.open} onOpenChange={(open) => setStageDealsDialog(prev => ({...prev, open}))}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {stageDealsDialog.stage} Stage - {stageDealsDialog.deals.length} Deals
            </DialogTitle>
            <DialogDescription>
              Detailed view of all deals currently in the {stageDealsDialog.stage} stage
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Stage Summary */}
            <div className="grid gap-4 md:grid-cols-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stageDealsDialog.deals.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${stageDealsDialog.deals.reduce((sum, deal) => {
                    const value = parseFloat(deal.dealSize.replace(/[^0-9.]/g, ''))
                    return sum + value
                  }, 0).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stageDealsDialog.deals.length > 0 ? 
                    Math.round(stageDealsDialog.deals.reduce((sum, deal) => sum + deal.gedsiScore, 0) / stageDealsDialog.deals.length)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Avg GEDSI Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stageDealsDialog.deals.filter(d => d.founderType.includes("women-led")).length}
                </div>
                <div className="text-sm text-muted-foreground">Women-Led</div>
              </div>
            </div>

            {/* Deals List */}
            {stageDealsDialog.deals.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No deals found in this stage</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stageDealsDialog.deals.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-lg">{deal.company}</h4>
                          <Badge variant="outline" className="text-xs">
                            {deal.sector}
                          </Badge>
                          <Badge 
                            variant={deal.aiInsights.riskLevel === "low" ? "default" : 
                                   deal.aiInsights.riskLevel === "medium" ? "secondary" : "destructive"}
                            className={
                              deal.aiInsights.riskLevel === "low" ? "bg-green-100 text-green-800" :
                              deal.aiInsights.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {deal.aiInsights.riskLevel} risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{deal.location}</p>
                        <p className="text-sm">{deal.inclusionFocus}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600 mb-1">{deal.dealSize}</div>
                        <div className="text-sm text-muted-foreground">Deal Value</div>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-4 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Heart className="h-3 w-3 text-pink-500" />
                          <span className="text-xs text-muted-foreground">GEDSI Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={deal.gedsiScore} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{deal.gedsiScore}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-muted-foreground">Impact Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={deal.impactScore} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{deal.impactScore}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-muted-foreground">Readiness</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={deal.readinessScore} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{deal.readinessScore}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-muted-foreground">Expected Close</span>
                        </div>
                        <div className="text-sm font-medium">{deal.expectedClose}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{deal.team.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            handleViewDeal(deal)
                            setStageDealsDialog(prev => ({...prev, open: false}))
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            handleEditDeal(deal)
                            setStageDealsDialog(prev => ({...prev, open: false}))
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleStageFilter(stageDealsDialog.stage)
                    setStageDealsDialog(prev => ({...prev, open: false}))
                  }}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filter by This Stage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStageDealsDialog(prev => ({...prev, open: false}))
                    handleAddNewDeal()
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Deal to Stage
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setStageDealsDialog(prev => ({...prev, open: false}))}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
} 