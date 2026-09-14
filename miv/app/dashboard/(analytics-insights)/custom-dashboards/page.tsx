"use client"

import { useState } from "react"

import DashboardCard, { type Dashboard } from "./components/dashboard-card"
import CreateDashboardDialog, {
  type NewDashboardForm,
} from "./components/create-dashboard-dialog"
import EditDashboardDialog from "./components/edit-dashboard-dialog"
import DashboardStats from "./components/widgets/dashboard-stats"
import DashboardFilters from "./components/widgets/dashboard-filters"
import DashboardTemplates from "./components/widgets/dashboard-templates"
import DashboardWidgetLibrary from "./components/widgets/dashboard-widget-library"

import {
  useCustomDashboards,
  useDashboardFilters,
} from "./hooks/use-custom-dashboards"

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/hooks/useAuth"
import { Grid3X3, Plus } from "lucide-react"

const categories = [
  "Pipeline",
  "Portfolio",
  "Impact",
  "Operations",
  "Team",
  "Financial",
  "Custom",
]

const emptyDashboardForm: NewDashboardForm = {
  name: "",
  description: "",
  category: "Custom",
  isPublic: false,
  widgets: [],
}

export default function CustomDashboardsPage() {
  const { addToast } = useToast()
  const { user } = useAuth()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedView, setSelectedView] = useState("all")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDashboard, setSelectedDashboard] =
    useState<Dashboard | null>(null)
  const [newDashboard, setNewDashboard] =
    useState<NewDashboardForm>(emptyDashboardForm)

  const {
    dashboards,
    isLoading,
    error,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    toggleFavorite,
    duplicateDashboard,
    createFromTemplate,
  } = useCustomDashboards({
    userId: user?.id,
  })

  const filteredDashboards = useDashboardFilters({
    dashboards,
    searchTerm,
    selectedCategory,
    selectedView,
  })

  const resetNewDashboardForm = () => {
    setNewDashboard(emptyDashboardForm)
  }

  const handleCreateDashboard = async () => {
    const created = await createDashboard(newDashboard)

    if (created) {
      setIsCreating(false)
      resetNewDashboardForm()
    }
  }

  const handleEditDashboard = (dashboard: Dashboard) => {
    setSelectedDashboard(dashboard)
    setNewDashboard({
      name: dashboard.name,
      description: dashboard.description,
      category: dashboard.category,
      isPublic: dashboard.isPublic,
      widgets: [],
    })
    setIsEditing(true)
  }

  const handleUpdateDashboard = async () => {
    if (!selectedDashboard) return

    const updated = await updateDashboard(
      selectedDashboard.id,
      newDashboard,
    )

    if (updated) {
      setIsEditing(false)
      setSelectedDashboard(null)
      resetNewDashboardForm()
    }
  }

  const handleDeleteDashboard = async (
    dashboardId: string,
  ) => {
    if (
      !confirm(
        "Are you sure you want to delete this dashboard?",
      )
    ) {
      return
    }

    await deleteDashboard(dashboardId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background ">
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Custom Dashboards
            </h1>

            <p className="text-muted-foreground">
              Create and manage your personalized dashboards
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsCreating(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Dashboard
        </Button>
      </div>

      {error && (
        <div className="rounded-md border p-3 text-sm text-muted-foreground">
          {error}
        </div>
      )}

      <DashboardStats dashboards={dashboards} />

      <Tabs
        defaultValue="dashboards"
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="dashboards">
            My Dashboards
          </TabsTrigger>
          <TabsTrigger value="templates">
            Templates
          </TabsTrigger>
          <TabsTrigger value="widgets">
            Widget Library
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="dashboards"
          className="space-y-4"
        >
          <DashboardFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedView={selectedView}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onViewChange={setSelectedView}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDashboards.map((dashboard) => (
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                handleToggleFavorite={toggleFavorite}
                handleDuplicateDashboard={
                  duplicateDashboard
                }
                handleDeleteDashboard={
                  handleDeleteDashboard
                }
                handleEditDashboard={
                  handleEditDashboard
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="templates"
          className="space-y-4"
        >
          <DashboardTemplates
            onUseTemplate={createFromTemplate}
          />
        </TabsContent>

        <TabsContent
          value="widgets"
          className="space-y-4"
        >
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