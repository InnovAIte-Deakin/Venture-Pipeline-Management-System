"use client"

import React, { useState, useEffect } from "react"
import { calculateGEDSIScore, getGEDSIScoreInterpretation } from "@/lib/gedsi-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  Filter, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  Download,
  Upload,
  MessageSquare,
  Star,
  TrendingUp,
  Target,
  Activity,
  Lightbulb,
  Award,
  ArrowRight
} from "lucide-react"

interface DueDiligenceItem {
  id: string
  company: string
  stage: string
  category: string
  assignedTo: string
  dueDate: string
  completion: number
  priority: "high" | "medium" | "low"
  status: "not_started" | "in_progress" | "completed" | "blocked"
  lastUpdated: string
  documents: number
  comments: number
}

interface VentureDD {
  ventureId: string
  ventureName: string
  overallProgress: number
  overallStatus: "not_started" | "in_progress" | "completed" | "blocked"
  priority: "high" | "medium" | "low"
  leadAnalyst: string
  dueDate: string
  lastActivity: string
  categories: {
    [key: string]: DueDiligenceItem
  }
  totalDocuments: number
  totalComments: number
  riskLevel: "low" | "medium" | "high"
  gedsiScore?: number
}

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: string
  completed: boolean
  assignedTo: string
  dueDate: string
  priority: "high" | "medium" | "low"
}

const mockDueDiligenceItems: DueDiligenceItem[] = [
  {
    id: "DD-001",
    company: "TechFlow Solutions",
    stage: "Financial Review",
    category: "Financial",
    assignedTo: "Sarah Johnson",
    dueDate: "2024-03-15",
    completion: 75,
    priority: "high",
    status: "in_progress",
    lastUpdated: "2 hours ago",
    documents: 12,
    comments: 8
  },
  {
    id: "DD-002",
    company: "GreenEnergy Innovations",
    stage: "Legal Review",
    category: "Legal",
    assignedTo: "Mike Chen",
    dueDate: "2024-03-10",
    completion: 90,
    priority: "high",
    status: "completed",
    lastUpdated: "1 day ago",
    documents: 18,
    comments: 15
  },
  {
    id: "DD-003",
    company: "HealthTech Pro",
    stage: "Technical Assessment",
    category: "Technical",
    assignedTo: "David Smith",
    dueDate: "2024-03-20",
    completion: 45,
    priority: "medium",
    status: "in_progress",
    lastUpdated: "3 days ago",
    documents: 8,
    comments: 3
  },
  {
    id: "DD-004",
    company: "FinTech Revolution",
    stage: "Market Analysis",
    category: "Market",
    assignedTo: "Lisa Wang",
    dueDate: "2024-03-25",
    completion: 30,
    priority: "medium",
    status: "not_started",
    lastUpdated: "1 week ago",
    documents: 5,
    comments: 2
  },
  {
    id: "DD-005",
    company: "EduTech Platform",
    stage: "Team Assessment",
    category: "Team",
    assignedTo: "Alex Rodriguez",
    dueDate: "2024-03-18",
    completion: 100,
    priority: "low",
    status: "completed",
    lastUpdated: "2 days ago",
    documents: 15,
    comments: 12
  }
]

// Checklist items are now generated from real venture data

const categories = [
  "Financial",
  "Legal", 
  "Technical",
  "Market",
  "Team",
  "Operations",
  "Compliance"
]

const stages = [
  "Initial Review",
  "Financial Review",
  "Legal Review", 
  "Technical Assessment",
  "Market Analysis",
  "Team Assessment",
  "Final Report"
]

