// app/dashboard/(g1-impact-analytics)/performance-analytics/components/desktop/performance-analytics-desktop.tsx
//
// T19 - Refactor and Improve Performance Analytics
// Desktop layout - full tab bar, 6-column KPI grid, side-by-side chart panels.

"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download, Users, Clock, BarChart3, MapPin, Lightbulb, RefreshCw, Target, Activity,
  Building2, UserCheck, ArrowRight, Eye, Share, Settings, Globe, Plus, TrendingUp,
} from "lucide-react"

import { KpiMetricsGrid } from "../../components/kpi-metrics-grid"
import {
  PerformanceTrendsChart, SectorPerformanceCard, VentureGrowthChart,
  GedsiComplianceTrendsChart, UserGrowthChart,
} from "../charts"
import {
  generateAIInsights, generateRiskAssessment, generateOptimizationOpportunities,
} from "../../lib/calculations"
import type { AnalyticsData, KpiMetric } from "../../types"

interface PerformanceAnalyticsDesktopProps {
  data: AnalyticsData
  selectedPeriod: string
  setSelectedPeriod: (v: string) => void
  realTimeEnabled: boolean
  setRealTimeEnabled: (v: boolean) => void
  loadAnalyticsData: () => void
  kpiMetrics: KpiMetric[]
  conversionFunnelData: any[]
  performanceTrends: any[]
  sectorPerformance: any[]
  gedsiCategoryPerformance: any[]
}

