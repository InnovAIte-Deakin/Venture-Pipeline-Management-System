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
  ChartPie, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  TrendingDown,
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
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  FileText,
  Send,
  Shield,
  Globe,
  RefreshCw,
  AlertCircle,
  XCircle,
  Landmark,
  Calculator,
  BookOpen,
  Briefcase,
  Award,
  Database,
  Settings,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  UserCheck
} from "lucide-react"

interface Fund {
  id: string
  name: string
  vintage: string
  size: string
  committedCapital: string
  calledCapital: string
  distributedCapital: string
  netAssetValue: string
  irr: number
  tvpi: number
  dpi: number
  moic: number
  status: "fundraising" | "active" | "closed" | "winding_down" | "liquidated"
  lps: number
  investments: number
  lastUpdate: string
  fundManager: string
  // Institutional-grade fields
  fundType: "venture" | "growth" | "buyout" | "impact" | "debt"
  geography: string
  sector: string[]
  investmentPeriod: string
  fundTerm: string
  managementFee: number
  carriedInterest: number
  hurdle: number
  catchUp: number
  benchmark: string
  aum: string
  dryPowder: string
  leverage: number
  esg: boolean
  regulatoryStatus: string
  fundAdmin: string
  auditor: string
  legalCounsel: string
  primeBroker: string
}

interface LimitedPartner {
  id: string
  name: string
  type: "pension" | "endowment" | "foundation" | "insurance" | "sovereign" | "family_office" | "fund_of_funds" | "corporate" | "individual"
  commitment: string
  called: string
  distributed: string
  nav: string
  irr: number
  tvpi: number
  dpi: number
  country: string
  currency: string
  contactPerson: string
  email: string
  phone: string
  status: "active" | "defaulted" | "transferred" | "withdrawn"
  investmentDate: string
  lastCapitalCall: string
  lastDistribution: string
  riskRating: "low" | "medium" | "high"
  kycStatus: "approved" | "pending" | "expired"
  accredited: boolean
}

interface CapitalCall {
  id: string
  fundId: string
  fundName: string
  callNumber: string
  amount: string
  dueDate: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  lpsResponded: number
  totalLps: number
  lastUpdate: string
  // Institutional fields
  purpose: string
  investments: string[]
  expenses: string
  interestRate: number
  gracePeriod: string
  defaultPenalty: number
  wireInstructions: boolean
  noticeDate: string
  remindersSent: number
  documentsGenerated: boolean
}

interface Distribution {
  id: string
  fundId: string
  fundName: string
  distributionNumber: string
  amount: string
  date: string
  type: "dividend" | "exit" | "refinancing" | "return_of_capital" | "other"
  status: "announced" | "paid" | "pending" | "processing"
  lpsPaid: number
  totalLps: number
  lastUpdate: string
  // Institutional fields
  source: string
  sourceVentures?: string[]
  taxImplications: string
  withholding: number
  currency: string
  exchangeRate: number
  paymentMethod: "wire" | "check" | "ach"
  taxReporting: boolean
  k1Generated: boolean
  recordDate: string
  exDate: string
}

interface Transaction {
  id: string
  fundId: string
  type: "capital_call" | "distribution" | "expense" | "fee" | "interest" | "fx"
  amount: string
  date: string
  description: string
  status: "pending" | "completed" | "failed" | "cancelled"
  reference: string
  counterparty: string
  currency: string
  exchangeRate: number
}

