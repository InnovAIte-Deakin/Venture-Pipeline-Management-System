"use client"

import React, { useState, useEffect, useCallback } from "react"
import DashboardCard, { type Dashboard } from "./components/dashboard-card"
import CreateDashboardDialog, { type NewDashboardForm } from "./components/create-dashboard-dialog"
import EditDashboardDialog from "./components/edit-dashboard-dialog"
import DashboardStats from "./components/widgets/dashboard-stats"
import DashboardFilters from "./components/widgets/dashboard-filters"
import DashboardTemplates from "./components/widgets/dashboard-templates"
import DashboardWidgetLibrary from "./components/widgets/dashboard-widget-library"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/hooks/useAuth"
import {
  Plus,
  Grid3X3,
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
      <DashboardStats dashboards={dashboards} />

      {/* Main Content */}
      <Tabs defaultValue="dashboards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboards">My Dashboards</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="widgets">Widget Library</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-4">
          {/* Filters */}
          <DashboardFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedView={selectedView}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onViewChange={setSelectedView}
          />

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
          <DashboardTemplates onUseTemplate={handleUseTemplate} />
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <DashboardWidgetLibrary
            onAddWidget={(widgetName) =>
              addToast({
                title: `To add a ${widgetName} widget, open a dashboard and use Manage Widgets`,
                type: "info",
              })
            }
          />
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
