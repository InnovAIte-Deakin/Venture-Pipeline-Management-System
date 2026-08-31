"use client"

import React, { useState, useEffect, useCallback } from "react"
import DashboardCard, { type Dashboard } from "./components/dashboard-card"
import CreateDashboardDialog, { type NewDashboardForm } from "./components/create-dashboard-dialog"
import EditDashboardDialog from "./components/edit-dashboard-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/hooks/useAuth"
import {
  BarChart,
  Plus,
  Copy,
  Grid3X3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
  Calendar,
  Filter,
  Search,
  Star,
  Clock,
  Gauge,
} from "lucide-react"


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
  { type: "chart", name: "Chart", icon: BarChart, description: "Line, bar, or pie charts", color: "blue" },
  { type: "metric", name: "Metric", icon: Target, description: "Single value with trend", color: "red" },
  { type: "table", name: "Table", icon: Grid3X3, description: "Data table with sorting", color: "purple" },
  { type: "progress", name: "Progress", icon: Gauge, description: "Progress bars and gauges", color: "amber" },
  { type: "list", name: "List", icon: Activity, description: "Simple list of items", color: "green" },
  { type: "calendar", name: "Calendar", icon: Calendar, description: "Calendar view", color: "pink" }
]

// Tailwind needs full, literal class strings to detect them at build time —
// dynamic template strings like `bg-${color}-100` are invisible to it, so
// every combination we might use is spelled out here instead.
const widgetColorClasses: Record<string, { border: string; iconBg: string; iconText: string }> = {
  blue:   { border: "border-t-blue-400",   iconBg: "bg-blue-100",   iconText: "text-blue-600" },
  red:    { border: "border-t-red-400",    iconBg: "bg-red-100",    iconText: "text-red-600" },
  purple: { border: "border-t-purple-400", iconBg: "bg-purple-100", iconText: "text-purple-600" },
  amber:  { border: "border-t-amber-400",  iconBg: "bg-amber-100",  iconText: "text-amber-600" },
  green:  { border: "border-t-green-400",  iconBg: "bg-green-100",  iconText: "text-green-600" },
  pink:   { border: "border-t-pink-400",   iconBg: "bg-pink-100",   iconText: "text-pink-600" },
}

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
  const { addToast } = useToast()
  const { user } = useAuth();
  const userId = user?.id ?? "cmsfgffh10000iqc0wuumq74r"
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
  const [newDashboard, setNewDashboard] = useState<NewDashboardForm>({
    name: "",
    description: "",
    category: "Custom",
    isPublic: false,
    widgets: []
  })

  const fetchDashboards = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/custom-dashboards?userId=${userId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboards: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setDashboards(data.dashboards || [])
      
      console.log(`Successfully loaded ${data.dashboards?.length || 0} custom dashboards`)
    } catch (err) {
      console.error('Error fetching dashboards:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to load dashboards: ${errorMessage}`)
      
      // Fallback to empty array instead of mock data
      setDashboards([])
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Fetch dashboards from database
  useEffect(() => {
    fetchDashboards()
  }, [fetchDashboards])

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

  const resetNewDashboardForm = () => {
    setNewDashboard({
      name: "",
      description: "",
      category: "Custom",
      isPublic: false,
      widgets: []
    })
  }

  const handleCreateDashboard = async () => {
    if (!newDashboard.name.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/custom-dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDashboard.name,
          description: newDashboard.description,
          category: newDashboard.category,
          isPublic: newDashboard.isPublic,
          widgets: newDashboard.widgets,
          createdById: userId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create dashboard: ${response.status}`)
      }

      const { dashboard } = await response.json()
      setDashboards(prev => [dashboard, ...prev])
      setIsCreating(false)
      resetNewDashboardForm()
      addToast({ title: "Dashboard created", type: "success" })
    } catch (err) {
      console.error('Error creating dashboard:', err)
      addToast({
        title: "Couldn't create dashboard",
        description: err instanceof Error ? err.message : "Please try again",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
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
    try {
      const response = await fetch('/api/custom-dashboards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDashboard.id,
          name: newDashboard.name,
          description: newDashboard.description,
          category: newDashboard.category,
          isPublic: newDashboard.isPublic,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update dashboard: ${response.status}`)
      }

      const { dashboard } = await response.json()
      setDashboards(prev => prev.map(d => (d.id === dashboard.id ? dashboard : d)))
      setIsEditing(false)
      setSelectedDashboard(null)
      resetNewDashboardForm()
      addToast({ title: "Dashboard updated", type: "success" })
    } catch (err) {
      console.error('Error updating dashboard:', err)
      addToast({
        title: "Couldn't update dashboard",
        description: err instanceof Error ? err.message : "Please try again",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDashboard = async (dashboardId: string) => {
    if (!confirm("Are you sure you want to delete this dashboard?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/custom-dashboards?id=${encodeURIComponent(dashboardId)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete dashboard: ${response.status}`)
      }

      setDashboards(prev => prev.filter(d => d.id !== dashboardId))
      addToast({ title: "Dashboard deleted", type: "success" })
    } catch (err) {
      console.error('Error deleting dashboard:', err)
      addToast({
        title: "Couldn't delete dashboard",
        description: err instanceof Error ? err.message : "Please try again",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = async (dashboardId: string) => {
    const target = dashboards.find(d => d.id === dashboardId)
    if (!target) return

    // Optimistic update
    setDashboards(prev => prev.map(d =>
      d.id === dashboardId ? { ...d, isFavorite: !d.isFavorite } : d
    ))

    try {
      const response = await fetch('/api/custom-dashboards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dashboardId, isFavorite: !target.isFavorite }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update favorite: ${response.status}`)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      // Roll back on failure
      setDashboards(prev => prev.map(d =>
        d.id === dashboardId ? { ...d, isFavorite: target.isFavorite } : d
      ))
      addToast({ title: "Couldn't update favorite", type: "error" })
    }
  }

  const handleDuplicateDashboard = async (dashboard: Dashboard) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/custom-dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${dashboard.name} (Copy)`,
          description: dashboard.description,
          category: dashboard.category,
          isPublic: false,
          widgets: [],
          createdById: userId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to duplicate dashboard: ${response.status}`)
      }

      const { dashboard: duplicated } = await response.json()
      setDashboards(prev => [duplicated, ...prev])
      addToast({ title: "Dashboard duplicated", type: "success" })
    } catch (err) {
      console.error('Error duplicating dashboard:', err)
      addToast({ title: "Couldn't duplicate dashboard", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseTemplate = async (templateName: string, widgetCount: number) => {
    setIsLoading(true)
    try {
      const category = templateName.includes('Portfolio') ? 'Portfolio' :
        templateName.includes('Pipeline') ? 'Pipeline' :
        templateName.includes('GEDSI') ? 'Impact' : 'Custom'

      const placeholderWidgets = Array.from({ length: widgetCount }, (_, i) => ({
        id: `widget-${i + 1}`,
        type: 'placeholder',
      }))

      const createRes = await fetch('/api/custom-dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `My ${templateName}`,
          description: `Custom ${templateName.toLowerCase()} dashboard created from template`,
          category,
          isPublic: false,
          widgets: placeholderWidgets,
          createdById: userId,
        }),
      })

      if (!createRes.ok) {
        throw new Error(`Failed to create dashboard: ${createRes.status}`)
      }

      const { dashboard } = await createRes.json()

      // Templates start favorited
      const favRes = await fetch('/api/custom-dashboards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dashboard.id, isFavorite: true }),
      })
      const finalDashboard = favRes.ok ? (await favRes.json()).dashboard : dashboard

      setDashboards(prev => [finalDashboard, ...prev])
      addToast({ title: `${templateName} dashboard created successfully!`, type: "success" })
    } catch (err) {
      console.error('Error creating dashboard from template:', err)
      addToast({ title: "Couldn't create dashboard from template", type: "error" })
    } finally {
      setIsLoading(false)
    }
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600">
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Custom Dashboards</h1>
            <p className="text-muted-foreground">
              Create and manage your personalized dashboards
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Dashboard
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="border-t-4 border-t-blue-500 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dashboards</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <BarChart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboards.length}</div>
            <p className="text-xs text-muted-foreground">
              {dashboards.filter(d => d.isPublic).length} public, {dashboards.filter(d => !d.isPublic).length} private
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-purple-500 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Widgets</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Grid3X3 className="h-4 w-4 text-purple-600" />
            </div>
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
        <Card className="border-t-4 border-t-amber-500 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
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
        <Card className="border-t-4 border-t-green-500 transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDashboards.map((dashboard) => (
              <DashboardCard
  key={dashboard.id}
  dashboard={dashboard}
  handleToggleFavorite={handleToggleFavorite}
  handleDuplicateDashboard={handleDuplicateDashboard}
  handleDeleteDashboard={handleDeleteDashboard}
  handleEditDashboard={handleEditDashboard}
/>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer border-t-4 border-t-blue-400 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                        <BarChart className="h-5 w-5 text-blue-600" />
                      </div>
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

                <Card className="cursor-pointer border-t-4 border-t-green-400 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
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

                <Card className="cursor-pointer border-t-4 border-t-purple-400 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
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

                <Card className="cursor-pointer border-t-4 border-t-orange-400 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                        <Activity className="h-5 w-5 text-orange-600" />
                      </div>
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

                <Card className="cursor-pointer border-t-4 border-t-green-400 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
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

                <Card className="cursor-pointer border-t-4 border-t-red-400 transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                        <Target className="h-5 w-5 text-red-600" />
                      </div>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {widgetTypes.map((widget) => (
                  <Card key={widget.type} className={`cursor-pointer border-t-4 ${widgetColorClasses[widget.color].border} transition-shadow hover:shadow-md`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${widgetColorClasses[widget.color].iconBg}`}>
                          <widget.icon className={`h-5 w-5 ${widgetColorClasses[widget.color].iconText}`} />
                        </div>
                        <CardTitle className="text-base">{widget.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {widget.description}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          addToast({
                            title: `To add a ${widget.name} widget, open a dashboard and use Manage Widgets`,
                            type: "info",
                          })
                        }
                      >
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

      <CreateDashboardDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        categories={categories}
        newDashboard={newDashboard}
        setNewDashboard={setNewDashboard}
        onCreate={handleCreateDashboard}
        isLoading={isLoading}
      />

      <EditDashboardDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        categories={categories}
        newDashboard={newDashboard}
        setNewDashboard={setNewDashboard}
        selectedDashboard={selectedDashboard}
        onUpdate={handleUpdateDashboard}
        isLoading={isLoading}
      />
    </div>
  )
}
