"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  BarChart, 
  Plus, 
  Settings, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Share2,
  Copy,
  Grid3X3,
  PieChart,
  LineChart,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Star,
  Clock,
  CheckCircle,
  X,
  Sparkles,
  BarChart3,
  Heart,
  Building2,
  RefreshCw,
  Save,
  Layout,
  Zap
} from "lucide-react"

interface Dashboard {
  id: string
  name: string
  description: string
  category: string
  widgets: number
  lastModified: string
  isPublic: boolean
  isFavorite: boolean
  createdBy: string
}

interface Widget {
  id: string
  type: string
  title: string
  size: "small" | "medium" | "large"
  position: { x: number; y: number }
  data: any
}

const mockDashboards: Dashboard[] = [
  {
    id: "DASH-001",
    name: "Pipeline Overview",
    description: "Comprehensive view of deal pipeline and performance metrics",
    category: "Pipeline",
    widgets: 8,
    lastModified: "2 hours ago",
    isPublic: true,
    isFavorite: true,
    createdBy: "Sarah Johnson"
  },
  {
    id: "DASH-002",
    name: "Portfolio Performance",
    description: "Real-time portfolio performance and IRR tracking",
    category: "Portfolio",
    widgets: 12,
    lastModified: "1 day ago",
    isPublic: false,
    isFavorite: false,
    createdBy: "Mike Chen"
  },
  {
    id: "DASH-003",
    name: "GEDSI Impact Tracker",
    description: "Gender equality, diversity, and social inclusion metrics",
    category: "Impact",
    widgets: 6,
    lastModified: "3 days ago",
    isPublic: true,
    isFavorite: true,
    createdBy: "Lisa Wang"
  },
  {
    id: "DASH-004",
    name: "Due Diligence Status",
    description: "Track due diligence progress across all active deals",
    category: "Operations",
    widgets: 10,
    lastModified: "1 week ago",
    isPublic: false,
    isFavorite: false,
    createdBy: "David Smith"
  },
  {
    id: "DASH-005",
    name: "Team Performance",
    description: "Team productivity and deal flow metrics",
    category: "Team",
    widgets: 7,
    lastModified: "2 weeks ago",
    isPublic: true,
    isFavorite: false,
    createdBy: "Alex Rodriguez"
  }
]

const widgetTypes = [
  { type: "chart", name: "Chart", icon: BarChart, description: "Line, bar, or pie charts" },
  { type: "metric", name: "Metric", icon: Target, description: "Single value with trend" },
  { type: "table", name: "Table", icon: Grid3X3, description: "Data table with sorting" },
  { type: "progress", name: "Progress", icon: Progress, description: "Progress bars and gauges" },
  { type: "list", name: "List", icon: Activity, description: "Simple list of items" },
  { type: "calendar", name: "Calendar", icon: Calendar, description: "Calendar view" }
]

const categories = [
  "Pipeline",
  "Portfolio", 
  "Impact",
  "Operations",
  "Team",
  "Financial",
  "Custom"
]

