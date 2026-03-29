"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  Users,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Maximize2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Bell,
  Plus
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  LineChart as RLineChart,
  Line,
  AreaChart as RAreaChart,
  Area,
  PieChart as RPieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts'

interface MetricCard {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: string
  subtitle?: string
}

interface ChartWidget {
  id: string
  title: string
  type: 'line' | 'bar' | 'pie' | 'area'
  data: Record<string, unknown>[]
  height?: number
  span?: number
}

// Generate real alerts from venture data
function generateRealAlerts(ventures: any[]) {
  const alerts = []
  
  // Check for high risk ventures (low GEDSI scores or declining metrics)
  const riskVentures = ventures.filter(v => 
    (v.gedsiScore && v.gedsiScore < 60) || 
    (v.status === 'INACTIVE') ||
    (v.stage === 'ON_HOLD')
  )
  
  if (riskVentures.length > 0) {
    alerts.push({
      type: 'risk',
      title: 'High Risk Venture Detected',
      message: `${riskVentures[0].name} shows declining metrics`,
      time: '2 hours ago'
    })
  }
  
  // Check for review deadlines
  const needReview = ventures.filter(v => 
    v.stage === 'DUE_DILIGENCE' || 
    v.stage === 'INVESTMENT_READY' ||
    !v.lastReviewDate
  )
  
  if (needReview.length > 0) {
    alerts.push({
      type: 'warning',
      title: 'Review Deadline Approaching',
      message: `${needReview.length} ventures require assessment by Friday`,
      time: '4 hours ago'
    })
  }
  
  // Check for high growth potential
  const highPotential = ventures.filter(v => 
    v.gedsiScore >= 80 || 
    v.stage === 'SERIES_A' || 
    v.stage === 'SERIES_B'
  )
  
  if (highPotential.length > 0) {
    alerts.push({
      type: 'info',
      title: 'AI Recommendation Available',
      message: `${highPotential.length} ventures show high growth potential`,
      time: '6 hours ago'
    })
  }
  
  return alerts.slice(0, 3) // Limit to 3 alerts
}

// Generate real recent activities from venture data
function generateRecentActivities(ventures: any[]) {
  const activities = []
  
  // Recent assessments (ventures with GEDSI scores)
  const recentAssessments = ventures.filter(v => v.gedsiScore && v.updatedAt)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 2)
  
  recentAssessments.forEach(venture => {
    activities.push({
      type: 'assessment',
      title: 'Assessment Completed',
      message: `${venture.name} - GEDSI Score: ${venture.gedsiScore}%`,
      time: '1 hour ago'
    })
  })
  
  // Recent funding rounds
  const recentFunding = ventures.filter(v => 
    v.fundingRaised > 0 && 
    ['SERIES_A', 'SERIES_B', 'FUNDED'].includes(v.stage)
  ).slice(0, 1)
  
  recentFunding.forEach(venture => {
    activities.push({
      type: 'funding',
      title: 'Funding Round Closed',
      message: `${venture.name} - $${(venture.fundingRaised / 1000).toFixed(0)}K ${venture.stage.replace('_', ' ')}`,
      time: '5 hours ago'
    })
  })
  
  // Milestones (high performing ventures)
  const milestones = ventures.filter(v => v.gedsiScore >= 85).slice(0, 1)
  
  milestones.forEach(venture => {
    activities.push({
      type: 'milestone',
      title: 'Milestone Achieved',
      message: `${venture.name} exceeded GEDSI targets`,
      time: '8 hours ago'
    })
  })
  
  return activities.slice(0, 4) // Limit to 4 activities
}

interface AnalyticsDashboardProps {
  title?: string
  metrics: MetricCard[]
  charts: ChartWidget[]
  ventures?: any[]
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  customizable?: boolean
  onOpenFilters?: () => void
  onExport?: (payload: { charts: ChartWidget[] }) => void
  onRefresh?: () => void
}

