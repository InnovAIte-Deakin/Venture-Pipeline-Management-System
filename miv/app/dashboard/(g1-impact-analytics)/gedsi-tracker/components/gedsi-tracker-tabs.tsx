"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Eye, Info, Plus, Shield } from "lucide-react"
import { CHART_COLORS, WASHINGTON_GROUP_QUESTIONS, WASHINGTON_GROUP_RESPONSES } from "../constants/gedsi-tracker.constants"
import { getStatusColor, getStatusIcon } from "../lib/gedsi-tracker-utils"
import type { GEDSIMetric, GedsiTrackerState } from "../types/gedsi-tracker.types"

export function GedsiTrackerTabs({ state }: { state: GedsiTrackerState }) {
  return (
    <Tabs defaultValue="metrics" className="space-y-6">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">
        <TabsTrigger value="metrics" className="whitespace-normal text-xs sm:text-sm">
          Metrics Overview
        </TabsTrigger>
        <TabsTrigger value="ventures" className="whitespace-normal text-xs sm:text-sm">
          Venture Performance
        </TabsTrigger>
        <TabsTrigger value="washington-group" className="whitespace-normal text-xs sm:text-sm">
          Washington Group
        </TabsTrigger>
        <TabsTrigger value="analytics" className="whitespace-normal text-xs sm:text-sm">
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="metrics" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Metrics by Venture</CardTitle>
            <CardDescription>Detailed view of all GEDSI metrics and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:hidden">
              {state.filteredMetrics.map((metric) => (
                <MobileMetricCard key={metric.id} metric={metric} />
              ))}
            </div>

            <Table className="hidden md:table">
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
                {state.filteredMetrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell className="font-medium">{metric.ventureName}</TableCell>
                    <TableCell>
                      <div className="font-medium">{metric.metricCode}</div>
                      <div className="text-sm text-slate-500">{metric.metricName}</div>
                    </TableCell>
                    <TableCell>
                      {metric.targetValue} {metric.unit}
                    </TableCell>
                    <TableCell>
                      {metric.currentValue} {metric.unit}
                    </TableCell>
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

      <TabsContent value="ventures" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Venture Performance</CardTitle>
            <CardDescription>GEDSI metric completion rates by venture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.venturePerformance.map((venture) => (
                <div
                  key={venture.ventureId}
                  className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{venture.ventureName}</h4>
                    <p className="text-sm text-gray-500">
                      {venture.verifiedMetrics} of {venture.totalMetrics} metrics verified
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:space-x-4">
                    <Progress value={venture.completionRate} className="min-w-0 flex-1 md:w-24 md:flex-none" />
                    <span className="text-sm font-medium">{venture.completionRate.toFixed(1)}%</span>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="washington-group" className="space-y-6">
        <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Washington Group Short Set
              </span>
            </CardTitle>
            <CardDescription>
              UN-standardized questions for identifying persons with disabilities (CRPD Article 31)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  The Washington Group Short Set provides internationally comparable disability data following UN
                  Convention on the Rights of Persons with Disabilities standards.
                </AlertDescription>
              </Alert>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Six Core Questions</h4>
                  {WASHINGTON_GROUP_QUESTIONS.map((question, index) => (
                    <div key={question} className="rounded-lg border bg-white/80 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Question {index + 1}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          UN Standard
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm font-medium">{question}</p>
                      <div className="flex flex-wrap gap-1">
                        {WASHINGTON_GROUP_RESPONSES.map((option) => (
                          <Badge key={option} variant="outline" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Implementation Status</h4>
                  <div className="space-y-3">
                    <ImplementationProgress
                      label="Venture Implementation"
                      badge={state.ventures.filter((venture) => venture.washingtonShortSet).length > 0 ? "Active" : "Pending"}
                      badgeClass={
                        state.ventures.filter((venture) => venture.washingtonShortSet).length > 0
                          ? "bg-green-600 text-white"
                          : "bg-yellow-600 text-white"
                      }
                      value={
                        state.ventures.length > 0
                          ? (state.ventures.filter((venture) => venture.washingtonShortSet).length / state.ventures.length) * 100
                          : 0
                      }
                      description={`${
                        state.ventures.length > 0
                          ? Math.round(
                              (state.ventures.filter((venture) => venture.washingtonShortSet).length / state.ventures.length) * 100,
                            )
                          : 0
                      }% of ventures collecting WG-SS data`}
                    />
                    <ImplementationProgress
                      label="Data Quality"
                      badge="High"
                      badgeClass="bg-green-600 text-white"
                      value={85}
                      description="85% data completeness rate across implemented ventures"
                    />
                    <ImplementationProgress
                      label="UN Compliance"
                      badge="Compliant"
                      badgeClass="bg-blue-600 text-white"
                      value={100}
                      description="Fully aligned with CRPD Article 31 requirements"
                    />
                  </div>

                  <Button className="w-full bg-black text-white hover:bg-neutral-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Implement WG-SS Assessment
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Progress Charts</CardTitle>
            <CardDescription>Visual representation of GEDSI progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h4 className="mb-4 font-semibold">Category Performance</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={state.categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completionRate" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Status Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Verified", value: state.overviewStats.verified },
                        { name: "In Progress", value: state.overviewStats.inProgress },
                        { name: "Overdue", value: state.overviewStats.overdue },
                        {
                          name: "Not Started",
                          value:
                            state.overviewStats.total -
                            state.overviewStats.verified -
                            state.overviewStats.inProgress -
                            state.overviewStats.overdue,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      dataKey="value"
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                      outerRadius={80}
                    >
                      {CHART_COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function MobileMetricCard({ metric }: { metric: GEDSIMetric }) {
  const progress = metric.targetValue > 0 ? Math.round((metric.currentValue / metric.targetValue) * 100) : 0

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{metric.ventureName}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">{metric.metricCode}</p>
        </div>
        <Badge className={`${getStatusColor(metric.status)} shrink-0`}>
          {getStatusIcon(metric.status)}
          <span className="ml-1">{metric.status}</span>
        </Badge>
      </div>

      <p className="mb-4 text-sm leading-5 text-slate-700">{metric.metricName}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Current</p>
          <p className="mt-1 font-semibold text-slate-950">
            {metric.currentValue} {metric.unit}
          </p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Target</p>
          <p className="mt-1 font-semibold text-slate-950">
            {metric.targetValue} {metric.unit}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}

function ImplementationProgress({
  label,
  badge,
  badgeClass,
  value,
  description,
}: {
  label: string
  badge: string
  badgeClass: string
  value: number
  description: string
}) {
  return (
    <div className="rounded-lg border bg-white/80 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <Badge className={badgeClass}>{badge}</Badge>
      </div>
      <Progress value={value} className="mb-2 h-2" />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
