import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { Dashboard } from "../components/dashboard-card"
import type { NewDashboardForm } from "../components/create-dashboard-dialog"
import { useToast } from "@/components/ui/toast"

interface DashboardListResponse {
  dashboards?: Dashboard[]
}

interface DashboardResponse {
  dashboard: Dashboard
}

interface UseDashboardFiltersParams {
  dashboards: Dashboard[]
  searchTerm: string
  selectedCategory: string
  selectedView: string
}

export function useDashboardFilters({
  dashboards,
  searchTerm,
  selectedCategory,
  selectedView,
}: UseDashboardFiltersParams) {
  return useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return dashboards.filter((dashboard) => {
      const matchesSearch =
        dashboard.name.toLowerCase().includes(normalizedSearch) ||
        dashboard.description?.toLowerCase().includes(normalizedSearch)

      const matchesCategory =
        selectedCategory === "all" ||
        dashboard.category === selectedCategory

      const matchesView =
        selectedView === "all" ||
        (selectedView === "favorites" && dashboard.isFavorite) ||
        (selectedView === "public" && dashboard.isPublic) ||
        (selectedView === "private" && !dashboard.isPublic)

      return matchesSearch && matchesCategory && matchesView
    })
  }, [dashboards, searchTerm, selectedCategory, selectedView])
}

interface UseCustomDashboardsParams {
  userId?: string
}

