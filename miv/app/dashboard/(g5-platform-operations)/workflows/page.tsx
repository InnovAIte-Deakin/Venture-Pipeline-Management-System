"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, RefreshCw, Zap } from "lucide-react"

type Workflow = {
  id: string
  name: string
  description?: string | null
  isActive: boolean
  updatedAt: string
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/workflows?limit=50')
      const json = await res.json()
      setWorkflows(json.results || [])
    } catch (error) {
      console.error('Error loading workflows:', error)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflow Automation</h1>
          <p className="text-gray-600">Design, build, and manage automated workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/workflows/wizard">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </Link>
          <Button variant="outline" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : workflows.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows yet</h3>
            <p className="text-gray-600 mb-4">Create your first workflow to automate venture management processes</p>
            <Link href="/dashboard/workflows/wizard">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {workflows.map(workflow => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{workflow.name}</CardTitle>
                    {workflow.description && (
                      <CardDescription className="line-clamp-2">
                        {workflow.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={workflow.isActive ? "default" : "secondary"}>
                    {workflow.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={async () => {
                        await fetch('/api/workflows/run', { 
                          method: 'POST', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify({ workflowId: workflow.id }) 
                        })
                        alert('Workflow run started!')
                      }}
                      disabled={!workflow.isActive}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/workflows/${workflow.id}/builder`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}