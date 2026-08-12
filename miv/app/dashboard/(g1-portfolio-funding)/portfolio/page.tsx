"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateGEDSIScore, getGEDSIScoreInterpretation, calculateGEDSIComplianceRate } from "@/lib/gedsi-utils"
import {
  Building2,
  Plus,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Activity,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Shield,
  Download,
  ArrowUpRight,
  Zap,
  Award,
  Calculator,
  RefreshCw
} from "lucide-react"
import type { PortfolioCompany } from "./types"
import { useIsMobile } from "./hooks/useIsMobile"
import { PortfolioFilters as DesktopPortfolioFilters } from "./components/desktop/PortfolioFilters"
import { VentureCard as DesktopVentureCard } from "./components/desktop/VentureCard"
import { CompanyDetailModal as DesktopCompanyDetailModal } from "./components/desktop/CompanyDetailModal"
import { ActionDialog as DesktopActionDialog } from "./components/desktop/ActionDialog"
import { PortfolioFilters as MobilePortfolioFilters } from "./components/mobile/PortfolioFilters"
import { VentureCard as MobileVentureCard } from "./components/mobile/VentureCard"
import { CompanyDetailModal as MobileCompanyDetailModal } from "./components/mobile/CompanyDetailModal"
import { ActionDialog as MobileActionDialog } from "./components/mobile/ActionDialog"

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

  const isMobile = useIsMobile()
  const PortfolioFiltersView = isMobile ? MobilePortfolioFilters : DesktopPortfolioFilters
  const VentureCardView = isMobile ? MobileVentureCard : DesktopVentureCard
  const CompanyDetailModalView = isMobile ? MobileCompanyDetailModal : DesktopCompanyDetailModal
  const ActionDialogView = isMobile ? MobileActionDialog : DesktopActionDialog

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
      <div className="hidden md:flex items-center justify-between">
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
          <div className="hidden md:grid gap-4 md:grid-cols-4">
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
        <Card className="hidden md:flex">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle>Portfolio Overview</CardTitle>
              <CardDescription className="mt-1">
                {selectedStageFilter === "portfolio" 
                  ? `Showing ${portfolioCompanies.length} portfolio companies (SEED, DUE_DILIGENCE, INVESTMENT_READY, FUNDED, SERIES_A/B/C, EXITED)`
                  : `Showing all ${portfolioCompanies.length} ventures including pipeline (INTAKE, SCREENING)`
                }
              </CardDescription>
            </div>
            <PortfolioFiltersView
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStageFilter={selectedStageFilter}
              onStageFilterChange={setSelectedStageFilter}
              selectedFounderType={selectedFounderType}
              onFounderTypeChange={setSelectedFounderType}
              founderTypes={founderTypes}
            />
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
              filteredCompanies.map((company) => (
                <VentureCardView
                  key={company.id}
                  company={company}
                  onClick={() => handleViewCompany(company)}
                />
              ))
            )}
                        </div>
            </CardContent>
          </Card>

      {/* Company Detail Dialog - Focused on Action */}
      {selectedCompany && (
        <CompanyDetailModalView
          company={selectedCompany}
          onClose={handleCloseDialog}
          onTakeAction={handleTakeAction}
        />
      )}
        </>
      )}

      {/* Action Dialog */}
      {selectedActionCompany && isActionDialogOpen && (
        <ActionDialogView
          company={selectedActionCompany}
          onClose={handleCloseActionDialog}
          onExecuteAction={executeAction}
        />
      )}
    </div>
  )
}
