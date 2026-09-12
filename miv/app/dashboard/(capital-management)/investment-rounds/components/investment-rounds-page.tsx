"use client"

import { useState } from "react"
import { Activity, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInvestmentRounds } from "@/app/dashboard/(capital-management)/investment-rounds/hooks/use-investment-rounds"
import type { InvestmentRound } from "@/app/dashboard/(capital-management)/investment-rounds/libs/types"
import { InvestmentRoundsHeader } from "./investment-rounds-header"
import { InvestmentRoundDistributions, InvestmentRoundKpis } from "./investment-round-summary"
import { RoundFilters } from "./round-filters"
import { InvestmentRoundsTable } from "./investment-rounds-table"
import { RoundDetailDialog } from "./round-detail-dialog"
import { AIInsightsPanel, GedsiImpactPanel, InvestmentAnalytics, InvestmentTimeline, RoundDocumentsPanel } from "./investment-round-tabs"

function PageTitle({ description }: { description: string }) { return <div><h1 className="text-3xl font-bold tracking-tight">Investment Rounds</h1><p className="text-muted-foreground">{description}</p></div> }

function LoadingState() { return <div className="space-y-6"><PageTitle description="Loading investment rounds..." /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Card key={index}><CardHeader className="animate-pulse"><div className="h-4 w-3/4 rounded bg-gray-200" /><div className="h-8 w-1/2 rounded bg-gray-200" /></CardHeader></Card>)}</div></div> }

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) { return <div className="space-y-6"><PageTitle description="Error loading investment rounds" /><Alert><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert><Button onClick={onRetry}><Activity className="mr-2 h-4 w-4" />Retry</Button></div> }

export function InvestmentRoundsPage() {
  const model = useInvestmentRounds()
  const [selectedRound, setSelectedRound] = useState<InvestmentRound | null>(null)
  if (model.loading) return <LoadingState />
  if (model.error) return <ErrorState error={model.error} onRetry={model.refresh} />

  return <div className="space-y-6 pb-20 sm:pb-0">
    <InvestmentRoundsHeader loading={model.loading} onRefresh={model.refresh} />
    <InvestmentRoundKpis summary={model.summary} />
    <InvestmentRoundDistributions rounds={model.rounds} />
    <Tabs defaultValue="overview" className="space-y-4"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="gedsi">GEDSI Impact</TabsTrigger><TabsTrigger value="ai-insights">AI Insights</TabsTrigger><TabsTrigger value="timeline">Timeline</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="documents">Documents</TabsTrigger></TabsList>
      <TabsContent value="overview" className="space-y-4"><RoundFilters filters={model.filters} onChange={model.setFilter} /><InvestmentRoundsTable rounds={model.filteredRounds} onView={setSelectedRound} /></TabsContent>
      <TabsContent value="gedsi" className="space-y-4"><GedsiImpactPanel rounds={model.rounds} summary={model.summary} /></TabsContent>
      <TabsContent value="ai-insights" className="space-y-4"><AIInsightsPanel rounds={model.rounds} /></TabsContent>
      <TabsContent value="timeline" className="space-y-4"><InvestmentTimeline rounds={model.rounds} /></TabsContent>
      <TabsContent value="analytics" className="space-y-4"><InvestmentAnalytics rounds={model.rounds} /></TabsContent>
      <TabsContent value="documents" className="space-y-4"><RoundDocumentsPanel /></TabsContent>
    </Tabs>
    <RoundDetailDialog round={selectedRound} open={selectedRound !== null} onOpenChange={(open) => { if (!open) setSelectedRound(null) }} />
  </div>
}
