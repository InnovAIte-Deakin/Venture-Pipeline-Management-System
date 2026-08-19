import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Play,
  Target,
  Users,
  Webhook,
} from "lucide-react"
import type { WorkflowNodeKind, WorkflowOption, WorkflowTemplate } from "./types"

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "venture-onboarding",
    name: "Venture Onboarding",
    description: "Automatically guide new ventures through intake, screening, and initial assessment",
    category: "Venture Management",
    icon: Building2,
    tags: ["onboarding", "automation", "assessment"],
    definition: {
      trigger: { type: "venture_created", config: {} },
      steps: [
        { type: "send_welcome_email", config: { template: "venture_welcome" } },
        { type: "create_tasks", config: { tasks: ["Document Review", "Initial Screening", "GEDSI Assessment"] } },
        { type: "schedule_meeting", config: { type: "intake_call", daysFromNow: 3 } },
        { type: "notify_team", config: { message: "New venture requires initial review" } },
      ],
    },
  },
  {
    id: "due-diligence-checklist",
    name: "Due Diligence Automation",
    description: "Create comprehensive due diligence checklists and track completion",
    category: "Due Diligence",
    icon: CheckCircle,
    tags: ["due-diligence", "checklist", "compliance"],
    definition: {
      trigger: { type: "stage_changed", config: { to: "DUE_DILIGENCE" } },
      steps: [
        { type: "create_checklist", config: { template: "comprehensive_dd" } },
        { type: "assign_reviewers", config: { roles: ["legal", "financial", "technical"] } },
        { type: "set_deadline", config: { daysFromNow: 30 } },
        { type: "schedule_reminders", config: { frequency: "weekly" } },
      ],
    },
  },
  {
    id: "gedsi-monitoring",
    name: "GEDSI Compliance Monitoring",
    description: "Monitor GEDSI metrics and alert on compliance issues",
    category: "Compliance",
    icon: Target,
    tags: ["gedsi", "compliance", "monitoring"],
    definition: {
      trigger: { type: "schedule", config: { frequency: "weekly" } },
      steps: [
        { type: "check_gedsi_metrics", config: { threshold: 70 } },
        { type: "identify_at_risk", config: { criteria: "score_below_threshold" } },
        { type: "create_alerts", config: { severity: "medium" } },
        { type: "notify_managers", config: { include_recommendations: true } },
      ],
    },
  },
  {
    id: "investment-pipeline",
    name: "Investment Pipeline Tracker",
    description: "Track ventures through investment stages with automated updates",
    category: "Investment",
    icon: ArrowRight,
    tags: ["investment", "pipeline", "tracking"],
    definition: {
      trigger: { type: "stage_changed", config: {} },
      steps: [
        { type: "update_pipeline_status", config: {} },
        { type: "calculate_stage_metrics", config: {} },
        { type: "notify_stakeholders", config: { include_progress: true } },
        { type: "schedule_review", config: { basedOnStage: true } },
      ],
    },
  },
  {
    id: "monthly-reporting",
    name: "Monthly Impact Reports",
    description: "Generate and distribute monthly impact and performance reports",
    category: "Reporting",
    icon: FileText,
    tags: ["reporting", "impact", "analytics"],
    definition: {
      trigger: { type: "schedule", config: { frequency: "monthly", day: 1 } },
      steps: [
        { type: "generate_impact_report", config: {} },
        { type: "compile_gedsi_summary", config: {} },
        { type: "create_visual_dashboard", config: {} },
        { type: "distribute_report", config: { recipients: "stakeholders" } },
      ],
    },
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment Workflow",
    description: "Automated risk assessment and mitigation planning",
    category: "Risk Management",
    icon: AlertTriangle,
    tags: ["risk", "assessment", "mitigation"],
    definition: {
      trigger: { type: "manual", config: {} },
      steps: [
        { type: "analyze_financial_risk", config: {} },
        { type: "assess_market_risk", config: {} },
        { type: "evaluate_operational_risk", config: {} },
        { type: "create_mitigation_plan", config: {} },
        { type: "schedule_review", config: { frequency: "quarterly" } },
      ],
    },
  },
]

export const TRIGGER_TYPES: WorkflowOption[] = [
  { value: "manual", label: "Manual Trigger", icon: Play, description: "Start manually when needed", color: "bg-green-100 text-green-700" },
  { value: "schedule", label: "Schedule", icon: Clock, description: "Run on a schedule", color: "bg-blue-100 text-blue-700" },
  { value: "webhook", label: "Webhook", icon: Webhook, description: "Trigger via API call", color: "bg-purple-100 text-purple-700" },
  { value: "venture_created", label: "Venture Created", icon: Building2, description: "When a new venture is added", color: "bg-orange-100 text-orange-700" },
  { value: "stage_changed", label: "Stage Changed", icon: ArrowRight, description: "When venture stage updates", color: "bg-yellow-100 text-yellow-700" },
  { value: "metric_updated", label: "Metric Updated", icon: Target, description: "When metrics are updated" },
]

export const ACTION_TYPES: WorkflowOption[] = [
  { value: "send_email", label: "Send Email", icon: Mail, description: "Send email notification", color: "bg-red-100 text-red-700" },
  { value: "create_notification", label: "Create Notification", icon: Bell, description: "Create in-app notification", color: "bg-blue-100 text-blue-700" },
  { value: "update_database", label: "Update Database", icon: Database, description: "Update venture data", color: "bg-green-100 text-green-700" },
  { value: "generate_document", label: "Generate Document", icon: FileText, description: "Create document from template", color: "bg-purple-100 text-purple-700" },
  { value: "assign_task", label: "Assign Task", icon: Users, description: "Create and assign tasks", color: "bg-orange-100 text-orange-700" },
  { value: "schedule_meeting", label: "Schedule Meeting", icon: Calendar, description: "Schedule calendar event", color: "bg-pink-100 text-pink-700" },
  { value: "send_slack", label: "Send Slack Message", icon: MessageSquare, description: "Send Slack notification" },
  { value: "webhook_call", label: "Webhook Call", icon: Globe, description: "Make HTTP request", color: "bg-indigo-100 text-indigo-700" },
]

export const CONDITION_TYPES: WorkflowOption[] = [
  { value: "if_condition", label: "If Condition", icon: Target, color: "bg-yellow-100 text-yellow-700" },
  { value: "delay", label: "Delay", icon: Clock, color: "bg-gray-100 text-gray-700" },
]

export const NODE_TYPES: Record<WorkflowNodeKind, WorkflowOption[]> = {
  trigger: TRIGGER_TYPES.filter(({ value }) => value !== "metric_updated"),
  action: ACTION_TYPES.filter(({ value }) => value !== "send_slack"),
  condition: CONDITION_TYPES,
}
