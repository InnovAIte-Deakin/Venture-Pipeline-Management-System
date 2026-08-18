"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CheckCircle,
  Zap,
  Plus
} from "lucide-react"
import { ACTION_TYPES, TRIGGER_TYPES, WORKFLOW_TEMPLATES } from "../config"
import type { WorkflowStep, WorkflowTrigger } from "../types"

export default function WorkflowWizardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [trigger, setTrigger] = useState<WorkflowTrigger>({ type: "manual", config: {} })
  const [actions, setActions] = useState<WorkflowStep[]>([
    { type: "send_email", config: { to: "", subject: "", body: "" } },
  ])

  const next = () => setStep(s => Math.min(5, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))

  const selectTemplate = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setName(template.name)
      setDescription(template.description)
      setCategory(template.category)
      if (template.definition.trigger) {
        setTrigger(template.definition.trigger)
      }
      if (template.definition.steps) {
        setActions(template.definition.steps)
      }
    }
  }

  // Auto-select template from URL params
  useEffect(() => {
    const templateParam = searchParams.get('template')
    if (templateParam && WORKFLOW_TEMPLATES.find(t => t.id === templateParam)) {
      selectTemplate(templateParam)
      setStep(2) // Skip template selection step
    }
  }, [searchParams])

  const addAction = () => {
    setActions(prev => [...prev, { type: "send_email", config: {} }])
  }

  const updateAction = <Key extends keyof WorkflowStep>(index: number, field: Key, value: WorkflowStep[Key]) => {
    setActions(prev => prev.map((action, i) => 
      i === index ? { ...action, [field]: value } : action
    ))
  }

  const removeAction = (index: number) => {
    setActions(prev => prev.filter((_, i) => i !== index))
  }

  const create = async () => {
    const definition = { 
      trigger, 
      steps: actions,
      metadata: {
        category,
        template: selectedTemplate,
        createdAt: new Date().toISOString()
      }
    }
    
    try {
      // Pick first user as creator (dev mode)
      const userRes = await fetch('/api/users?limit=1')
      const userJson = await userRes.json()
      const createdById = userJson.users?.[0]?.id
      
      if (!createdById) { 
        alert('No user found to assign as creator')
        return 
      }
      
      const res = await fetch('/api/workflows', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ name, description, definition, createdById }) 
      })
      
      if (res.ok) {
        const wf = await res.json()
        router.push(`/dashboard/workflows/${wf.id}/builder`)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Failed to create workflow')
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
      alert('Failed to create workflow')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {i}
            </div>
            {i < 5 && (
              <div className={`w-16 h-0.5 mx-2 ${
                i < step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Workflow Creation Wizard
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choose a template or start from scratch"}
            {step === 2 && "Define workflow basics"}
            {step === 3 && "Configure the trigger"}
            {step === 4 && "Set up actions"}
            {step === 5 && "Review and create"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose Your Starting Point</h3>
                <p className="text-gray-600">Select a template to get started quickly, or create a custom workflow</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === null ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedTemplate(null)
                    setName("")
                    setDescription("")
                    setCategory("")
                    setTrigger({ type: "manual", config: {} })
                    setActions([{ type: "send_email", config: {} }])
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-gray-600" />
                    </div>
                    <h4 className="font-semibold">Start from Scratch</h4>
                    <p className="text-sm text-gray-600 mt-1">Create a custom workflow</p>
                  </CardContent>
                </Card>

                {WORKFLOW_TEMPLATES.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    onClick={() => selectTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <template.icon className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-center mb-2">{template.name}</h4>
                      <p className="text-sm text-gray-600 text-center mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Workflow Name</label>
                <Input 
                  placeholder="Enter workflow name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea 
                  placeholder="Describe what this workflow does" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Venture Management">Venture Management</SelectItem>
                    <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Reporting">Reporting</SelectItem>
                    <SelectItem value="Risk Management">Risk Management</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Trigger Configuration */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">When should this workflow run?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TRIGGER_TYPES.map((triggerType) => (
                    <Card 
                      key={triggerType.value}
                      className={`cursor-pointer transition-all ${
                        trigger.type === triggerType.value ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => setTrigger({ type: triggerType.value, config: {} })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <triggerType.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{triggerType.label}</h4>
                            <p className="text-sm text-gray-600">{triggerType.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Trigger Configuration */}
              {trigger.type === 'schedule' && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Schedule Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Frequency</label>
                      <Select 
                        value={trigger.config.frequency || "daily"} 
                        onValueChange={(value) => setTrigger(prev => ({ ...prev, config: { ...prev.config, frequency: value } }))}
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
                        value={trigger.config.time || "09:00"}
                        onChange={(e) => setTrigger(prev => ({ ...prev, config: { ...prev.config, time: e.target.value } }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {trigger.type === 'webhook' && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Webhook Configuration</h4>
                  <div>
                    <label className="block text-sm font-medium mb-1">Authentication</label>
                    <Select 
                      value={trigger.config.auth || "none"} 
                      onValueChange={(value) => setTrigger(prev => ({ ...prev, config: { ...prev.config, auth: value } }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="api_key">API Key</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Actions Configuration */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Workflow Actions</label>
                <Button variant="outline" size="sm" onClick={addAction}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Action
                </Button>
              </div>

              <div className="space-y-4">
                {actions.map((action, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <Select 
                            value={action.type} 
                            onValueChange={(value) => updateAction(index, 'type', value)}
                          >
                            <SelectTrigger className="w-64">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ACTION_TYPES.map((actionType) => (
                                <SelectItem key={actionType.value} value={actionType.value}>
                                  <div className="flex items-center gap-2">
                                    <actionType.icon className="h-4 w-4" />
                                    {actionType.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {actions.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeAction(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        {/* Action Configuration */}
                        {action.type === 'send_email' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input 
                              placeholder="To (email address)" 
                              value={action.config.to || ""} 
                              onChange={(e) => updateAction(index, 'config', { ...action.config, to: e.target.value })}
                            />
                            <Input 
                              placeholder="Subject" 
                              value={action.config.subject || ""} 
                              onChange={(e) => updateAction(index, 'config', { ...action.config, subject: e.target.value })}
                            />
                            <div className="md:col-span-2">
                              <Textarea 
                                placeholder="Email body" 
                                value={action.config.body || ""} 
                                onChange={(e) => updateAction(index, 'config', { ...action.config, body: e.target.value })}
                                rows={3}
                              />
                            </div>
                          </div>
                        )}

                        {action.type === 'create_notification' && (
                          <div className="space-y-3">
                            <Input 
                              placeholder="Notification title" 
                              value={action.config.title || ""} 
                              onChange={(e) => updateAction(index, 'config', { ...action.config, title: e.target.value })}
                            />
                            <Textarea 
                              placeholder="Notification message" 
                              value={action.config.message || ""} 
                              onChange={(e) => updateAction(index, 'config', { ...action.config, message: e.target.value })}
                              rows={2}
                            />
                          </div>
                        )}

                        {action.type === 'webhook_call' && (
                          <div className="space-y-3">
                            <Input 
                              placeholder="URL" 
                              value={action.config.url || ""} 
                              onChange={(e) => updateAction(index, 'config', { ...action.config, url: e.target.value })}
                            />
                            <Select 
                              value={action.config.method || "POST"} 
                              onValueChange={(value) => updateAction(index, 'config', { ...action.config, method: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Your Workflow</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                    <span className="font-medium">Name:</span> {name}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span> {description || "No description"}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {category}
                  </div>
                  <div>
                    <span className="font-medium">Trigger:</span> {TRIGGER_TYPES.find(t => t.value === trigger.type)?.label}
                  </div>
                  <div>
                    <span className="font-medium">Actions:</span> {actions.length} action(s) configured
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Ready to Create</h4>
                    <p className="text-blue-700 text-sm">Your workflow is configured and ready to be created. You can further customize it in the builder after creation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={back} disabled={step === 1}>
          Back
        </Button>
        {step < 5 ? (
          <Button onClick={next} disabled={step === 2 && !name}>
            Next
          </Button>
        ) : (
          <Button onClick={create} disabled={!name}>
            Create Workflow
          </Button>
        )}
      </div>
    </div>
  )
}

