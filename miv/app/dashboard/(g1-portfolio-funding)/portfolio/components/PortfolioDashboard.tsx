"use client"

import type { ComponentType, Dispatch, SetStateAction } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Heart,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react"
import type { PortfolioCompany } from "../types"

interface PortfolioFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedStageFilter: string
  onStageFilterChange: (value: string) => void
  selectedFounderType: string
  onFounderTypeChange: (value: string) => void
  founderTypes: string[]
}

interface VentureCardProps {
  company: PortfolioCompany
  onClick: () => void
}

interface CompanyDetailModalProps {
  company: PortfolioCompany
  onClose: () => void
  onTakeAction: (company: PortfolioCompany) => void
}

interface ActionDialogProps {
  company: PortfolioCompany
  onClose: () => void
  onExecuteAction: (actionType: string, company: PortfolioCompany) => void
}

interface PortfolioDashboardProps {
  loading: boolean
  error: string | null
  isExporting: boolean
  portfolioCompanies: PortfolioCompany[]
  filteredCompanies: PortfolioCompany[]
  totalVenturesCount: number
  totalCompanies: number
  avgGedsiScore: number
  totalGedsiMetrics: number
  totalActivities: number
  searchTerm: string
  selectedStageFilter: string
  selectedFounderType: string
  founderTypes: string[]
  selectedCompany: PortfolioCompany | null
  selectedActionCompany: PortfolioCompany | null
  isActionDialogOpen: boolean
  setSearchTerm: Dispatch<SetStateAction<string>>
  setSelectedStageFilter: Dispatch<SetStateAction<string>>
  setSelectedFounderType: Dispatch<SetStateAction<string>>
  fetchPortfolioCompanies: () => Promise<void>
  handleExportPortfolio: () => Promise<void>
  handleViewCompany: (company: PortfolioCompany) => void
  handleCloseDialog: () => void
  handleTakeAction: (company: PortfolioCompany) => void
  handleCloseActionDialog: () => void
  executeAction: (actionType: string, company: PortfolioCompany) => Promise<void>
  PortfolioFiltersView: ComponentType<PortfolioFiltersProps>
  VentureCardView: ComponentType<VentureCardProps>
  CompanyDetailModalView: ComponentType<CompanyDetailModalProps>
  ActionDialogView: ComponentType<ActionDialogProps>
}

export function PortfolioDashboard({
  loading,
  error,
  isExporting,
  portfolioCompanies,
  filteredCompanies,
  totalVenturesCount,
  totalCompanies,
  avgGedsiScore,
  totalGedsiMetrics,
  totalActivities,
  searchTerm,
  selectedStageFilter,
  selectedFounderType,
  founderTypes,
  selectedCompany,
  selectedActionCompany,
  isActionDialogOpen,
  setSearchTerm,
  setSelectedStageFilter,
  setSelectedFounderType,
  fetchPortfolioCompanies,
  handleExportPortfolio,
  handleViewCompany,
  handleCloseDialog,
  handleTakeAction,
  handleCloseActionDialog,
  executeAction,
  PortfolioFiltersView,
  VentureCardView,
  CompanyDetailModalView,
  ActionDialogView,
}: PortfolioDashboardProps) {
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
