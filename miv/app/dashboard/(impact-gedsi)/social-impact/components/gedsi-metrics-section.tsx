import { Lightbulb, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatLabel } from "../lib/social-impact-formatters"
import { isComplete, metricProgress } from "../lib/social-impact-calculations"
import type { GedsiMetric, SocialImpactVenture } from "../types/social-impact"

export function GedsiMetricsSection({ metrics, ventures }: { metrics: GedsiMetric[]; ventures: SocialImpactVenture[] }) {
  const names = new Map(ventures.map((venture) => [venture.id, venture.name || "Unnamed venture"]))
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-purple-600" />GEDSI Metrics Tracking</CardTitle><CardDescription>Gender equality, disability, and social inclusion metrics across the portfolio</CardDescription></CardHeader><CardContent>
    {metrics.length === 0 ? <div className="py-8 text-center"><Lightbulb className="mx-auto mb-4 h-12 w-12 text-muted-foreground" /><p className="text-muted-foreground">No GEDSI metrics are available for these ventures.</p></div> : <div className="space-y-3">{metrics.map((metric) => { const progress = metricProgress(metric); return <article key={metric.id} className="min-w-0 rounded-lg border bg-white p-4"><div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 flex-wrap items-center gap-2"><Badge variant="secondary">{formatLabel(metric.category)}</Badge><h3 className="wrap-break-word font-medium">{metric.metricName}</h3></div><Badge className={isComplete(metric) ? "bg-green-600" : metric.status === "IN_PROGRESS" ? "bg-yellow-600" : "bg-gray-600"}>{formatLabel(metric.status)}</Badge></div><div className="grid gap-3 text-sm sm:grid-cols-3"><div><span className="text-muted-foreground">Current</span><p className="font-semibold">{metric.currentValue ?? 0} {metric.unit}</p></div><div><span className="text-muted-foreground">Target</span><p className="font-semibold">{metric.targetValue ?? 0} {metric.unit}</p></div><div><div className="flex justify-between"><span className="text-muted-foreground">Progress</span><span>{progress.toFixed(0)}%</span></div><Progress value={progress} className="mt-2 h-2" /></div></div><p className="mt-3 wrap-break-word text-xs text-muted-foreground">Metric {metric.metricCode} · {names.get(metric.ventureId) ?? "Unknown venture"}</p></article> })}</div>}
  </CardContent></Card>
}
