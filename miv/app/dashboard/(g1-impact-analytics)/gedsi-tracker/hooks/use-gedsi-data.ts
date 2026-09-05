"use client"

import { useEffect, useMemo, useState } from "react"
import { GEDSI_CATEGORIES, mockAiInsights, mockMetrics, mockVentures } from "../constants/gedsi-tracker.constants"
import { mapApiMetric } from "../lib/gedsi-tracker-utils"
import type { GEDSIMetric, GedsiInsightSummary, GedsiTrackerState, Venture } from "../types/gedsi-tracker.types"

export function useGedsiData(): GedsiTrackerState {
  const [metrics, setMetrics] = useState<GEDSIMetric[]>([])
  const [ventures, setVentures] = useState<Venture[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVenture, setSelectedVenture] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAddMetric, setShowAddMetric] = useState(false)
  const [aiInsights, setAiInsights] = useState<GedsiInsightSummary | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    void fetchGEDSIData()
  }, [])

  const filteredMetrics = useMemo(() => {
    return metrics.filter((metric) => {
      const ventureMatch = selectedVenture === "all" || metric.ventureId === selectedVenture
      const categoryMatch = selectedCategory === "all" || metric.category === selectedCategory
      const statusMatch = selectedStatus === "all" || metric.status === selectedStatus
      return ventureMatch && categoryMatch && statusMatch
    })
  }, [metrics, selectedVenture, selectedCategory, selectedStatus])

  const overviewStats = useMemo(() => {
    const total = metrics.length
    const verified = metrics.filter((metric) => metric.status === "Verified").length
    const inProgress = metrics.filter((metric) => metric.status === "In Progress").length
    const overdue = metrics.filter((metric) => metric.status === "Overdue").length

    return {
      total,
      verified,
      inProgress,
      overdue,
      completionRate: total > 0 ? (verified / total) * 100 : 0,
    }
  }, [metrics])

  const categoryStats = useMemo(() => {
    return GEDSI_CATEGORIES.map((category) => {
      const categoryMetrics = metrics.filter((metric) => metric.category === category)
      const verified = categoryMetrics.filter((metric) => metric.status === "Verified").length
      const total = categoryMetrics.length

      return {
        category,
        total,
        verified,
        completionRate: total > 0 ? (verified / total) * 100 : 0,
      }
    })
  }, [metrics])

  const venturePerformance = useMemo(() => {
    if (!Array.isArray(ventures)) {
      return []
    }

    return ventures
      .map((venture) => {
        const ventureMetrics = metrics.filter((metric) => metric.ventureId === venture.id)
        const verified = ventureMetrics.filter((metric) => metric.status === "Verified").length
        const total = ventureMetrics.length

        return {
          ventureId: venture.id,
          ventureName: venture.name,
          totalMetrics: total,
          verifiedMetrics: verified,
          completionRate: total > 0 ? (verified / total) * 100 : 0,
        }
      })
      .sort((a, b) => b.completionRate - a.completionRate)
  }, [ventures, metrics])

  async function fetchGEDSIData() {
    try {
      setLoading(true)

      const venturesResponse = await fetch("/api/ventures")
      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json()
        setVentures(venturesData.ventures || [])
      }

      const metricsResponse = await fetch("/api/gedsi-metrics")
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setMetrics((metricsData.metrics || []).map(mapApiMetric))
      }

      const insightsResponse = await fetch("/api/ai/gedsi-insights")
      if (insightsResponse.ok) {
        setAiInsights(await insightsResponse.json())
      }
    } catch (error) {
      console.error("Error fetching GEDSI data:", error)
      setMetrics(mockMetrics)
      setVentures(mockVentures)
      setAiInsights(mockAiInsights)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    setIsExporting(true)
    const csvContent = [
      ["Venture", "Metric", "Category", "Current Value", "Target Value", "Status", "Progress %"].join(","),
      ...filteredMetrics.map((metric) =>
        [
          metric.ventureName,
          metric.metricName,
          metric.category,
          metric.currentValue,
          metric.targetValue,
          metric.status,
          Math.round((metric.currentValue / metric.targetValue) * 100),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "gedsi-metrics-un-standards.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    setIsExporting(false)
  }

  const handleAddMetric = async (metricData: Partial<GEDSIMetric>) => {
    try {
      const response = await fetch("/api/gedsi-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metricData),
      })

      if (response.ok) {
        const newMetric = mapApiMetric(await response.json())
        setMetrics((prev) => [...prev, newMetric])
        setShowAddMetric(false)
      }
    } catch (error) {
      console.error("Error adding metric:", error)
    }
  }

  const handleUpdateMetric = async (metricId: string, updates: Partial<GEDSIMetric>) => {
    try {
      const response = await fetch(`/api/gedsi-metrics/${metricId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedMetric = mapApiMetric(await response.json())
        setMetrics((prev) => prev.map((metric) => (metric.id === metricId ? updatedMetric : metric)))
      }
    } catch (error) {
      console.error("Error updating metric:", error)
    }
  }

  return {
    metrics,
    ventures,
    loading,
    selectedVenture,
    setSelectedVenture,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    showAddMetric,
    setShowAddMetric,
    aiInsights,
    isExporting,
    exportData,
    filteredMetrics,
    overviewStats,
    categoryStats,
    venturePerformance,
    handleAddMetric,
    handleUpdateMetric,
  }
}
