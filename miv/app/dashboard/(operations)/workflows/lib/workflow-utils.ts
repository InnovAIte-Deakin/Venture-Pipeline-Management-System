import type { WorkflowDefinition, WorkflowNode, WorkflowRun, WorkflowRunStats } from "../types/workflow"

const DEFAULT_TRIGGER = { type: "manual", config: {} }

export function definitionToNodes(definition: WorkflowDefinition): WorkflowNode[] {
  const nodes: WorkflowNode[] = []
  let y = 100

  if (definition.trigger) {
    nodes.push({
      id: "trigger",
      type: "trigger",
      nodeType: definition.trigger.type || "manual",
      config: definition.trigger.config || {},
      position: { x: 100, y },
      connections: definition.steps.length > 0 ? ["step-0"] : [],
    })
    y += 150
  }

  definition.steps.forEach((step, index) => {
    nodes.push({
      id: `step-${index}`,
      type: "action",
      nodeType: step.type || "send_email",
      config: step.config || {},
      position: { x: 100, y },
      connections: index < definition.steps.length - 1 ? [`step-${index + 1}`] : [],
    })
    y += 150
  })

  return nodes
}

export function nodesToDefinition(nodes: WorkflowNode[]): WorkflowDefinition {
  const trigger = nodes.find((node) => node.type === "trigger")
  const steps = nodes
    .filter((node) => node.type === "action")
    .sort((a, b) => Number(a.id.split("-")[1] || 0) - Number(b.id.split("-")[1] || 0))

  return {
    trigger: trigger ? { type: trigger.nodeType, config: trigger.config } : DEFAULT_TRIGGER,
    steps: steps.map((node) => ({ type: node.nodeType, config: node.config })),
    metadata: {
      lastModified: new Date().toISOString(),
      nodeCount: nodes.length,
    },
  }
}

export function getRunStats(runs: WorkflowRun[]): WorkflowRunStats {
  const succeeded = runs.filter((run) => run.status === "SUCCEEDED").length
  const failed = runs.filter((run) => run.status === "FAILED").length
  const running = runs.filter((run) => run.status === "RUNNING").length
  const completed = runs.filter((run) => run.finishedAt)
  const totalDuration = completed.reduce(
    (sum, run) => sum + new Date(run.finishedAt!).getTime() - new Date(run.startedAt).getTime(),
    0,
  )

  return {
    total: runs.length,
    succeeded,
    failed,
    running,
    successRate: runs.length > 0 ? Math.round((succeeded / runs.length) * 100) : 0,
    averageDuration: completed.length > 0 ? totalDuration / completed.length : 0,
  }
}

export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) return `${milliseconds}ms`
  if (milliseconds < 60_000) return `${Math.round(milliseconds / 1000)}s`
  return `${Math.round(milliseconds / 60_000)}m`
}
