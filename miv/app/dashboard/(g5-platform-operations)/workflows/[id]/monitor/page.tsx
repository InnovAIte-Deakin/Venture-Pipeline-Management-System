"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft,
  Play, 
  RefreshCw, 
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Activity,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Eye,
  Download,
  Filter
} from "lucide-react"

interface WorkflowRun {
  id: string
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED'
  input: any
  output: any
  errorMessage?: string
  startedAt: string
  finishedAt?: string
  workflow: {
    name: string
  }
}

interface Workflow {
  id: string
  name: string
  description?: string
  isActive: boolean
  definition: any
}

export default function WorkflowMonitorPage() {
  const params = useParams()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [workflowRes, runsRes] = await Promise.all([
        fetch(`/api/workflows/${params.id}`),
        fetch(`/api/workflows/${params.id}/runs?limit=100`)
      ])
      
      if (workflowRes.ok) {
        const workflowData = await workflowRes.json()
        setWorkflow(workflowData)
      }
      
      if (runsRes.ok) {
        const runsData = await runsRes.json()
        setRuns(runsData.results || [])
      }
    } catch (error) {
      console.error('Error loading workflow monitoring data:', error)
    }
    setLoading(false)
  }

  const runWorkflow = async () => {
    try {
      const res = await fetch('/api/workflows/run', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ workflowId: params.id }) 
      })
      
      if (res.ok) {
        alert('Workflow run started!')
        load() // Reload to get updated data
      } else {
        alert('Failed to start workflow run')
      }
    } catch (error) {
      console.error('Error running workflow:', error)
      alert('Failed to start workflow run')
    }
  }

  const getRunStats = () => {
    const total = runs.length
    const succeeded = runs.filter(r => r.status === 'SUCCEEDED').length
    const failed = runs.filter(r => r.status === 'FAILED').length
    const running = runs.filter(r => r.status === 'RUNNING').length
    const successRate = total > 0 ? Math.round((succeeded / total) * 100) : 0
    
    // Calculate average duration for completed runs
    const completedRuns = runs.filter(r => r.finishedAt)
    const avgDuration = completedRuns.length > 0 
      ? completedRuns.reduce((sum, run) => {
          const duration = new Date(run.finishedAt!).getTime() - new Date(run.startedAt).getTime()
          return sum + duration
        }, 0) / completedRuns.length
      : 0

    return { total, succeeded, failed, running, successRate, avgDuration }
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${Math.round(ms / 1000)}s`
    return `${Math.round(ms / 60000)}m`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'RUNNING':
        return <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'text-green-600 bg-green-50'
      case 'FAILED':
        return 'text-red-600 bg-red-50'
      case 'RUNNING':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  useEffect(() => { 
    if (params.id) load() 
  }, [params.id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )

  if (!workflow) return (
    <div className="text-center py-12">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Workflow Not Found</h2>
      <p className="text-gray-600">The workflow you're looking for doesn't exist or has been deleted.</p>
    </div>
  )

  const stats = getRunStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/workflows">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workflows
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
            <p className="text-gray-600">Workflow Monitoring & Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={workflow.isActive ? "default" : "secondary"}>
            {workflow.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button variant="outline" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={runWorkflow} disabled={!workflow.isActive}>
            <Play className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Runs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Succeeded</p>
                <p className="text-2xl font-bold">{stats.succeeded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Run History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Run History</span>
                <Badge variant="outline">{runs.length} runs</Badge>
              </CardTitle>
              <CardDescription>Recent workflow executions</CardDescription>
            </CardHeader>
            <CardContent>
              {runs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-8 w-8 mx-auto mb-2" />
                  <p>No runs yet</p>
                  <p className="text-sm">Execute the workflow to see run history</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {runs.slice(0, 20).map((run) => {
                    const duration = run.finishedAt 
                      ? new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()
                      : 0
                    
                    return (
                      <div 
                        key={run.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRun?.id === run.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedRun(run)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(run.status)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Run #{run.id.slice(-8)}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getStatusColor(run.status)}`}
                                >
                                  {run.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(run.startedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            {run.finishedAt && (
                              <p>Duration: {formatDuration(duration)}</p>
                            )}
                            {run.status === 'RUNNING' && (
                              <p>Running...</p>
                            )}
                          </div>
                        </div>
                        {run.errorMessage && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            Error: {run.errorMessage}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Run Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Run Details</CardTitle>
              <CardDescription>
                {selectedRun ? `Run #${selectedRun.id.slice(-8)}` : 'Select a run to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRun ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="input">Input</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(selectedRun.status)}
                          <Badge className={getStatusColor(selectedRun.status)}>
                            {selectedRun.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Started</label>
                        <p className="text-sm mt-1">{new Date(selectedRun.startedAt).toLocaleString()}</p>
                      </div>
                      
                      {selectedRun.finishedAt && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Finished</label>
                          <p className="text-sm mt-1">{new Date(selectedRun.finishedAt).toLocaleString()}</p>
                        </div>
                      )}
                      
                      {selectedRun.finishedAt && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Duration</label>
                          <p className="text-sm mt-1">
                            {formatDuration(
                              new Date(selectedRun.finishedAt).getTime() - new Date(selectedRun.startedAt).getTime()
                            )}
                          </p>
                        </div>
                      )}
                      
                      {selectedRun.errorMessage && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Error</label>
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-1">
                            {selectedRun.errorMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="input">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Input Data</label>
                      <pre className="text-xs bg-gray-50 p-3 rounded mt-2 overflow-auto max-h-64">
                        {JSON.stringify(selectedRun.input || {}, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="output">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Output Data</label>
                      <pre className="text-xs bg-gray-50 p-3 rounded mt-2 overflow-auto max-h-64">
                        {JSON.stringify(selectedRun.output || {}, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-8 w-8 mx-auto mb-2" />
                  <p>Select a run from the history</p>
                  <p className="text-sm">to view detailed information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
