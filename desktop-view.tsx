"use client"

import { OverviewCards } from "../components/overview-cards"
import { FiltersBar } from "../components/filters-bar"
import { AddMetricForm } from "../components/modals/add-metric-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Plus, Download, Sparkles, TrendingUp, CheckCircle, Clock, AlertCircle, Shield, Info, Lightbulb, Eye } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

export function DesktopView({ data }: { data: any }) {
  const {
    metrics, ventures, loading, selectedVenture, setSelectedVenture,
    selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus,
    showAddMetric, setShowAddMetric, isExporting, exportData,
    filteredMetrics, overviewStats, categoryStats, venturePerformance, handleAddMetric
  } = data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="h-4 w-4" />
      case 'In Progress': return <Clock className="h-4 w-4" />
      case 'Overdue': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div className="space-y-6 animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            GEDSI Intelligence Hub (Desktop)
          </h1>
          <p className="text-muted-foreground">AI-powered GEDSI tracking with UN standards</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportData} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'UN Standards Report'}
          </Button>
          <Dialog open={showAddMetric} onOpenChange={setShowAddMetric}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Metric</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add GEDSI Metric</DialogTitle>
                <DialogDescription>Add a new GEDSI metric for tracking venture impact</DialogDescription>
              </DialogHeader>
              <AddMetricForm onSubmit={handleAddMetric} ventures={ventures} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <OverviewCards metrics={metrics} />

      <FiltersBar 
        ventures={ventures}
        selectedVenture={selectedVenture} setSelectedVenture={setSelectedVenture}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
      />

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Metrics Overview</TabsTrigger>
          <TabsTrigger value="ventures">Venture Performance</TabsTrigger>
          <TabsTrigger value="washington-group">Washington Group</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="metrics">
          <Card>
            <CardHeader><CardTitle>Metrics by Venture</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Venture Name</TableHead>
                    <TableHead>Metric Code</TableHead>
                    <TableHead>Target Value</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMetrics.map((metric: any) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.ventureName}</TableCell>
                      <TableCell>
                        <div className="font-medium">{metric.metricCode}</div>
                        <div className="text-sm text-slate-500">{metric.metricName}</div>
                      </TableCell>
                      <TableCell>{metric.targetValue} {metric.unit}</TableCell>
                      <TableCell>{metric.currentValue} {metric.unit}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(metric.status)}>
                          {getStatusIcon(metric.status)}
                          <span className="ml-1">{metric.status}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ventures">
          <Card>
            <CardHeader><CardTitle>Venture Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venturePerformance.map((venture: any) => (
                  <div key={venture.ventureId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{venture.ventureName}</h4>
                      <p className="text-sm text-gray-500">{venture.verifiedMetrics} of {venture.totalMetrics} verified</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress value={venture.completionRate} className="w-24" />
                      <span className="text-sm font-medium">{venture.completionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="washington-group">
          <Card>
            <CardHeader><CardTitle>Washington Group Short Set</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">CRPD Article 31 Framework integrated.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader><CardTitle>Analytics & Charts</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completionRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}