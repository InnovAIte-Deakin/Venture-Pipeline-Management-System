"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateGEDSIScore, getGEDSIScoreInterpretation, calculateGEDSIComplianceRate } from "@/lib/gedsi-utils"
import { 
  Building2, 
  Search, 
  Plus, 
  Eye, 
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  Activity,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Shield,
  Sparkles,
  Download,
  MessageSquare,
  ArrowUpRight,
  Bell,
  Zap,
  Award,
  Calculator,
  RefreshCw,
  X
} from "lucide-react"

interface PortfolioCompany {
  id: string
  name: string
  sector: string
  stage: string
  location: string
  status: string
  founderTypes: string
  gedsiGoals: string
  inclusionFocus: string
  createdAt: string
  updatedAt: string
  gedsiMetrics: any[]
  capitalActivities: any[]
  _count: {
    documents: number
    activities: number
    capitalActivities: number
  }
  // Calculated fields
  gedsiScore?: number
  impactScore?: number
  readinessScore?: number
  aiInsights?: {
    riskLevel: "low" | "medium" | "high"
    priority: "urgent" | "high" | "medium" | "low"
    nextAction: string
    daysUntilAction: number
    alerts: string[]
  }
}

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFounderType, setSelectedFounderType] = useState("all")
  const [selectedStageFilter, setSelectedStageFilter] = useState("portfolio") // "all" or "portfolio"
  const [selectedCompany, setSelectedCompany] = useState<PortfolioCompany | null>(null)
  const [isCompanyViewOpen, setIsCompanyViewOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalVenturesCount, setTotalVenturesCount] = useState(0)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [selectedActionCompany, setSelectedActionCompany] = useState<PortfolioCompany | null>(null)

  // Fetch portfolio companies from database
  useEffect(() => {
    fetchPortfolioCompanies()
  }, [selectedStageFilter])

  const fetchPortfolioCompanies = async () => {
    try {
      setLoading(true)
      
      // Fetch all ventures from the database (since API doesn't support multiple status filtering)
      const response = await fetch('/api/ventures?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      const allVentures = data.ventures || []
      
      // Debug: Log all ventures and their statuses/stages
      console.log(`📊 Found ${allVentures.length} total ventures in database:`)
      const statusCounts = allVentures.reduce((acc: any, venture: any) => {
        acc[venture.status || 'UNDEFINED'] = (acc[venture.status || 'UNDEFINED'] || 0) + 1
        return acc
      }, {})
      const stageCounts = allVentures.reduce((acc: any, venture: any) => {
        acc[venture.stage || 'UNDEFINED'] = (acc[venture.stage || 'UNDEFINED'] || 0) + 1
        return acc
      }, {})
      console.log('📈 Status breakdown:', statusCounts)
      console.log('🎭 Stage breakdown:', stageCounts)
      
      // Define portfolio-relevant stages
      const portfolioStages = ['FUNDED', 'EXITED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'INVESTMENT_READY', 'DUE_DILIGENCE']
      
      // Filter based on selected stage filter
      const ventures = selectedStageFilter === "all" 
        ? allVentures 
        : allVentures.filter((venture: any) => portfolioStages.includes(venture.stage))
      
      console.log(`🎯 Filtered to ${ventures.length} companies with filter: ${selectedStageFilter}`, {
        portfolioStages: selectedStageFilter === "portfolio" ? portfolioStages : "all stages",
        totalVentures: allVentures.length,
        filteredVentures: ventures.length
      })
      
      // Store total count for better error messaging
      setTotalVenturesCount(allVentures.length)
      
      // Transform database ventures into portfolio companies with calculated metrics
      const portfolioData = await Promise.all(
        ventures.map(async (venture: any) => {
          // Calculate GEDSI score using the proper utility
          const gedsiScore = calculateGEDSIScore(venture)

          // Calculate impact score based on real database factors
          const impactScore = calculateImpactScore(venture)
          
          // Calculate readiness score from database fields
          const readinessScore = calculateReadinessScore(venture)
          
          // Debug logging for troubleshooting
          console.log(`📊 ${venture.name}: GEDSI=${gedsiScore}, Impact=${impactScore}, Readiness=${readinessScore}`, {
            revenue: venture.revenue,
            fundingRaised: venture.fundingRaised,
            teamSize: venture.teamSize,
            gedsiMetricsCount: venture.gedsiMetrics?.length || 0
          })
          
          // Generate AI insights from real data
          const aiInsights = generateAIInsights(venture, gedsiScore, impactScore)
          
          return {
            id: venture.id,
            name: venture.name,
            sector: venture.sector || 'Technology',
            stage: venture.stage || 'Seed',
            location: venture.location || 'Southeast Asia',
            status: venture.status || 'ACTIVE',
            founderTypes: venture.founderTypes || '[]',
            gedsiGoals: venture.gedsiGoals || '[]',
            inclusionFocus: venture.inclusionFocus || 'Impact-focused venture',
            createdAt: venture.createdAt,
            updatedAt: venture.updatedAt,
            gedsiMetrics: venture.gedsiMetrics || [],
            capitalActivities: venture.capitalActivities || [],
            _count: venture._count || { documents: 0, activities: 0, capitalActivities: 0 },
            gedsiScore,
            impactScore,
            readinessScore,
            aiInsights
          }
        })
      )
      
      setPortfolioCompanies(portfolioData)
      console.log(`✅ Successfully loaded ${portfolioData.length} portfolio companies`)
    } catch (err) {
      console.error('❌ Error fetching portfolio companies:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to load portfolio companies: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateImpactScore = (venture: any) => {
    try {
      let score = 40 // Base score
      
      // Financial impact indicators (from real database fields)
      const revenue = parseFloat(venture.revenue) || 0
      const fundingRaised = parseFloat(venture.fundingRaised) || 0
      const teamSize = parseInt(venture.teamSize) || 0
      
      // Debug logging
      console.log(`💰 Impact calculation for ${venture.name}:`, {
        revenue: venture.revenue,
        fundingRaised: venture.fundingRaised,
        teamSize: venture.teamSize,
        parsedRevenue: revenue,
        parsedFunding: fundingRaised,
        parsedTeamSize: teamSize,
        baseScore: score
      })
      
      // Ensure all calculations are safe
      if (revenue > 0 && !isNaN(revenue)) {
        const revenuePoints = Math.min(revenue / 100000, 20)
        if (!isNaN(revenuePoints)) {
          score += revenuePoints
          console.log(`  Revenue points: ${revenuePoints} (${revenue} / 100000)`)
        }
      }
      
      if (fundingRaised > 0 && !isNaN(fundingRaised)) {
        const fundingPoints = Math.min(fundingRaised / 1000000, 15)
        if (!isNaN(fundingPoints)) {
          score += fundingPoints
          console.log(`  Funding points: ${fundingPoints} (${fundingRaised} / 1000000)`)
        }
      }
      
      if (teamSize > 1 && !isNaN(teamSize)) {
        const teamPoints = Math.min(teamSize, 10)
        if (!isNaN(teamPoints)) {
          score += teamPoints
          console.log(`  Team points: ${teamPoints}`)
        }
      }
      
      // GEDSI goals impact (from database JSON field)
      try {
        const goals = venture.gedsiGoals ? (Array.isArray(venture.gedsiGoals) ? venture.gedsiGoals : JSON.parse(venture.gedsiGoals)) : []
        const gedsiPoints = Math.min(goals.length * 3, 15)
        if (!isNaN(gedsiPoints)) {
          score += gedsiPoints
          console.log(`  GEDSI goals points: ${gedsiPoints}`)
        }
      } catch (e) {
        console.warn('Error parsing GEDSI goals:', e)
      }
      
      // Founder diversity impact (from database field)
      try {
        const founderTypes = Array.isArray(venture.founderTypes) ? venture.founderTypes : JSON.parse(venture.founderTypes || '[]')
        let founderPoints = 0
        if (founderTypes.includes('women-led')) founderPoints += 8
        if (founderTypes.includes('disability-inclusive')) founderPoints += 8
        if (founderTypes.includes('rural-focus')) founderPoints += 5
        if (founderTypes.includes('indigenous-led')) founderPoints += 6
        if (founderTypes.includes('youth-led')) founderPoints += 4
        
        if (!isNaN(founderPoints) && founderPoints > 0) {
          score += founderPoints
          console.log(`  Founder diversity points: ${founderPoints}`)
        }
      } catch (e) {
        console.warn('Error parsing founder types:', e)
      }
      
      // GEDSI metrics completion (from actual metrics)
      if (venture.gedsiMetrics?.length > 0) {
        const verifiedMetrics = venture.gedsiMetrics.filter((m: any) => m.status === 'VERIFIED' || m.status === 'COMPLETED')
        const metricsPoints = Math.min(verifiedMetrics.length * 2, 10)
        if (!isNaN(metricsPoints)) {
          score += metricsPoints
          console.log(`  GEDSI metrics points: ${metricsPoints}`)
        }
      }
      
      // Stage-based impact multiplier
      const stageMultipliers: { [key: string]: number } = {
        'FUNDED': 1.2,
        'SERIES_A': 1.3,
        'SERIES_B': 1.4,
        'SERIES_C': 1.5,
        'EXITED': 1.6
      }
      
      const multiplier = stageMultipliers[venture.stage] || 1.0
      if (!isNaN(multiplier) && !isNaN(score)) {
        score = score * multiplier
      }
      
      const finalScore = Math.min(Math.round(score), 100)
      console.log(`  Final impact score for ${venture.name}: ${finalScore} (before multiplier: ${score / multiplier}, multiplier: ${multiplier})`)
      
      // Safety check for NaN
      if (isNaN(finalScore)) {
        console.error(`❌ NaN detected in impact score for ${venture.name}, returning 40`)
        return 40
      }
      
      return finalScore
    } catch (error) {
      console.error(`❌ Error calculating impact score for ${venture.name}:`, error)
      return 40 // Safe fallback
    }
  }

  const calculateReadinessScore = (venture: any) => {
    let score = 30 // Base score
    
    // Operational readiness (from database JSON field)
    try {
      const operationalReadiness = venture.operationalReadiness || {}
      const operationalChecks = Object.values(operationalReadiness).filter(Boolean).length
      const totalOperationalChecks = Object.keys(operationalReadiness).length || 10 // Assume 10 if empty
      if (totalOperationalChecks > 0) {
        score += (operationalChecks / totalOperationalChecks) * 35 // Up to 35 points
      }
    } catch (e) {
      console.warn('Error parsing operational readiness:', e)
    }
    
    // Capital readiness (from database JSON field)
    try {
      const capitalReadiness = venture.capitalReadiness || {}
      const capitalChecks = Object.values(capitalReadiness).filter(Boolean).length
      const totalCapitalChecks = Object.keys(capitalReadiness).length || 10 // Assume 10 if empty
      if (totalCapitalChecks > 0) {
        score += (capitalChecks / totalCapitalChecks) * 35 // Up to 35 points
      }
    } catch (e) {
      console.warn('Error parsing capital readiness:', e)
    }
    
    // Additional readiness indicators from real data
    const revenue = parseFloat(venture.revenue) || 0
    const teamSize = parseInt(venture.teamSize) || 0
    
    if (revenue > 0) score += 5 // Has revenue
    if (teamSize >= 3) score += 5 // Adequate team size
    if (venture.website) score += 3 // Has online presence
    if (venture.pitchSummary && venture.pitchSummary.length > 100) score += 2 // Good pitch summary
    
    // Document completeness
    const docCount = venture._count?.documents || 0
    if (docCount >= 5) score += 5 // Well documented
    else if (docCount >= 3) score += 3
    else if (docCount >= 1) score += 1
    
    return Math.min(Math.round(score), 100)
  }

  const generateAIInsights = (venture: any, gedsiScore: number, impactScore: number) => {
    const alerts: string[] = []
    let priority: "urgent" | "high" | "medium" | "low" = "medium"
    let nextAction = "Continue monitoring performance"
    let daysUntilAction = 30
    
    // Try to use real AI analysis data first
    try {
      const aiAnalysis = venture.aiAnalysis ? (typeof venture.aiAnalysis === 'string' ? JSON.parse(venture.aiAnalysis) : venture.aiAnalysis) : null
      
      if (aiAnalysis) {
        // Use AI-generated insights if available
        if (aiAnalysis.riskAssessment) {
          if (aiAnalysis.riskAssessment.includes('high risk') || aiAnalysis.riskAssessment.includes('urgent')) {
            priority = "urgent"
            daysUntilAction = 3
          } else if (aiAnalysis.riskAssessment.includes('medium risk')) {
            priority = "high"
            daysUntilAction = 7
          }
        }
        
        if (aiAnalysis.recommendations && Array.isArray(aiAnalysis.recommendations)) {
          nextAction = aiAnalysis.recommendations[0] || nextAction
        }
        
        if (aiAnalysis.alerts && Array.isArray(aiAnalysis.alerts)) {
          alerts.push(...aiAnalysis.alerts)
        }
      }
    } catch (e) {
      console.warn('Error parsing AI analysis:', e)
    }
    
    // Fallback to calculated insights if no AI data
    if (alerts.length === 0) {
      // Determine priority based on scores
      if (gedsiScore < 60) {
        priority = "urgent"
        nextAction = "Improve GEDSI metrics and inclusion practices"
        daysUntilAction = 7
        alerts.push("GEDSI score below acceptable threshold")
      } else if (gedsiScore < 75) {
        priority = "high"
        nextAction = "Review and enhance GEDSI integration"
        daysUntilAction = 14
        alerts.push("GEDSI score needs improvement")
      } else if (impactScore > 85) {
        priority = "high"
        nextAction = "Consider additional investment or expansion support"
        daysUntilAction = 14
        alerts.push("High impact performance - scaling opportunity")
      }
      
      // Add venture-specific insights based on real data
      if (venture.gedsiMetrics?.length === 0) {
        alerts.push("No GEDSI metrics recorded")
        if (priority === "medium") priority = "high"
      }
      
      if (venture._count?.capitalActivities === 0) {
        alerts.push("No capital activities recorded")
      }
      
      if (venture._count?.documents < 3) {
        alerts.push("Insufficient documentation")
      }
      
      // Financial health alerts
      const revenue = parseFloat(venture.revenue) || 0
      if (revenue === 0) {
        alerts.push("No revenue recorded")
      }
      
      const teamSize = parseInt(venture.teamSize) || 0
      if (teamSize > 0 && teamSize < 3) {
        alerts.push("Small team size may limit scalability")
      }
      
      // Readiness alerts
      const hasOperationalReadiness = venture.operationalReadiness && Object.keys(venture.operationalReadiness).length > 0
      const hasCapitalReadiness = venture.capitalReadiness && Object.keys(venture.capitalReadiness).length > 0
      
      if (!hasOperationalReadiness && !hasCapitalReadiness) {
        alerts.push("Readiness assessment incomplete")
        if (priority === "medium") priority = "high"
      }
    }
    
    // Determine risk level based on multiple factors
    let riskLevel: "low" | "medium" | "high" = "medium"
    if (gedsiScore > 80 && impactScore > 70 && venture._count?.documents >= 3) {
      riskLevel = "low"
    } else if (gedsiScore < 60 || impactScore < 40 || venture._count?.documents < 2) {
      riskLevel = "high"
    }
    
    return {
      riskLevel,
      priority,
      nextAction,
      daysUntilAction,
      alerts: alerts.slice(0, 3) // Limit to 3 most important alerts
    }
  }

  const handleViewCompany = (company: PortfolioCompany) => {
    setSelectedCompany(company)
    setIsCompanyViewOpen(true)
  }

  const handleCloseDialog = () => {
    setIsCompanyViewOpen(false)
    setSelectedCompany(null)
  }

  const handleTakeAction = (company: PortfolioCompany) => {
    setSelectedActionCompany(company)
    setIsActionDialogOpen(true)
  }

  const handleCloseActionDialog = () => {
    setIsActionDialogOpen(false)
    setSelectedActionCompany(null)
  }

  const executeAction = async (actionType: string, company: PortfolioCompany) => {
    // Simulate action execution
    console.log(`🎯 Executing action: ${actionType} for ${company.name}`)
    
    // In a real app, this would make API calls to:
    // - Update GEDSI metrics
    // - Schedule meetings
    // - Send notifications
    // - Update venture status
    // - Create activities
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success feedback
    alert(`Action "${actionType}" has been scheduled for ${company.name}`)
    
    // Close the action dialog
    handleCloseActionDialog()
  }

  // Handle keyboard events for dialogs
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isActionDialogOpen) {
          handleCloseActionDialog()
        } else if (selectedCompany) {
          handleCloseDialog()
        }
      }
    }

    if (selectedCompany || isActionDialogOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedCompany, isActionDialogOpen])

  const handleExportPortfolio = async () => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const csvContent = [
        'Company,Sector,Stage,Location,GEDSI Score,Impact Score,Status,Created Date,GEDSI Metrics Count,Activities Count',
        ...filteredCompanies.map(company => 
          `"${company.name}","${company.sector}","${company.stage}","${company.location}",${company.gedsiScore || 0},${company.impactScore || 0},"${company.status}","${company.createdAt}",${company.gedsiMetrics?.length || 0},${company._count?.activities || 0}`
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `miv-portfolio-export-${new Date().toISOString().split('T')[0]}.csv`
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

  const filteredCompanies = portfolioCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.inclusionFocus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesFounderType = true
    if (selectedFounderType !== "all") {
      try {
        const founderTypes = JSON.parse(company.founderTypes || '[]')
        matchesFounderType = founderTypes.includes(selectedFounderType)
      } catch (e) {
        matchesFounderType = false
      }
    }
    
    return matchesSearch && matchesFounderType
  })

  const founderTypes = ["women-led", "youth-led", "disability-inclusive", "rural-focus", "indigenous-led"]

  // Calculate metrics from real data
  const totalCompanies = portfolioCompanies.length
  const avgGedsiScore = portfolioCompanies.length > 0 
    ? portfolioCompanies.reduce((sum, c) => sum + (c.gedsiScore || 0), 0) / portfolioCompanies.length 
    : 0
  const avgImpactScore = portfolioCompanies.length > 0
    ? portfolioCompanies.reduce((sum, c) => sum + (c.impactScore || 0), 0) / portfolioCompanies.length
    : 0
  const totalGedsiMetrics = portfolioCompanies.reduce((sum, c) => sum + (c.gedsiMetrics?.length || 0), 0)
  const totalActivities = portfolioCompanies.reduce((sum, c) => sum + (c._count?.activities || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header - Action-Oriented */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Command Center</h1>
          <p className="text-muted-foreground">
            Your daily dashboard for portfolio company management and impact tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportPortfolio} disabled={isExporting}>
            {isExporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Loading portfolio companies from database...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="space-y-2">
            <div>
              <strong>Database Connection Error:</strong> {error}
            </div>
            <div className="text-sm text-muted-foreground">
              This usually means:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Database is not running or accessible</li>
                <li>API endpoint is not responding</li>
                <li>Network connectivity issue</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={fetchPortfolioCompanies}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry Connection
              </Button>
              <Button size="sm" variant="link" className="p-0 h-auto text-red-600">
                Check Database Status
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics - From Real Data */}
      {!loading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
        <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalCompanies}</div>
                    <p className="text-sm text-muted-foreground">Portfolio Companies</p>
                    <p className="text-xs text-green-600">From database</p>
                  </div>
                </div>
          </CardContent>
        </Card>

        <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalGedsiMetrics}</div>
                    <p className="text-sm text-muted-foreground">GEDSI Metrics</p>
                    <p className="text-xs text-blue-600">Tracked metrics</p>
                  </div>
                </div>
          </CardContent>
        </Card>

        <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                  <div>
                    <div className="text-2xl font-bold">{avgGedsiScore.toFixed(0)}%</div>
                    <p className="text-sm text-muted-foreground">Avg GEDSI Score</p>
                    <p className="text-xs text-pink-600">Portfolio average</p>
                    </div>
            </div>
          </CardContent>
        </Card>

        <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                  <div>
                    <div className="text-2xl font-bold">{totalActivities}</div>
                    <p className="text-sm text-muted-foreground">Total Activities</p>
                    <p className="text-xs text-purple-600">All companies</p>
                  </div>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Today's Action Items - From Real Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Today's Action Items
            </CardTitle>
              <CardDescription>
                Companies requiring immediate attention based on AI analysis
              </CardDescription>
          </CardHeader>
          <CardContent>
              {portfolioCompanies.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Portfolio Companies Found</h3>
                  {totalVenturesCount > 0 ? (
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Found {totalVenturesCount} ventures in database, but none have portfolio stage
                      </p>
                      <p className="text-sm text-muted-foreground">
                        To see companies here, update their stage to any portfolio stage:
                      </p>
                      <div className="flex justify-center gap-2 flex-wrap">
                        <Badge variant="outline">SEED</Badge>
                        <Badge variant="outline">DUE_DILIGENCE</Badge>
                        <Badge variant="outline">INVESTMENT_READY</Badge>
                        <Badge variant="outline">FUNDED</Badge>
                        <Badge variant="outline">SERIES_A</Badge>
                        <Badge variant="outline">SERIES_B</Badge>
                        <Badge variant="outline">EXITED</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-muted-foreground">No ventures found in database</p>
                      <p className="text-sm text-muted-foreground">
                        Add ventures through the venture intake form first
                      </p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Venture
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolioCompanies
                    .filter(c => c.aiInsights?.priority === "urgent" || (c.aiInsights?.daysUntilAction || 30) <= 7)
                    .sort((a, b) => (a.aiInsights?.daysUntilAction || 30) - (b.aiInsights?.daysUntilAction || 30))
                    .slice(0, 5)
                    .map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            company.aiInsights?.priority === "urgent" ? "bg-red-500" :
                            company.aiInsights?.priority === "high" ? "bg-orange-500" :
                            "bg-yellow-500"
                          }`} />
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {company.aiInsights?.nextAction || "Review company performance and metrics"}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{company.sector}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {company.gedsiMetrics?.length || 0} GEDSI metrics
                              </span>
                            </div>
                          </div>
                        </div>
                    <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewCompany(company)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" onClick={() => handleTakeAction(company)}>
                            <Zap className="h-4 w-4 mr-1" />
                            Take Action
                          </Button>
                    </div>
                  </div>
                    ))}
                  
                  {portfolioCompanies.filter(c => c.aiInsights?.priority === "urgent" || (c.aiInsights?.daysUntilAction || 30) <= 7).length === 0 && (
                    <div className="text-center py-6">
                      <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-muted-foreground">All companies are performing well!</p>
            </div>
                  )}
                </div>
              )}
          </CardContent>
        </Card>

      {/* Portfolio Grid - Clean, Scannable */}
          <Card>
            <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio Overview</CardTitle>
              <CardDescription className="mt-1">
                {selectedStageFilter === "portfolio" 
                  ? `Showing ${portfolioCompanies.length} portfolio companies (SEED, DUE_DILIGENCE, INVESTMENT_READY, FUNDED, SERIES_A/B/C, EXITED)`
                  : `Showing all ${portfolioCompanies.length} ventures including pipeline (INTAKE, SCREENING)`
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                    />
                  </div>
              <Select value={selectedStageFilter} onValueChange={setSelectedStageFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">Portfolio Companies Only</SelectItem>
                  <SelectItem value="all">All Ventures (Including Pipeline)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFounderType} onValueChange={setSelectedFounderType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {founderTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Portfolio Companies Found</h3>
                {searchTerm || selectedFounderType !== "all" || selectedStageFilter !== "portfolio" ? (
                <div className="space-y-2">
                    <p className="text-muted-foreground">No companies match your current filters</p>
                    <Button variant="outline" onClick={() => { 
                      setSearchTerm(""); 
                      setSelectedFounderType("all"); 
                      setSelectedStageFilter("portfolio"); 
                    }}>
                      Clear Filters
                    </Button>
                </div>
                ) : totalVenturesCount > 0 ? (
                <div className="space-y-2">
                    <p className="text-muted-foreground mb-4">
                      Found {totalVenturesCount} ventures in database, but none have portfolio stage
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To see companies here, update their stage to any portfolio stage:
                    </p>
                    <div className="flex justify-center gap-2 mb-4 flex-wrap">
                      <Badge variant="outline">SEED</Badge>
                      <Badge variant="outline">DUE_DILIGENCE</Badge>
                      <Badge variant="outline">INVESTMENT_READY</Badge>
                      <Badge variant="outline">FUNDED</Badge>
                      <Badge variant="outline">SERIES_A</Badge>
                      <Badge variant="outline">SERIES_B</Badge>
                      <Badge variant="outline">EXITED</Badge>
                </div>
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      View All Ventures
                    </Button>
                  </div>
                ) : (
                <div className="space-y-2">
                    <p className="text-muted-foreground">No ventures found in database</p>
                    <p className="text-sm text-muted-foreground">
                      Add ventures through the venture intake form first
                    </p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Venture
                    </Button>
                </div>
                )}
              </div>
            ) : (
              filteredCompanies.map((company) => {
                const founderTypes = (() => {
                  try {
                    return JSON.parse(company.founderTypes || '[]')
                  } catch {
                    return []
                  }
                })()

                return (
                  <Card key={company.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500" onClick={() => handleViewCompany(company)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{company.location}</p>
                          <p className="text-xs text-muted-foreground mt-1">{company.inclusionFocus}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="text-xs">{company.stage}</Badge>
                          <Badge variant="outline" className="text-xs">{company.status}</Badge>
                          <div className={`w-2 h-2 rounded-full ${
                            company.aiInsights?.priority === "urgent" ? "bg-red-500" :
                            company.aiInsights?.priority === "high" ? "bg-orange-500" :
                            company.aiInsights?.priority === "medium" ? "bg-yellow-500" :
                            "bg-green-500"
                          }`} />
                        </div>
                      </div>
            </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Performance Indicators */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">{company.gedsiMetrics?.length || 0}</div>
                          <p className="text-xs text-muted-foreground">GEDSI Metrics</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-pink-600">{company.gedsiScore?.toFixed(0) || 'N/A'}%</div>
                          <p className="text-xs text-muted-foreground">GEDSI</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">{company.impactScore?.toFixed(0) || 'N/A'}%</div>
                          <p className="text-xs text-muted-foreground">Impact</p>
                        </div>
                            </div>

                      {/* Activity Stats */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Documents:</span>
                          <span className="font-medium">{company._count?.documents || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Activities:</span>
                          <span className="font-medium">{company._count?.activities || 0}</span>
                        </div>
                      </div>

                      {/* Founder Type Tags */}
                      <div className="flex flex-wrap gap-1">
                        {founderTypes.slice(0, 2).map((type: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type.replace('-', ' ')}
                          </Badge>
                        ))}
                        {founderTypes.length === 0 && (
                          <Badge variant="outline" className="text-xs">No founder type set</Badge>
                        )}
                            </div>

                      {/* AI Alerts */}
                      {company.aiInsights?.alerts && company.aiInsights.alerts.length > 0 && (
                        <Alert className="py-2">
                          <Sparkles className="h-3 w-3" />
                          <AlertDescription className="text-xs">
                            <strong>Alert:</strong> {company.aiInsights.alerts[0]}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                        <span>Created: {new Date(company.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(company.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
                        </div>
            </CardContent>
          </Card>

      {/* Company Detail Dialog - Focused on Action */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseDialog}>
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                  <p className="text-muted-foreground">{selectedCompany.location} • {selectedCompany.sector}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleCloseDialog}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Action Required Section */}
              {selectedCompany.aiInsights?.priority === "urgent" && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <strong>Urgent Action Required:</strong> {selectedCompany.aiInsights?.nextAction}
                    <Button size="sm" className="ml-3" onClick={() => handleTakeAction(selectedCompany)}>
                      Take Action Now
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Key Metrics Dashboard */}
              <div className="grid gap-4 md:grid-cols-3">
          <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Company Information</CardTitle>
            </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sector:</span>
                      <Badge variant="outline">{selectedCompany.sector}</Badge>
                          </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stage:</span>
                      <Badge variant="outline">{selectedCompany.stage}</Badge>
                          </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant="outline">{selectedCompany.status}</Badge>
                        </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="font-medium">{selectedCompany.location}</span>
                        </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Impact Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">GEDSI Score:</span>
                      <span className="font-bold text-pink-600">{selectedCompany.gedsiScore?.toFixed(0) || 'N/A'}%</span>
                      </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Impact Score:</span>
                      <span className="font-bold text-green-600">{selectedCompany.impactScore?.toFixed(0) || 'N/A'}%</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">GEDSI Metrics:</span>
                      <span className="font-medium">{selectedCompany.gedsiMetrics?.length || 0}</span>
                        </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Readiness Score:</span>
                      <span className="font-medium">{selectedCompany.readinessScore?.toFixed(0) || 'N/A'}%</span>
                      </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Documents:</span>
                      <span className="font-medium">{selectedCompany._count?.documents || 0}</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Activities:</span>
                      <span className="font-medium">{selectedCompany._count?.activities || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Capital Activities:</span>
                      <span className="font-medium">{selectedCompany._count?.capitalActivities || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created:</span>
                      <span className="font-medium">{new Date(selectedCompany.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
              </div>

              {/* GEDSI Metrics Detail */}
          <Card>
            <CardHeader>
                  <CardTitle>GEDSI Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                  {selectedCompany.gedsiMetrics && selectedCompany.gedsiMetrics.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCompany.gedsiMetrics.slice(0, 6).map((metric: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                            <div className="font-medium">{metric.code || `Metric ${index + 1}`}</div>
                            <div className="text-sm text-muted-foreground">{metric.category || 'GEDSI'}</div>
                      </div>
                      <div className="text-right">
                            <div className="font-bold">{metric.currentValue || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">{metric.unit || ''}</div>
                      </div>
                    </div>
                  ))}
                      {selectedCompany.gedsiMetrics.length > 6 && (
                        <div className="text-center text-sm text-muted-foreground">
                          +{selectedCompany.gedsiMetrics.length - 6} more metrics
              </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No GEDSI metrics recorded yet</p>
                      <Button size="sm" className="mt-2">Add GEDSI Metrics</Button>
                    </div>
                  )}
            </CardContent>
          </Card>

              {/* AI Insights */}
              {selectedCompany.aiInsights && (
          <Card>
            <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      AI Insights & Recommendations
                    </CardTitle>
            </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        {selectedCompany.aiInsights.nextAction}
                      </AlertDescription>
                    </Alert>
                    
                    {selectedCompany.aiInsights.alerts && selectedCompany.aiInsights.alerts.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-1 text-orange-600">
                          <Bell className="h-4 w-4" />
                          Active Alerts
                        </h4>
                        <ul className="space-y-1">
                          {selectedCompany.aiInsights.alerts.map((alert, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {alert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Action Dialog */}
      {selectedActionCompany && isActionDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseActionDialog}>
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Take Action: {selectedActionCompany.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedActionCompany.aiInsights?.nextAction || "Choose an action to help this company"}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleCloseActionDialog}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Priority Actions based on AI Insights */}
              {selectedActionCompany.aiInsights?.priority === "urgent" && (
                <div className="mb-6">
                  <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Urgent Actions Required
                  </h3>
                  <div className="grid gap-2">
                    {selectedActionCompany.aiInsights?.alerts?.map((alert, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start text-left h-auto p-4 border-red-200"
                        onClick={() => executeAction(`Resolve: ${alert}`, selectedActionCompany)}
                      >
                        <div>
                          <div className="font-medium">Resolve: {alert}</div>
                          <div className="text-xs text-muted-foreground">Click to schedule resolution</div>
                        </div>
                </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Actions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Available Actions
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* GEDSI Actions */}
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto p-4"
                    onClick={() => executeAction("Update GEDSI Metrics", selectedActionCompany)}
                  >
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-pink-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Update GEDSI Metrics</div>
                        <div className="text-xs text-muted-foreground">
                          Current: {selectedActionCompany.gedsiMetrics?.length || 0} metrics
                        </div>
                      </div>
                    </div>
                </Button>

                  {/* Schedule Review */}
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto p-4"
                    onClick={() => executeAction("Schedule Board Review", selectedActionCompany)}
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Schedule Board Review</div>
                        <div className="text-xs text-muted-foreground">
                          Plan next quarterly review
                        </div>
                      </div>
                    </div>
                </Button>

                  {/* Request Documents */}
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto p-4"
                    onClick={() => executeAction("Request Updated Documents", selectedActionCompany)}
                  >
                    <div className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Request Documents</div>
                        <div className="text-xs text-muted-foreground">
                          Financial statements, metrics
                        </div>
                      </div>
                    </div>
                </Button>

                  {/* Send Notification */}
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto p-4"
                    onClick={() => executeAction("Send Follow-up Notification", selectedActionCompany)}
                  >
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Send Notification</div>
                        <div className="text-xs text-muted-foreground">
                          Follow-up on pending items
                        </div>
                      </div>
                    </div>
                </Button>

                  {/* Impact Assessment */}
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto p-4"
                    onClick={() => executeAction("Conduct Impact Assessment", selectedActionCompany)}
                  >
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Impact Assessment</div>
                        <div className="text-xs text-muted-foreground">
                          Evaluate social impact metrics
              </div>
                      </div>
                    </div>
                  </Button>

                  {/* Funding Support */}
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto p-4"
                    onClick={() => executeAction("Provide Funding Support", selectedActionCompany)}
                  >
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Funding Support</div>
                        <div className="text-xs text-muted-foreground">
                          Connect with investors
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => executeAction("Add to Watch List", selectedActionCompany)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Add to Watch List
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => executeAction("Mark as High Priority", selectedActionCompany)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    High Priority
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => executeAction("Schedule Call", selectedActionCompany)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 