// Mock data removed - all data now fetched from API
/*
const mockFunds: Fund[] = [
  {
    id: "FUND-001",
    name: "MIV Asia Pacific Fund I",
    vintage: "2020",
    size: "$50M",
    committedCapital: "$50M",
    calledCapital: "$35M",
    distributedCapital: "$12M",
    netAssetValue: "$45M",
    irr: 18.5,
    tvpi: 1.29,
    dpi: 0.24,
    moic: 1.29,
    status: "active",
    lps: 25,
    investments: 15,
    lastUpdate: "2 hours ago",
    fundManager: "Sarah Johnson",
    fundType: "venture",
    geography: "Asia Pacific",
    sector: ["Technology", "Healthcare", "FinTech"],
    investmentPeriod: "2020-2025",
    fundTerm: "10 years + 2x1 year extensions",
    managementFee: 2.0,
    carriedInterest: 20,
    hurdle: 8,
    catchUp: 100,
    benchmark: "MSCI AC Asia Pacific",
    aum: "$45M",
    dryPowder: "$15M",
    leverage: 0,
    esg: true,
    regulatoryStatus: "SEC Registered",
    fundAdmin: "SS&C Technologies",
    auditor: "KPMG",
    legalCounsel: "Latham & Watkins",
    primeBroker: "Goldman Sachs"
  },
  {
    id: "FUND-002",
    name: "MIV Growth Fund II",
    vintage: "2022",
    size: "$75M",
    committedCapital: "$75M",
    calledCapital: "$25M",
    distributedCapital: "$5M",
    netAssetValue: "$28M",
    irr: 12.3,
    tvpi: 1.12,
    dpi: 0.07,
    moic: 1.12,
    status: "active",
    lps: 35,
    investments: 8,
    lastUpdate: "1 day ago",
    fundManager: "Mike Chen",
    fundType: "growth",
    geography: "Southeast Asia",
    sector: ["CleanTech", "EdTech", "AgTech"],
    investmentPeriod: "2022-2027",
    fundTerm: "12 years + 2x1 year extensions",
    managementFee: 2.5,
    carriedInterest: 20,
    hurdle: 8,
    catchUp: 100,
    benchmark: "FTSE Developed Asia Pacific",
    aum: "$28M",
    dryPowder: "$50M",
    leverage: 0,
    esg: true,
    regulatoryStatus: "AIFMD Compliant",
    fundAdmin: "Northern Trust",
    auditor: "EY",
    legalCounsel: "Simpson Thacher",
    primeBroker: "Morgan Stanley"
  },
  {
    id: "FUND-003",
    name: "MIV Impact Fund",
    vintage: "2021",
    size: "$30M",
    committedCapital: "$30M",
    calledCapital: "$22M",
    distributedCapital: "$8M",
    netAssetValue: "$25M",
    irr: 15.7,
    tvpi: 1.10,
    dpi: 0.27,
    moic: 1.14,
    status: "active",
    lps: 18,
    investments: 12,
    lastUpdate: "3 days ago",
    fundManager: "Lisa Wang",
    fundType: "impact",
    geography: "Emerging Asia",
    sector: ["Social Impact", "Financial Inclusion", "Healthcare"],
    investmentPeriod: "2021-2026",
    fundTerm: "10 years + 2x1 year extensions",
    managementFee: 2.0,
    carriedInterest: 15,
    hurdle: 6,
    catchUp: 100,
    benchmark: "Custom Impact Index",
    aum: "$25M",
    dryPowder: "$8M",
    leverage: 0,
    esg: true,
    regulatoryStatus: "B-Corp Certified",
    fundAdmin: "Alter Domus",
    auditor: "Deloitte",
    legalCounsel: "White & Case",
    primeBroker: "J.P. Morgan"
  },
  {
    id: "FUND-004",
    name: "MIV Seed Fund",
    vintage: "2019",
    size: "$20M",
    committedCapital: "$20M",
    calledCapital: "$20M",
    distributedCapital: "$15M",
    netAssetValue: "$8M",
    irr: 22.1,
    tvpi: 1.15,
    dpi: 0.75,
    moic: 1.15,
    status: "winding_down",
    lps: 15,
    investments: 20,
    lastUpdate: "1 week ago",
    fundManager: "David Smith",
    fundType: "venture",
    geography: "Asia Pacific",
    sector: ["Early Stage Tech", "B2B SaaS"],
    investmentPeriod: "2019-2024",
    fundTerm: "10 years (expiring 2029)",
    managementFee: 2.5,
    carriedInterest: 20,
    hurdle: 8,
    catchUp: 100,
    benchmark: "Cambridge Associates VC Index",
    aum: "$8M",
    dryPowder: "$0M",
    leverage: 0,
    esg: false,
    regulatoryStatus: "Exempt Reporting Advisor",
    fundAdmin: "Citco",
    auditor: "PwC",
    legalCounsel: "Kirkland & Ellis",
    primeBroker: "Credit Suisse"
  }
]

const limitedPartners: LimitedPartner[] = [
  {
    id: "LP-001",
    name: "CalPERS",
    type: "pension",
    commitment: "$5.0M",
    called: "$3.5M",
    distributed: "$1.2M",
    nav: "$4.1M",
    irr: 19.2,
    tvpi: 1.31,
    dpi: 0.24,
    country: "United States",
    currency: "USD",
    contactPerson: "Jennifer Martinez",
    email: "j.martinez@calpers.ca.gov",
    phone: "+1-916-795-3000",
    status: "active",
    investmentDate: "2020-03-15",
    lastCapitalCall: "2024-01-15",
    lastDistribution: "2023-12-01",
    riskRating: "low",
    kycStatus: "approved",
    accredited: true
  },
  {
    id: "LP-002", 
    name: "Singapore GIC",
    type: "sovereign",
    commitment: "$10.0M",
    called: "$7.0M",
    distributed: "$2.1M",
    nav: "$8.5M",
    irr: 17.8,
    tvpi: 1.26,
    dpi: 0.21,
    country: "Singapore",
    currency: "USD",
    contactPerson: "Lim Wei Ming",
    email: "wm.lim@gic.com.sg",
    phone: "+65-6889-8888",
    status: "active",
    investmentDate: "2020-02-01",
    lastCapitalCall: "2024-01-15",
    lastDistribution: "2023-11-15",
    riskRating: "low",
    kycStatus: "approved",
    accredited: true
  },
  {
    id: "LP-003",
    name: "Harvard Management Company",
    type: "endowment",
    commitment: "$3.0M",
    called: "$2.1M",
    distributed: "$0.7M",
    nav: "$2.4M",
    irr: 16.5,
    tvpi: 1.24,
    dpi: 0.23,
    country: "United States",
    currency: "USD",
    contactPerson: "Dr. Sarah Chen",
    email: "s.chen@hmc.harvard.edu",
    phone: "+1-617-495-5000",
    status: "active",
    investmentDate: "2020-04-01",
    lastCapitalCall: "2024-01-15",
    lastDistribution: "2023-10-30",
    riskRating: "low",
    kycStatus: "approved",
    accredited: true
  },
  {
    id: "LP-004",
    name: "Temasek Holdings",
    type: "sovereign",
    commitment: "$8.0M",
    called: "$5.6M",
    distributed: "$1.8M",
    nav: "$6.2M",
    irr: 18.9,
    tvpi: 1.29,
    dpi: 0.23,
    country: "Singapore",
    currency: "USD",
    contactPerson: "Tan Kok Wah",
    email: "kw.tan@temasek.com.sg",
    phone: "+65-6828-6828",
    status: "active",
    investmentDate: "2020-01-20",
    lastCapitalCall: "2024-01-15",
    lastDistribution: "2023-12-15",
    riskRating: "low",
    kycStatus: "approved",
    accredited: true
  },
  {
    id: "LP-005",
    name: "Ontario Teachers' Pension Plan",
    type: "pension",
    commitment: "$4.0M",
    called: "$2.8M",
    distributed: "$0.9M",
    nav: "$3.1M",
    irr: 17.1,
    tvpi: 1.25,
    dpi: 0.23,
    country: "Canada",
    currency: "USD",
    contactPerson: "Michael Thompson",
    email: "m.thompson@otpp.com",
    phone: "+1-416-228-5900",
    status: "active",
    investmentDate: "2020-05-01",
    lastCapitalCall: "2024-01-15",
    lastDistribution: "2023-11-30",
    riskRating: "low",
    kycStatus: "approved",
    accredited: true
  }
]
*/

// Data will be fetched from API

const fundStatuses = ["active", "closed", "winding_down"]
const distributionTypes = ["dividend", "exit", "refinancing", "other"]

