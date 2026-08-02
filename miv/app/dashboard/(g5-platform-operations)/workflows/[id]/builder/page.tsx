"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Save, 
  Settings, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowRight, 
  Clock, 
  Webhook, 
  Mail, 
  Bell, 
  Database, 
  FileText, 
  Users, 
  Building2, 
  Target,
  MessageSquare,
  Calendar,
  Globe,
  Zap,
  Eye,
  Code,
  History,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react"

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition'
  nodeType: string
  config: any
  position: { x: number, y: number }
  connections: string[]
}

interface WorkflowDefinition {
  trigger: any
  steps: any[]
  metadata?: any
}

const NODE_TYPES = {
  trigger: [
    { value: "manual", label: "Manual Trigger", icon: <Play className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
    { value: "schedule", label: "Schedule", icon: <Clock className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
    { value: "webhook", label: "Webhook", icon: <Webhook className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
    { value: "venture_created", label: "Venture Created", icon: <Building2 className="h-4 w-4" />, color: "bg-orange-100 text-orange-700" },
    { value: "stage_changed", label: "Stage Changed", icon: <ArrowRight className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-700" }
  ],
  action: [
    { value: "send_email", label: "Send Email", icon: <Mail className="h-4 w-4" />, color: "bg-red-100 text-red-700" },
    { value: "create_notification", label: "Create Notification", icon: <Bell className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
    { value: "update_database", label: "Update Database", icon: <Database className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
    { value: "generate_document", label: "Generate Document", icon: <FileText className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
    { value: "assign_task", label: "Assign Task", icon: <Users className="h-4 w-4" />, color: "bg-orange-100 text-orange-700" },
    { value: "schedule_meeting", label: "Schedule Meeting", icon: <Calendar className="h-4 w-4" />, color: "bg-pink-100 text-pink-700" },
    { value: "webhook_call", label: "Webhook Call", icon: <Globe className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-700" }
  ],
  condition: [
    { value: "if_condition", label: "If Condition", icon: <Target className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-700" },
    { value: "delay", label: "Delay", icon: <Clock className="h-4 w-4" />, color: "bg-gray-100 text-gray-700" }
  ]
}

export default function WorkflowBuilderPage() {
  const params = useParams()
  const [workflow, setWorkflow] = useState<any>(null)
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [runs, setRuns] = useState([])
  const canvasRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [workflowRes, runsRes] = await Promise.all([
        fetch(`/api/workflows/${params.id}`),
        fetch(`/api/workflows/${params.id}/runs?limit=10`).catch(() => ({ ok: false }))
      ])
      
      if (workflowRes.ok) {
        const wf = await workflowRes.json()
        setWorkflow(wf)
        
        // Convert workflow definition to nodes
        const convertedNodes = convertDefinitionToNodes(wf.definition || { trigger: { type: 'manual' }, steps: [] })
        setNodes(convertedNodes)
      }
      
      if (runsRes.ok) {
        const runsData = await runsRes.json()
        setRuns(runsData.results || [])
      }
    } catch (error) {
      console.error('Error loading workflow:', error)
    }
    setLoading(false)
  }

  const convertDefinitionToNodes = (definition: WorkflowDefinition): WorkflowNode[] => {
    const nodes: WorkflowNode[] = []
    let yPosition = 100

    // Add trigger node
    if (definition.trigger) {
      nodes.push({
        id: 'trigger',
        type: 'trigger',
        nodeType: definition.trigger.type || 'manual',
        config: definition.trigger.config || {},
        position: { x: 100, y: yPosition },
        connections: definition.steps && definition.steps.length > 0 ? ['step-0'] : []
      })
      yPosition += 150
    }

    // Add step nodes
    if (definition.steps) {
      definition.steps.forEach((step, index) => {
        nodes.push({
          id: `step-${index}`,
          type: 'action',
          nodeType: step.type || 'send_email',
          config: step.config || {},
          position: { x: 100, y: yPosition },
          connections: index < definition.steps.length - 1 ? [`step-${index + 1}`] : []
        })
        yPosition += 150
      })
    }

    return nodes
  }

  const convertNodesToDefinition = (nodes: WorkflowNode[]): WorkflowDefinition => {
    const triggerNode = nodes.find(n => n.type === 'trigger')
    const actionNodes = nodes.filter(n => n.type === 'action').sort((a, b) => {
      const aIndex = parseInt(a.id.split('-')[1] || '0')
      const bIndex = parseInt(b.id.split('-')[1] || '0')
      return aIndex - bIndex
    })

    return {
      trigger: triggerNode ? { type: triggerNode.nodeType, config: triggerNode.config } : { type: 'manual' },
      steps: actionNodes.map(node => ({ type: node.nodeType, config: node.config })),
      metadata: {
        lastModified: new Date().toISOString(),
        nodeCount: nodes.length
      }
    }
  }

  const save = async () => {
    if (!workflow) return

    const definition = convertNodesToDefinition(nodes)
    
    try {
      const res = await fetch(`/api/workflows/${params.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          name: workflow.name, 
          description: workflow.description, 
          definition 
        }) 
      })
      
      if (res.ok) {
        alert('Workflow saved successfully!')
        load() // Reload to get updated data
      } else {
        alert('Failed to save workflow')
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      alert('Failed to save workflow')
    }
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
        load() // Reload to get updated runs
      } else {
        alert('Failed to start workflow run')
      }
    } catch (error) {
      console.error('Error running workflow:', error)
      alert('Failed to start workflow run')
    }
  }

  const addNode = (type: 'trigger' | 'action' | 'condition', nodeType: string) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      nodeType,
      config: {},
      position: { x: 300, y: 200 },
      connections: []
    }

    setNodes(prev => [...prev, newNode])
    setSelectedNode(newNode)
  }

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ))
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates })
    }
  }

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null)
    }
  }

  const duplicateNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      const newNode: WorkflowNode = {
        ...node,
        id: `${node.type}-${Date.now()}`,
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        connections: []
      }
      setNodes(prev => [...prev, newNode])
    }
  }

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    setIsDragging(true)
    setSelectedNode(node)
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - node.position.x,
        y: e.clientY - rect.top - node.position.y
      })
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedNode || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const newPosition = {
      x: Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 200)),
      y: Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 100))
    }

    updateNode(selectedNode.id, { position: newPosition })
  }, [isDragging, selectedNode, dragOffset])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

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
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Workflow Not Found</h2>
      <p className="text-gray-600">The workflow you're looking for doesn't exist or has been deleted.</p>
    </div>
  )

  const getNodeTypeInfo = (type: 'trigger' | 'action' | 'condition', nodeType: string) => {
    return NODE_TYPES[type]?.find(nt => nt.value === nodeType) || NODE_TYPES[type]?.[0]
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <h1 className="text-xl font-bold">{workflow.name}</h1>
          <p className="text-sm text-gray-600">{workflow.description || 'No description'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={workflow.isActive ? "default" : "secondary"}>
            {workflow.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button variant="outline" size="sm" onClick={runWorkflow}>
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
          <Button size="sm" onClick={save}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r bg-gray-50 overflow-y-auto">
          <Tabs defaultValue="nodes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nodes" className="p-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Triggers</h3>
                <div className="space-y-2">
                  {NODE_TYPES.trigger.map((nodeType) => (
                    <Button
                      key={nodeType.value}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addNode('trigger', nodeType.value)}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${nodeType.color}`}>
                        {nodeType.icon}
                      </div>
                      {nodeType.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Actions</h3>
                <div className="space-y-2">
                  {NODE_TYPES.action.map((nodeType) => (
                    <Button
                      key={nodeType.value}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addNode('action', nodeType.value)}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${nodeType.color}`}>
                        {nodeType.icon}
                      </div>
                      {nodeType.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Conditions</h3>
                <div className="space-y-2">
                  {NODE_TYPES.condition.map((nodeType) => (
                    <Button
                      key={nodeType.value}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addNode('condition', nodeType.value)}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${nodeType.color}`}>
                        {nodeType.icon}
                      </div>
                      {nodeType.label}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="properties" className="p-4">
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Node Properties</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <Select
                          value={selectedNode.nodeType}
                          onValueChange={(value) => updateNode(selectedNode.id, { nodeType: value, config: {} })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {NODE_TYPES[selectedNode.type]?.map((nodeType) => (
                              <SelectItem key={nodeType.value} value={nodeType.value}>
                                <div className="flex items-center gap-2">
                                  {nodeType.icon}
                                  {nodeType.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Dynamic configuration based on node type */}
                      {selectedNode.nodeType === 'send_email' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">To</label>
                            <Input
                              value={selectedNode.config.to || ''}
                              onChange={(e) => updateNode(selectedNode.id, { 
                                config: { ...selectedNode.config, to: e.target.value } 
                              })}
                              placeholder="recipient@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <Input
                              value={selectedNode.config.subject || ''}
                              onChange={(e) => updateNode(selectedNode.id, { 
                                config: { ...selectedNode.config, subject: e.target.value } 
                              })}
                              placeholder="Email subject"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Body</label>
                            <Textarea
                              value={selectedNode.config.body || ''}
                              onChange={(e) => updateNode(selectedNode.id, { 
                                config: { ...selectedNode.config, body: e.target.value } 
                              })}
                              placeholder="Email body"
                              rows={4}
                            />
                          </div>
                        </div>
                      )}

                      {selectedNode.nodeType === 'schedule' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Frequency</label>
                            <Select
                              value={selectedNode.config.frequency || 'daily'}
                              onValueChange={(value) => updateNode(selectedNode.id, { 
                                config: { ...selectedNode.config, frequency: value } 
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <Input
                              type="time"
                              value={selectedNode.config.time || '09:00'}
                              onChange={(e) => updateNode(selectedNode.id, { 
                                config: { ...selectedNode.config, time: e.target.value } 
                              })}
                            />
                          </div>
                        </div>
                      )}

                      {selectedNode.nodeType === 'create_notification' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                              value={selectedNode.config.title || ''}
                              onChange={(e) => updateNode(selectedNode.id, { 
                                config: { ...selectedNode.config, title: e.target.value } 
                              })}
                              placeholder="Notification title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <Textarea
                              value={selectedNode.config.message || ''}
                              onChange={(e) => updateNode(selectedNode.id, { 
                                config: { ...selectedNode.config, message: e.target.value } 
                              })}
                              placeholder="Notification message"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => duplicateNode(selectedNode.id)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteNode(selectedNode.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2" />
                  <p>Select a node to edit properties</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Recent Runs</h3>
                {runs.length > 0 ? (
                  <div className="space-y-2">
                    {runs.slice(0, 5).map((run: any) => (
                      <div key={run.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          {run.status === 'SUCCEEDED' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {run.status === 'FAILED' && <XCircle className="h-4 w-4 text-red-500" />}
                          {run.status === 'RUNNING' && <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />}
                          <span className="text-sm">{run.status}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(run.startedAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <History className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">No runs yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gray-100">
          <div 
            ref={canvasRef}
            className="w-full h-full relative"
            style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {/* Render connections */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              {nodes.map(node => 
                node.connections.map(connectionId => {
                  const targetNode = nodes.find(n => n.id === connectionId)
                  if (!targetNode) return null
                  
                  return (
                    <line
                      key={`${node.id}-${connectionId}`}
                      x1={node.position.x + 100}
                      y1={node.position.y + 50}
                      x2={targetNode.position.x + 100}
                      y2={targetNode.position.y}
                      stroke="#6b7280"
                      strokeWidth={2}
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })
              )}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth={10}
                  markerHeight={7}
                  refX={9}
                  refY={3.5}
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                </marker>
              </defs>
            </svg>

            {/* Render nodes */}
            {nodes.map(node => {
              const nodeTypeInfo = getNodeTypeInfo(node.type, node.nodeType)
              const isSelected = selectedNode?.id === node.id
              
              return (
                <div
                  key={node.id}
                  className={`absolute bg-white border-2 rounded-lg shadow-sm cursor-move transition-all ${
                    isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    width: 200,
                    zIndex: isSelected ? 10 : 5
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${nodeTypeInfo?.color || 'bg-gray-100'}`}>
                        {nodeTypeInfo?.icon}
                      </div>
                      <span className="text-sm font-medium truncate">
                        {nodeTypeInfo?.label || node.nodeType}
                      </span>
                    </div>
                    
                    {/* Node configuration preview */}
                    <div className="text-xs text-gray-600 space-y-1">
                      {node.nodeType === 'send_email' && node.config.to && (
                        <div>To: {node.config.to}</div>
                      )}
                      {node.nodeType === 'schedule' && node.config.frequency && (
                        <div>Every {node.config.frequency}</div>
                      )}
                      {node.nodeType === 'create_notification' && node.config.title && (
                        <div>Title: {node.config.title}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Empty state */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Build Your Workflow</h3>
                  <p className="text-gray-600 mb-4">Start by adding nodes from the sidebar</p>
                  <Button onClick={() => addNode('trigger', 'manual')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trigger
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
