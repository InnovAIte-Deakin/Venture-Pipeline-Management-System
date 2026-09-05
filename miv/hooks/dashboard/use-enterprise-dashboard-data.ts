"use client"

import { useCallback, useEffect, useState } from "react"
import type {
  DashboardDataState,
  DashboardGedsiMetric,
  DashboardIrisMetric,
  DashboardUser,
  DashboardVenture,
} from "@/types/dashboard/types"

interface UseEnterpriseDashboardDataOptions {
  onError?: () => void
}

export function useEnterpriseDashboardData({
  onError,
}: UseEnterpriseDashboardDataOptions = {}): DashboardDataState {
  const [ventures, setVentures] = useState<DashboardVenture[]>([])
  const [gedsiMetrics, setGedsiMetrics] = useState<DashboardGedsiMetric[]>([])
  const [irisMetrics, setIrisMetrics] = useState<DashboardIrisMetric[]>([])
  const [users, setUsers] = useState<DashboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [venturesRes, gedsiRes, irisRes, usersRes] = await Promise.all([
        fetch("/api/ventures?limit=100"),
        fetch("/api/gedsi-metrics?limit=200"),
        fetch("/api/iris/metrics?limit=100"),
        fetch("/api/users?limit=100"),
      ])

      if (!venturesRes.ok || !gedsiRes.ok || !irisRes.ok || !usersRes.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const [venturesData, gedsiData, irisData, usersData] = await Promise.all([
        venturesRes.json(),
        gedsiRes.json(),
        irisRes.json(),
        usersRes.json(),
      ])

      setVentures(venturesData.ventures || [])
      setGedsiMetrics(gedsiData.metrics || [])
      setIrisMetrics(irisData.results || [])
      setUsers(usersData.users || [])
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      onError?.()
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return {
    ventures,
    gedsiMetrics,
    irisMetrics,
    users,
    loading,
    error,
    refetch,
  }
}
