// hooks/use-performance-analytics-data.ts
//
// Extracted from app/dashboard/(g1-impact-analytics)/performance-analytics/page.tsx
// T19 - Refactor and Improve Performance Analytics
//
// Isolates: the 4 API calls, loading state, the 30s real-time polling
// interval, and period-based refetching. No behaviour changed — this is
// the same logic, just pulled into its own hook so it can be tested and
// reasoned about on its own ("Test polling behaviour" checklist item).

import { useEffect, useState } from "react"
import type { AnalyticsData } from "@/lib/performance-analytics-calculations"

export function usePerformanceAnalyticsData() {
  const [data, setData] = useState<AnalyticsData>({
    ventures: [],
    gedsiMetrics: [],
    users: [],
    analytics: null
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      const [venturesRes, gedsiRes, usersRes, analyticsRes] = await Promise.all([
        fetch('/api/ventures?limit=100'),
        fetch('/api/gedsi-metrics?limit=200'),
        fetch('/api/users?limit=100'),
        fetch(`/api/analytics?period=${selectedPeriod}`).catch(() => ({ ok: false }))
      ])

      const [venturesData, gedsiData, usersData, analyticsData] = await Promise.all([
        venturesRes.json(),
        gedsiRes.json(),
        usersRes.json(),
        analyticsRes.ok && 'json' in analyticsRes ? analyticsRes.json() : {}
      ])

      setData({
        ventures: venturesData.ventures || [],
        gedsiMetrics: gedsiData.metrics || [],
        users: usersData.users || [],
        analytics: analyticsData || null
      })
    } catch (error) {
      console.error('Error loading analytics data:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAnalyticsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod])

  // Real-time data refresh
  useEffect(() => {
    if (!realTimeEnabled) return

    const interval = setInterval(() => {
      loadAnalyticsData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realTimeEnabled, selectedPeriod])

  return {
    data,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    realTimeEnabled,
    setRealTimeEnabled,
    loadAnalyticsData,
  }
}