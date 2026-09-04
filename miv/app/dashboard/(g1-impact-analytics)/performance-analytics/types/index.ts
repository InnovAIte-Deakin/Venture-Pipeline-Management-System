// app/dashboard/(g1-impact-analytics)/performance-analytics/types/index.ts
//
// T19 - Refactor and Improve Performance Analytics

import type { LucideIcon } from "lucide-react"

export interface AnalyticsData {
  ventures: any[]
  gedsiMetrics: any[]
  users: any[]
  analytics: any
}

export interface KpiMetric {
  title: string
  value: string | number
  unit: string
  change: number
  trend: "up" | "down" | "neutral" | string
  icon: LucideIcon
  color: string
  bgColor: string
  description: string
}