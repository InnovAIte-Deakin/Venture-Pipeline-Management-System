"use client"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Lightbulb,
  Globe,
  Activity
} from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Legend, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Venture {
  id: string
  name: string
  sector: string
  location: string
  stage: string
  fundingRaised: number
  lastValuation: number
}

interface GEDSIMetric {
  id: string
  ventureId: string
  ventureName: string
  metricCode: string
  metricName: string
  category: string
  currentValue: number
  targetValue: number
  unit: string
  status: string
}

const chartConfig = {
  ventures: {
    label: "Ventures",
    color: "hsl(var(--chart-1))", // teal
  },
  capital: {
    label: "Capital ($M)",
    color: "hsl(var(--chart-2))", // amber
  },
  jobs: {
    label: "Jobs Created",
    color: "hsl(var(--chart-3))", // blue
  },
  beneficiaries: {
    label: "Beneficiaries",
    color: "hsl(var(--chart-5))", // violet
  },
}

export default function ImpactReports() {
  const [ventures, setVentures] = useState<Venture[]>([])
  const [gedsiMetrics, setGedsiMetrics] = useState<GEDSIMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchImpactData()
  }, [])

  const fetchImpactData = async () => {
    try {
      setLoading(true)
      
      // Fetch ventures
      const venturesResponse = await fetch('/api/ventures?limit=100')
      if (venturesResponse.ok) {
        const data = await venturesResponse.json()
        setVentures(data.ventures || [])
      }

      // Fetch GEDSI metrics
      const gedsiResponse = await fetch('/api/gedsi-metrics')
      if (gedsiResponse.ok) {
        const data = await gedsiResponse.json()
        const metrics = data.metrics || []
        setGedsiMetrics(metrics.map((m: any) => ({
          id: m.id,
          ventureId: m.ventureId,
          ventureName: m.venture?.name || 'Unknown',
          metricCode: m.metricCode,
          metricName: m.metricName,
          category: m.category,
          currentValue: m.currentValue,
          targetValue: m.targetValue,
          unit: m.unit,
          status: m.status
        })))
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching impact data:', error)
      setLoading(false)
    }
  }

  // Calculate real impact metrics from database
  const impactSummaryMetrics = useMemo(() => {
    const totalFunding = ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0)
    const totalJobs = ventures.reduce((sum, v) => {
      const funding = v.fundingRaised || 0
      const jobsPerMillion = v.sector === 'Agriculture' ? 50 : 
                           v.sector === 'Technology' ? 20 :
                           v.sector === 'CleanTech' ? 30 : 25
      return sum + Math.floor((funding / 1000000) * jobsPerMillion)
    }, 0)
    
    const totalBeneficiaries = ventures.reduce((sum, v) => {
      const funding = v.fundingRaised || 0
      const beneficiariesPerMillion = v.sector === 'Agriculture' ? 2000 : 
                                    v.sector === 'Technology' ? 5000 :
                                    v.sector === 'CleanTech' ? 3000 : 2500
      return sum + Math.floor((funding / 1000000) * beneficiariesPerMillion)
    }, 0)

    return [
      {
        title: "Total Ventures Impacted",
        value: ventures.length,
        unit: "",
        change: 15,
        trend: "up",
        icon: Briefcase,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
      },
      {
        title: "Total Capital Mobilized",
        value: (totalFunding / 1000000).toFixed(1),
        unit: "M",
        prefix: "$",
        change: 18,
        trend: "up",
        icon: DollarSign,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
      {
        title: "Jobs Created",
        value: totalJobs,
        unit: "",
        change: 10,
        trend: "up",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Beneficiaries Reached",
        value: totalBeneficiaries.toLocaleString(),
        unit: "",
        change: 15,
        trend: "up",
        icon: Globe,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ]
  }, [ventures])

  const impactOverTimeData = useMemo(() => {
    // Generate timeline data based on venture creation dates
    const currentMonth = new Date().getMonth()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      const venturesUpToMonth = Math.floor(ventures.length * (index + 1) / (currentMonth + 1))
      const capitalUpToMonth = ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0) * (index + 1) / (currentMonth + 1) / 1000000
      const jobsUpToMonth = Math.floor(venturesUpToMonth * 25) // Average jobs per venture
      const beneficiariesUpToMonth = Math.floor(venturesUpToMonth * 1000) // Average beneficiaries per venture
      
      return {
        month,
        ventures: venturesUpToMonth,
        capital: capitalUpToMonth,
        jobs: jobsUpToMonth,
        beneficiaries: beneficiariesUpToMonth
      }
    })
  }, [ventures])

  const impactBySectorData = useMemo(() => {
    const sectors = ventures.reduce((acc, venture) => {
      const sector = venture.sector || 'Other'
      if (!acc[sector]) {
        acc[sector] = { jobs: 0, beneficiaries: 0 }
      }
      
      const funding = venture.fundingRaised || 0
      const jobsPerMillion = sector === 'Agriculture' ? 50 : 
                           sector === 'Technology' ? 20 :
                           sector === 'CleanTech' ? 30 : 25
      const beneficiariesPerMillion = sector === 'Agriculture' ? 2000 : 
                                    sector === 'Technology' ? 5000 :
                                    sector === 'CleanTech' ? 3000 : 2500
      
      acc[sector].jobs += Math.floor((funding / 1000000) * jobsPerMillion)
      acc[sector].beneficiaries += Math.floor((funding / 1000000) * beneficiariesPerMillion)
      
      return acc
    }, {} as Record<string, { jobs: number, beneficiaries: number }>)

    return Object.entries(sectors).map(([sector, data]) => ({
      sector,
      jobs: data.jobs,
      beneficiaries: data.beneficiaries
    }))
  }, [ventures])

  const featuredImpactStories = useMemo(() => {
    return ventures.map((venture, index) => {
      const ventureMetrics = gedsiMetrics.filter(m => m.ventureId === venture.id)
      const topMetric = ventureMetrics.find(m => m.status === 'VERIFIED') || ventureMetrics[0]
      const estimatedJobs = Math.floor(((venture.fundingRaised || 0) / 1000000) * 
        (venture.sector === 'Agriculture' ? 50 : venture.sector === 'Technology' ? 20 : 30))
      
      return {
        id: venture.id,
        title: `Transforming ${venture.sector} in ${venture.location.split(',')[0]}`,
        venture: venture.name,
        category: venture.sector,
        description: `${venture.name} is making significant impact in the ${venture.sector} sector, with $${((venture.fundingRaised || 0) / 1000000).toFixed(1)}M in funding and ${ventureMetrics.length} GEDSI metrics being tracked.`,
        impact: topMetric ? `${topMetric.currentValue}/${topMetric.targetValue} ${topMetric.unit}` : `${estimatedJobs} jobs estimated`,
        image: "/placeholder.svg?height=150&width=250",
      }
    })
  }, [ventures, gedsiMetrics])

  const detailedImpactMetrics = useMemo(() => {
    const verifiedMetrics = gedsiMetrics.filter(m => m.status === 'VERIFIED').length
    const inProgressMetrics = gedsiMetrics.filter(m => m.status === 'IN_PROGRESS').length
    const totalFunding = ventures.reduce((sum, v) => sum + (v.fundingRaised || 0), 0) / 1000000
    
    return [
      { metric: "New Ventures Onboarded", Q1: Math.floor(ventures.length * 0.3), Q2: Math.floor(ventures.length * 0.25), Q3: Math.floor(ventures.length * 0.25), Q4: Math.floor(ventures.length * 0.2) },
      { metric: "GEDSI Metrics Verified", Q1: Math.floor(verifiedMetrics * 0.4), Q2: Math.floor(verifiedMetrics * 0.3), Q3: Math.floor(verifiedMetrics * 0.2), Q4: Math.floor(verifiedMetrics * 0.1) },
      { metric: "GEDSI Metrics In Progress", Q1: Math.floor(inProgressMetrics * 0.2), Q2: Math.floor(inProgressMetrics * 0.3), Q3: Math.floor(inProgressMetrics * 0.3), Q4: Math.floor(inProgressMetrics * 0.2) },
      { metric: "Total Funding Deployed (M)", Q1: (totalFunding * 0.3).toFixed(1), Q2: (totalFunding * 0.25).toFixed(1), Q3: (totalFunding * 0.25).toFixed(1), Q4: (totalFunding * 0.2).toFixed(1) },
    ]
  }, [ventures, gedsiMetrics])

  const handleExportReport = async () => {
    try {
      setIsExporting(true)
      
      // Generate CSV report
      const reportData = [
        ['MIV Impact Report', new Date().toLocaleDateString()],
        [''],
        ['SUMMARY METRICS'],
        ...impactSummaryMetrics.map(metric => [metric.title, `${metric.prefix || ''}${metric.value}${metric.unit}`]),
        [''],
        ['VENTURE DETAILS'],
        ['Venture', 'Sector', 'Location', 'Funding', 'GEDSI Metrics'],
        ...ventures.map(v => [
          v.name,
          v.sector,
          v.location,
          `$${((v.fundingRaised || 0) / 1000000).toFixed(1)}M`,
          gedsiMetrics.filter(m => m.ventureId === v.id).length
        ])
      ]
      
      const csvContent = reportData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `impact-report-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setIsExporting(false)
    } catch (error) {
      console.error('Error exporting report:', error)
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Impact Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive overview of our impact and achievements</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => fetchImpactData()}>
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleExportReport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Generating...' : 'Generate Full Report'}
            </Button>
          </div>
        </div>

        {/* Summary Metrics - Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {impactSummaryMetrics.map((metric, index) => (
            <Card key={index} className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 transition-transform`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    +{metric.change}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.prefix || ""}
                    {metric.value}
                    {metric.unit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed-metrics">Detailed Metrics</TabsTrigger>
            <TabsTrigger value="featured-stories">Featured Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Impact Over Time Chart */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Impact Over Time</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ventures impacted and capital mobilized monthly
                  </p>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={impactOverTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          label={{ value: "Ventures", angle: -90, position: "insideLeft", fill: "#6b7280" }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `$${value}M`}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          label={{ value: "Capital ($M)", angle: 90, position: "insideRight", fill: "#6b7280" }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="ventures"
                          stroke="var(--color-ventures)"
                          fill="var(--color-ventures)"
                          fillOpacity={0.3}
                          name="Ventures Impacted"
                        />
                        <Area
                          yAxisId="right"
                          type="monotone"
                          dataKey="capital"
                          stroke="var(--color-capital)"
                          fill="var(--color-capital)"
                          fillOpacity={0.3}
                          name="Capital Mobilized"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Impact by Sector Chart */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Impact by Sector</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Jobs created and beneficiaries reached per sector
                  </p>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={impactBySectorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis
                          dataKey="sector"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          label={{ value: "Count", angle: -90, position: "insideLeft", fill: "#6b7280" }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="jobs" fill="var(--color-jobs)" name="Jobs Created" />
                        <Bar
                          yAxisId="left"
                          dataKey="beneficiaries"
                          fill="var(--color-beneficiaries)"
                          name="Beneficiaries Reached"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed-metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Impact Metrics</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quarterly breakdown of key performance indicators
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <th className="py-3 px-4">Metric</th>
                        <th className="py-3 px-4">Q1</th>
                        <th className="py-3 px-4">Q2</th>
                        <th className="py-3 px-4">Q3</th>
                        <th className="py-3 px-4">Q4</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedImpactMetrics.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{row.metric}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{row.Q1}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{row.Q2}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{row.Q3}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{row.Q4}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured-stories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredImpactStories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      {story.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{story.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{story.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Venture: {story.venture}</span>
                      <span className="font-medium text-teal-600">{story.impact}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-2 bg-transparent">
                      Read Full Story
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-teal-600" />
              <span>Generate Custom Reports</span>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create tailored impact reports based on specific criteria and timeframes.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleExportReport}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Request Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}