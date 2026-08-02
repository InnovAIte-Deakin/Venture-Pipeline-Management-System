 "use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Play, 
  Settings, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Zap,
  Building2,
  UserCheck,
  Bell,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Webhook,
  Calendar,
  Target,
  Globe,
  RefreshCw,
  Eye,
  Edit,
  BarChart3
} from "lucide-react"

interface WorkflowDashboardTabProps {
  loading: boolean
  addToast: (toast: { type: string; title: string; description: string }) => void
}

interface Workflow {
  id: string
  name: string
  description?: string
  isActive: boolean
  definition?: any
  updatedAt: string
  _count?: {
    runs: number
  }
}

interface WorkflowRun {
  id: string
  workflowId: string
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED'
  startedAt: string
  finishedAt?: string
  workflow: {
    name: string
  }
}

const WORKFLOW_TEMPLATES = [
  {
    id: "venture-onboarding",
    name: "Venture Onboarding",
    description: "Automate new venture intake and initial assessment",
    icon: <Building2 className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700",
    category: "Venture Management",
    estimatedTime: "5 min setup",
    triggers: ["Venture Created"],
    actions: 4
  },
  {
    id: "gedsi-monitoring",
    name: "GEDSI Compliance",
    description: "Monitor GEDSI metrics and send compliance alerts", 
    icon: <UserCheck className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700",
    category: "Compliance",
    estimatedTime: "3 min setup",
    triggers: ["Schedule", "Metric Updated"],
    actions: 3
  },
  {
    id: "due-diligence",
    name: "Due Diligence Automation",
    description: "Create comprehensive DD checklists and track completion",
    icon: <CheckCircle className="h-5 w-5" />,
    color: "bg-green-100 text-green-700", 
    category: "Due Diligence",
    estimatedTime: "7 min setup",
    triggers: ["Stage Changed"],
    actions: 5
  },
  {
    id: "investment-pipeline",
    name: "Investment Pipeline",
    description: "Track ventures through investment stages automatically",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-700",
    category: "Investment",
    estimatedTime: "4 min setup", 
    triggers: ["Stage Changed", "Manual"],
    actions: 4
  },
  {
    id: "monthly-reports",
    name: "Monthly Reports",
    description: "Generate and distribute impact reports automatically",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-indigo-100 text-indigo-700",
    category: "Reporting",
    estimatedTime: "6 min setup",
    triggers: ["Schedule"],
    actions: 4
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment",
    description: "Automated risk analysis and mitigation planning",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "bg-red-100 text-red-700",
    category: "Risk Management", 
    estimatedTime: "8 min setup",
    triggers: ["Manual", "Schedule"],
    actions: 5
  }
]

