"use client"

import { useEffect, useState } from "react"
import { calculateGEDSIScore } from "@/lib/gedsi-utils"
import type { PortfolioCompany } from "./types"
import { FOUNDER_TYPES, PORTFOLIO_STAGES } from "./constants"
import { useIsMobile } from "./hooks/useIsMobile"
import {
  calculateImpactScore,
  calculateReadinessScore,
  generateAIInsights,
} from "./lib/portfolioCalculations"
import { PortfolioDashboard } from "./components/PortfolioDashboard"
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
      
      // Filter based on selected stage filter
      const ventures = selectedStageFilter === "all" 
        ? allVentures 
        : allVentures.filter((venture: any) => PORTFOLIO_STAGES.includes(venture.stage))
      
      console.log(`🎯 Filtered to ${ventures.length} companies with filter: ${selectedStageFilter}`, {
        PORTFOLIO_STAGES: selectedStageFilter === "portfolio" ? PORTFOLIO_STAGES : "all stages",
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

  // Calculate metrics from real data
  const totalCompanies = portfolioCompanies.length
  const avgGedsiScore = portfolioCompanies.length > 0 
    ? portfolioCompanies.reduce((sum, c) => sum + (c.gedsiScore || 0), 0) / portfolioCompanies.length 
    : 0
  const totalGedsiMetrics = portfolioCompanies.reduce((sum, c) => sum + (c.gedsiMetrics?.length || 0), 0)
  const totalActivities = portfolioCompanies.reduce((sum, c) => sum + (c._count?.activities || 0), 0)

  return (
    <PortfolioDashboard
      loading={loading}
      error={error}
      isExporting={isExporting}
      portfolioCompanies={portfolioCompanies}
      filteredCompanies={filteredCompanies}
      totalVenturesCount={totalVenturesCount}
      totalCompanies={totalCompanies}
      avgGedsiScore={avgGedsiScore}
      totalGedsiMetrics={totalGedsiMetrics}
      totalActivities={totalActivities}
      searchTerm={searchTerm}
      selectedStageFilter={selectedStageFilter}
      selectedFounderType={selectedFounderType}
      founderTypes={FOUNDER_TYPES}
      selectedCompany={selectedCompany}
      selectedActionCompany={selectedActionCompany}
      isActionDialogOpen={isActionDialogOpen}
      setSearchTerm={setSearchTerm}
      setSelectedStageFilter={setSelectedStageFilter}
      setSelectedFounderType={setSelectedFounderType}
      fetchPortfolioCompanies={fetchPortfolioCompanies}
      handleExportPortfolio={handleExportPortfolio}
      handleViewCompany={handleViewCompany}
      handleCloseDialog={handleCloseDialog}
      handleTakeAction={handleTakeAction}
      handleCloseActionDialog={handleCloseActionDialog}
      executeAction={executeAction}
      PortfolioFiltersView={PortfolioFiltersView}
      VentureCardView={VentureCardView}
      CompanyDetailModalView={CompanyDetailModalView}
      ActionDialogView={ActionDialogView}
    />
  )
}