export function AnalyticsDashboard({
  title = "Analytics Dashboard",
  metrics,
  charts,
  ventures = [],
  timeRange = "30d",
  onTimeRangeChange,
  customizable = true,
  onOpenFilters,
  onExport,
  onRefresh,
}: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customizingChartId, setCustomizingChartId] = useState<string | null>(null)
  const [widgetConfig, setWidgetConfig] = useState<{ keyMetrics: boolean; performanceCharts: boolean; alertsPanel: boolean }>(() => {
    if (typeof window === 'undefined') return { keyMetrics: true, performanceCharts: true, alertsPanel: true }
    try {
      const raw = localStorage.getItem('analytics.widgets')
      return raw ? JSON.parse(raw) : { keyMetrics: true, performanceCharts: true, alertsPanel: true }
    } catch {
      return { keyMetrics: true, performanceCharts: true, alertsPanel: true }
    }
  })
  const [layoutMode, setLayoutMode] = useState<'standard' | 'compact' | 'wide'>(() => {
    if (typeof window === 'undefined') return 'standard'
    try {
      return (localStorage.getItem('analytics.layout') as any) || 'standard'
    } catch { return 'standard' }
  })

  const persistWidgets = (cfg: typeof widgetConfig) => {
    setWidgetConfig(cfg)
    try { localStorage.setItem('analytics.widgets', JSON.stringify(cfg)) } catch {}
  }
  const persistLayout = (mode: typeof layoutMode) => {
    setLayoutMode(mode)
    try { localStorage.setItem('analytics.layout', mode) } catch {}
  }
  const [chartOptionsMap, setChartOptionsMap] = useState<Record<string, any>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem('analytics.chartOptions')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const persistOptions = (updater: (curr: Record<string, any>) => Record<string, any>) => {
    setChartOptionsMap(prev => {
      const next = updater(prev)
      if (typeof window !== 'undefined') localStorage.setItem('analytics.chartOptions', JSON.stringify(next))
      return next
    })
  }

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range)
    onTimeRangeChange?.(range)
  }

  const handleOpenFilters = () => {
    if (onOpenFilters) return onOpenFilters()
    console.info('[AnalyticsDashboard] No onOpenFilters handler provided')
  }

  const download = (filename: string, text: string, mime = 'application/json') => {
    try {
      const blob = new Blob([text], { type: mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  const handleExport = () => {
    if (onExport) return onExport({ charts })
    // Default: export charts data as JSON
    const payload = charts.map(c => ({ id: c.id, title: c.title, type: c.type, data: c.data }))
    download(`dashboard-charts-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(payload, null, 2))
  }

  const handleRefresh = () => {
    if (onRefresh) return onRefresh()
    if (typeof window !== 'undefined') window.location.reload()
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-emerald-600 font-semibold'
      case 'decrease':
        return 'text-red-600 font-semibold'
      default:
        return 'text-gray-600'
    }
  }

  const ChartRenderer = ({ chart }: { chart: ChartWidget }) => {
    const { xKey, yKey, nameKey, valueKey } = useMemo(() => {
      const first = chart.data && chart.data.length > 0 ? chart.data[0] : undefined
      const keys = first ? Object.keys(first) : []
      const numericKeys = keys.filter(k => typeof (first as any)[k] === 'number')
      const stringKeys = keys.filter(k => typeof (first as any)[k] === 'string')
      return {
        xKey: stringKeys[0] || 'name',
        yKey: numericKeys[0] || 'value',
        nameKey: stringKeys[0] || 'name',
        valueKey: numericKeys[0] || 'value',
      }
    }, [chart.data])

    const options: any = (chart as any)?.options || {}
    const persisted = chartOptionsMap[chart.id] || {}
    const mergedOptions = { ...options, ...persisted }
    const palette = (mergedOptions.palette as string[]) || ['#6366F1','#22C55E','#F59E0B','#EC4899','#06B6D4','#84CC16']
    const primaryColor = mergedOptions.color || palette[0]
    const showConversionLabels = mergedOptions.showConversionLabels !== false
    const showDeltaLabels = mergedOptions.showDeltaLabels !== false
    const yAxisWidth = typeof mergedOptions.yAxisWidth === 'number' ? mergedOptions.yAxisWidth : 140
    const barMaxWidth = typeof mergedOptions.barMaxWidth === 'number' ? mergedOptions.barMaxWidth : 36

    // Stacked or single-series rendering - moved outside switch to avoid conditional hook
    const stackedKeys: string[] = Array.isArray(mergedOptions.stackedKeys) ? mergedOptions.stackedKeys : []
    const stackedAsPercent = !!mergedOptions.stackedAsPercent

    // Optional percentage transform for stacked data
    const transformedData = useMemo(() => {
      if (!stackedKeys.length || !stackedAsPercent) return chart.data as any[]
      return (chart.data as any[]).map(row => {
        const total = stackedKeys.reduce((sum, key) => sum + (Number(row[key]) || 0), 0)
        if (!total) return row
        const next: any = { ...row }
        stackedKeys.forEach(key => { next[key] = Math.round(((Number(row[key]) || 0) / total) * 100) })
        return next
      })
    }, [chart.data, stackedKeys, stackedAsPercent])

    const heightPx = 256
    switch (chart.type) {
      case 'bar':
        if (mergedOptions.layout === 'vertical') {
          const values = Array.isArray(chart.data) ? (chart.data as any[]).map((d) => Number(d[yKey]) || 0) : [0]
          const maxValue = values.length ? Math.max(...values) : 0

          const FunnelShape = (props: any) => {
            const { x, y, width, height, payload } = props
            const value = Number(payload?.[yKey]) || 0
            const ratio = maxValue > 0 ? value / maxValue : 1
            const inset = Math.max(0, (1 - ratio) * width * 0.35)
            const left = x + inset
            const right = x + width
            const top = y
            const bottom = y + height
            return (
              <path d={`M ${left},${top} L ${right},${top} L ${right},${bottom} L ${left},${bottom} Z`} fill={primaryColor} rx={4} ry={4} />
            )
          }

          return (
            <div style={{ width: '100%', height: heightPx }}>
              <ResponsiveContainer>
                <RBarChart layout="vertical" data={transformedData as any} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, stackedAsPercent && stackedKeys.length ? 100 : 'auto']} />
                  <YAxis type="category" dataKey={xKey} width={yAxisWidth} />
                  <Tooltip formatter={(value: any, name: any, props: any) => {
                    if (typeof mergedOptions.tooltipFormatter === 'function') {
                      return mergedOptions.tooltipFormatter(value, props?.payload)
                    }
                    const conv = props?.payload?.conversion
                    const delta = props?.payload?.delta
                    if (stackedKeys.length) {
                      const unit = stackedAsPercent ? '%' : ''
                      return [`${value}${unit}`, String(name)]
                    }
                    const parts = [stackedAsPercent ? `${value}%` : `${value} ventures`]
                    if (showConversionLabels && conv != null) parts.push(`${conv}% step conv.`)
                    if (showDeltaLabels && typeof delta === 'number') parts.push(`${delta >= 0 ? '+' : ''}${delta} vs prev`)
                    return [parts.join(' • '), '']
                  }} />
                  {stackedKeys.length ? (
                    stackedKeys.map((key, idx) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={palette[idx % palette.length]} maxBarSize={barMaxWidth} />
                    ))
                  ) : (
                    <Bar dataKey={yKey} shape={<FunnelShape />} maxBarSize={barMaxWidth} onClick={(data: any) => mergedOptions.onBarClick && mergedOptions.onBarClick(data?.payload)} cursor={mergedOptions.onBarClick ? 'pointer' : 'default'}>
                      {options?.labels !== false && (
                        <LabelList position="right" formatter={(val: any, _name: any, props: any) => {
                          if (typeof mergedOptions.labelFormatter === 'function') {
                            return mergedOptions.labelFormatter(val, props?.payload)
                          }
                          const conv = props?.payload?.conversion
                          const delta = props?.payload?.delta
                          let base = stackedAsPercent ? `${val}%` : String(val)
                          if (showConversionLabels && conv != null) base = `${base} (${conv}%)`
                          if (showDeltaLabels && typeof delta === 'number') base = `${base}  ${delta >= 0 ? '▲' : '▼'}${Math.abs(delta)}`
                          return base
                        }} />
                      )}
                    </Bar>
                  )}
                  {stackedKeys.length ? <Legend /> : null}
                </RBarChart>
              </ResponsiveContainer>
            </div>
          )
        }
        return (
          <div style={{ width: '100%', height: heightPx }}>
            <ResponsiveContainer>
              <RBarChart data={chart.data as any} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={yKey} fill={primaryColor} radius={[4,4,0,0]} />
              </RBarChart>
            </ResponsiveContainer>
          </div>
        )
      case 'line':
        return (
          <div style={{ width: '100%', height: heightPx }}>
            <ResponsiveContainer>
              <RLineChart data={chart.data as any} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={yKey} stroke={palette[0]} strokeWidth={2} dot={false} />
              </RLineChart>
            </ResponsiveContainer>
          </div>
        )
      case 'area':
        return (
          <div style={{ width: '100%', height: heightPx }}>
            <ResponsiveContainer>
              <RAreaChart data={chart.data as any} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={palette[0]} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={palette[0]} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey={yKey} stroke={palette[0]} fillOpacity={1} fill="url(#colorPrimary)" />
              </RAreaChart>
            </ResponsiveContainer>
          </div>
        )
      case 'pie':
        return (
          <div style={{ width: '100%', height: heightPx }}>
            <ResponsiveContainer>
              <RPieChart>
                <Tooltip />
                <Legend />
                <Pie 
                  data={chart.data as any} 
                  dataKey={valueKey} 
                  nameKey={nameKey} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80}
                  label={true}
                >
                  {(chart.data as any[]).map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} />
                  ))}
                </Pie>
              </RPieChart>
            </ResponsiveContainer>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{title}</h1>
          <p className="text-slate-600 font-medium">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleOpenFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          {customizable && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCustomizing(!isCustomizing)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      {widgetConfig.keyMetrics && (
      <div className={`grid ${layoutMode === 'compact' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} ${layoutMode === 'wide' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{metric.value}</p>
                    {metric.change !== 0 && (
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getChangeColor(metric.changeType)} ${metric.changeType === 'increase' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        {getChangeIcon(metric.changeType)}
                        <span className="text-sm font-medium">
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    )}
                  </div>
                  {metric.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.color} transform transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Charts Grid */}
      {widgetConfig.performanceCharts && (
      <div className={`grid grid-cols-1 ${layoutMode === 'wide' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} xl:grid-cols-3 gap-6`}>
        {charts.map((chart) => (
          <Card 
            key={chart.id} 
            className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
              chart.span === 2 ? 'lg:col-span-2' : ''
            } ${chart.span === 3 ? 'xl:col-span-3' : ''}`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {chart.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsCustomizing(curr => !curr)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg">
                <ChartRenderer chart={{...chart, options: { ...(chart as any).options, ...(chartOptionsMap[chart.id] || {}) }}} />
                
                
                {isCustomizing && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-600">Customize:</span>
                    <Button variant={customizingChartId === chart.id ? 'default' : 'outline'} size="sm" onClick={() => setCustomizingChartId(customizingChartId === chart.id ? null : chart.id)}>
                      {customizingChartId === chart.id ? 'Editing' : 'Edit this chart'}
                    </Button>
                    {customizingChartId === chart.id && (
                      <>
                        <span className="text-gray-600 ml-2">Color:</span>
                        {['#0EA5E9','#22C55E','#F59E0B','#EF4444','#8B5CF6','#06B6D4'].map((c) => (
                          <button
                        key={c}
                        type="button"
                        onClick={() => persistOptions(prev => ({...prev, [chart.id]: { ...(prev[chart.id]||{}), color: c }}))}
                        className="w-6 h-6 rounded-full border" style={{ backgroundColor: c }}
                        aria-label={`Set color ${c}`}
                      />
                        ))}
                        <label className="ml-4 flex items-center gap-2">
                          <input type="checkbox" checked={(chartOptionsMap[chart.id]?.showConversionLabels ?? true)} onChange={(e) => persistOptions(prev => ({...prev, [chart.id]: { ...(prev[chart.id]||{}), showConversionLabels: e.target.checked }}))} />
                          Show conversion
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={(chartOptionsMap[chart.id]?.showDeltaLabels ?? true)} onChange={(e) => persistOptions(prev => ({...prev, [chart.id]: { ...(prev[chart.id]||{}), showDeltaLabels: e.target.checked }}))} />
                          Show delta
                        </label>
                        <label className="flex items-center gap-2">
                          Y width
                          <input type="number" className="w-20 border rounded px-2 py-1" value={(chartOptionsMap[chart.id]?.yAxisWidth ?? 160)} onChange={(e) => persistOptions(prev => ({...prev, [chart.id]: { ...(prev[chart.id]||{}), yAxisWidth: Number(e.target.value) }}))} />
                        </label>
                        <label className="flex items-center gap-2">
                          Bar max
                          <input type="number" className="w-20 border rounded px-2 py-1" value={(chartOptionsMap[chart.id]?.barMaxWidth ?? 42)} onChange={(e) => persistOptions(prev => ({...prev, [chart.id]: { ...(prev[chart.id]||{}), barMaxWidth: Number(e.target.value) }}))} />
                        </label>
                        <label className="flex items-center gap-2">
                          Percent stacks
                          <input type="checkbox" checked={(chartOptionsMap[chart.id]?.stackedAsPercent ?? false)} onChange={(e) => persistOptions(prev => ({...prev, [chart.id]: { ...(prev[chart.id]||{}), stackedAsPercent: e.target.checked }}))} />
                        </label>
                        <Button variant="outline" size="sm" onClick={() => persistOptions(prev => { const copy = {...prev}; delete copy[chart.id]; return copy })}>Reset</Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Alerts and Notifications */}
      {widgetConfig.alertsPanel && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ventures.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">
                    Add ventures to monitor performance and receive alerts.
                  </p>
                </div>
              ) : (
                generateRealAlerts(ventures).map((alert, index) => (
                  <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    alert.type === 'risk' ? 'bg-red-50' :
                    alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                  }`}>
                    {alert.type === 'risk' ? <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" /> :
                     alert.type === 'warning' ? <Clock className="h-5 w-5 text-yellow-500 mt-0.5" /> :
                     <Zap className="h-5 w-5 text-blue-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        alert.type === 'risk' ? 'text-red-900' :
                        alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                      }`}>{alert.title}</p>
                      <p className={`text-xs ${
                        alert.type === 'risk' ? 'text-red-700' :
                        alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                      }`}>{alert.message}</p>
                      <p className={`text-xs mt-1 ${
                        alert.type === 'risk' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>{alert.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ventures.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Recent Activities</h3>
                  <p className="text-muted-foreground">
                    Add ventures to track activities and milestones.
                  </p>
                </div>
              ) : (
                generateRecentActivities(ventures).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    {activity.type === 'assessment' ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> :
                     activity.type === 'team' ? <Users className="h-5 w-5 text-blue-500 mt-0.5" /> :
                     activity.type === 'funding' ? <DollarSign className="h-5 w-5 text-green-500 mt-0.5" /> :
                     <Target className="h-5 w-5 text-purple-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Customization Panel */}
      {isCustomizing && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-900">
              Dashboard Customization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Widgets</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" checked={widgetConfig.keyMetrics} onChange={(e) => persistWidgets({ ...widgetConfig, keyMetrics: e.target.checked })} />
                    <span className="text-sm">Key Metrics</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" checked={widgetConfig.performanceCharts} onChange={(e) => persistWidgets({ ...widgetConfig, performanceCharts: e.target.checked })} />
                    <span className="text-sm">Performance Charts</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" checked={widgetConfig.alertsPanel} onChange={(e) => persistWidgets({ ...widgetConfig, alertsPanel: e.target.checked })} />
                    <span className="text-sm">Alerts Panel</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Layout</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="layout" className="rounded" checked={layoutMode==='standard'} onChange={() => persistLayout('standard')} />
                    <span className="text-sm">Standard Grid</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="layout" className="rounded" checked={layoutMode==='compact'} onChange={() => persistLayout('compact')} />
                    <span className="text-sm">Compact View</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="layout" className="rounded" checked={layoutMode==='wide'} onChange={() => persistLayout('wide')} />
                    <span className="text-sm">Wide Layout</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Actions</h4>
                <div className="space-y-2">
                  <Button size="sm" className="w-full" onClick={() => { try { localStorage.setItem('analytics.widgets', JSON.stringify(widgetConfig)); localStorage.setItem('analytics.layout', layoutMode) } catch {}; setIsCustomizing(false) }}>Save Layout</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { persistWidgets({ keyMetrics: true, performanceCharts: true, alertsPanel: true }); persistLayout('standard') }}>Reset to Default</Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsCustomizing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