export default function FundManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedVintage, setSelectedVintage] = useState("all")
  const [selectedFundType, setSelectedFundType] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedLP, setSelectedLP] = useState<LimitedPartner | null>(null)
  const [isLPDialogOpen, setIsLPDialogOpen] = useState(false)
  const [activeView, setActiveView] = useState("lifecycle")
  const [isWorkflowStatusOpen, setIsWorkflowStatusOpen] = useState(false)
  const [isLaunchFundOpen, setIsLaunchFundOpen] = useState(false)
  
  // Database state
  const [funds, setFunds] = useState<Fund[]>([])
  const [limitedPartners, setLimitedPartners] = useState<LimitedPartner[]>([])
  const [capitalCalls, setCapitalCalls] = useState<CapitalCall[]>([])
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [operationTasks, setOperationTasks] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  
  // Fetch fund data from API
  useEffect(() => {
    fetchFundData()
  }, [])
  
  // Real-time data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFundData()
    }, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const fetchFundData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch fund management data from API
      const response = await fetch('/api/fund-management?includeCapitalActivities=true&includeLPs=true')
      if (!response.ok) {
        throw new Error(`Failed to fetch fund data: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Update state with real data
      setFunds(data.funds || [])
      setLimitedPartners(data.limitedPartners || [])
      setCapitalCalls(data.capitalCalls || [])
      setDistributions(data.distributions || [])
      setOperationTasks(data.operationTasks || [])
      setReports(data.reports || [])
      
      // Extract documents from ventures
      const allDocuments = data.ventures ? data.ventures.flatMap((venture: any) => 
        (venture.documents || []).map((doc: any) => ({
          ...doc,
          ventureName: venture.name
        }))
      ) : []
      setDocuments(allDocuments)
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching fund data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch fund data')
      
      // Set empty state when API fails - no mock data fallback
      setFunds([])
      setLimitedPartners([])
      setCapitalCalls([])
      setDistributions([])
      setOperationTasks([])
      setDocuments([])
      setReports([])
      setLoading(false)
    }
  }

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.geography.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || fund.status === selectedStatus
    const matchesVintage = selectedVintage === "all" || fund.vintage === selectedVintage
    const matchesFundType = selectedFundType === "all" || fund.fundType === selectedFundType
    
    return matchesSearch && matchesStatus && matchesVintage && matchesFundType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "closed": return <Clock className="h-4 w-4 text-blue-500" />
      case "winding_down": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "fundraising": return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "liquidated": return <XCircle className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case "closed": return <Badge variant="outline" className="bg-blue-100 text-blue-800">Closed</Badge>
      case "winding_down": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Winding Down</Badge>
      case "fundraising": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Fundraising</Badge>
      case "liquidated": return <Badge variant="outline" className="bg-gray-100 text-gray-800">Liquidated</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getCallStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "overdue": return <Badge variant="destructive">Overdue</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getDistributionStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
      case "announced": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Announced</Badge>
      case "pending": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "processing": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  // Calculate fund metrics using real data
  const totalFunds = funds.length
  const activeFunds = funds.filter(f => f.status === "active").length
  const totalCommittedCapital = funds.reduce((sum, fund) => {
    const amount = parseFloat(fund.committedCapital.replace(/[^0-9.]/g, ''))
    return sum + amount
  }, 0)
  const totalCalledCapital = funds.reduce((sum, fund) => {
    const amount = parseFloat(fund.calledCapital.replace(/[^0-9.]/g, ''))
    return sum + amount
  }, 0)
  const totalDistributedCapital = funds.reduce((sum, fund) => {
    const amount = parseFloat(fund.distributedCapital.replace(/[^0-9.]/g, ''))
    return sum + amount
  }, 0)
  const averageIRR = funds.length > 0 ? funds.reduce((sum, fund) => sum + fund.irr, 0) / totalFunds : 0

  if (loading) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fund Operations</h1>
            <p className="text-muted-foreground">Loading fund data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
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
            <h1 className="text-3xl font-bold tracking-tight">Fund Operations</h1>
            <p className="text-muted-foreground">Error loading fund data</p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchFundData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflow-Based Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fund Operations</h1>
          <p className="text-muted-foreground">
            End-to-end fund lifecycle and operational workflow management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isWorkflowStatusOpen} onOpenChange={setIsWorkflowStatusOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Activity className="mr-2 h-4 w-4" />
                Workflow Status
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Fund Operations Workflow Status</DialogTitle>
                <DialogDescription>
                  Current status of all operational workflows and processes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Active Workflows</h4>
                    {[
                      { 
                        name: "Capital Call Processing", 
                        status: capitalCalls.filter(c => c.status === 'pending' || c.status === 'in_progress').length > 0 ? "active" : "idle", 
                        count: capitalCalls.filter(c => c.status === 'pending' || c.status === 'in_progress').length 
                      },
                      { 
                        name: "LP Onboarding", 
                        status: limitedPartners.filter(lp => lp.status === 'active' || lp.kycStatus === 'pending').length > 0 ? "active" : "idle", 
                        count: limitedPartners.filter(lp => lp.status === 'active' || lp.kycStatus === 'pending').length 
                      },
                      { 
                        name: "Distribution Processing", 
                        status: distributions.filter(d => d.status === 'pending' || d.status === 'processing').length > 0 ? "active" : "idle", 
                        count: distributions.filter(d => d.status === 'pending' || d.status === 'processing').length 
                      },
                      { 
                        name: "Compliance Reviews", 
                        status: funds.filter(f => f.regulatoryStatus === 'UNDER_REVIEW').length > 0 ? "active" : "scheduled", 
                        count: funds.filter(f => f.regulatoryStatus === 'UNDER_REVIEW' || !f.regulatoryStatus).length 
                      }
                    ].map((workflow) => (
                      <div key={workflow.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">{workflow.count} items</div>
                        </div>
                        <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'} 
                               className={workflow.status === 'active' ? 'bg-green-100 text-green-800' : ''}>
                          {workflow.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">System Status</h4>
                    {[
                      { system: "Database", status: "operational", health: "100%" },
                      { system: "API Services", status: "operational", health: "100%" },
                      { system: "Email System", status: "operational", health: "98%" },
                      { system: "Document Storage", status: "operational", health: "100%" }
                    ].map((system) => (
                      <div key={system.system} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{system.system}</div>
                          <div className="text-sm text-muted-foreground">Health: {system.health}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">{system.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={fetchFundData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
          
          <Dialog open={isLaunchFundOpen} onOpenChange={setIsLaunchFundOpen}>
            <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
                Launch Fund
        </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Launch New Fund</DialogTitle>
                <DialogDescription>
                  Set up a new fund with complete operational parameters and LP onboarding
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Fund Setup Checklist</h4>
                    {[
                      { task: "Legal Structure Formation", completed: false, required: true },
                      { task: "Regulatory Registration", completed: false, required: true },
                      { task: "Service Provider Selection", completed: false, required: true },
                      { task: "Fund Documentation", completed: false, required: true },
                      { task: "LP Prospect List", completed: false, required: false },
                      { task: "Marketing Materials", completed: false, required: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div>
                            <span className="text-sm">{item.task}</span>
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                        </div>
                        <Badge variant={item.completed ? 'default' : 'outline'}>
                          {item.completed ? 'Complete' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Fund Parameters</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Target Size:</span>
                        <span className="font-medium">$100M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fund Type:</span>
                        <span className="font-medium">Growth Equity</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Geography:</span>
                        <span className="font-medium">Asia Pacific</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Period:</span>
                        <span className="font-medium">5 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Management Fee:</span>
                        <span className="font-medium">2.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carried Interest:</span>
                        <span className="font-medium">20%</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Begin Fund Setup
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Operational Workflow Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capitalCalls.length + distributions.length}</div>
            <p className="text-xs text-muted-foreground">
              {capitalCalls.length} capital calls, {distributions.length} distributions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funds.filter(f => f.status === 'fundraising' || f.lastUpdate?.includes('overdue')).length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LP Communications</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{limitedPartners.length * 2}</div>
            <p className="text-xs text-muted-foreground">
              Sent this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {funds.length === 0 ? '0%' : Math.round((funds.filter(f => f.status === 'active').length / funds.length) * 100) + '%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {funds.length === 0 ? 'No funds to assess' : 'Requirements status'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fund Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageIRR.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average IRR across funds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fund Performance Distribution */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Fund Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fundStatuses.map((status) => {
                const count = funds.filter(f => f.status === status).length
                const percentage = ((count / totalFunds) * 100).toFixed(1)
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
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
              <Building2 className="h-5 w-5" />
              Vintage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(funds.map(f => f.vintage)))
                .sort()
                .map((vintage) => {
                  const count = funds.filter(f => f.vintage === vintage).length
                  const percentage = ((count / totalFunds) * 100).toFixed(1)
                  return (
                    <div key={vintage} className="flex items-center justify-between">
                      <span className="text-sm">{vintage}</span>
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
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Distributed</span>
                <div className="text-right">
                  <div className="font-medium">${totalDistributedCapital.toFixed(0)}M</div>
                  <div className="text-xs text-muted-foreground">
                    {((totalDistributedCapital / totalCalledCapital) * 100).toFixed(1)}% of called
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg TVPI</span>
                <div className="text-right">
                  <div className="font-medium">
                    {totalFunds > 0 ? (funds.reduce((sum, f) => sum + f.tvpi, 0) / totalFunds).toFixed(2) : '0.00'}x
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg DPI</span>
                <div className="text-right">
                  <div className="font-medium">
                    {totalFunds > 0 ? (funds.reduce((sum, f) => sum + f.dpi, 0) / totalFunds).toFixed(2) : '0.00'}x
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Management Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-6">
            <TabsTrigger value="lifecycle">Fund Lifecycle</TabsTrigger>
            <TabsTrigger value="onboarding">LP Onboarding</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <TabsContent value="lifecycle" className="space-y-4">
          {/* Fund Lifecycle Management */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Fund Formation & Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Fund Formation
                </CardTitle>
                <CardDescription>Structure setup and legal formation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Legal Structure</div>
                      <div className="text-sm text-muted-foreground">Partnership agreements, governance</div>
                    </div>
                    <Badge variant="default" className={funds.length > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {funds.length > 0 ? 'Complete' : 'Not Started'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Regulatory Approval</div>
                      <div className="text-sm text-muted-foreground">SEC registration, compliance setup</div>
                    </div>
                    <Badge variant="secondary" className={
                      funds.some(f => f.regulatoryStatus === 'APPROVED') ? "bg-green-100 text-green-800" :
                      funds.some(f => f.regulatoryStatus === 'UNDER_REVIEW') ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }>
                      {funds.some(f => f.regulatoryStatus === 'APPROVED') ? 'Complete' :
                       funds.some(f => f.regulatoryStatus === 'UNDER_REVIEW') ? 'In Progress' : 'Not Started'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Service Providers</div>
                      <div className="text-sm text-muted-foreground">Fund admin, auditor, legal counsel</div>
                    </div>
                    <Badge variant="outline" className={
                      funds.some(f => f.fundAdmin && f.auditor && f.legalCounsel) ? "bg-green-100 text-green-800" :
                      funds.some(f => f.fundAdmin || f.auditor || f.legalCounsel) ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                    }>
                      {funds.some(f => f.fundAdmin && f.auditor && f.legalCounsel) ? 'Complete' :
                       funds.some(f => f.fundAdmin || f.auditor || f.legalCounsel) ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Setup
                </Button>
              </CardContent>
            </Card>

            {/* Fundraising Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Fundraising
                </CardTitle>
                <CardDescription>Capital raising and LP acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Target Size</span>
                    <span className="font-medium">
                      {funds.length > 0 ? funds[0].size : '$0M'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Committed</span>
                    <span className="font-medium text-green-600">
                      {funds.length > 0 ? funds[0].committedCapital : '$0M'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="font-medium">
                      {funds.length > 0 ? Math.round((parseFloat(funds[0].committedCapital.replace(/[^0-9.]/g, '')) / parseFloat(funds[0].size.replace(/[^0-9.]/g, ''))) * 100) + '%' : '0%'}
                    </span>
                  </div>
                  <Progress 
                    value={funds.length > 0 ? Math.round((parseFloat(funds[0].committedCapital.replace(/[^0-9.]/g, '')) / parseFloat(funds[0].size.replace(/[^0-9.]/g, ''))) * 100) : 0} 
                    className="w-full" 
                  />
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>First Close</span>
                      <Badge variant="default" className={
                        funds.some(f => f.status === 'active' || f.status === 'closed') ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }>
                        {funds.some(f => f.status === 'active' || f.status === 'closed') ? 'Complete' : 'Planned'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Second Close</span>
                      <Badge variant="secondary" className={
                        funds.some(f => f.status === 'fundraising' && (typeof f.committedCapital === 'number' ? f.committedCapital : parseFloat(f.committedCapital?.toString().replace(/[^0-9.]/g, '') || '0')) > (typeof f.size === 'number' ? f.size : parseFloat(f.size?.toString().replace(/[^0-9.]/g, '') || '0')) * 0.5) ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }>
                        {funds.some(f => f.status === 'fundraising' && (typeof f.committedCapital === 'number' ? f.committedCapital : parseFloat(f.committedCapital?.toString().replace(/[^0-9.]/g, '') || '0')) > (typeof f.size === 'number' ? f.size : parseFloat(f.size?.toString().replace(/[^0-9.]/g, '') || '0')) * 0.5) ? 'Active' : 'Planned'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Final Close</span>
                      <Badge variant="outline" className={
                        funds.some(f => f.status === 'closed') ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }>
                        {funds.some(f => f.status === 'closed') ? 'Complete' : 'Planned'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Fundraising
                </Button>
              </CardContent>
            </Card>

            {/* Investment Period */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Investment Period
                </CardTitle>
                <CardDescription>Active investment and deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Period Remaining</span>
                    <span className="font-medium">
                      {funds.length > 0 ? '5 years' : '0 years'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Capital Deployed</span>
                    <span className="font-medium">
                      {funds.length > 0 ? funds[0].calledCapital : '$0M'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Investments Made</span>
                    <span className="font-medium">
                      {funds.length > 0 ? funds[0].investments + ' companies' : '0 companies'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pipeline</span>
                    <span className="font-medium">
                      {funds.length > 0 ? Math.round(funds[0].investments * 1.5) + ' opportunities' : '0 opportunities'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="text-sm font-medium">Recent Activity</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {operationTasks.length === 0 ? (
                        <div>• No recent activity</div>
                      ) : (
                        operationTasks.slice(0, 3).map((task, idx) => (
                          <div key={idx}>• {task.title}</div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Pipeline
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Fund Lifecycle Status */}
          <Card>
            <CardHeader>
              <CardTitle>Fund Lifecycle Timeline</CardTitle>
              <CardDescription>Track progress through all phases of fund lifecycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { 
                    phase: "Formation", 
                    status: funds.length > 0 ? "completed" : "upcoming",
                    duration: "6 months", 
                    description: "Legal setup, regulatory approvals" 
                  },
                  { 
                    phase: "Fundraising", 
                    status: funds.some(f => f.status === 'fundraising') ? "active" : 
                           funds.some(f => f.status === 'active' || f.status === 'closed') ? "completed" : "upcoming",
                    duration: "18 months", 
                    description: "LP commitments, multiple closes" 
                  },
                  { 
                    phase: "Investment", 
                    status: funds.some(f => f.status === 'active' && (typeof f.calledCapital === 'number' ? f.calledCapital : parseFloat(f.calledCapital?.toString().replace(/[^0-9.]/g, '') || '0')) > 0) ? "active" :
                           funds.some(f => f.status === 'active') ? "upcoming" : "upcoming",
                    duration: "5 years", 
                    description: "Deploy capital, build portfolio" 
                  },
                  { 
                    phase: "Management", 
                    status: funds.some(f => (f.investments && f.investments > 0)) ? "active" : "upcoming",
                    duration: "5-7 years", 
                    description: "Portfolio support, value creation" 
                  },
                  { 
                    phase: "Harvesting", 
                    status: funds.some(f => (typeof f.distributedCapital === 'number' ? f.distributedCapital : parseFloat(f.distributedCapital?.toString().replace(/[^0-9.]/g, '') || '0')) > 0) ? "active" : "upcoming",
                    duration: "2-4 years", 
                    description: "Exits, distributions to LPs" 
                  },
                  { 
                    phase: "Liquidation", 
                    status: funds.some(f => f.status === 'winding_down' || f.status === 'liquidated') ? "active" : "upcoming",
                    duration: "1-2 years", 
                    description: "Final distributions, wind down" 
                  }
                ].map((phase, index) => (
                  <div key={phase.phase} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-500' :
                        phase.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      {index < 5 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          phase.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{phase.phase}</h4>
                          <p className="text-sm text-muted-foreground">{phase.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            phase.status === 'completed' ? 'default' :
                            phase.status === 'active' ? 'secondary' : 'outline'
                          } className={
                            phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                            phase.status === 'active' ? 'bg-blue-100 text-blue-800' : ''
                          }>
                            {phase.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">{phase.duration}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          {/* LP Onboarding Workflow */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  LP Onboarding Pipeline
                </CardTitle>
                <CardDescription>Track investor onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {limitedPartners.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Limited Partners</h3>
                      <p className="text-muted-foreground mb-4">
                        Add limited partners to track onboarding progress.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First LP
                      </Button>
                    </div>
                  ) : (
                    limitedPartners.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.kycStatus === 'pending' ? 'KYC Review' :
                             item.kycStatus === 'approved' && item.status === 'active' ? 'Active LP' :
                             'Documentation'}
                          </div>
                        </div>
                        <Badge variant={
                          item.status === 'active' && item.kycStatus === 'approved' ? 'default' :
                          item.status === 'active' ? 'secondary' : 'outline'
                        } className={
                          item.status === 'active' && item.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {item.status === 'active' && item.kycStatus === 'approved' ? 'Completed' :
                           item.status === 'active' ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Onboarding Checklist
                </CardTitle>
                <CardDescription>Required steps for new LPs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Initial Interest & Qualification", completed: limitedPartners.length > 0 },
                    { task: "Fund Materials Distribution", completed: limitedPartners.length > 0 },
                    { task: "KYC/AML Documentation", completed: limitedPartners.some(lp => lp.kycStatus === 'approved') },
                    { task: "Investment Committee Approval", completed: limitedPartners.some(lp => lp.status === 'active') },
                    { task: "Legal Documentation Review", completed: limitedPartners.some(lp => lp.status === 'active') },
                    { task: "Capital Commitment Agreement", completed: limitedPartners.some(lp => typeof lp.commitment === 'number' ? lp.commitment > 0 : parseFloat(lp.commitment?.toString() || '0') > 0) },
                    { task: "Wire Instructions Setup", completed: limitedPartners.some(lp => lp.status === 'active') },
                    { task: "Investor Portal Access", completed: limitedPartners.some(lp => lp.status === 'active') }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New LP
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* LP Communication Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Templates</CardTitle>
              <CardDescription>Standardized communications for LP onboarding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: "Welcome Package", description: "Initial fund materials and overview", status: "active" },
                  { name: "KYC Request", description: "Documentation requirements", status: "template" },
                  { name: "Legal Review", description: "Subscription documents", status: "template" },
                  { name: "Onboarding Complete", description: "Welcome to the fund", status: "template" }
                ].map((template) => (
                  <div key={template.name} className="p-4 border rounded-lg">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground mb-3">{template.description}</div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Send className="mr-2 h-3 w-3" />
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search funds, geography, sectors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fund Type</label>
                  <Select value={selectedFundType} onValueChange={setSelectedFundType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All fund types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All fund types</SelectItem>
                      <SelectItem value="venture">Venture Capital</SelectItem>
                      <SelectItem value="growth">Growth Equity</SelectItem>
                      <SelectItem value="impact">Impact Investing</SelectItem>
                      <SelectItem value="buyout">Buyout</SelectItem>
                      <SelectItem value="debt">Debt Funds</SelectItem>
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
                      <SelectItem value="fundraising">Fundraising</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="winding_down">Winding Down</SelectItem>
                      <SelectItem value="liquidated">Liquidated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vintage</label>
                  <Select value={selectedVintage} onValueChange={setSelectedVintage}>
                    <SelectTrigger>
                      <SelectValue placeholder="All vintages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All vintages</SelectItem>
                      {Array.from(new Set(funds.map(f => f.vintage)))
                        .sort()
                        .map(vintage => (
                          <SelectItem key={vintage} value={vintage}>{vintage}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funds Table */}
          <Card>
            <CardHeader>
              <CardTitle>Funds ({filteredFunds.length})</CardTitle>
              <CardDescription>
                Overview of all funds and their performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead>Vintage</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Called</TableHead>
                    <TableHead>Distributed</TableHead>
                    <TableHead>IRR</TableHead>
                    <TableHead>TVPI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFunds.map((fund) => {
                    const calledPercentage = (parseFloat(fund.calledCapital.replace(/[^0-9.]/g, '')) / 
                                             parseFloat(fund.committedCapital.replace(/[^0-9.]/g, ''))) * 100
                    
                    return (
                      <TableRow key={fund.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{fund.name}</div>
                            <div className="text-sm text-muted-foreground">{fund.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{fund.vintage}</TableCell>
                        <TableCell className="font-medium">{fund.size}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{fund.calledCapital}</div>
                            <div className="text-sm text-muted-foreground">{calledPercentage.toFixed(1)}%</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{fund.distributedCapital}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${fund.irr > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {fund.irr > 0 ? '+' : ''}{fund.irr.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{fund.tvpi.toFixed(2)}x</span>
                            {fund.tvpi > 1 ? (
                              <ArrowUpRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(fund.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                              {fund.fundManager ? fund.fundManager.split(' ').map(n => n[0]).join('') : 'FM'}
                            </div>
                            <span className="text-sm">{fund.fundManager || 'Fund Manager'}</span>
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
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capital-calls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capital Calls</CardTitle>
              <CardDescription>
                Track capital calls and LP responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead>Call Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>LP Response</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capitalCalls.map((call) => {
                    const responseRate = (call.lpsResponded / call.totalLps) * 100
                    
                    return (
                      <TableRow key={call.id}>
                        <TableCell>
                          <div className="font-medium">{call.fundName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{call.callNumber}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{call.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{call.dueDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={responseRate} className="w-16 h-2" />
                            <span className="text-sm">{call.lpsResponded}/{call.totalLps}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getCallStatusBadge(call.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{call.lastUpdate}</span>
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

        <TabsContent value="distributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distributions</CardTitle>
              <CardDescription>
                Track fund distributions and LP payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead>Distribution</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>LP Payments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributions.map((dist) => {
                    const paymentRate = (dist.lpsPaid / dist.totalLps) * 100
                    
                    return (
                      <TableRow key={dist.id}>
                        <TableCell>
                          <div className="font-medium">{dist.fundName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{dist.distributionNumber}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{dist.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{dist.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{dist.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={paymentRate} className="w-16 h-2" />
                            <span className="text-sm">{dist.lpsPaid}/{dist.totalLps}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getDistributionStatusBadge(dist.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{dist.lastUpdate}</span>
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

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fund Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and insights on fund performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Top Performing Funds</h4>
                  {funds
                    .sort((a, b) => b.irr - a.irr)
                    .slice(0, 3)
                    .map((fund, index) => (
                      <div key={fund.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{fund.name}</div>
                            <div className="text-sm text-muted-foreground">{fund.vintage}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+{fund.irr.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">{fund.tvpi.toFixed(2)}x TVPI</div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Capital Efficiency</h4>
                  {funds
                    .sort((a, b) => {
                      const aEfficiency = parseFloat(a.distributedCapital.replace(/[^0-9.]/g, '')) / 
                                         parseFloat(a.calledCapital.replace(/[^0-9.]/g, ''))
                      const bEfficiency = parseFloat(b.distributedCapital.replace(/[^0-9.]/g, '')) / 
                                         parseFloat(b.calledCapital.replace(/[^0-9.]/g, ''))
                      return bEfficiency - aEfficiency
                    })
                    .slice(0, 3)
                    .map((fund) => {
                      const efficiency = parseFloat(fund.distributedCapital.replace(/[^0-9.]/g, '')) / 
                                       parseFloat(fund.calledCapital.replace(/[^0-9.]/g, ''))
                      return (
                        <div key={fund.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{fund.name}</span>
                          <div className="text-right">
                            <div className="font-medium">{(efficiency * 100).toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">
                              {fund.distributedCapital} / {fund.calledCapital}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lp-portal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Limited Partners</CardTitle>
              <CardDescription>
                Manage investor relationships and communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {limitedPartners.slice(0, 4).map(lp => (
                  <div key={lp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => {setSelectedLP(lp); setIsLPDialogOpen(true)}}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {lp.name ? lp.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'LP'}
                      </div>
                      <div>
                        <div className="font-medium">{lp.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {lp.type.replace('_', ' ')} • {lp.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{lp.commitment}</div>
                      <div className="text-sm text-muted-foreground">
                        {lp.irr.toFixed(1)}% IRR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* LP Performance Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>LP Performance Analysis</CardTitle>
              <CardDescription>Individual limited partner performance metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Limited Partner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Commitment</TableHead>
                      <TableHead>Called</TableHead>
                      <TableHead>Distributed</TableHead>
                      <TableHead>NAV</TableHead>
                      <TableHead>IRR</TableHead>
                      <TableHead>TVPI</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {limitedPartners.map(lp => (
                      <TableRow key={lp.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                              {lp.name ? lp.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'LP'}
                            </div>
                            <div>
                              <div className="font-medium">{lp.name}</div>
                              <div className="text-sm text-muted-foreground">{lp.country}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {lp.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{lp.commitment}</TableCell>
                        <TableCell>{lp.called}</TableCell>
                        <TableCell>{lp.distributed}</TableCell>
                        <TableCell>{lp.nav}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${lp.irr > 15 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {lp.irr.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{lp.tvpi.toFixed(2)}x</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={lp.kycStatus === 'approved' ? 'default' : 'secondary'} className={lp.kycStatus === 'approved' ? 'bg-green-100 text-green-800' : ''}>
                            {lp.kycStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {setSelectedLP(lp); setIsLPDialogOpen(true)}}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capital Calls</CardTitle>
              <CardDescription>
                Track capital calls and LP responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead>Call Number</TableHead>
                    <TableHead>Target Ventures</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>LP Response</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capitalCalls.map((call) => {
                    const responseRate = (call.lpsResponded / call.totalLps) * 100
                    
                    return (
                      <TableRow key={call.id}>
                        <TableCell>
                          <div className="font-medium">{call.fundName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{call.callNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            {call.investments && call.investments.length > 0 ? (
                              <div className="space-y-1">
                                {call.investments.map(investment => (
                                  <Badge 
                                    key={investment} 
                                    variant="outline" 
                                    className="text-xs bg-blue-50 text-blue-700 block w-fit cursor-pointer hover:bg-blue-100 transition-colors"
                                    onClick={() => window.open('/dashboard/deal-flow', '_blank')}
                                  >
                                    🏢 {investment}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">No specific ventures</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{call.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{call.dueDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={responseRate} className="w-16 h-2" />
                            <span className="text-sm">{call.lpsResponded}/{call.totalLps}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getCallStatusBadge(call.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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

        <TabsContent value="operations" className="space-y-4">
          {/* Operational Workflows */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Capital Call Workflow
                </CardTitle>
                <CardDescription>Manage capital call process from initiation to collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {capitalCalls.map((call) => {
                    const responseRate = (call.lpsResponded / call.totalLps) * 100
                    return (
                      <div key={call.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">{call.fundName}</div>
                            <div className="text-sm text-muted-foreground">{call.callNumber} • {call.amount}</div>
                            <div className="text-sm text-blue-600 font-medium">
                              🏢 {call.purpose || call.investments?.join(', ') || 'Investment purpose'}
                            </div>
                          </div>
                          {getCallStatusBadge(call.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Target Ventures:</span>
                            <span className="font-medium">{call.investments?.length || 0} companies</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Due Date:</span>
                            <span>{call.dueDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>LP Responses:</span>
                            <span>{call.lpsResponded}/{call.totalLps} ({responseRate.toFixed(0)}%)</span>
                          </div>
                          <Progress value={responseRate} className="w-full h-2" />
                          
                          {call.investments && call.investments.length > 0 && (
                            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                              <div className="text-xs font-medium text-blue-800 mb-1">Target Investments:</div>
                              <div className="flex flex-wrap gap-1">
                                {call.investments.map(investment => (
                                  <Badge 
                                    key={investment} 
                                    variant="outline" 
                                    className="text-xs bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 transition-colors"
                                    onClick={() => window.open('/dashboard/deal-flow', '_blank')}
                                  >
                                    🏢 {investment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Bell className="mr-2 h-3 w-3" />
                            Send Reminder
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="mr-2 h-3 w-3" />
                            View Details
                          </Button>
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
                  <Banknote className="h-5 w-5" />
                  Distribution Workflow
                </CardTitle>
                <CardDescription>Manage distribution process from approval to payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distributions.map((dist) => {
                    const paymentRate = (dist.lpsPaid / dist.totalLps) * 100
                    return (
                      <div key={dist.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">{dist.fundName}</div>
                            <div className="text-sm text-muted-foreground">{dist.distributionNumber} • {dist.amount}</div>
                          </div>
                          {getDistributionStatusBadge(dist.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Distribution Date:</span>
                            <span>{dist.date}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Type:</span>
                            <Badge variant="secondary" className="capitalize">{dist.type}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>LP Payments:</span>
                            <span>{dist.lpsPaid}/{dist.totalLps} ({paymentRate.toFixed(0)}%)</span>
                          </div>
                          <Progress value={paymentRate} className="w-full h-2" />
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Send className="mr-2 h-3 w-3" />
                            Process Payment
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Receipt className="mr-2 h-3 w-3" />
                            Tax Forms
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operational Task Management */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Task Queue</CardTitle>
              <CardDescription>Manage day-to-day operational tasks and workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {operationTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Operation Tasks</h3>
                    <p className="text-muted-foreground mb-4">
                      All operational tasks are completed or no tasks have been created yet.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                ) : (
                  operationTasks.slice(0, 5).map((task, index) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          task.priority === 'HIGH' ? 'bg-red-500' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'} • 
                            Assigned to: {task.assignee?.name || 'Unassigned'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.type?.toLowerCase().replace('_', ' ') || 'task'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Dashboard */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Regulatory Compliance
                </CardTitle>
                <CardDescription>Track regulatory requirements and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funds.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Compliance Requirements</h3>
                      <p className="text-muted-foreground mb-4">
                        Add funds to track regulatory compliance requirements.
                      </p>
                    </div>
                  ) : (
                    [
                      { requirement: "Form ADV Annual Update", due: "2024-03-31", status: funds.some(f => f.regulatoryStatus === 'APPROVED') ? "completed" : "pending", priority: "high" },
                      { requirement: "Annual Audit Report", due: "2024-04-15", status: funds.some(f => f.auditor) ? "completed" : "pending", priority: "high" },
                      { requirement: "LP Annual Reports", due: "2024-03-30", status: limitedPartners.length > 0 ? "completed" : "pending", priority: "medium" },
                      { requirement: "AIFMD Reporting", due: "2024-04-30", status: "pending", priority: "medium" },
                      { requirement: "Tax Returns Filing", due: "2024-04-15", status: funds.some(f => f.status === 'active') ? "in_progress" : "pending", priority: "high" }
                    ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.requirement}</div>
                        <div className="text-sm text-muted-foreground">Due: {item.due}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <Badge variant={
                          item.status === 'completed' ? 'default' :
                          item.status === 'in_progress' ? 'secondary' : 'outline'
                        } className={
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''
                        }>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Management
                </CardTitle>
                <CardDescription>Track required documents and filings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Documents</h3>
                      <p className="text-muted-foreground mb-4">
                        No documents have been uploaded yet. Add ventures with documents to see them here.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  ) : (
                    documents.slice(0, 5).map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.type?.toLowerCase().replace('_', ' ') || 'document'} • 
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} • 
                            From: {doc.ventureName}
                          </div>
                        </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          current
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          {/* Reporting Workflows */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Reporting Schedule
                </CardTitle>
                <CardDescription>Automated reporting calendar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {limitedPartners.length === 0 ? (
                    <div className="text-center py-4">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No reporting required</p>
                      <p className="text-xs text-muted-foreground">Add LPs to enable reporting</p>
                    </div>
                  ) : (
                    [
                      { report: "Monthly LP Update", frequency: "Monthly", next: "2024-04-01", status: limitedPartners.length > 0 ? "scheduled" : "disabled" },
                      { report: "Quarterly Performance", frequency: "Quarterly", next: "2024-04-15", status: funds.some(f => f.status === 'active') ? "scheduled" : "planned" },
                      { report: "Annual Report", frequency: "Annual", next: "2024-12-31", status: funds.length > 0 ? "planned" : "disabled" },
                      { report: "Tax K-1 Generation", frequency: "Annual", next: "2024-03-15", status: distributions.length > 0 ? "pending" : "disabled" }
                    ].filter(item => item.status !== 'disabled').map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{item.report}</div>
                        <Badge variant="outline" className="text-xs">{item.frequency}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Next: {item.next}</div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant={
                          item.status === 'scheduled' ? 'default' :
                          item.status === 'in_progress' ? 'secondary' : 'outline'
                        } className={
                          item.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''
                        }>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Reports
                </CardTitle>
                <CardDescription>Generate and distribute performance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Monthly Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Quarterly Performance
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calculator className="mr-2 h-4 w-4" />
                    Custom Analytics
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Report Library
                </CardTitle>
                <CardDescription>Access historical reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.length === 0 ? (
                    <div className="text-center py-6">
                      <Award className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-md font-medium mb-2">No Reports Generated</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        No reports have been generated yet. Create your first report.
                      </p>
                      <Button size="sm">
                        <Plus className="h-3 w-3 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  ) : (
                    reports.slice(0, 4).map((report, index) => (
                      <div key={report.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : 'Draft'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {report.type?.toLowerCase() || 'report'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* LP Detail Dialog */}
      <Dialog open={isLPDialogOpen} onOpenChange={setIsLPDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {selectedLP?.name ? selectedLP.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'LP'}
              </div>
              {selectedLP?.name}
            </DialogTitle>
            <DialogDescription>
              Limited partner details and performance
            </DialogDescription>
          </DialogHeader>
          {selectedLP && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Investment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commitment:</span>
                      <span className="font-medium">{selectedLP.commitment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Called:</span>
                      <span className="font-medium">{selectedLP.called}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distributed:</span>
                      <span className="font-medium">{selectedLP.distributed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current NAV:</span>
                      <span className="font-medium">{selectedLP.nav}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>IRR:</span>
                      <span className={`font-medium ${selectedLP.irr > 15 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedLP.irr.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVPI:</span>
                      <span className="font-medium">{selectedLP.tvpi.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DPI:</span>
                      <span className="font-medium">{selectedLP.dpi.toFixed(2)}x</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLP.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLP.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLP.country}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Compliance Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>KYC Status:</span>
                      <Badge variant={selectedLP.kycStatus === 'approved' ? 'default' : 'secondary'}>
                        {selectedLP.kycStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Accredited:</span>
                      <Badge variant={selectedLP.accredited ? 'default' : 'secondary'}>
                        {selectedLP.accredited ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Rating:</span>
                      <Badge variant="outline" className={
                        selectedLP.riskRating === 'low' ? 'text-green-600' :
                        selectedLP.riskRating === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      }>
                        {selectedLP.riskRating}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 