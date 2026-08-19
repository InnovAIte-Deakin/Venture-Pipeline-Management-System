import type { ComponentType } from "react"

export type WorkflowConfig = Record<string, any>

export interface WorkflowStep {
  type: string
  config: WorkflowConfig
}

export type WorkflowTrigger = WorkflowStep

export interface WorkflowDefinition {
  trigger: WorkflowTrigger
  steps: WorkflowStep[]
  metadata?: WorkflowConfig
}

export interface Workflow {
  id: string
  name: string
  description?: string | null
  isActive: boolean
  definition: WorkflowDefinition
  updatedAt: string
}

export type WorkflowRunStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED"

export interface WorkflowRun {
  id: string
  status: WorkflowRunStatus
  input: WorkflowConfig | null
  output: WorkflowConfig | null
  errorMessage?: string | null
  startedAt: string
  finishedAt?: string | null
  workflow?: {
    name: string
  }
}

export type WorkflowNodeKind = "trigger" | "action" | "condition"

export interface WorkflowNode {
  id: string
  type: WorkflowNodeKind
  nodeType: string
  config: WorkflowConfig
  position: { x: number; y: number }
  connections: string[]
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: ComponentType<{ className?: string }>
  definition: WorkflowDefinition
  tags: string[]
}

export interface WorkflowOption {
  value: string
  label: string
  icon: ComponentType<{ className?: string }>
  description?: string
  color?: string
}

export interface WorkflowRunStats {
  total: number
  succeeded: number
  failed: number
  running: number
  successRate: number
  averageDuration: number
}