export default function CustomDashboardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedView, setSelectedView] = useState("all")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  
  // New dashboard form state
  const [newDashboard, setNewDashboard] = useState({
    name: "",
    description: "",
    category: "Custom",
    isPublic: false,
    widgets: []
  })

  // Fetch dashboards from database
  useEffect(() => {
    fetchDashboards()
  }, [])

  const fetchDashboards = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/custom-dashboards')
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboards: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setDashboards(data.dashboards || [])
      
      console.log(`✅ Successfully loaded ${data.dashboards?.length || 0} custom dashboards`)
    } catch (err) {
      console.error('❌ Error fetching dashboards:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to load dashboards: ${errorMessage}`)
      
      // Fallback to empty array instead of mock data
      setDashboards([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch portfolio data for widgets
  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch('/api/ventures?limit=100')
      if (response.ok) {
        const data = await response.json()
        setPortfolioData(data)
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    }
  }

  const handleCreateDashboard = async () => {
    if (!newDashboard.name.trim()) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const dashboard: Dashboard = {
      id: `DASH-${Date.now()}`,
      name: newDashboard.name,
      description: newDashboard.description,
      category: newDashboard.category,
      widgets: 0,
      lastModified: "Just now",
      isPublic: newDashboard.isPublic,
      isFavorite: false,
      createdBy: "You"
    }

    setDashboards(prev => [dashboard, ...prev])
    setIsCreating(false)
    setNewDashboard({
      name: "",
      description: "",
      category: "Custom",
      isPublic: false,
      widgets: []
    })
    setIsLoading(false)
  }

  const handleEditDashboard = (dashboard: Dashboard) => {
    setSelectedDashboard(dashboard)
    setNewDashboard({
      name: dashboard.name,
      description: dashboard.description,
      category: dashboard.category,
      isPublic: dashboard.isPublic,
      widgets: []
    })
    setIsEditing(true)
  }

  const handleUpdateDashboard = async () => {
    if (!selectedDashboard || !newDashboard.name.trim()) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setDashboards(prev => prev.map(d => 
      d.id === selectedDashboard.id 
        ? { ...d, ...newDashboard, lastModified: "Just now" }
        : d
    ))
    
    setIsEditing(false)
    setSelectedDashboard(null)
    setNewDashboard({
      name: "",
      description: "",
      category: "Custom",
      isPublic: false,
      widgets: []
    })
    setIsLoading(false)
  }

  const handleDeleteDashboard = async (dashboardId: string) => {
    if (!confirm("Are you sure you want to delete this dashboard?")) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setDashboards(prev => prev.filter(d => d.id !== dashboardId))
    setIsLoading(false)
  }

  const handleToggleFavorite = (dashboardId: string) => {
    setDashboards(prev => prev.map(d => 
      d.id === dashboardId ? { ...d, isFavorite: !d.isFavorite } : d
    ))
  }

  const handleDuplicateDashboard = async (dashboard: Dashboard) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const duplicatedDashboard: Dashboard = {
      ...dashboard,
      id: `DASH-${Date.now()}`,
      name: `${dashboard.name} (Copy)`,
      lastModified: "Just now",
      createdBy: "You"
    }
    
    setDashboards(prev => [duplicatedDashboard, ...prev])
    setIsLoading(false)
  }

  const handleUseTemplate = async (templateName: string, widgetCount: number) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const dashboard: Dashboard = {
      id: `DASH-${Date.now()}`,
      name: `My ${templateName}`,
      description: `Custom ${templateName.toLowerCase()} dashboard created from template`,
      category: templateName.includes('Portfolio') ? 'Portfolio' : 
                templateName.includes('Pipeline') ? 'Pipeline' :
                templateName.includes('GEDSI') ? 'Impact' : 'Custom',
      widgets: widgetCount,
      lastModified: "Just now",
      isPublic: false,
      isFavorite: true,
      createdBy: "You"
    }

    setDashboards(prev => [dashboard, ...prev])
    setIsLoading(false)
    
    // Show success message
    alert(`${templateName} dashboard created successfully!`)
  }

  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = dashboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dashboard.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || dashboard.category === selectedCategory
    const matchesView = selectedView === "all" || 
                       (selectedView === "favorites" && dashboard.isFavorite) ||
                       (selectedView === "public" && dashboard.isPublic) ||
                       (selectedView === "private" && !dashboard.isPublic)
    
    return matchesSearch && matchesCategory && matchesView
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Dashboards</h1>
          <p className="text-muted-foreground">
            Create and manage your personalized dashboards
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Dashboard
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dashboards</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboards.length}</div>
            <p className="text-xs text-muted-foreground">
              {dashboards.filter(d => d.isPublic).length} public, {dashboards.filter(d => !d.isPublic).length} private
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Widgets</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboards.reduce((sum, d) => sum + d.widgets, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average {dashboards.length > 0 ? Math.round(dashboards.reduce((sum, d) => sum + d.widgets, 0) / dashboards.length) : 0} per dashboard
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboards.filter(d => d.isFavorite).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboards.length > 0 ? ((dashboards.filter(d => d.isFavorite).length / dashboards.length) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboards.filter(d => d.lastModified.includes("hour") || d.lastModified.includes("day") || d.lastModified.includes("Just now")).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In the last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboards">My Dashboards</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="widgets">Widget Library</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-4">
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
                      placeholder="Search dashboards..."
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
                  <label className="text-sm font-medium">View</label>
                  <Select value={selectedView} onValueChange={setSelectedView}>
                    <SelectTrigger>
                      <SelectValue placeholder="All views" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All dashboards</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDashboards.map((dashboard) => (
              <Card key={dashboard.id} className="relative group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                        {dashboard.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        {dashboard.isPublic && (
                          <Badge variant="outline" className="text-xs">Public</Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {dashboard.description}
                      </CardDescription>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(dashboard.id)
                          }}
                        >
                          <Star className={`h-4 w-4 ${dashboard.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateDashboard(dashboard)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteDashboard(dashboard.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Widgets</span>
                      <span className="font-medium">{dashboard.widgets}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="secondary" className="text-xs">{dashboard.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last modified</span>
                      <span className="text-muted-foreground">{dashboard.lastModified}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Created by</span>
                      <span className="text-muted-foreground">{dashboard.createdBy}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => alert(`Opening dashboard: ${dashboard.name}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditDashboard(dashboard)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => alert(`Sharing options for: ${dashboard.name}`)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Templates</CardTitle>
              <CardDescription>
                Pre-built dashboard templates to get you started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">Pipeline Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete pipeline tracking with deal flow metrics
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">8 widgets</Badge>
                      <Button size="sm" onClick={() => handleUseTemplate("Pipeline Overview", 8)}>Use Template</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-base">Portfolio Performance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Portfolio tracking with IRR and performance metrics
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">12 widgets</Badge>
                      <Button size="sm" onClick={() => handleUseTemplate("Portfolio Performance", 12)}>Use Template</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-base">GEDSI Impact</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Gender equality and social impact tracking
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">6 widgets</Badge>
                      <Button size="sm" onClick={() => handleUseTemplate("GEDSI Impact", 6)}>Use Template</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-base">Due Diligence</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Due diligence process tracking and management
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">10 widgets</Badge>
                      <Button size="sm" onClick={() => handleUseTemplate("Due Diligence", 10)}>Use Template</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-base">Financial Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Financial metrics and investment tracking
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">9 widgets</Badge>
                      <Button size="sm" onClick={() => handleUseTemplate("Financial Overview", 9)}>Use Template</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-base">Team Performance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Team productivity and performance metrics
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">7 widgets</Badge>
                      <Button size="sm" onClick={() => handleUseTemplate("Team Performance", 7)}>Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Library</CardTitle>
              <CardDescription>
                Available widgets to add to your dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {widgetTypes.map((widget) => (
                  <Card key={widget.type} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <widget.icon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">{widget.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {widget.description}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Add Widget
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Dashboard Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Dashboard
            </DialogTitle>
            <DialogDescription>
              Create a custom dashboard to track your key metrics and KPIs
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="dashboard-name">Dashboard Name</Label>
              <Input
                id="dashboard-name"
                placeholder="Enter dashboard name..."
                value={newDashboard.name}
                onChange={(e) => setNewDashboard(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dashboard-description">Description</Label>
              <Textarea
                id="dashboard-description"
                placeholder="Describe what this dashboard will track..."
                value={newDashboard.description}
                onChange={(e) => setNewDashboard(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dashboard-category">Category</Label>
                <Select
                  value={newDashboard.category}
                  onValueChange={(value) => setNewDashboard(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dashboard-public">Visibility</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch
                    id="dashboard-public"
                    checked={newDashboard.isPublic}
                    onCheckedChange={(checked) => setNewDashboard(prev => ({ ...prev, isPublic: checked }))}
                  />
                  <Label htmlFor="dashboard-public" className="text-sm">
                    {newDashboard.isPublic ? "Public" : "Private"}
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Quick Start Options */}
            <div className="space-y-3">
              <Label>Quick Start Options</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setNewDashboard(prev => ({ ...prev, category: "Portfolio" }))}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Portfolio Focus</div>
                      <div className="text-xs text-muted-foreground">Track investments & returns</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setNewDashboard(prev => ({ ...prev, category: "Impact" }))}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Heart className="h-8 w-8 text-pink-600" />
                    <div>
                      <div className="font-medium text-sm">Impact Focus</div>
                      <div className="text-xs text-muted-foreground">Track GEDSI & social impact</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setNewDashboard(prev => ({ ...prev, category: "Pipeline" }))}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Pipeline Focus</div>
                      <div className="text-xs text-muted-foreground">Track deal flow & stages</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setNewDashboard(prev => ({ ...prev, category: "Operations" }))}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Activity className="h-8 w-8 text-orange-600" />
                    <div>
                      <div className="font-medium text-sm">Operations Focus</div>
                      <div className="text-xs text-muted-foreground">Track team & processes</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              You can add widgets after creating the dashboard
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateDashboard} 
                disabled={!newDashboard.name.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Dashboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dashboard Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Dashboard
            </DialogTitle>
            <DialogDescription>
              Update your dashboard settings and configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dashboard-name">Dashboard Name</Label>
              <Input
                id="edit-dashboard-name"
                placeholder="Enter dashboard name..."
                value={newDashboard.name}
                onChange={(e) => setNewDashboard(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-dashboard-description">Description</Label>
              <Textarea
                id="edit-dashboard-description"
                placeholder="Describe what this dashboard tracks..."
                value={newDashboard.description}
                onChange={(e) => setNewDashboard(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dashboard-category">Category</Label>
                <Select
                  value={newDashboard.category}
                  onValueChange={(value) => setNewDashboard(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-dashboard-public">Visibility</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch
                    id="edit-dashboard-public"
                    checked={newDashboard.isPublic}
                    onCheckedChange={(checked) => setNewDashboard(prev => ({ ...prev, isPublic: checked }))}
                  />
                  <Label htmlFor="edit-dashboard-public" className="text-sm">
                    {newDashboard.isPublic ? "Public" : "Private"}
                  </Label>
                </div>
              </div>
            </div>
            
            {selectedDashboard && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Layout className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Current Dashboard Info</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Widgets: {selectedDashboard.widgets}</div>
                  <div>Created: {selectedDashboard.lastModified}</div>
                  <div>Created by: {selectedDashboard.createdBy}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => alert("Widget management coming soon!")}>
                <Zap className="h-4 w-4 mr-1" />
                Manage Widgets
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateDashboard} 
                disabled={!newDashboard.name.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Dashboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 