// Helper functions for real calculations
function calculateAverageCompletionTime(ventures: any[]): number {
  if (ventures.length === 0) return 0
  
  const completedVentures = ventures.filter(v => 
    ['FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'EXITED'].includes(v.stage)
  )
  
  if (completedVentures.length === 0) return 0
  
  const totalDays = completedVentures.reduce((sum, venture) => {
    const createdDate = new Date(venture.createdAt)
    const updatedDate = new Date(venture.updatedAt)
    const daysDiff = Math.floor((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    return sum + daysDiff
  }, 0)
  
  return Math.round(totalDays / completedVentures.length)
}

function calculateCompletionTimeProgress(ventures: any[]): number {
  const avgTime = calculateAverageCompletionTime(ventures)
  if (avgTime === 0) return 0
  
  // Progress based on target of 30 days (lower is better)
  const targetDays = 30
  const progress = Math.max(0, Math.min(100, ((targetDays - avgTime) / targetDays) * 100 + 50))
  return Math.round(progress)
}

function calculateOnTimeCompletionRate(ventures: any[]): number {
  if (ventures.length === 0) return 0
  
  const dueDiligenceVentures = ventures.filter(v => 
    ['DUE_DILIGENCE', 'INVESTMENT_READY', 'FUNDED', 'SERIES_A', 'SERIES_B', 'SERIES_C'].includes(v.stage)
  )
  
  if (dueDiligenceVentures.length === 0) return 0
  
  // Consider ventures "on time" if they progressed within reasonable timeframes
  const onTimeVentures = dueDiligenceVentures.filter(v => {
    const createdDate = new Date(v.createdAt)
    const updatedDate = new Date(v.updatedAt)
    const daysDiff = Math.floor((updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 45 // Within 45 days is considered "on time"
  })
  
  return Math.round((onTimeVentures.length / dueDiligenceVentures.length) * 100)
}

function calculateAverageGEDSIScore(ventures: any[]): number {
  if (ventures.length === 0) return 0
  
  const venturesWithScores = ventures.filter(v => v.gedsiScore != null && v.gedsiScore > 0)
  
  if (venturesWithScores.length === 0) {
    // Calculate using GEDSI utility if no stored scores
    const calculatedScores = ventures.map(v => calculateGEDSIScore(v)).filter(score => score > 0)
    if (calculatedScores.length === 0) return 0
    return Math.round(calculatedScores.reduce((sum, score) => sum + score, 0) / calculatedScores.length)
  }
  
  return Math.round(venturesWithScores.reduce((sum, v) => sum + v.gedsiScore, 0) / venturesWithScores.length)
}

// Generate checklist items from real venture data
function generateChecklistFromVentures(ventures: any[]): ChecklistItem[] {
  if (ventures.length === 0) return []
  
  const standardChecklist = [
    {
      title: "Financial Statements Review",
      description: "Review audited financial statements and financial projections",
      category: "Financial",
      priority: "high" as const
    },
    {
      title: "Legal Structure Analysis", 
      description: "Analyze corporate structure, contracts, and legal obligations",
      category: "Legal",
      priority: "high" as const
    },
    {
      title: "Technology Stack Assessment",
      description: "Evaluate technology architecture and scalability",
      category: "Technical", 
      priority: "medium" as const
    },
    {
      title: "Market Size Validation",
      description: "Verify TAM, SAM, and market opportunity analysis",
      category: "Market",
      priority: "medium" as const
    },
    {
      title: "Team Background Assessment",
      description: "Evaluate team composition and key personnel",
      category: "Team",
      priority: "low" as const
    },
    {
      title: "GEDSI Compliance Review",
      description: "Assess GEDSI metrics and inclusion practices",
      category: "Compliance",
      priority: "high" as const
    }
  ]
  
  // Generate checklist items for each venture
  return ventures.flatMap((venture, ventureIndex) => 
    standardChecklist.map((template, index) => ({
      id: `CL-${venture.id}-${index + 1}`,
      title: `${template.title} - ${venture.name}`,
      description: template.description,
      category: template.category,
      completed: calculateChecklistCompletion(venture, template.category),
      assignedTo: getAssignedAnalyst(template.category),
      dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Staggered due dates
      priority: template.priority
    }))
  )
}

// Helper function to assign analysts based on category
function getAssignedAnalyst(category: string): string {
  const assignments = {
    "Financial": "Sarah Johnson",
    "Legal": "Mike Chen", 
    "Technical": "David Smith",
    "Market": "Lisa Wang",
    "Team": "Alex Rodriguez",
    "Compliance": "Maria Santos",
    "Operations": "John Kim"
  }
  return assignments[category as keyof typeof assignments] || "Unassigned"
}

// Calculate completion percentage based on real venture data
function calculateCategoryCompletion(venture: any, category: string): number {
  let completion = 0
  
  switch (category) {
    case 'Financial':
      // Base on financial data availability
      if (venture.revenue) completion += 25
      if (venture.fundingRaised) completion += 25
      if (venture.lastValuation) completion += 25
      if (venture._count?.documents >= 2) completion += 25
      break
      
    case 'Legal':
      // Base on legal structure and documentation
      if (venture.operationalReadiness?.legalStructure) completion += 50
      if (venture._count?.documents >= 1) completion += 30
      if (venture.contactEmail && venture.contactPhone) completion += 20
      break
      
    case 'Technical':
      // Base on technical readiness
      if (venture.operationalReadiness?.businessPlan) completion += 30
      if (venture.website) completion += 20
      if (venture.teamSize && venture.teamSize > 3) completion += 30
      if (venture.pitchSummary && venture.pitchSummary.length > 100) completion += 20
      break
      
    case 'Market':
      // Base on market validation
      if (venture.targetMarket) completion += 30
      if (venture.revenueModel) completion += 30
      if (venture.revenue && venture.revenue > 0) completion += 40
      break
      
    case 'Compliance':
      // Base on GEDSI and compliance
      if (venture.gedsiMetrics?.length > 0) completion += 40
      if (venture.gedsiScore && venture.gedsiScore > 70) completion += 30
      if (venture.inclusionFocus) completion += 30
      break
      
    default:
      completion = 50 // Default moderate completion
  }
  
  return Math.min(100, Math.max(0, completion))
}

// Calculate checklist item completion based on venture data
function calculateChecklistCompletion(venture: any, category: string): boolean {
  switch (category) {
    case 'Financial':
      return venture._count?.documents >= 3 && venture.revenue != null
    case 'Legal':
      return venture.operationalReadiness?.legalStructure === true
    case 'Technical':
      return venture.operationalReadiness?.businessPlan === true && venture.website != null
    case 'Market':
      return venture.targetMarket != null && venture.revenueModel != null
    case 'Team':
      return venture.teamSize != null && venture.teamSize > 2
    case 'Compliance':
      return venture.gedsiMetrics?.length > 0
    default:
      return false
  }
}

export default function DueDiligencePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [isReportConfigOpen, setIsReportConfigOpen] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<string>("")
  const [reportSections, setReportSections] = useState<{[key: string]: boolean}>({})
  const [selectedVenture, setSelectedVenture] = useState<string>("all")
  const [reportFormat, setReportFormat] = useState<string>("pdf")
  const [isNewDDDialogOpen, setIsNewDDDialogOpen] = useState(false)
  const [dueDiligenceItems, setDueDiligenceItems] = useState<DueDiligenceItem[]>([])
  const [venturesDDs, setVenturesDDs] = useState<VentureDD[]>([])
  const [ventures, setVentures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'ventures' | 'items'>('ventures')
  const [selectedVentureForDetails, setSelectedVentureForDetails] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedItem, setSelectedItem] = useState<DueDiligenceItem | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [dateRange, setDateRange] = useState<{from: string, to: string}>({from: '', to: ''})
  const [sortBy, setSortBy] = useState<string>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])

  // Fetch due diligence data from database
  useEffect(() => {
    fetchDueDiligenceData()
  }, [])

  const fetchDueDiligenceData = async () => {
    try {
      setLoading(true)
      
      // Fetch ventures from the database
      const response = await fetch('/api/ventures?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      const venturesData = data.ventures || []
      
      console.log(`📊 Found ${venturesData.length} ventures for due diligence`)
      
      // Store ventures for calculations
      setVentures(venturesData)
      
      // Transform ventures into due diligence items
      const transformedItems: DueDiligenceItem[] = venturesData.flatMap((venture: any) => {
        // Create multiple DD items per venture (different categories)
        const categories = ['Financial', 'Legal', 'Technical', 'Market']
        
        return categories.map((category, index) => {
          // Calculate completion based on real venture data
          const completion = calculateCategoryCompletion(venture, category)
          const status = completion === 100 ? 'completed' :
                        completion > 70 ? 'in_progress' :
                        completion > 0 ? 'in_progress' : 'not_started'
          
          const priority = venture.stage === 'DUE_DILIGENCE' ? 'high' :
                          venture.stage === 'INVESTMENT_READY' ? 'high' :
                          venture.stage === 'SERIES_A' || venture.stage === 'SERIES_B' ? 'medium' : 'low'

          const stage = category === 'Financial' ? 'Financial Review' :
                       category === 'Legal' ? 'Legal Review' :
                       category === 'Technical' ? 'Technical Assessment' :
                       'Market Analysis'

          return {
            id: `DD-${venture.id}-${category}`,
            company: venture.name,
            stage,
            category,
            assignedTo: venture.assignedTo?.name || venture.createdBy?.name || 'Unassigned',
            dueDate: calculateDueDate(venture.stage, category),
            completion,
            priority: priority as "high" | "medium" | "low",
            status: status as "not_started" | "in_progress" | "completed" | "blocked",
            lastUpdated: getLastActivityTime(venture.updatedAt),
            documents: venture._count?.documents || 0,
            comments: venture._count?.activities || 0
          }
        })
      })
      
      setDueDiligenceItems(transformedItems)
      
      // Group items by venture with actual venture data for GEDSI scores
      const ventureGroups = groupItemsByVenture(transformedItems, venturesData)
      setVenturesDDs(ventureGroups)
      
      // Generate checklist items from venture data
      const generatedChecklistItems = generateChecklistFromVentures(venturesData)
      setChecklistItems(generatedChecklistItems)
      
      console.log(`✅ Successfully loaded ${transformedItems.length} due diligence items from ${venturesData.length} ventures`)
      console.log(`✅ Generated ${generatedChecklistItems.length} checklist items`)
    } catch (err) {
      console.error('❌ Error fetching due diligence data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to load due diligence data: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const groupItemsByVenture = (items: DueDiligenceItem[], ventures: any[]): VentureDD[] => {
    const ventureMap = new Map<string, VentureDD>()
    
    items.forEach(item => {
      if (!ventureMap.has(item.company)) {
        // Find the actual venture data to calculate proper GEDSI score
        const ventureData = ventures.find(v => v.name === item.company)
        const gedsiScore = ventureData ? calculateGEDSIScore(ventureData) : 50
        
        // Debug GEDSI calculation (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 GEDSI Score for ${item.company}:`, gedsiScore, 'from data:', {
            founderTypes: ventureData?.founderTypes,
            inclusionFocus: ventureData?.inclusionFocus,
            aiAnalysis: ventureData?.aiAnalysis ? 'present' : 'missing',
            gedsiMetricsSummary: ventureData?.gedsiMetricsSummary ? 'present' : 'missing'
          })
        }
        
        ventureMap.set(item.company, {
          ventureId: item.company.toLowerCase().replace(/\s+/g, '-'),
          ventureName: item.company,
          overallProgress: 0,
          overallStatus: 'not_started',
          priority: 'medium',
          leadAnalyst: item.assignedTo,
          dueDate: item.dueDate,
          lastActivity: item.lastUpdated,
          categories: {},
          totalDocuments: 0,
          totalComments: 0,
          riskLevel: 'medium',
          gedsiScore: gedsiScore
        })
      }
      
      const venture = ventureMap.get(item.company)!
      venture.categories[item.category] = item
      venture.totalDocuments += item.documents
      venture.totalComments += item.comments
    })
    
    // Calculate overall metrics for each venture
    ventureMap.forEach(venture => {
      const categoryItems = Object.values(venture.categories)
      venture.overallProgress = Math.round(
        categoryItems.reduce((sum, item) => sum + item.completion, 0) / categoryItems.length
      )
      
      // Determine overall status
      const completedCount = categoryItems.filter(item => item.status === 'completed').length
      const inProgressCount = categoryItems.filter(item => item.status === 'in_progress').length
      const blockedCount = categoryItems.filter(item => item.status === 'blocked').length
      
      if (completedCount === categoryItems.length) {
        venture.overallStatus = 'completed'
      } else if (blockedCount > 0) {
        venture.overallStatus = 'blocked'
      } else if (inProgressCount > 0) {
        venture.overallStatus = 'in_progress'
      } else {
        venture.overallStatus = 'not_started'
      }
      
      // Determine priority (highest priority of all categories)
      const priorities = categoryItems.map(item => item.priority)
      if (priorities.includes('high')) venture.priority = 'high'
      else if (priorities.includes('medium')) venture.priority = 'medium'
      else venture.priority = 'low'
      
      // Determine risk level based on progress and overdue items
      const overdueCategoriesCount = categoryItems.filter(item => new Date(item.dueDate) < new Date()).length
      if (overdueCategoriesCount > 1 || venture.overallProgress < 30) {
        venture.riskLevel = 'high'
      } else if (overdueCategoriesCount > 0 || venture.overallProgress < 60) {
        venture.riskLevel = 'medium'
      } else {
        venture.riskLevel = 'low'
      }
    })
    
    return Array.from(ventureMap.values())
  }

  const calculateDueDate = (stage: string, category: string) => {
    let daysFromNow = 30 // Default 30 days
    
    // Adjust based on stage urgency
    if (stage === 'DUE_DILIGENCE' || stage === 'INVESTMENT_READY') {
      daysFromNow = 14 // 2 weeks for urgent stages
    } else if (stage === 'SERIES_A' || stage === 'SERIES_B') {
      daysFromNow = 30 // 4 weeks for funding stages
    }
    
    // Adjust based on category
    if (category === 'Financial') daysFromNow *= 0.8 // Financial is usually faster
    if (category === 'Legal') daysFromNow *= 1.2 // Legal takes longer
    
    const dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
    return dueDate.toISOString().split('T')[0]
  }

  const getLastActivityTime = (updatedAt: string) => {
    if (!updatedAt) return 'Unknown'
    
    const diffMs = Date.now() - new Date(updatedAt).getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffHours < 1) return 'Less than 1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return `${Math.floor(diffDays / 7)} weeks ago`
  }

  const filteredItems = dueDiligenceItems.filter(item => {
    const matchesSearch = item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStage = selectedStage === "all" || item.stage === selectedStage
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || item.priority === selectedPriority
    
    // Date range filtering
    let matchesDateRange = true
    if (dateRange.from || dateRange.to) {
      const itemDate = new Date(item.dueDate)
      if (dateRange.from && itemDate < new Date(dateRange.from)) matchesDateRange = false
      if (dateRange.to && itemDate > new Date(dateRange.to)) matchesDateRange = false
    }
    
    return matchesSearch && matchesCategory && matchesStage && matchesStatus && matchesPriority && matchesDateRange
  }).sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'completion':
        aValue = a.completion
        bValue = b.completion
        break
      case 'company':
        aValue = a.company.toLowerCase()
        bValue = b.company.toLowerCase()
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
        break
      case 'lastUpdated':
        aValue = new Date(a.lastUpdated || 0).getTime()
        bValue = new Date(b.lastUpdated || 0).getTime()
        break
      case 'dueDate':
      default:
        aValue = new Date(a.dueDate).getTime()
        bValue = new Date(b.dueDate).getTime()
    }
    
    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  // Action handlers
  const handleViewItem = (item: DueDiligenceItem) => {
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleEditItem = (item: DueDiligenceItem) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  const handleCommentItem = (item: DueDiligenceItem) => {
    alert(`Opening comments for ${item.company} - ${item.category} review`)
  }

  const handleMoreActions = (item: DueDiligenceItem) => {
    const actions = [
      'Assign to team member',
      'Change priority',
      'Update due date',
      'Archive item',
      'Duplicate for other venture'
    ]
    const selectedAction = prompt(`Choose action for ${item.company}:\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`)
    if (selectedAction) {
      alert(`Action selected: ${actions[parseInt(selectedAction) - 1] || 'Invalid selection'}`)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewVentureDetails = (ventureName: string) => {
    setSelectedVentureForDetails(ventureName)
    setViewMode('items')
    setSearchTerm(ventureName)
    setCurrentPage(1) // Reset to first page
  }

  const handleBackToVentures = () => {
    setSelectedVentureForDetails(null)
    setViewMode('ventures')
    setSearchTerm('') // Clear search
    setSelectedCategory('all')
    setSelectedStage('all')
    setSelectedStatus('all')
    setSelectedPriority('all')
    setDateRange({from: '', to: ''})
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />
      case "not_started": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "blocked": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress": return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "not_started": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Not Started</Badge>
      case "blocked": return <Badge variant="destructive">Blocked</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="destructive">High</Badge>
      case "medium": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low": return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const totalItems = mockDueDiligenceItems.length
  const completedItems = mockDueDiligenceItems.filter(d => d.status === "completed").length
  const inProgressItems = mockDueDiligenceItems.filter(d => d.status === "in_progress").length
  const averageCompletion = mockDueDiligenceItems.reduce((sum, item) => sum + item.completion, 0) / totalItems

  // Report section configurations
  const reportSectionOptions = {
    financial: [
      { id: 'executive_summary', label: 'Executive Summary', default: true },
      { id: 'financial_health', label: 'Financial Health Analysis', default: true },
      { id: 'gedsi_financial', label: 'GEDSI Financial Impact', default: true },
      { id: 'investment_readiness', label: 'Investment Readiness', default: true },
      { id: 'risk_assessment', label: 'Risk Assessment', default: true },
      { id: 'recommendations', label: 'Recommendations', default: true },
      { id: 'iris_metrics', label: 'IRIS+ Metrics Alignment', default: false },
      { id: 'benchmarking', label: 'Industry Benchmarking', default: false },
      { id: 'scenario_analysis', label: 'Scenario Analysis', default: false }
    ],
    legal: [
      { id: 'executive_summary', label: 'Executive Summary', default: true },
      { id: 'corporate_structure', label: 'Corporate Structure', default: true },
      { id: 'compliance_status', label: 'Compliance Status', default: true },
      { id: 'intellectual_property', label: 'Intellectual Property', default: true },
      { id: 'gedsi_legal', label: 'GEDSI Legal Framework', default: true },
      { id: 'contracts', label: 'Contracts & Agreements', default: true },
      { id: 'legal_risks', label: 'Legal Risks', default: true },
      { id: 'recommendations', label: 'Recommendations', default: true },
      { id: 'regulatory_landscape', label: 'Regulatory Landscape', default: false },
      { id: 'litigation_history', label: 'Litigation History', default: false }
    ],
    technical: [
      { id: 'executive_summary', label: 'Executive Summary', default: true },
      { id: 'technology_architecture', label: 'Technology Architecture', default: true },
      { id: 'security_assessment', label: 'Security Assessment', default: true },
      { id: 'accessibility_inclusion', label: 'Accessibility & Inclusion', default: true },
      { id: 'development_practices', label: 'Development Practices', default: true },
      { id: 'scalability_analysis', label: 'Scalability Analysis', default: true },
      { id: 'technical_team', label: 'Technical Team Assessment', default: true },
      { id: 'technology_risks', label: 'Technology Risks', default: true },
      { id: 'recommendations', label: 'Recommendations', default: true },
      { id: 'code_review', label: 'Code Quality Review', default: false },
      { id: 'infrastructure_audit', label: 'Infrastructure Audit', default: false }
    ],
    market: [
      { id: 'executive_summary', label: 'Executive Summary', default: true },
      { id: 'market_opportunity', label: 'Market Opportunity', default: true },
      { id: 'competitive_landscape', label: 'Competitive Landscape', default: true },
      { id: 'gedsi_market', label: 'GEDSI Market Analysis', default: true },
      { id: 'customer_analysis', label: 'Customer Analysis', default: true },
      { id: 'geographic_expansion', label: 'Geographic Expansion', default: true },
      { id: 'market_risks', label: 'Market Risks', default: true },
      { id: 'recommendations', label: 'Recommendations', default: true },
      { id: 'tam_sam_som', label: 'TAM/SAM/SOM Deep Dive', default: false },
      { id: 'pricing_strategy', label: 'Pricing Strategy Analysis', default: false }
    ]
  }

  const openReportConfig = (reportType: string) => {
    setSelectedReportType(reportType)
    // Set default sections for this report type
    const defaultSections: {[key: string]: boolean} = {}
    reportSectionOptions[reportType as keyof typeof reportSectionOptions]?.forEach(section => {
      defaultSections[section.id] = section.default
    })
    setReportSections(defaultSections)
    setIsReportConfigOpen(true)
  }

  const generateCustomReport = async () => {
    setGeneratingReport(selectedReportType)
    setIsReportConfigOpen(false)
    
    try {
      // Simulate report generation process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Create customized report content
      const reportContent = generateCustomizedReportContent(selectedReportType, reportSections, selectedVenture)
      const filename = `${selectedReportType}-dd-report-${new Date().toISOString().split('T')[0]}.${reportFormat === 'pdf' ? 'pdf' : 'txt'}`
      
      // Create and download file
      const blob = new Blob([reportContent], { type: reportFormat === 'pdf' ? 'application/pdf' : 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Report generation failed:', error)
    } finally {
      setGeneratingReport(null)
    }
  }

  const generateCustomizedReportContent = (reportType: string, sections: {[key: string]: boolean}, venture: string) => {
    const selectedSections = Object.keys(sections).filter(key => sections[key])
    const ventureFilter = venture === "all" ? "All Ventures" : venture
    
    let content = `MIV PLATFORM - ${reportType.toUpperCase()} DUE DILIGENCE REPORT (CUSTOMIZED)
Generated: ${new Date().toLocaleDateString()}
Venture Scope: ${ventureFilter}
Selected Sections: ${selectedSections.join(', ')}
Format: ${reportFormat.toUpperCase()}

`

    selectedSections.forEach(sectionId => {
      switch (sectionId) {
        case 'executive_summary':
          content += `EXECUTIVE SUMMARY
================
This ${reportType} due diligence report provides targeted analysis based on your selected criteria.
Focus areas include ${selectedSections.length} key sections for comprehensive assessment.

`
          break
        case 'financial_health':
          content += `FINANCIAL HEALTH ANALYSIS
========================
• Revenue Growth: 45% YoY growth with strong fundamentals
• Cash Flow: Positive operating cash flow for 8 consecutive quarters
• Burn Rate: Efficient capital utilization with 18-month runway
• Unit Economics: LTV/CAC ratio of 4.2x (industry benchmark: 3x)

`
          break
        case 'gedsi_financial':
          content += `GEDSI FINANCIAL IMPACT
=====================
• Women Leadership ROI: 23% higher productivity metrics
• Inclusive Hiring Investment: $75K annual D&I program budget
• Accessibility ROI: 15% revenue increase from accessible design
• Rural Market Revenue: 65% of total revenue from underserved areas

`
          break
        case 'investment_readiness':
          content += `INVESTMENT READINESS
===================
• Financial Model: 5-year projections with sensitivity analysis
• Audit Status: Clean opinions from reputable accounting firm
• Legal Structure: Investment-ready corporate structure
• Due Diligence Materials: Complete data room prepared

`
          break
        case 'risk_assessment':
          content += `RISK ASSESSMENT
==============
• Market Risk: Medium - competitive but differentiated positioning
• Financial Risk: Low - strong unit economics and cash management
• Operational Risk: Low - experienced team with proven execution
• Technology Risk: Low - modern, scalable architecture

`
          break
        case 'recommendations':
          content += `RECOMMENDATIONS
==============
1. Proceed with investment - meets all MIV criteria
2. Implement quarterly impact reporting
3. Establish GEDSI monitoring dashboard
4. Consider follow-on funding in 18-24 months

`
          break
        case 'iris_metrics':
          content += `IRIS+ METRICS ALIGNMENT
======================
• OI.1 (Jobs Created): 150 direct jobs, 300 indirect jobs
• OI.2 (Income): $2.5M revenue supporting local economies
• OI.3 (Financial Services): 25,000 underbanked customers served
• PI.1 (Gender): 60% women in leadership positions
• PI.2 (Youth): 40% employees under 30 years old

`
          break
        default:
          content += `${sectionId.replace('_', ' ').toUpperCase()}
${'='.repeat(sectionId.length + 1)}
Detailed analysis for ${sectionId.replace('_', ' ')} section.

`
      }
    })

    content += `
Report customized by: ${selectedSections.length} selected sections
Generated by: MIV AI Analysis Engine
Contact: reports@miv.org
`

    return content
  }

  const handleNewDueDiligence = () => {
    setIsNewDDDialogOpen(true)
  }

  const generateReport = async (reportType: string) => {
    setGeneratingReport(reportType)
    
    try {
      // Simulate report generation process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Create report content based on type
      let reportContent = ""
      let filename = ""
      
      switch (reportType) {
        case "financial":
          reportContent = generateFinancialReport()
          filename = `financial-dd-report-${new Date().toISOString().split('T')[0]}.txt`
          break
        case "legal":
          reportContent = generateLegalReport()
          filename = `legal-dd-report-${new Date().toISOString().split('T')[0]}.txt`
          break
        case "technical":
          reportContent = generateTechnicalReport()
          filename = `technical-dd-report-${new Date().toISOString().split('T')[0]}.txt`
          break
        case "market":
          reportContent = generateMarketReport()
          filename = `market-dd-report-${new Date().toISOString().split('T')[0]}.txt`
          break
        default:
          reportContent = "Report type not recognized"
          filename = `dd-report-${new Date().toISOString().split('T')[0]}.txt`
      }
      
      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Report generation failed:', error)
    } finally {
      setGeneratingReport(null)
    }
  }

  const generateFinancialReport = () => {
    return `MIV PLATFORM - FINANCIAL DUE DILIGENCE REPORT
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
This financial due diligence report provides a comprehensive analysis of the venture's financial health, 
revenue model, and investment readiness based on MIV's impact investing criteria.

FINANCIAL HEALTH ANALYSIS
========================
• Revenue Growth: Strong 45% YoY growth demonstrated
• Burn Rate: Sustainable burn rate with 18-month runway
• Unit Economics: Positive contribution margins
• Financial Controls: Adequate accounting systems in place

GEDSI FINANCIAL IMPACT
=====================
• Women Leadership Financial Performance: Above industry average
• Inclusive Hiring ROI: 23% improvement in productivity metrics
• Disability Inclusion Investment: $50K annual accessibility improvements
• Rural Market Penetration: 65% of revenue from underserved communities

INVESTMENT READINESS
===================
• Financial Projections: Comprehensive 5-year model provided
• Audit Status: Clean audit for last 2 years
• Legal Structure: Appropriate corporate structure for investment
• Tax Compliance: All filings current and compliant

RISK ASSESSMENT
==============
• Market Risk: Medium - competitive landscape
• Financial Risk: Low - strong unit economics
• Operational Risk: Low - experienced management team
• Regulatory Risk: Medium - evolving regulatory environment

RECOMMENDATIONS
==============
1. Proceed with investment - strong financial fundamentals
2. Request quarterly financial reporting post-investment
3. Implement enhanced GEDSI financial tracking
4. Consider board seat for financial oversight

IRIS+ METRICS ALIGNMENT
======================
• OI.1 (Revenue): $2.5M projected next 12 months
• OI.2 (Jobs): 150 direct jobs, 60% women
• OI.3 (Financial Inclusion): 25,000 underbanked customers served

This analysis supports the investment recommendation with strong confidence in financial returns and impact outcomes.

Report prepared by: MIV AI Analysis Engine
Contact: reports@miv.org
`
  }

  const generateLegalReport = () => {
    return `MIV PLATFORM - LEGAL DUE DILIGENCE REPORT
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
This legal due diligence report covers corporate structure, compliance status, intellectual property, 
and legal risks associated with the investment opportunity.

CORPORATE STRUCTURE
==================
• Entity Type: Private Limited Company
• Jurisdiction: Singapore (favorable for impact investing)
• Share Structure: Clear cap table with appropriate option pool
• Board Composition: Balanced with independent directors

COMPLIANCE STATUS
================
• Regulatory Compliance: Current on all regulatory filings
• Employment Law: Compliant with local labor regulations
• Data Privacy: GDPR and local privacy law compliant
• Anti-Corruption: Robust compliance policies in place

INTELLECTUAL PROPERTY
====================
• Patents: 3 pending patents for core technology
• Trademarks: Brand names properly registered
• Trade Secrets: Adequate protection measures
• IP Ownership: Clear ownership by company

GEDSI LEGAL FRAMEWORK
====================
• Diversity Policies: Comprehensive D&I policies documented
• Accessibility Compliance: WCAG 2.1 AA compliance achieved
• Equal Pay Certification: Gender pay equity certified
• Disability Rights: ADA-equivalent compliance in operations

CONTRACTS & AGREEMENTS
=====================
• Customer Contracts: Standard terms, appropriate liability limits
• Supplier Agreements: Diverse supplier base, 40% women/minority-owned
• Employment Contracts: Standard terms with appropriate IP assignment
• Partnership Agreements: Strategic partnerships properly documented

LEGAL RISKS
==========
• Litigation Risk: Low - no pending or threatened litigation
• Regulatory Risk: Medium - evolving regulatory landscape
• IP Risk: Low - strong IP protection strategy
• Contract Risk: Low - well-documented agreements

RECOMMENDATIONS
==============
1. Proceed with investment - clean legal structure
2. Implement enhanced GEDSI policy documentation
3. Consider additional IP protection in key markets
4. Regular compliance audits recommended

IRIS+ LEGAL COMPLIANCE
=====================
• Governance Structure: Meets IRIS+ governance standards
• Impact Measurement: Legal framework supports impact tracking
• Stakeholder Rights: Appropriate protections for all stakeholders

This legal analysis supports the investment with minor recommendations for enhanced documentation.

Report prepared by: MIV Legal Analysis Team
Contact: legal@miv.org
`
  }

  const generateTechnicalReport = () => {
    return `MIV PLATFORM - TECHNICAL DUE DILIGENCE REPORT
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
This technical due diligence report evaluates the venture's technology stack, scalability, 
security posture, and technical team capabilities.

TECHNOLOGY ARCHITECTURE
======================
• Stack: Modern cloud-native architecture
• Scalability: Microservices design supports 10x growth
• Performance: <200ms response times, 99.9% uptime
• Database: PostgreSQL with proper indexing and optimization

SECURITY ASSESSMENT
==================
• Data Protection: AES-256 encryption at rest and in transit
• Access Control: Multi-factor authentication implemented
• Vulnerability Management: Regular security scans and updates
• Compliance: SOC 2 Type II ready

ACCESSIBILITY & INCLUSION
=========================
• WCAG 2.1 AA Compliance: Full accessibility features implemented
• Multi-language Support: 5 languages supported for diverse markets
• Offline Capabilities: Works in low-bandwidth environments
• Mobile Optimization: Progressive web app for mobile access

DEVELOPMENT PRACTICES
====================
• Code Quality: 95% test coverage, automated testing
• Version Control: Git with proper branching strategy
• CI/CD: Automated deployment pipeline
• Documentation: Comprehensive technical documentation

SCALABILITY ANALYSIS
===================
• Current Capacity: 10,000 concurrent users
• Growth Projection: Can scale to 100,000 users with current architecture
• Performance Benchmarks: Meets enterprise-grade standards
• Infrastructure: Cloud-native with auto-scaling capabilities

TECHNICAL TEAM
==============
• CTO Background: 10+ years experience, previous successful exits
• Development Team: 8 engineers, 50% women, diverse backgrounds
• Technical Advisory: Strong technical advisory board
• Skill Gaps: Minor gaps in AI/ML expertise, easily addressable

TECHNOLOGY RISKS
===============
• Vendor Lock-in: Low - multi-cloud strategy implemented
• Technical Debt: Low - modern codebase with good practices
• Scalability Risk: Low - proven architecture patterns
• Security Risk: Low - enterprise-grade security measures

RECOMMENDATIONS
==============
1. Strong technical foundation supports investment
2. Consider additional AI/ML talent acquisition
3. Implement enhanced monitoring and observability
4. Regular security audits recommended

IRIS+ TECHNICAL METRICS
======================
• Digital Inclusion: 95% mobile accessibility score
• Technology Access: Supports low-bandwidth environments
• Innovation Index: High - proprietary technology advantages

This technical analysis strongly supports the investment with excellent technical fundamentals.

Report prepared by: MIV Technical Analysis Team
Contact: tech@miv.org
`
  }

  const generateMarketReport = () => {
    return `MIV PLATFORM - MARKET DUE DILIGENCE REPORT
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
This market due diligence report analyzes the venture's market opportunity, competitive position,
and growth potential in the target markets.

MARKET OPPORTUNITY
=================
• Total Addressable Market (TAM): $50B globally
• Serviceable Addressable Market (SAM): $5B in target regions
• Serviceable Obtainable Market (SOM): $500M realistic capture
• Market Growth Rate: 25% CAGR over next 5 years

COMPETITIVE LANDSCAPE
====================
• Direct Competitors: 3 major players identified
• Competitive Advantage: Strong differentiation through inclusion focus
• Market Position: Early leader in inclusive technology solutions
• Barriers to Entry: High - regulatory and relationship requirements

GEDSI MARKET ANALYSIS
====================
• Women-Led Market Segment: $2B underserved market opportunity
• Disability-Inclusive Products: 15% market premium achievable
• Rural Market Penetration: 40% market share potential
• Youth Engagement: 65% of target demographic under 35

CUSTOMER ANALYSIS
================
• Customer Acquisition Cost: $150 (industry average: $200)
• Customer Lifetime Value: $2,500 (strong unit economics)
• Customer Retention: 85% annual retention rate
• Market Validation: 500+ pilot customers with positive feedback

GEOGRAPHIC EXPANSION
===================
• Primary Markets: Thailand, Vietnam, Philippines
• Secondary Markets: Indonesia, Malaysia, Myanmar
• Market Entry Strategy: Partnership-first approach
• Regulatory Environment: Favorable for impact ventures

MARKET RISKS
===========
• Competition Risk: Medium - established players entering market
• Regulatory Risk: Low - supportive government policies
• Economic Risk: Medium - emerging market volatility
• Technology Risk: Low - proven technology adoption

RECOMMENDATIONS
==============
1. Strong market opportunity supports investment
2. Accelerate geographic expansion strategy
3. Strengthen competitive moats through partnerships
4. Focus on GEDSI differentiation as key advantage

IRIS+ MARKET METRICS
===================
• Market Reach: 25,000 customers in underserved communities
• Geographic Coverage: 5 countries in Southeast Asia
• Market Impact: 15% improvement in financial inclusion metrics

This market analysis strongly supports the investment opportunity with significant growth potential.

Report prepared by: MIV Market Analysis Team
Contact: market@miv.org
`
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Loading due diligence data from database...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Error:</strong> {error}
            <Button variant="link" className="p-0 h-auto text-red-600 underline ml-2" onClick={fetchDueDiligenceData}>
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
          <h1 className="text-3xl font-bold tracking-tight">Due Diligence</h1>
          <p className="text-muted-foreground">
            Manage due diligence processes and track progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'ventures' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                if (selectedVentureForDetails) {
                  handleBackToVentures()
                } else {
                  setViewMode('ventures')
                }
              }}
              className="rounded-r-none"
              disabled={loading}
            >
              By Venture
            </Button>
            <Button
              variant={viewMode === 'items' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                if (selectedVentureForDetails) {
                  // Already in items view for specific venture, do nothing or show all items
                  setSelectedVentureForDetails(null)
                  setSearchTerm('')
                } else {
                  setViewMode('items')
                }
              }}
              className="rounded-l-none"
              disabled={loading}
            >
              {selectedVentureForDetails ? 'All Items' : 'By Items'}
            </Button>
          </div>
          <Button onClick={handleNewDueDiligence}>
            <Plus className="mr-2 h-4 w-4" />
            New Due Diligence
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {selectedVentureForDetails && viewMode === 'items' && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBackToVentures}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                >
                  ← Back to Ventures
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{selectedVentureForDetails} Due Diligence Details</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filteredItems.length} items found
                </Badge>
                <Button variant="outline" size="sm" onClick={handleBackToVentures}>
                  <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                  Back to Overview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats Cards with Real Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {viewMode === 'ventures' ? 'Total Ventures' : 'Total Items'}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {viewMode === 'ventures' ? venturesDDs.length : filteredItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {viewMode === 'ventures' 
                ? `${filteredItems.length} total DD items`
                : `Across ${new Set(filteredItems.map(item => item.company)).size} companies`
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredItems.filter(item => item.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredItems.length > 0 ? ((filteredItems.filter(item => item.status === 'completed').length / filteredItems.length) * 100).toFixed(1) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredItems.filter(item => item.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredItems.length > 0 ? ((filteredItems.filter(item => item.status === 'in_progress').length / filteredItems.length) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredItems.length > 0 ? (filteredItems.reduce((sum, item) => sum + item.completion, 0) / filteredItems.length).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all active items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Analytics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">High Priority Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredItems.filter(item => item.priority === 'high').slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
                  <span className="text-sm font-medium truncate">{item.company}</span>
                  <Badge variant="destructive" className="text-xs">
                    {item.completion}%
                  </Badge>
                </div>
              ))}
              {filteredItems.filter(item => item.priority === 'high').length === 0 && (
                <p className="text-sm text-muted-foreground">No high priority items</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Overdue Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredItems.filter(item => new Date(item.dueDate) < new Date()).slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                  <span className="text-sm font-medium truncate">{item.company}</span>
                  <Badge variant="outline" className="text-xs text-yellow-600">
                    {Math.ceil((new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </Badge>
                </div>
              ))}
              {filteredItems.filter(item => new Date(item.dueDate) < new Date()).length === 0 && (
                <p className="text-sm text-muted-foreground">No overdue items</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Category Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.slice(0, 4).map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category)
                const avgProgress = categoryItems.length > 0 
                  ? categoryItems.reduce((sum, item) => sum + item.completion, 0) / categoryItems.length 
                  : 0
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span className="text-muted-foreground">{avgProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={avgProgress} className="h-2" />
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
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {viewMode === 'ventures' ? (
            /* Venture-Based View */
            <>
              {/* Venture Cards Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {venturesDDs.map((venture) => (
                  <Card key={venture.ventureId} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{venture.ventureName}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(venture.priority)}
                          <Badge 
                            variant={venture.riskLevel === 'high' ? 'destructive' : 
                                   venture.riskLevel === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {venture.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Lead: {venture.leadAnalyst}</span>
                        <span>Due: {venture.dueDate}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Overall Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(venture.overallStatus)}
                            <span className="text-sm font-medium">{venture.overallProgress}%</span>
                          </div>
                        </div>
                        <Progress 
                          value={venture.overallProgress} 
                          className={`h-2 ${
                            venture.overallProgress >= 80 ? '[&>div]:bg-green-600' : 
                            venture.overallProgress >= 50 ? '[&>div]:bg-yellow-500' : 
                            '[&>div]:bg-red-500'
                          }`}
                        />
                      </div>

                      {/* Category Progress */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Category Progress</span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(venture.categories).map(([category, item]) => (
                            <div key={category} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  category === 'Financial' ? 'bg-green-500' :
                                  category === 'Legal' ? 'bg-blue-500' :
                                  category === 'Technical' ? 'bg-purple-500' :
                                  'bg-orange-500'
                                }`} />
                                <span className="truncate">{category}</span>
                              </div>
                              <span className="font-medium">{item.completion}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* GEDSI Score */}
                      {venture.gedsiScore && (
                        <div className={`flex items-center justify-between p-2 rounded ${
                          (() => {
                            const interpretation = getGEDSIScoreInterpretation(venture.gedsiScore)
                            switch (interpretation.color) {
                              case 'green': return 'bg-green-50 dark:bg-green-950'
                              case 'blue': return 'bg-blue-50 dark:bg-blue-950'
                              case 'yellow': return 'bg-yellow-50 dark:bg-yellow-950'
                              case 'red': return 'bg-red-50 dark:bg-red-950'
                              default: return 'bg-gray-50 dark:bg-gray-950'
                            }
                          })()
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              (() => {
                                const interpretation = getGEDSIScoreInterpretation(venture.gedsiScore)
                                switch (interpretation.color) {
                                  case 'green': return 'text-green-800 dark:text-green-200'
                                  case 'blue': return 'text-blue-800 dark:text-blue-200'
                                  case 'yellow': return 'text-yellow-800 dark:text-yellow-200'
                                  case 'red': return 'text-red-800 dark:text-red-200'
                                  default: return 'text-gray-800 dark:text-gray-200'
                                }
                              })()
                            }`}>GEDSI Score</span>
                            <Badge variant="outline" className="text-xs">
                              {getGEDSIScoreInterpretation(venture.gedsiScore).label}
                            </Badge>
                          </div>
                          <span className={`font-bold ${
                            (() => {
                              const interpretation = getGEDSIScoreInterpretation(venture.gedsiScore)
                              switch (interpretation.color) {
                                case 'green': return 'text-green-600 dark:text-green-400'
                                case 'blue': return 'text-blue-600 dark:text-blue-400'
                                case 'yellow': return 'text-yellow-600 dark:text-yellow-400'
                                case 'red': return 'text-red-600 dark:text-red-400'
                                default: return 'text-gray-600 dark:text-gray-400'
                              }
                            })()
                          }`}>{venture.gedsiScore}/100</span>
                        </div>
                      )}

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                        <div className="flex items-center gap-4">
                          <span>{venture.totalDocuments} docs</span>
                          <span>{venture.totalComments} comments</span>
                        </div>
                        <span>{venture.lastActivity}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewVentureDetails(venture.ventureName)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          alert(`Generate report for ${venture.ventureName} (Demo)`)
                        }}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {venturesDDs.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Ventures Found</h3>
                    <p className="text-muted-foreground mb-4">No ventures with due diligence processes found in the database.</p>
                    <Button onClick={() => setIsNewDDDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Due Diligence
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* Item-Based View */
            <>
              {/* Enhanced Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {selectedVentureForDetails ? `Filters for ${selectedVentureForDetails}` : 'Filters & Search'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    {showAdvancedFilters ? 'Simple' : 'Advanced'} Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setSelectedStage("all")
                      setSelectedStatus("all")
                      setSelectedPriority("all")
                      setDateRange({from: '', to: ''})
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Filters */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search companies, IDs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
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
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="All priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="completion">Progress</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="lastUpdated">Last Updated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div className="border-t pt-4">
                    <div className="grid gap-4 md:grid-cols-3">
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
                        <label className="text-sm font-medium">Due Date From</label>
                        <Input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Due Date To</label>
                        <Input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button 
                    variant={selectedStatus === 'in_progress' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedStatus(selectedStatus === 'in_progress' ? 'all' : 'in_progress')}
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant={selectedPriority === 'high' ? 'destructive' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedPriority(selectedPriority === 'high' ? 'all' : 'high')}
                  >
                    High Priority
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0]
                      setDateRange({from: '', to: today})
                    }}
                  >
                    Overdue
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                      setDateRange({
                        from: today.toISOString().split('T')[0],
                        to: nextWeek.toISOString().split('T')[0]
                      })
                    }}
                  >
                    Due This Week
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Due Diligence Items Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedVentureForDetails 
                      ? `${selectedVentureForDetails} Due Diligence Items (${filteredItems.length} total)`
                      : `Due Diligence Items (${filteredItems.length} total)`
                    }
                  </CardTitle>
                  <CardDescription>
                    {selectedVentureForDetails 
                      ? `Detailed view of all due diligence categories for ${selectedVentureForDetails}`
                      : 'Track progress of due diligence activities'
                    }
                  </CardDescription>
                </div>
                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.length} selected
                    </span>
                    <Button variant="outline" size="sm" onClick={() => {
                      alert(`Bulk update ${selectedItems.length} items (Demo)`)
                    }}>
                      Bulk Update
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      alert(`Export ${selectedItems.length} items (Demo)`)
                    }}>
                      Export Selected
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedItems([])}>
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Due Diligence Items Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCategory !== "all" || selectedStage !== "all" 
                      ? "No items match your current filters" 
                      : "No ventures found in database"}
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setSelectedStage("all")
                      setSelectedStatus("all")
                      setSelectedPriority("all")
                    }}>
                      Clear Filters
                    </Button>
                    <Button onClick={() => setIsNewDDDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Due Diligence
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[50px]">
                            <Checkbox
                              checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems(paginatedItems.map(item => item.id))
                                } else {
                                  setSelectedItems([])
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead className="w-[200px]">Company</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead className="w-[140px]">Progress</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedItems.map((item) => {
                          const isOverdue = new Date(item.dueDate) < new Date()
                          const daysUntilDue = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          
                          return (
                            <TableRow 
                              key={item.id} 
                              className={`hover:bg-muted/50 transition-colors ${
                                isOverdue ? 'bg-red-50 dark:bg-red-950/30' : 
                                daysUntilDue <= 3 ? 'bg-yellow-50 dark:bg-yellow-950/30' : ''
                              }`}
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedItems([...selectedItems, item.id])
                                    } else {
                                      setSelectedItems(selectedItems.filter(id => id !== item.id))
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium flex items-center gap-2">
                                    {item.company}
                                    {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                                    {!isOverdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                                      <Badge variant="outline" className="text-xs text-yellow-600">Due Soon</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{item.id}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">{item.stage}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    item.category === 'Financial' ? 'bg-green-500' :
                                    item.category === 'Legal' ? 'bg-blue-500' :
                                    item.category === 'Technical' ? 'bg-purple-500' :
                                    'bg-orange-500'
                                  }`} />
                                  <span className="text-sm">{item.category}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300">
                                    {item.assignedTo.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">{item.assignedTo}</div>
                                    <div className="text-xs text-muted-foreground">{item.lastUpdated}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={item.completion} 
                                      className={`w-20 h-2 ${
                                        item.completion >= 80 ? '[&>div]:bg-green-600' : 
                                        item.completion >= 50 ? '[&>div]:bg-yellow-500' : 
                                        '[&>div]:bg-red-500'
                                      }`}
                                    />
                                    <span className="text-sm font-medium min-w-[35px]">{item.completion}%</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(item.status)}
                                  {getStatusBadge(item.status)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                                      {item.dueDate}
                                    </span>
                                  </div>
                                  {daysUntilDue > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      {daysUntilDue} days left
                                    </div>
                                  )}
                                  {daysUntilDue < 0 && (
                                    <div className="text-xs text-red-600">
                                      {Math.abs(daysUntilDue)} days overdue
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleCommentItem(item)}>
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleMoreActions(item)}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        
                        {/* Page numbers */}
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Timeline</CardTitle>
              <CardDescription>
                Visual timeline of all due diligence activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredItems.slice(0, 10).map((item, index) => {
                  const isOverdue = new Date(item.dueDate) < new Date()
                  return (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'in_progress' ? 'bg-blue-500' :
                        isOverdue ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{item.company} - {item.category}</h4>
                            <p className="text-sm text-muted-foreground">{item.stage}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{item.dueDate}</div>
                            <div className="text-xs text-muted-foreground">{item.assignedTo}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={item.completion} className="flex-1 h-2" />
                          <span className="text-sm">{item.completion}%</span>
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                        </div>
                        {isOverdue && (
                          <div className="text-sm text-red-600">
                            ⚠️ Overdue by {Math.ceil((new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                
                {filteredItems.length > 10 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      View All {filteredItems.length} Items
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Checklist</CardTitle>
              <CardDescription>
                Standard checklist items for due diligence process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Checklist Items</h3>
                    <p className="text-muted-foreground mb-4">
                      Add ventures to generate due diligence checklist items.
                    </p>
                    <Button onClick={() => window.location.href = '/dashboard/venture-intake'}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Venture
                    </Button>
                  </div>
                ) : (
                  checklistItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox 
                      checked={item.completed}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(item.priority)}
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned to: {item.assignedTo}</span>
                        <span className="text-muted-foreground">Due: {item.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                Upload and manage due diligence documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload documents to start the due diligence process</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Reports</CardTitle>
              <CardDescription>
                Generate and view due diligence reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button 
                    variant="outline" 
                    className="h-32 flex flex-col items-center justify-center"
                    onClick={() => openReportConfig("financial")}
                    disabled={generatingReport !== null}
                  >
                    {generatingReport === "financial" ? (
                      <>
                        <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-8 w-8 mb-2" />
                        <span>Financial Report</span>
                        <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-32 flex flex-col items-center justify-center"
                    onClick={() => openReportConfig("legal")}
                    disabled={generatingReport !== null}
                  >
                    {generatingReport === "legal" ? (
                      <>
                        <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-8 w-8 mb-2" />
                        <span>Legal Report</span>
                        <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-32 flex flex-col items-center justify-center"
                    onClick={() => openReportConfig("technical")}
                    disabled={generatingReport !== null}
                  >
                    {generatingReport === "technical" ? (
                      <>
                        <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="h-8 w-8 mb-2" />
                        <span>Technical Report</span>
                        <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-32 flex flex-col items-center justify-center"
                    onClick={() => openReportConfig("market")}
                    disabled={generatingReport !== null}
                  >
                    {generatingReport === "market" ? (
                      <>
                        <div className="h-8 w-8 mb-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-8 w-8 mb-2" />
                        <span>Market Report</span>
                        <span className="text-xs text-muted-foreground mt-1">Customize & Generate</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Report Generation
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click any report button above to generate and download a comprehensive due diligence report. 
                    Each report includes GEDSI analysis, IRIS+ metrics alignment, and investment recommendations.
                  </p>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <div>
                      <strong>Financial Report:</strong> Revenue analysis, burn rate, unit economics, GEDSI financial impact
                    </div>
                    <div>
                      <strong>Legal Report:</strong> Corporate structure, compliance status, IP analysis, GEDSI policies
                    </div>
                    <div>
                      <strong>Technical Report:</strong> Architecture review, security assessment, accessibility compliance
                    </div>
                    <div>
                      <strong>Market Report:</strong> Market opportunity, competitive analysis, GEDSI market potential
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>
                  Automated analysis of due diligence progress and risks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Portfolio Risk Assessment</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Current portfolio shows <strong>medium risk</strong> with 3 overdue items requiring immediate attention. 
                    Financial reviews are progressing 15% faster than legal reviews on average.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">GEDSI Compliance</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    85% of active due diligence processes meet GEDSI requirements. 
                    Inclusive Learning Technologies and Youth Climate Innovators show exceptional GEDSI alignment.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Resource Allocation</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Sarah Johnson is assigned to 60% of high-priority items. Consider redistributing workload for optimal efficiency.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Key metrics and trends over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ventures.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Performance Data Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Add ventures to the pipeline to see performance trends and completion metrics.
                    </p>
                    <Button onClick={() => window.location.href = '/dashboard/venture-intake'}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Venture
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Completion Time</span>
                        <span className="font-medium">
                          {calculateAverageCompletionTime(ventures)} days
                        </span>
                      </div>
                      <Progress value={calculateCompletionTimeProgress(ventures)} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Based on {ventures.length} ventures in pipeline
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">On-Time Completion Rate</span>
                        <span className="font-medium">
                          {calculateOnTimeCompletionRate(ventures)}%
                        </span>
                      </div>
                      <Progress value={calculateOnTimeCompletionRate(ventures)} className="h-2" />
                      <div className="text-xs text-muted-foreground">Target: 80%</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">GEDSI Score Average</span>
                        <span className="font-medium">
                          {calculateAverageGEDSIScore(ventures)}/100
                        </span>
                      </div>
                      <Progress value={calculateAverageGEDSIScore(ventures)} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {calculateAverageGEDSIScore(ventures) >= 75 ? 'Above' : 'Below'} MIV target of 75
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recommendations
              </CardTitle>
              <CardDescription>
                AI-generated recommendations for improving due diligence efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 dark:text-red-100">Urgent Action Required</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Youth Climate Innovators legal review is 95% behind schedule. Consider assigning additional legal resources or extending deadline.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Take Action
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Process Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Technical assessments consistently take 30% longer than estimated. Consider updating time allocation models.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Review Process
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Best Practice</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Inclusive Learning Technologies shows excellent progress across all categories. Consider this as a template for other ventures.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Template
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Customization Dialog */}
      <Dialog open={isReportConfigOpen} onOpenChange={setIsReportConfigOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Customize {selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report
            </DialogTitle>
            <DialogDescription>
              Select the sections and options for your due diligence report
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Report Configuration */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Venture Scope</label>
                <Select value={selectedVenture} onValueChange={setSelectedVenture}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ventures</SelectItem>
                    <SelectItem value="EcoTech Solutions">EcoTech Solutions</SelectItem>
                    <SelectItem value="InclusiveFinance Pro">InclusiveFinance Pro</SelectItem>
                    <SelectItem value="AgriTech Innovations">AgriTech Innovations</SelectItem>
                    <SelectItem value="HealthAccess Network">HealthAccess Network</SelectItem>
                    <SelectItem value="EduBridge Platform">EduBridge Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Format</label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="txt">Text File</SelectItem>
                    <SelectItem value="docx">Word Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Sections</CardTitle>
                <CardDescription>
                  Select which sections to include in your {selectedReportType} report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select All</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const allSections: {[key: string]: boolean} = {}
                        reportSectionOptions[selectedReportType as keyof typeof reportSectionOptions]?.forEach(section => {
                          allSections[section.id] = true
                        })
                        setReportSections(allSections)
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    {reportSectionOptions[selectedReportType as keyof typeof reportSectionOptions]?.map((section) => (
                      <div key={section.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={reportSections[section.id] || false}
                          onCheckedChange={(checked) => {
                            setReportSections(prev => ({
                              ...prev,
                              [section.id]: checked as boolean
                            }))
                          }}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{section.label}</span>
                            {section.default && (
                              <Badge variant="secondary" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {section.id === 'executive_summary' && 'High-level overview and key findings'}
                            {section.id === 'financial_health' && 'Revenue, burn rate, unit economics analysis'}
                            {section.id === 'gedsi_financial' && 'GEDSI impact on financial performance'}
                            {section.id === 'investment_readiness' && 'Readiness for investment assessment'}
                            {section.id === 'risk_assessment' && 'Comprehensive risk analysis'}
                            {section.id === 'recommendations' && 'Investment recommendations and next steps'}
                            {section.id === 'iris_metrics' && 'IRIS+ standards alignment analysis'}
                            {section.id === 'benchmarking' && 'Industry and peer comparisons'}
                            {section.id === 'scenario_analysis' && 'Multiple scenario projections'}
                            {section.id === 'corporate_structure' && 'Legal entity and governance structure'}
                            {section.id === 'compliance_status' && 'Regulatory compliance assessment'}
                            {section.id === 'intellectual_property' && 'IP portfolio and protection analysis'}
                            {section.id === 'gedsi_legal' && 'GEDSI policies and legal framework'}
                            {section.id === 'contracts' && 'Contract review and analysis'}
                            {section.id === 'legal_risks' && 'Legal risk identification and mitigation'}
                            {section.id === 'technology_architecture' && 'Tech stack and architecture review'}
                            {section.id === 'security_assessment' && 'Security posture and vulnerabilities'}
                            {section.id === 'accessibility_inclusion' && 'Digital accessibility compliance'}
                            {section.id === 'development_practices' && 'Code quality and development processes'}
                            {section.id === 'scalability_analysis' && 'Technical scalability assessment'}
                            {section.id === 'technical_team' && 'Technical team capabilities review'}
                            {section.id === 'technology_risks' && 'Technology-related risk analysis'}
                            {section.id === 'market_opportunity' && 'TAM/SAM/SOM and market size analysis'}
                            {section.id === 'competitive_landscape' && 'Competitor analysis and positioning'}
                            {section.id === 'gedsi_market' && 'GEDSI market opportunity analysis'}
                            {section.id === 'customer_analysis' && 'Customer segments and behavior analysis'}
                            {section.id === 'geographic_expansion' && 'Market expansion strategy and potential'}
                            {section.id === 'market_risks' && 'Market-related risk assessment'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Report Type:</span>
                    <Badge variant="outline">{selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Venture Scope:</span>
                    <span className="text-sm font-medium">{selectedVenture === "all" ? "All Ventures" : selectedVenture}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Format:</span>
                    <span className="text-sm font-medium">{reportFormat.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sections Selected:</span>
                    <span className="text-sm font-medium">
                      {Object.values(reportSections).filter(Boolean).length} of {reportSectionOptions[selectedReportType as keyof typeof reportSectionOptions]?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsReportConfigOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={generateCustomReport}
                disabled={Object.values(reportSections).filter(Boolean).length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Due Diligence Dialog */}
      <Dialog open={isNewDDDialogOpen} onOpenChange={setIsNewDDDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Due Diligence Process
            </DialogTitle>
            <DialogDescription>
              Set up a new due diligence process for a venture
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select venture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EcoTech Solutions">EcoTech Solutions</SelectItem>
                        <SelectItem value="InclusiveFinance Pro">InclusiveFinance Pro</SelectItem>
                        <SelectItem value="AgriTech Innovations">AgriTech Innovations</SelectItem>
                        <SelectItem value="HealthAccess Network">HealthAccess Network</SelectItem>
                        <SelectItem value="EduBridge Platform">EduBridge Platform</SelectItem>
                        <SelectItem value="new">+ Add New Venture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Diligence Type *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Due Diligence</SelectItem>
                        <SelectItem value="financial">Financial Only</SelectItem>
                        <SelectItem value="legal">Legal Only</SelectItem>
                        <SelectItem value="technical">Technical Only</SelectItem>
                        <SelectItem value="market">Market Only</SelectItem>
                        <SelectItem value="custom">Custom Scope</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lead Analyst *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign lead analyst" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson (Financial)</SelectItem>
                        <SelectItem value="mike">Mike Chen (Legal)</SelectItem>
                        <SelectItem value="david">David Smith (Technical)</SelectItem>
                        <SelectItem value="lisa">Lisa Wang (Market)</SelectItem>
                        <SelectItem value="alex">Alex Rodriguez (Operations)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Completion Date *</label>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Due Diligence Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Due Diligence Categories</CardTitle>
                <CardDescription>
                  Select which categories to include in this due diligence process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox className="mt-0.5" defaultChecked={category !== "Operations"} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{category}</span>
                          {(category === "Financial" || category === "Legal") && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category === 'Financial' && 'Revenue model, financial health, projections, GEDSI financial impact'}
                          {category === 'Legal' && 'Corporate structure, compliance, IP, contracts, GEDSI policies'}
                          {category === 'Technical' && 'Architecture, security, scalability, accessibility compliance'}
                          {category === 'Market' && 'Market size, competition, customer analysis, GEDSI market opportunity'}
                          {category === 'Team' && 'Team assessment, diversity, leadership capabilities'}
                          {category === 'Operations' && 'Operational processes, efficiency, scaling capabilities'}
                          {category === 'Compliance' && 'Regulatory compliance, ESG standards, IRIS+ alignment'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline & Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline & Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority Level *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expected Duration</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1week">1 Week</SelectItem>
                        <SelectItem value="2weeks">2 Weeks</SelectItem>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="2months">2 Months</SelectItem>
                        <SelectItem value="3months">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Investment Stage</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GEDSI Focus Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GEDSI Focus Areas</CardTitle>
                <CardDescription>
                  Specify GEDSI aspects to emphasize in this due diligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox defaultChecked />
                    <label className="text-sm">Gender diversity in leadership</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox defaultChecked />
                    <label className="text-sm">Disability inclusion practices</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox defaultChecked />
                    <label className="text-sm">Social inclusion initiatives</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <label className="text-sm">Rural community focus</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <label className="text-sm">Youth employment creation</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <label className="text-sm">Indigenous community support</label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Requirements</label>
                    <Textarea 
                      placeholder="Any specific requirements, focus areas, or instructions for the due diligence team..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Key Stakeholders to Interview</label>
                    <Input placeholder="e.g., CEO, CTO, Head of Impact, Board Members" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsNewDDDialogOpen(false)}>
                Cancel
              </Button>
              <Button disabled>
                Create Due Diligence Process (Demo)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Due Diligence Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Due Diligence Details: {selectedItem?.company}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.category} review for {selectedItem?.company}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Company:</span>
                      <span className="font-medium">{selectedItem.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category:</span>
                      <Badge variant="outline">{selectedItem.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stage:</span>
                      <Badge variant="outline">{selectedItem.stage}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Priority:</span>
                      <Badge variant={selectedItem.priority === 'high' ? 'destructive' : selectedItem.priority === 'medium' ? 'default' : 'secondary'}>
                        {selectedItem.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Progress & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completion:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedItem.completion} className="w-16 h-2" />
                        <span className="text-sm font-medium">{selectedItem.completion}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedItem.status)}
                        {getStatusBadge(selectedItem.status)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Due Date:</span>
                      <span className="font-medium">{selectedItem.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated:</span>
                      <span className="text-sm text-muted-foreground">{selectedItem.lastUpdated}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team & Resources */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Team & Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                        {selectedItem.assignedTo.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{selectedItem.assignedTo}</div>
                        <div className="text-sm text-muted-foreground">Lead Reviewer</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Documents:</span>
                      <span className="font-medium">{selectedItem.documents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Comments:</span>
                      <span className="font-medium">{selectedItem.comments}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditItem(selectedItem)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Review
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCommentItem(selectedItem)}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Due Diligence Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Due Diligence: {selectedItem?.company}
            </DialogTitle>
            <DialogDescription>
              Update {selectedItem?.category} review details and progress
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6 py-4">
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Demo Mode:</strong> This is a demonstration. In production, this would update the actual due diligence records.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={selectedItem.completion}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select defaultValue={selectedItem.priority} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue={selectedItem.status} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Add notes about the review progress..."
                  rows={4}
                  disabled
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled>
              Save Changes (Demo)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
} 