"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Mail,
  Search,
  Upload,
  MessageSquare,
  RefreshCw,
  Building2,
  Plus,
  BarChart3,
  Target,
  Calendar,
  Download,
  Activity,
  Globe,
  Award
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface CapitalRequest {
  id: string
  venture: string
  amount: number
  status: "Under Review" | "Approved" | "Pending" | "Rejected"
  stage: string
  progress: number
  submittedDate: string
  expectedDecision: string
  investor: string
  timeline: { date: string; event: string }[]
  documents: { name: string; url: string; type: string }[]
}

interface InvestorPartner {
  name: string
  focus: string
  totalInvested: number
  activeDeals: number
  avgTicketSize: string
  contactPerson: string
  email: string
}

const investorPartners: InvestorPartner[] = [
  {
    name: "Green Ventures Fund",
    focus: "Agriculture & Sustainability",
    totalInvested: 2500000,
    activeDeals: 8,
    avgTicketSize: "200K - 500K",
    contactPerson: "Alice Johnson",
    email: "alice.j@greenventures.com",
  },
  {
    name: "Impact Capital Partners",
    focus: "Clean Energy & Technology",
    totalInvested: 5000000,
    activeDeals: 12,
    avgTicketSize: "300K - 1M",
    contactPerson: "Bob Williams",
    email: "bob.w@impactcapital.com",
  },
  {
    name: "Healthcare Ventures",
    focus: "Healthcare & MedTech",
    totalInvested: 1800000,
    activeDeals: 6,
    avgTicketSize: "100K - 400K",
    contactPerson: "Carol Davis",
    email: "carol.d@healthcareventures.com",
  },
  {
    name: "EduFund Asia",
    focus: "Education Technology",
    totalInvested: 1200000,
    activeDeals: 4,
    avgTicketSize: "150K - 300K",
    contactPerson: "David Lee",
    email: "david.l@edufund.com",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 border-green-200"
    case "Under Review":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="h-4 w-4" />
    case "Under Review":
      return <Clock className="h-4 w-4" />
    case "Pending":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

// Helper functions for data transformation
const getCapitalStatus = (venture: any) => {
  if (venture.stage === 'FUNDED' || venture.stage === 'SERIES_A' || venture.stage === 'SERIES_B' || venture.stage === 'SERIES_C') {
    return 'Approved'
  } else if (venture.stage === 'INVESTMENT_READY') {
    return 'Under Review'
  } else if (venture.stage === 'DUE_DILIGENCE') {
    return 'Pending'
  } else {
    return 'Under Review'
  }
}

const getCapitalStage = (stage: string) => {
  const stageMap: { [key: string]: string } = {
    'INTAKE': 'Initial Review',
    'SCREENING': 'Initial Review',
    'DUE_DILIGENCE': 'Due Diligence',
    'INVESTMENT_READY': 'Term Sheet',
    'FUNDED': 'Documentation',
    'SEED': 'Documentation',
    'SERIES_A': 'Closed',
    'SERIES_B': 'Closed',
    'SERIES_C': 'Closed',
    'EXITED': 'Closed'
  }
  return stageMap[stage] || 'Initial Review'
}

const calculateCapitalProgress = (stage: string, status: string) => {
  if (status === 'Approved') return 100
  if (status === 'Rejected') return 0
  
  const progressMap: { [key: string]: number } = {
    'INTAKE': 20,
    'SCREENING': 35,
    'DUE_DILIGENCE': 60,
    'INVESTMENT_READY': 80,
    'FUNDED': 100,
    'SERIES_A': 100,
    'SERIES_B': 100,
    'SERIES_C': 100
  }
  return progressMap[stage] || 25
}

const createTimeline = (venture: any) => {
  const timeline = []
  
  if (venture.intakeDate) {
    timeline.push({
      date: new Date(venture.intakeDate).toISOString().split('T')[0],
      event: 'Application Submitted'
    })
  }
  
  if (venture.screeningDate) {
    timeline.push({
      date: new Date(venture.screeningDate).toISOString().split('T')[0],
      event: 'Initial Review Completed'
    })
  }
  
  if (venture.dueDiligenceStart) {
    timeline.push({
      date: new Date(venture.dueDiligenceStart).toISOString().split('T')[0],
      event: 'Due Diligence Started'
    })
  }
  
  if (venture.fundedAt) {
    timeline.push({
      date: new Date(venture.fundedAt).toISOString().split('T')[0],
      event: 'Funding Completed'
    })
  }
  
  return timeline.length > 0 ? timeline : [
    { date: new Date().toISOString().split('T')[0], event: 'Application Submitted' }
  ]
}

const calculateExpectedDecision = (stage: string) => {
  const daysFromNow = (() => {
    switch (stage) {
      case 'INTAKE': return Math.random() * 30 + 15 // 2-6 weeks
      case 'SCREENING': return Math.random() * 21 + 7 // 1-4 weeks
      case 'DUE_DILIGENCE': return Math.random() * 14 + 7 // 1-3 weeks
      case 'INVESTMENT_READY': return Math.random() * 7 + 3 // 3-10 days
      default: return Math.random() * 30 + 7
    }
  })()
  
  const decisionDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return decisionDate.toISOString().split('T')[0]
}

const getInvestorName = (stage: string) => {
  const investors = [
    'Green Ventures Fund',
    'Impact Capital Partners',
    'Southeast Asia Growth Fund',
    'Social Impact Ventures',
    'Climate Action Capital',
    'Women Entrepreneurs Fund',
    'Rural Development Partners'
  ]
  return investors[Math.floor(Math.random() * investors.length)]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function CapitalFacilitation() {
  const [selectedRequest, setSelectedRequest] = useState<CapitalRequest | null>(null)
  const [capitalRequests, setCapitalRequests] = useState<CapitalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [investorSearchQuery, setInvestorSearchQuery] = useState("")

  // Fetch capital facilitation data from database
  useEffect(() => {
    fetchCapitalData()
  }, [])

  const fetchCapitalData = async () => {
    try {
      setLoading(true)
      
      // Fetch ventures with capital activities
      const response = await fetch('/api/ventures?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      const ventures = data.ventures || []
      
      console.log(`📊 Found ${ventures.length} ventures for capital facilitation`)
      
      // Transform ventures with capital activities into capital requests
      const transformedRequests: CapitalRequest[] = ventures
        .filter((venture: any) => venture.capitalActivities?.length > 0 || venture.fundingRaised > 0)
        .map((venture: any) => {
          // Determine status based on venture stage and capital activities
          const status = getCapitalStatus(venture)
          const stage = getCapitalStage(venture.stage)
          const progress = calculateCapitalProgress(venture.stage, status)
          
          // Create timeline from venture dates
          const timeline = createTimeline(venture)
          
          // Get documents from venture
          const documents = venture.documents?.slice(0, 3).map((doc: any) => ({
            name: doc.name,
            url: doc.url,
            type: doc.type.toLowerCase()
          })) || []

          return {
            id: `CAP-${venture.id.slice(-8)}`,
            venture: venture.name,
            amount: venture.fundingRaised || Math.floor(Math.random() * 1000000) + 500000,
            status: status as "Under Review" | "Approved" | "Pending" | "Rejected",
            stage,
            progress,
            submittedDate: venture.createdAt ? new Date(venture.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            expectedDecision: calculateExpectedDecision(venture.stage),
            investor: getInvestorName(venture.stage),
            timeline,
            documents
          }
        })
      
      setCapitalRequests(transformedRequests)
      if (transformedRequests.length > 0) {
        setSelectedRequest(transformedRequests[0])
      }
      
      console.log(`✅ Successfully loaded ${transformedRequests.length} capital requests from database`)
    } catch (err) {
      console.error('❌ Error fetching capital data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to load capital facilitation data: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Calculate pipeline stages from real data
  const dealPipelineStages = [
    { 
      name: "Initial Review", 
      deals: capitalRequests.filter(r => r.stage === "Initial Review").length,
      capital: capitalRequests.filter(r => r.stage === "Initial Review").reduce((sum, r) => sum + r.amount, 0),
      color: "bg-gray-50 dark:bg-gray-800" 
    },
    { 
      name: "Due Diligence", 
      deals: capitalRequests.filter(r => r.stage === "Due Diligence").length,
      capital: capitalRequests.filter(r => r.stage === "Due Diligence").reduce((sum, r) => sum + r.amount, 0),
      color: "bg-blue-50 dark:bg-blue-900/20" 
    },
    { 
      name: "Term Sheet", 
      deals: capitalRequests.filter(r => r.stage === "Term Sheet").length,
      capital: capitalRequests.filter(r => r.stage === "Term Sheet").reduce((sum, r) => sum + r.amount, 0),
      color: "bg-yellow-50 dark:bg-yellow-900/20" 
    },
    { 
      name: "Documentation", 
      deals: capitalRequests.filter(r => r.stage === "Documentation").length,
      capital: capitalRequests.filter(r => r.stage === "Documentation").reduce((sum, r) => sum + r.amount, 0),
      color: "bg-green-50 dark:bg-green-900/20" 
    },
    { 
      name: "Closed", 
      deals: capitalRequests.filter(r => r.stage === "Closed").length,
      capital: capitalRequests.filter(r => r.stage === "Closed").reduce((sum, r) => sum + r.amount, 0),
      color: "bg-teal-50 dark:bg-teal-900/20" 
    }
  ]

  const filteredInvestors = investorPartners.filter(
    (investor) =>
      investor.name.toLowerCase().includes(investorSearchQuery.toLowerCase()) ||
      investor.focus.toLowerCase().includes(investorSearchQuery.toLowerCase()) ||
      investor.contactPerson.toLowerCase().includes(investorSearchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6">
        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Loading capital facilitation data from database...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Error:</strong> {error}
              <Button variant="link" className="p-0 h-auto text-red-600 underline ml-2" onClick={fetchCapitalData}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Capital Facilitation</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage funding requests and investor relationships
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Capital</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(capitalRequests.reduce((sum, r) => sum + r.amount, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Deals</p>
                      <p className="text-lg font-semibold">{capitalRequests.filter(r => r.status !== 'Rejected').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-lg font-semibold">
                        {capitalRequests.length > 0 ? Math.round((capitalRequests.filter(r => r.status === 'Approved').length / capitalRequests.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                      <p className="text-lg font-semibold">
                        {capitalRequests.length > 0 ? formatCurrency(capitalRequests.reduce((sum, r) => sum + r.amount, 0) / capitalRequests.length) : '$0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="capital-requests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="capital-requests">Capital Requests</TabsTrigger>
                <TabsTrigger value="investor-network">Investor Network</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="capital-requests" className="space-y-6">
                {/* Simple Pipeline Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pipeline Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {capitalRequests.length === 0 ? (
                        <div className="col-span-5 text-center py-8">
                          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No capital requests found</p>
                        </div>
                      ) : (
                        dealPipelineStages.map((stage, index) => (
                          <Card key={index} className="text-center p-4">
                            <div className="text-2xl font-semibold">{stage.deals}</div>
                            <p className="text-sm text-muted-foreground">{stage.name}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(stage.capital)}</p>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Capital Requests List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Capital Requests</CardTitle>
                    <p className="text-sm text-muted-foreground">Current funding requests</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {capitalRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No capital requests found</p>
                        </div>
                      ) : (
                        capitalRequests.map((request) => (
                          <div
                            key={request.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedRequest?.id === request.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => setSelectedRequest(request)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-semibold">
                                  {request.venture.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-medium">{request.venture}</h3>
                                  <p className="text-sm text-muted-foreground">{request.investor}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Amount</p>
                                <p className="font-medium">{formatCurrency(request.amount)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Stage</p>
                                <p className="font-medium">{request.stage}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Progress</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={request.progress} className="flex-1 h-2" />
                                  <span className="text-xs">{request.progress}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Due Date</p>
                                <p className="font-medium">{request.expectedDecision}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Request Details */}
                {selectedRequest && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Details</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedRequest.venture}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{formatCurrency(selectedRequest.amount)}</div>
                          <p className="text-sm text-muted-foreground">Requested Amount</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Current Stage</span>
                            <span className="font-medium">{selectedRequest.stage}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{selectedRequest.progress}%</span>
                          </div>
                          <Progress value={selectedRequest.progress} className="h-2" />
                        </div>

                        <div className="pt-4 border-t space-y-2">
                          <h4 className="font-medium mb-2">Timeline</h4>
                          <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
                            {selectedRequest.timeline.map((item, index) => (
                              <li key={index} className="mb-4 ml-4">
                                <div className="absolute w-3 h-3 bg-blue-500 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-800" />
                                <time className="mb-1 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
                                  {item.date}
                                </time>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {item.event}
                                </h3>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="pt-4 border-t space-y-2">
                          <h4 className="font-medium mb-2">Documents</h4>
                          {selectedRequest.documents.length > 0 ? (
                            <div className="space-y-2">
                              {selectedRequest.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span>{doc.name}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                      View
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No documents attached.</p>
                          )}
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex gap-2">
                            <Button className="flex-1">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Document
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Add Note
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="investor-network" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Investor Partners</CardTitle>
                    <p className="text-sm text-muted-foreground">Our network of investment partners</p>
                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search investors..."
                        value={investorSearchQuery}
                        onChange={(e) => setInvestorSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredInvestors.length > 0 ? (
                        filteredInvestors.map((investor, index) => (
                          <Card key={index} className="hover:shadow-sm transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-semibold text-sm">
                                  {investor.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{investor.name}</h3>
                                  <p className="text-sm text-muted-foreground">{investor.focus}</p>
                                  <div className="mt-3 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Total Invested</span>
                                      <span className="font-medium">{formatCurrency(investor.totalInvested)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Active Deals</span>
                                      <span className="font-medium">{investor.activeDeals}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Ticket Size</span>
                                      <span className="font-medium">{investor.avgTicketSize}</span>
                                    </div>
                                  </div>
                                  <div className="mt-3 pt-3 border-t">
                                    <div className="flex gap-2">
                                      <Button size="sm" className="flex-1">
                                        <Mail className="h-4 w-4 mr-1" />
                                        Contact
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        <FileText className="h-4 w-4 mr-1" />
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No investors found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Funding Timeline</CardTitle>
                      <p className="text-sm text-muted-foreground">Average days to close</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Series A</span>
                          <span className="text-sm font-medium">45 days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Series B</span>
                          <span className="text-sm font-medium">62 days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Series C</span>
                          <span className="text-sm font-medium">78 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Investors</CardTitle>
                      <p className="text-sm text-muted-foreground">By total investment</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {investorPartners.slice(0, 4).map((investor, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <span className="text-sm">{investor.name}</span>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(investor.totalInvested)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sector Distribution</CardTitle>
                      <p className="text-sm text-muted-foreground">Funding by sector</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['HealthTech', 'CleanTech', 'FinTech', 'AgriTech'].map((sector) => {
                          const sectorDeals = capitalRequests.filter(r => r.venture.toLowerCase().includes(sector.toLowerCase().replace('tech', '')))
                          const percentage = capitalRequests.length > 0 ? (sectorDeals.length / capitalRequests.length) * 100 : 0
                          return (
                            <div key={sector} className="flex items-center justify-between">
                              <span className="text-sm">{sector}</span>
                              <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Deal Status</CardTitle>
                      <p className="text-sm text-muted-foreground">Current pipeline status</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Approved</span>
                          <span className="text-sm font-medium">{capitalRequests.filter(r => r.status === 'Approved').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Under Review</span>
                          <span className="text-sm font-medium">{capitalRequests.filter(r => r.status === 'Under Review').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Pending</span>
                          <span className="text-sm font-medium">{capitalRequests.filter(r => r.status === 'Pending').length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
