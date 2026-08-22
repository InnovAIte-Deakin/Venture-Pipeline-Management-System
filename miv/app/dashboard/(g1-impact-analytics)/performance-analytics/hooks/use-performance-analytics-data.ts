// app/dashboard/(g1-impact-analytics)/performance-analytics/hooks/use-performance-analytics-data.ts
//
// T19 - Refactor and Improve Performance Analytics

import { useEffect, useState } from "react"
import type { AnalyticsData } from "../types"

export function usePerformanceAnalyticsData() {
  const [data, setData] = useState<AnalyticsData>({ ventures: [], gedsiMetrics: [], users: [], analytics: null })
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
        venturesRes.json(), gedsiRes.json(), usersRes.json(),
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

  useEffect(() => {
    if (!realTimeEnabled) return
    const interval = setInterval(() => { loadAnalyticsData() }, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realTimeEnabled, selectedPeriod])

  return { data, loading, selectedPeriod, setSelectedPeriod, realTimeEnabled, setRealTimeEnabled, loadAnalyticsData }
}