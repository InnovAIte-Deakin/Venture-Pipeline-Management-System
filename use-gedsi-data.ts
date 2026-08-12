"use client"

import { useState, useEffect, useMemo } from 'react'

export interface GEDSIMetric {
  id: string
  ventureId: string
  ventureName: string
  metricCode: string
  metricName: string
  category: 'Gender' | 'Disability' | 'Social Inclusion' | 'Cross-cutting'
  targetValue: number
  currentValue: number
  unit: string
  status: 'Not Started' | 'In Progress' | 'Verified' | 'Overdue'
  verificationDate?: string
  notes?: string
  lastUpdated: string
}

export interface Venture {
  id: string
  name: string
  sector: string
  location: string
  gedsiScore: number
  status: string
  founderTypes: string[]
  inclusionFocus?: string
  washingtonShortSet?: any
  socialImpactScore?: number | null
  gedsiComplianceRate?: number | null
  totalBeneficiaries?: number | null
  jobsCreated?: number | null
  womenEmpowered?: number | null
  disabilityInclusive?: number | null
  youthEngaged?: number | null
  calculatedAt?: string | null
}

export function useGedsiData() {
  const [metrics, setMetrics] = useState<GEDSIMetric[]>([])
  const [ventures, setVentures] = useState<Venture[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVenture, setSelectedVenture] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showAddMetric, setShowAddMetric] = useState(false)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchGEDSIData()
  }, [])

  const fetchGEDSIData = async () => {
    try {
      setLoading(true)
      const venturesResponse = await fetch('/api/ventures')
      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json()
        setVentures(venturesData.ventures || [])
      }

      const metricsResponse = await fetch('/api/gedsi-metrics')
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        const transformedMetrics = (metricsData.metrics || []).map((metric: any) => ({
          id: metric.id,
          ventureId: metric.ventureId,
          ventureName: metric.venture?.name || 'Unknown',
          metricCode: metric.metricCode,
          metricName: metric.metricName,
          category: metric.category === 'GENDER' ? 'Gender' :
                    metric.category === 'DISABILITY' ? 'Disability' :
                    metric.category === 'SOCIAL_INCLUSION' ? 'Social Inclusion' : 'Cross-cutting',
          targetValue: metric.targetValue,
          currentValue: metric.currentValue,
          unit: metric.unit,
          status: metric.status === 'VERIFIED' ? 'Verified' :
                   metric.status === 'COMPLETED' ? 'Verified' :
                   metric.status === 'IN_PROGRESS' ? 'In Progress' : 'Not Started',
          verificationDate: metric.verificationDate,
          notes: metric.notes,
          lastUpdated: metric.updatedAt
        }))
        setMetrics(transformedMetrics)
      }

      const insightsResponse = await fetch('/api/ai/gedsi-insights')
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json()
        setAiInsights(insightsData)
      }
    } catch (error) {
      console.error('Error fetching GEDSI data:', error)
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
      ['Venture', 'Metric', 'Category', 'Current Value', 'Target Value', 'Status', 'Progress %'].join(','),
      ...filteredMetrics.map(metric => [
        metric.ventureName,
        metric.metricName,
        metric.category,
        metric.currentValue,
        metric.targetValue,
        metric.status,
        Math.round((metric.currentValue / metric.targetValue) * 100)
      ].join(','))
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gedsi-metrics-un-standards.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    setIsExporting(false)
  }

  const filteredMetrics = useMemo(() => {
    return metrics.filter(metric => {
      const ventureMatch = selectedVenture === 'all' || metric.ventureId === selectedVenture
      const categoryMatch = selectedCategory === 'all' || metric.category === selectedCategory
      const statusMatch = selectedStatus === 'all' || metric.status === selectedStatus
      return ventureMatch && categoryMatch && statusMatch
    })
  }, [metrics, selectedVenture, selectedCategory, selectedStatus])

  const overviewStats = useMemo(() => {
    const total = metrics.length
    const verified = metrics.filter(m => m.status === 'Verified').length
    const inProgress = metrics.filter(m => m.status === 'In Progress').length
    const overdue = metrics.filter(m => m.status === 'Overdue').length
    const completionRate = total > 0 ? (verified / total) * 100 : 0
    return { total, verified, inProgress, overdue, completionRate }
  }, [metrics])

  const categoryStats = useMemo(() => {
    const categories = ['Gender', 'Disability', 'Social Inclusion', 'Cross-cutting']
    return categories.map(category => {
      const categoryMetrics = metrics.filter(m => m.category === category)
      const verified = categoryMetrics.filter(m => m.status === 'Verified').length
      const total = categoryMetrics.length
      return {
        category,
        total,
        verified,
        completionRate: total > 0 ? (verified / total) * 100 : 0
      }
    })
  }, [metrics])

  const venturePerformance = useMemo(() => {
    if (!Array.isArray(ventures)) return []
    return ventures.map(venture => {
      const ventureMetrics = metrics.filter(m => m.ventureId === venture.id)
      const verified = ventureMetrics.filter(m => m.status === 'Verified').length
      const total = ventureMetrics.length
      return {
        ventureId: venture.id,
        ventureName: venture.name,
        totalMetrics: total,
        verifiedMetrics: verified,
        completionRate: total > 0 ? (verified / total) * 100 : 0
      }
    }).sort((a, b) => b.completionRate - a.completionRate)
  }, [ventures, metrics])

  const handleAddMetric = async (metricData: Partial<GEDSIMetric>) => {
    try {
      const response = await fetch('/api/gedsi-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metricData),
      })
      if (response.ok) {
        const newMetric = await response.json()
        setMetrics(prev => [...prev, newMetric])
        setShowAddMetric(false)
      }
    } catch (error) {
      console.error('Error adding metric:', error)
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
    handleAddMetric
  }
}

const mockMetrics: GEDSIMetric[] = [
  {
    id: '1',
    ventureId: '1',
    ventureName: 'GreenTech Solutions',
    metricCode: 'OI.1',
    metricName: 'Number of women-led ventures supported',
    category: 'Gender',
    targetValue: 100,
    currentValue: 75,
    unit: 'ventures',
    status: 'In Progress',
    lastUpdated: '2024-01-15'
  }
]

const mockVentures: Venture[] = [
  {
    id: '1',
    name: 'GreenTech Solutions',
    sector: 'CleanTech',
    location: 'Vietnam',
    gedsiScore: 85,
    status: 'Active',
    founderTypes: ['women-led', 'rural-focus']
  }
]

const mockAiInsights = {
  trendAnalysis: 'GEDSI metrics show 15% improvement in gender inclusion over the last quarter',
  recommendations: 'Focus on disability inclusion metrics and rural community engagement',
  riskAlerts: '3 metrics are overdue and require immediate attention'
}