export function WorkflowDashboardTab({ loading, addToast }: WorkflowDashboardTabProps) {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [recentRuns, setRecentRuns] = useState<WorkflowRun[]>([])
  const [workflowStats, setWorkflowStats] = useState({
    total: 0,
    active: 0,
    totalRuns: 0,
    successRate: 0
  })
  const [loadingWorkflows, setLoadingWorkflows] = useState(true)

  const loadWorkflowData = async () => {
    setLoadingWorkflows(true)
    try {
      const [workflowsRes, runsRes] = await Promise.all([
        fetch('/api/workflows?limit=10'),
        fetch('/api/workflows/runs/recent?limit=10').catch(() => ({ 
          ok: false,
          json: async () => ({ results: [] })
        }))
      ])

      if (workflowsRes.ok) {
        const workflowsData = await workflowsRes.json()
        const workflowsList = workflowsData.results || []
        setWorkflows(workflowsList)

        // Calculate stats
        const total = workflowsList.length
        const active = workflowsList.filter((w: Workflow) => w.isActive).length
        setWorkflowStats(prev => ({ ...prev, total, active }))
      }

      if (runsRes.ok) {
        const runsData = await runsRes.json()
        const runsList = runsData.results || []
        setRecentRuns(runsList)

        // Calculate run stats
        const totalRuns = runsList.length
        const successfulRuns = runsList.filter((r: WorkflowRun) => r.status === 'SUCCEEDED').length
        const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0
        setWorkflowStats(prev => ({ ...prev, totalRuns, successRate }))
      }
    } catch (error) {
      console.error('Error loading workflow data:', error)
    }
    setLoadingWorkflows(false)
  }

  const runWorkflow = async (workflowId: string) => {
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId })
      })

      if (res.ok) {
        addToast({
          type: "success",
          title: "Workflow Started",
          description: "Workflow execution has been initiated successfully"
        })
        loadWorkflowData() // Refresh data
      } else {
        addToast({
          type: "error", 
          title: "Execution Failed",
          description: "Failed to start workflow execution"
        })
      }
    } catch (error) {
      console.error('Error running workflow:', error)
      addToast({
        type: "error",
        title: "Execution Error", 
        description: "An error occurred while starting the workflow"
      })
    }
  }

  const createWorkflowFromTemplate = (templateId: string) => {
    router.push(`/dashboard/workflows/wizard?template=${templateId}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-3 w-3 text-red-500" />
      case 'RUNNING':
        return <RotateCcw className="h-3 w-3 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  useEffect(() => {
    loadWorkflowData()
  }, [])

  if (loading || loadingWorkflows) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading workflow automation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Automation</h2>
          <p className="text-gray-600">Automate processes and streamline operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/workflows">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/workflows/wizard">
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold">{workflowStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{workflowStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Runs</p>
                <p className="text-2xl font-bold">{workflowStats.totalRuns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{workflowStats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common workflow operations and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-1"
              asChild
            >
              <Link href="/dashboard/workflows/wizard">
                <Plus className="h-5 w-5" />
                <span className="text-sm">New Workflow</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-1"
              asChild
            >
              <Link href="/dashboard/workflows">
                <Settings className="h-5 w-5" />
                <span className="text-sm">Manage All</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-1"
              onClick={() => {
                router.push('/dashboard/workflows/wizard?template=venture-onboarding')
              }}
            >
              <Building2 className="h-5 w-5" />
              <span className="text-sm">Quick Setup</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-1"
              onClick={loadWorkflowData}
            >
              <RefreshCw className="h-5 w-5" />
              <span className="text-sm">Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Workflows</span>
              <Badge variant="outline">{workflows.filter(w => w.isActive).length} active</Badge>
            </CardTitle>
            <CardDescription>Currently running automation workflows</CardDescription>
          </CardHeader>
          <CardContent>
            {workflows.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">No workflows created yet</p>
                <Button size="sm" asChild>
                  <Link href="/dashboard/workflows/wizard">
                    <Plus className="h-4 w-4 mr-1" />
                    Create First Workflow
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {workflows.slice(0, 5).map((workflow) => {
                  const triggerType = workflow.definition?.trigger?.type || 'manual'
                  const stepCount = workflow.definition?.steps?.length || 0
                  
                  return (
                    <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          workflow.isActive ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {workflow.isActive ? (
                            <Activity className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{workflow.name}</p>
                          <p className="text-xs text-gray-600">
                            {triggerType} • {stepCount} steps
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={workflow.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {workflow.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => runWorkflow(workflow.id)}
                          disabled={!workflow.isActive}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/dashboard/workflows/${workflow.id}/builder`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {workflows.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/workflows">
                        View all {workflows.length} workflows
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Badge variant="outline">{recentRuns.length} recent runs</Badge>
            </CardTitle>
            <CardDescription>Latest workflow execution results</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRuns.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRuns.slice(0, 5).map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(run.status)}
                      <div>
                        <p className="font-medium text-sm">{run.workflow.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(run.startedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        run.status === 'SUCCEEDED' ? 'text-green-600 bg-green-50' :
                        run.status === 'FAILED' ? 'text-red-600 bg-red-50' :
                        run.status === 'RUNNING' ? 'text-blue-600 bg-blue-50' :
                        'text-gray-600 bg-gray-50'
                      }`}
                    >
                      {run.status}
                    </Badge>
                  </div>
                ))}
                {recentRuns.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/workflows">
                        View all activity
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>Pre-built automation templates for common venture management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKFLOW_TEMPLATES.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.color}`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                        <span className="text-xs text-gray-500">{template.estimatedTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <span>{template.actions} actions</span>
                        <span>{template.triggers.join(', ')}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => createWorkflowFromTemplate(template.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center pt-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/workflows/wizard">
                <Zap className="h-4 w-4 mr-2" />
                Browse All Templates
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Automation Impact</CardTitle>
            <CardDescription>How workflows are improving efficiency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Process Automation</span>
              <span className="text-sm text-gray-600">85%</span>
            </div>
            <Progress value={85} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Time Saved</span>
              <span className="text-sm text-gray-600">12 hrs/week</span>
            </div>
            <Progress value={75} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Reduction</span>
              <span className="text-sm text-gray-600">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Status</CardTitle>
            <CardDescription>Connected services and platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Email Service</span>
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Slack Integration</span>
              </div>
              <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Calendar API</span>
              </div>
              <Badge variant="outline" className="text-gray-600 bg-gray-50">Not Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Workflows */}
      {workflows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Used Workflows</CardTitle>
            <CardDescription>Your most frequently executed automation workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflows.slice(0, 3).map((workflow, index) => (
                <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{workflow.name}</p>
                      <p className="text-xs text-gray-600">
                        {workflow._count?.runs || 0} executions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => runWorkflow(workflow.id)}>
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/dashboard/workflows/${workflow.id}/monitor`}>
                        <Activity className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Automation Trends</CardTitle>
            <CardDescription>Workflow execution patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="text-sm font-medium">+23% executions</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most Active</span>
                <span className="text-sm font-medium">GEDSI Monitoring</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak Hours</span>
                <span className="text-sm font-medium">9AM - 11AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Duration</span>
                <span className="text-sm font-medium">2.3 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
            <CardDescription>Workflow system performance and reliability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Queue Status</span>
                <span className="text-sm font-medium">0 pending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Maintenance</span>
                <span className="text-sm font-medium">2 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium">99.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