export function PerformanceAnalyticsDesktop({
  data, selectedPeriod, setSelectedPeriod, realTimeEnabled, setRealTimeEnabled,
  loadAnalyticsData, kpiMetrics, conversionFunnelData, performanceTrends,
  sectorPerformance, gedsiCategoryPerformance,
}: PerformanceAnalyticsDesktopProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into venture performance and platform metrics</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant={realTimeEnabled ? "default" : "outline"} size="sm" onClick={() => setRealTimeEnabled(!realTimeEnabled)}>
                <Activity className="h-4 w-4 mr-1" />
                {realTimeEnabled ? "Live" : "Static"}
              </Button>
              {realTimeEnabled && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Live</span>
                </div>
              )}
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadAnalyticsData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <KpiMetricsGrid metrics={kpiMetrics} />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-gray-800/80 shadow rounded-lg">
            <TabsTrigger value="overview" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="ventures" className="flex items-center gap-2"><Building2 className="h-4 w-4" />Ventures</TabsTrigger>
            <TabsTrigger value="gedsi" className="flex items-center gap-2"><UserCheck className="h-4 w-4" />GEDSI</TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2"><Users className="h-4 w-4" />Users</TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2"><Lightbulb className="h-4 w-4" />Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PerformanceTrendsChart data={performanceTrends} />
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ArrowRight className="h-5 w-5" />Venture Pipeline Funnel</CardTitle>
                  <CardDescription>Conversion rates and drop-off analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionFunnelData.map((stage) => (
                      <div key={stage.stage} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{stage.stage}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{stage.count} ventures</span>
                            <Badge variant="outline" className="text-xs">{stage.percentage}%</Badge>
                            {stage.dropoff > 0 && <Badge variant="outline" className="text-xs text-red-600 bg-red-50">-{stage.dropoff}% dropoff</Badge>}
                          </div>
                        </div>
                        <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div className="h-full rounded-lg transition-all duration-500" style={{ width: `${stage.percentage}%`, backgroundColor: stage.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <SectorPerformanceCard sectorPerformance={sectorPerformance} />
          </TabsContent>

          <TabsContent value="ventures" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <VentureGrowthChart data={performanceTrends} />
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Geographic Distribution</CardTitle>
                  <CardDescription>Venture distribution across regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.ventures.reduce((acc: any[], venture) => {
                      const country = venture.location?.split(',')[1]?.trim() || 'Unknown'
                      const existing = acc.find(item => item.country === country)
                      if (existing) { existing.count++; existing.capital += venture.fundingRaised || 0 }
                      else acc.push({ country, count: 1, capital: venture.fundingRaised || 0 })
                      return acc
                    }, []).sort((a, b) => b.count - a.count).slice(0, 8).map((item) => (
                      <div key={item.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gray-500" /><span className="text-sm font-medium">{item.country}</span></div>
                        <div className="text-right">
                          <span className="text-sm font-bold">{item.count} ventures</span>
                          <p className="text-xs text-gray-500">${(item.capital / 1000000).toFixed(1)}M capital</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gedsi" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>GEDSI Category Performance</CardTitle>
                  <CardDescription>Completion rates by GEDSI category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gedsiCategoryPerformance.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{category.completed}/{category.total}</span>
                            <Badge variant="outline" className="text-xs">{category.completionRate}%</Badge>
                          </div>
                        </div>
                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${category.completionRate}%`, backgroundColor: category.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <GedsiComplianceTrendsChart data={performanceTrends} />
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <UserGrowthChart data={performanceTrends} />
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>User activity and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-blue-600" /><span className="text-sm font-medium">Daily Active Users</span></div>
                      <span className="text-lg font-bold text-blue-600">{data.users.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-green-600" /><span className="text-sm font-medium">Avg Session Duration</span></div>
                      <span className="text-lg font-bold text-green-600">{data.users.length > 0 ? '15m' : '0m'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2"><Target className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium">Feature Adoption</span></div>
                      <span className="text-lg font-bold text-purple-600">{data.ventures.length > 0 ? Math.round((data.ventures.filter(v => v.gedsiMetrics?.length > 0).length / data.ventures.length) * 100) : 0}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-orange-600" /><span className="text-sm font-medium">Return Rate</span></div>
                      <span className="text-lg font-bold text-orange-600">{data.users.length > 0 ? Math.round((data.users.filter(u => u.updatedAt !== u.createdAt).length / data.users.length) * 100) : 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-blue-600" />AI-Powered Insights</CardTitle>
                  <CardDescription>Intelligent recommendations based on your data</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.ventures.length === 0 ? (
                    <div className="text-center py-8">
                      <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
                      <p className="text-muted-foreground mb-4">Add ventures to the pipeline to generate AI-powered insights and recommendations.</p>
                      <Button onClick={() => window.location.href = '/dashboard/venture-intake'}><Plus className="h-4 w-4 mr-2" />Add First Venture</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {generateAIInsights(data).map((insight, index) => (
                        <div key={index} className={`p-4 bg-white/60 rounded-lg border-l-4 ${insight.borderColor}`}>
                          <div className="flex items-start gap-3">
                            <insight.icon className={`h-5 w-5 ${insight.iconColor} mt-0.5`} />
                            <div>
                              <h4 className={`font-medium ${insight.textColor}`}>{insight.title}</h4>
                              <p className={`text-sm ${insight.descriptionColor}`}>{insight.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-purple-600" />Predictive Analytics</CardTitle>
                  <CardDescription>Forecasts and predictions based on current trends</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.ventures.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Predictive Data Available</h3>
                      <p className="text-muted-foreground mb-4">Add ventures to generate forecasts and trend predictions.</p>
                      <Button onClick={() => window.location.href = '/dashboard/venture-intake'}><Plus className="h-4 w-4 mr-2" />Add First Venture</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-white/60 rounded-lg">
                        <h4 className="font-medium mb-3">Next Month Forecast</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">New Ventures</p>
                            <p className="text-2xl font-bold text-purple-600">{Math.max(1, Math.round(data.ventures.length * 0.3))}</p>
                            <p className="text-xs text-muted-foreground">Based on current pipeline</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Funding Events</p>
                            <p className="text-2xl font-bold text-purple-600">{Math.max(0, Math.round(data.ventures.filter(v => ['DUE_DILIGENCE', 'INVESTMENT_READY'].includes(v.stage)).length * 0.6))}</p>
                            <p className="text-xs text-muted-foreground">Ready for funding</p>
                          </div>
                        </div>
                      </div>
                      {generateRiskAssessment(data).map((risk, index) => (
                        <div key={index} className="p-4 bg-white/60 rounded-lg">
                          <h4 className="font-medium mb-3">{risk.title}</h4>
                          <div className="space-y-2">
                            {risk.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center justify-between">
                                <span className="text-sm">{item.label}</span>
                                <Badge variant="outline" className={item.badgeClass}>{item.value}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {generateOptimizationOpportunities(data).length > 0 && (
                        <div className="p-4 bg-white/60 rounded-lg">
                          <h4 className="font-medium mb-3">Optimization Opportunities</h4>
                          <div className="space-y-2">
                            {generateOptimizationOpportunities(data).map((opportunity, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Target className="h-3 w-3 text-blue-600" />
                                <span>{opportunity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-blue-600" />Advanced Analytics & Reporting</CardTitle>
            <CardDescription>Unlock deeper insights with custom reports, predictive models, and advanced visualizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-16 flex flex-col items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700"><Download className="h-5 w-5" /><span className="text-sm">Custom Report</span></Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1"><Lightbulb className="h-5 w-5" /><span className="text-sm">AI Insights</span></Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1"><Share className="h-5 w-5" /><span className="text-sm">Share Dashboard</span></Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1"><Settings className="h-5 w-5" /><span className="text-sm">Configure</span></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}