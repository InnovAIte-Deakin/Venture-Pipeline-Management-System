import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Eye, Globe, Heart, Lightbulb, Sparkles, Target } from "lucide-react"
import { RiskBadge } from "../shared/risk-badge"
import { TeamAvatarStack } from "../shared/team-avatar-stack"
import type { ReactNode } from "react"
import type { Deal } from "../../types/deal-flow.types"

interface DealDetailDialogProps {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealDetailDialog({ deal, open, onOpenChange }: DealDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" aria-hidden="true" />
            {deal?.company || "Deal details"}
          </DialogTitle>
          <DialogDescription>Detailed view of venture information and metrics</DialogDescription>
        </DialogHeader>

        {deal && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Company" value={deal.company} />
                  <InfoRow label="Deal ID" value={deal.id} />
                  <InfoRow label="Location" value={deal.location} />
                  <InfoRow label="Sector" value={<Badge variant="outline">{deal.sector}</Badge>} />
                  <InfoRow label="Stage" value={<Badge variant="outline">{deal.stage}</Badge>} />
                  <InfoRow label="Deal Size" value={<span className="text-lg font-medium">{deal.dealSize}</span>} />
                  <InfoRow
                    label="Probability"
                    value={
                      <div className="flex items-center gap-2">
                        <Progress value={deal.probability} className="h-2 w-20" />
                        <span className="font-medium">{deal.probability}%</span>
                      </div>
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impact Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ScoreRow icon={<Heart className="h-4 w-4 text-pink-500" />} label="GEDSI Score" value={deal.gedsiScore} />
                  <ScoreRow icon={<Globe className="h-4 w-4 text-green-500" />} label="Impact Score" value={deal.impactScore} />
                  <ScoreRow icon={<Target className="h-4 w-4 text-blue-500" />} label="Readiness Score" value={deal.readinessScore} />
                  <div className="border-t pt-2">
                    <p className="mb-2 text-sm text-muted-foreground">AI Risk Assessment:</p>
                    <RiskBadge riskLevel={deal.aiInsights.riskLevel} uppercase />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inclusion Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{deal.inclusionFocus}</p>
                <div className="mt-3">
                  <p className="mb-2 text-sm text-muted-foreground">Founder Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {deal.founderType.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <Metric label="Jobs Created" value={deal.metrics.jobsCreated.toLocaleString()} color="text-blue-600" />
                  <Metric label="Communities Served" value={String(deal.metrics.communitiesServed)} color="text-green-600" />
                  <Metric label="Women Leadership" value={`${deal.metrics.womenLeadership}%`} color="text-pink-600" />
                  <Metric label="Disability Inclusive" value={deal.metrics.disabilityInclusive ? "Yes" : "No"} color="text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sustainability Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {deal.sustainabilityGoals.map((goal) => (
                    <Badge key={goal} variant="outline" className="text-sm">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  AI Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>{deal.aiInsights.recommendation}</AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-2">
                  <InsightList title="Key Strengths" items={deal.aiInsights.keyStrengths} />
                  <InsightList title="Areas for Improvement" items={deal.aiInsights.areasForImprovement} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <TeamAvatarStack team={deal.team} size="md" />
                  <div>
                    <p className="text-sm font-medium">Team Members:</p>
                    <p className="text-sm text-muted-foreground">{deal.team.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function ScoreRow({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        {icon}
        {label}:
      </span>
      <div className="flex items-center gap-2">
        <Progress value={value} className="h-2 w-20" />
        <span className="font-medium">{value}%</span>
      </div>
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1 font-medium">
        <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