export function useCustomDashboards({
  userId,
}: UseCustomDashboardsParams) {
  const { addToast } = useToast()

  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboards = useCallback(async () => {
    if (!userId) {
      setDashboards([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `/api/custom-dashboards?userId=${encodeURIComponent(userId)}`,
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch dashboards: ${response.status} ${response.statusText}`,
        )
      }

      const data =
        (await response.json()) as DashboardListResponse

      setDashboards(data.dashboards ?? [])
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unknown error occurred"

      setError(`Failed to load dashboards: ${message}`)
      setDashboards([])
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchDashboards()
  }, [fetchDashboards])

  const createDashboard = useCallback(
    async (form: NewDashboardForm) => {
      if (!userId || !form.name.trim()) {
        if (!userId) {
          addToast({
            title: "Unable to create dashboard",
            description:
              "Authenticated user information is unavailable.",
            type: "error",
          })
        }

        return false
      }

      setIsLoading(true)

      try {
        const response = await fetch("/api/custom-dashboards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            category: form.category,
            isPublic: form.isPublic,
            widgets: form.widgets,
            createdById: userId,
          }),
        })

        if (!response.ok) {
          throw new Error(
            `Failed to create dashboard: ${response.status}`,
          )
        }

        const data =
          (await response.json()) as DashboardResponse

        setDashboards((previous) => [
          data.dashboard,
          ...previous,
        ])

        addToast({
          title: "Dashboard created",
          type: "success",
        })

        return true
      } catch (err) {
        addToast({
          title: "Couldn't create dashboard",
          description:
            err instanceof Error
              ? err.message
              : "Please try again",
          type: "error",
        })

        return false
      } finally {
        setIsLoading(false)
      }
    },
    [userId, addToast],
  )

  const updateDashboard = useCallback(
    async (
      dashboardId: string,
      form: NewDashboardForm,
    ) => {
      if (!form.name.trim()) return false

      setIsLoading(true)

      try {
        const response = await fetch("/api/custom-dashboards", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: dashboardId,
            name: form.name,
            description: form.description,
            category: form.category,
            isPublic: form.isPublic,
          }),
        })

        if (!response.ok) {
          throw new Error(
            `Failed to update dashboard: ${response.status}`,
          )
        }

        const data =
          (await response.json()) as DashboardResponse

        setDashboards((previous) =>
          previous.map((dashboard) =>
            dashboard.id === data.dashboard.id
              ? data.dashboard
              : dashboard,
          ),
        )

        addToast({
          title: "Dashboard updated",
          type: "success",
        })

        return true
      } catch (err) {
        addToast({
          title: "Couldn't update dashboard",
          description:
            err instanceof Error
              ? err.message
              : "Please try again",
          type: "error",
        })

        return false
      } finally {
        setIsLoading(false)
      }
    },
    [addToast],
  )

  const deleteDashboard = useCallback(
    async (dashboardId: string) => {
      setIsLoading(true)

      try {
        const response = await fetch(
          `/api/custom-dashboards?id=${encodeURIComponent(
            dashboardId,
          )}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          throw new Error(
            `Failed to delete dashboard: ${response.status}`,
          )
        }

        setDashboards((previous) =>
          previous.filter(
            (dashboard) => dashboard.id !== dashboardId,
          ),
        )

        addToast({
          title: "Dashboard deleted",
          type: "success",
        })

        return true
      } catch (err) {
        addToast({
          title: "Couldn't delete dashboard",
          description:
            err instanceof Error
              ? err.message
              : "Please try again",
          type: "error",
        })

        return false
      } finally {
        setIsLoading(false)
      }
    },
    [addToast],
  )

  const toggleFavorite = useCallback(
    async (dashboardId: string) => {
      const target = dashboards.find(
        (dashboard) => dashboard.id === dashboardId,
      )

      if (!target) return

      const nextFavoriteState = !target.isFavorite

      // Optimistic UI update.
      setDashboards((previous) =>
        previous.map((dashboard) =>
          dashboard.id === dashboardId
            ? {
                ...dashboard,
                isFavorite: nextFavoriteState,
              }
            : dashboard,
        ),
      )

      try {
        const response = await fetch("/api/custom-dashboards", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: dashboardId,
            isFavorite: nextFavoriteState,
          }),
        })

        if (!response.ok) {
          throw new Error(
            `Failed to update favorite: ${response.status}`,
          )
        }
      } catch {
        // Roll back optimistic update if the API request fails.
        setDashboards((previous) =>
          previous.map((dashboard) =>
            dashboard.id === dashboardId
              ? {
                  ...dashboard,
                  isFavorite: target.isFavorite,
                }
              : dashboard,
          ),
        )

        addToast({
          title: "Couldn't update favorite",
          type: "error",
        })
      }
    },
    [dashboards, addToast],
  )

  const duplicateDashboard = useCallback(
    async (dashboard: Dashboard) => {
      if (!userId) {
        addToast({
          title: "Unable to duplicate dashboard",
          description:
            "Authenticated user information is unavailable.",
          type: "error",
        })

        return false
      }

      setIsLoading(true)

      try {
        const response = await fetch("/api/custom-dashboards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
          throw new Error(
            `Failed to duplicate dashboard: ${response.status}`,
          )
        }

        const data =
          (await response.json()) as DashboardResponse

        setDashboards((previous) => [
          data.dashboard,
          ...previous,
        ])

        addToast({
          title: "Dashboard duplicated",
          type: "success",
        })

        return true
      } catch (err) {
        addToast({
          title: "Couldn't duplicate dashboard",
          description:
            err instanceof Error
              ? err.message
              : "Please try again",
          type: "error",
        })

        return false
      } finally {
        setIsLoading(false)
      }
    },
    [userId, addToast],
  )

  const createFromTemplate = useCallback(
    async (templateName: string, widgetCount: number) => {
      if (!userId) {
        addToast({
          title: "Unable to create dashboard",
          description:
            "Authenticated user information is unavailable.",
          type: "error",
        })

        return false
      }

      setIsLoading(true)

      try {
        const category = templateName.includes("Portfolio")
          ? "Portfolio"
          : templateName.includes("Pipeline")
            ? "Pipeline"
            : templateName.includes("GEDSI")
              ? "Impact"
              : "Custom"

        const placeholderWidgets = Array.from(
          { length: widgetCount },
          (_, index) => ({
            id: `widget-${index + 1}`,
            type: "placeholder",
          }),
        )

        const createResponse = await fetch(
          "/api/custom-dashboards",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `My ${templateName}`,
              description: `Custom ${templateName.toLowerCase()} dashboard created from template`,
              category,
              isPublic: false,
              widgets: placeholderWidgets,
              createdById: userId,
            }),
          },
        )

        if (!createResponse.ok) {
          throw new Error(
            `Failed to create dashboard: ${createResponse.status}`,
          )
        }

        const createdData =
          (await createResponse.json()) as DashboardResponse

        const favoriteResponse = await fetch(
          "/api/custom-dashboards",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: createdData.dashboard.id,
              isFavorite: true,
            }),
          },
        )

        let finalDashboard = createdData.dashboard

        if (favoriteResponse.ok) {
          const favoriteData =
            (await favoriteResponse.json()) as DashboardResponse

          finalDashboard = favoriteData.dashboard
        }

        setDashboards((previous) => [
          finalDashboard,
          ...previous,
        ])

        addToast({
          title: `${templateName} dashboard created successfully!`,
          type: "success",
        })

        return true
      } catch (err) {
        addToast({
          title: "Couldn't create dashboard from template",
          description:
            err instanceof Error
              ? err.message
              : "Please try again",
          type: "error",
        })

        return false
      } finally {
        setIsLoading(false)
      }
    },
    [userId, addToast],
  )

  return {
    dashboards,
    isLoading,
    error,
    fetchDashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    toggleFavorite,
    duplicateDashboard,
    createFromTemplate,
  }
}