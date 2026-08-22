// app/dashboard/(g1-impact-analytics)/performance-analytics/components/mobile/performance-analytics-mobile.tsx
//
// T19 - Refactor and Improve Performance Analytics
// Mobile layout - deliberately restructured, not a shrunk copy of desktop:
// single-column stacking, compact header, 2-column KPI grid, larger tap
// targets, icon-first scrollable tabs, secondary actions tucked into a menu.

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download, Users, BarChart3, Lightbulb, RefreshCw, Target, Activity,
  Building2, UserCheck, ArrowRight, Eye, Globe, Plus, TrendingUp, MoreVertical, MapPin,
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

interface PerformanceAnalyticsMobileProps {
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

export function PerformanceAnalyticsMobile({
  data, selectedPeriod, setSelectedPeriod, realTimeEnabled, setRealTimeEnabled,
  loadAnalyticsData, kpiMetrics, conversionFunnelData, performanceTrends,
  sectorPerformance, gedsiCategoryPerformance,
}: PerformanceAnalyticsMobileProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-4 space-y-4">
        {/* Compact header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Venture &amp; platform metrics</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={loadAnalyticsData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={realTimeEnabled ? "default" : "outline"}
              size="sm"
              className="h-10 flex-1"
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            >
              <Activity className="h-4 w-4 mr-1" />
              {realTimeEnabled ? "Live" : "Static"}
            </Button>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="h-10 flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 2-column compact KPI grid */}
        <KpiMetricsGrid metrics={kpiMetrics} gridClassName="grid grid-cols-2 gap-3" />

        {/* Icon-first scrollable tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full gap-1 overflow-x-auto bg-white/80 dark:bg-gray-800/80 shadow rounded-lg p-1">
            <TabsTrigger value="overview" className="flex-shrink-0 h-11 px-3"><BarChart3 className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="ventures" className="flex-shrink-0 h-11 px-3"><Building2 className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="gedsi" className="flex-shrink-0 h-11 px-3"><UserCheck className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="users" className="flex-shrink-0 h-11 px-3"><Users className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="insights" className="flex-shrink-0 h-11 px-3"><Lightbulb className="h-4 w-4" /></TabsTrigger>
          </TabsList>
          <p className="text-xs text-gray-500 text-center capitalize">{activeTab}</p>

          <TabsContent value="overview" className="space-y-4 mt-3">
            <PerformanceTrendsChart data={performanceTrends} />
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base"><ArrowRight className="h-4 w-4" />Venture Pipeline Funnel</CardTitle>
                <CardDescription className="text-xs">Conversion rates and drop-off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversionFunnelData.map((stage) => (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{stage.stage}</span>
                        <span className="text-xs text-gray-600">{stage.count} &middot; {stage.percentage}%</span>
                      </div>
                      <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="h-full rounded-lg transition-all duration-500" style={{ width: `${stage.percentage}%`, backgroundColor: stage.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <SectorPerformanceCard sectorPerformance={sectorPerformance} />
          </TabsContent>

          <TabsContent value="ventures" className="space-y-4 mt-3">
            <VentureGrowthChart data={performanceTrends} />
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base"><Globe className="h-4 w-4" />Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.ventures.reduce((acc: any[], venture) => {
                    const country = venture.location?.split(',')[1]?.trim() || 'Unknown'
                    const existing = acc.find(item => item.country === country)
                    if (existing) { existing.count++; existing.capital += venture.fundingRaised || 0 }
                    else acc.push({ country, count: 1, capital: venture.fundingRaised || 0 })
                    return acc
                  }, []).sort((a, b) => b.count - a.count).slice(0, 8).map((item) => (
                    <div key={item.country} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gray-500" /><span className="text-xs font-medium">{item.country}</span></div>
                      <span className="text-xs font-bold">{item.count} &middot; ${(item.capital / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gedsi" className="space-y-4 mt-3">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">GEDSI Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gedsiCategoryPerformance.map((category) => (
                    <div key={category.category} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{category.category}</span>
                        <span className="text-xs text-gray-600">{category.completed}/{category.total} &middot; {category.completionRate}%</span>
                      </div>
                      <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${category.completionRate}%`, backgroundColor: category.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <GedsiComplianceTrendsChart data={performanceTrends} />
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-3">
            <UserGrowthChart data={performanceTrends} />
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base">User Engagement</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-blue-600" /><span className="text-xs font-medium">Daily Active Users</span></div>
                    <span className="text-base font-bold text-blue-600">{data.users.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-green-600" /><span className="text-xs font-medium">Avg Session</span></div>
                    <span className="text-base font-bold text-green-600">{data.users.length > 0 ? '15m' : '0m'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2"><Target className="h-4 w-4 text-purple-600" /><span className="text-xs font-medium">Feature Adoption</span></div>
                    <span className="text-base font-bold text-purple-600">{data.ventures.length > 0 ? Math.round((data.ventures.filter(v => v.gedsiMetrics?.length > 0).length / data.ventures.length) * 100) : 0}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-orange-600" /><span className="text-xs font-medium">Return Rate</span></div>
                    <span className="text-base font-bold text-orange-600">{data.users.length > 0 ? Math.round((data.users.filter(u => u.updatedAt !== u.createdAt).length / data.users.length) * 100) : 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-3">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base"><Lightbulb className="h-4 w-4 text-blue-600" />AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {data.ventures.length === 0 ? (
                  <div className="text-center py-6">
                    <Lightbulb className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Add ventures to generate insights.</p>
                    <Button size="sm" className="h-10" onClick={() => window.location.href = '/dashboard/venture-intake'}><Plus className="h-4 w-4 mr-2" />Add Venture</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generateAIInsights(data).map((insight, index) => (
                      <div key={index} className={`p-3 bg-white/60 rounded-lg border-l-4 ${insight.borderColor}`}>
                        <div className="flex items-start gap-2">
                          <insight.icon className={`h-4 w-4 ${insight.iconColor} mt-0.5 flex-shrink-0`} />
                          <div>
                            <h4 className={`text-sm font-medium ${insight.textColor}`}>{insight.title}</h4>
                            <p className={`text-xs ${insight.descriptionColor}`}>{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-purple-600" />Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {data.ventures.length === 0 ? (
                  <div className="text-center py-6">
                    <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Add ventures to generate forecasts.</p>
                    <Button size="sm" className="h-10" onClick={() => window.location.href = '/dashboard/venture-intake'}><Plus className="h-4 w-4 mr-2" />Add Venture</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2.5 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600">New Ventures</p>
                        <p className="text-xl font-bold text-purple-600">{Math.max(1, Math.round(data.ventures.length * 0.3))}</p>
                      </div>
                      <div className="text-center p-2.5 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600">Funding Events</p>
                        <p className="text-xl font-bold text-purple-600">{Math.max(0, Math.round(data.ventures.filter(v => ['DUE_DILIGENCE', 'INVESTMENT_READY'].includes(v.stage)).length * 0.6))}</p>
                      </div>
                    </div>
                    {generateRiskAssessment(data).map((risk, index) => (
                      <div key={index} className="p-3 bg-white/60 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">{risk.title}</h4>
                        <div className="space-y-1.5">
                          {risk.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between">
                              <span className="text-xs">{item.label}</span>
                              <Badge variant="outline" className={`text-xs ${item.badgeClass}`}>{item.value}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {generateOptimizationOpportunities(data).length > 0 && (
                      <div className="p-3 bg-white/60 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Optimization Opportunities</h4>
                        <div className="space-y-1.5">
                          {generateOptimizationOpportunities(data).map((opportunity, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs">
                              <Target className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}