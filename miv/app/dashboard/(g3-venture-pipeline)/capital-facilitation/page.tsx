"use client"

import { useEffect, useMemo, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCapitalFacilitation } from "@/hooks/use-capital-facilitation"
import { calculateMetrics, calculatePipelineStages, calculateSectorDistribution, calculateStatusCounts } from "@/lib/capital-facilitation/calculations"
import type { CapitalRequest } from "@/types/capital-facilitation"
import { AlertCircle, Download, Plus, RefreshCw } from "lucide-react"
import { AnalyticsSection, CapitalRequestsSection, CapitalSummaryCards, InvestorNetwork, PipelineOverview, RequestDetails } from "@/components/capital-facilitation/CapitalFacilitationSections"
import { CapitalFacilitationTable } from "@/components/capital-facilitation/CapitalFacilitationTable"

export default function CapitalFacilitation() {
  const { capitalRequests, investorPartners, fundingTimeline, loading, error, refresh } = useCapitalFacilitation()
  const [selectedRequest, setSelectedRequest] = useState<CapitalRequest | null>(null)
  const [investorSearchQuery, setInvestorSearchQuery] = useState("")
  const metrics = useMemo(() => calculateMetrics(capitalRequests), [capitalRequests])
  const pipelineStages = useMemo(() => calculatePipelineStages(capitalRequests), [capitalRequests])
  const sectorDistribution = useMemo(() => calculateSectorDistribution(capitalRequests), [capitalRequests])
  const statusCounts = useMemo(() => calculateStatusCounts(capitalRequests), [capitalRequests])

  useEffect(() => {
    setSelectedRequest((current) => current && capitalRequests.some((request) => request.id === current.id) ? current : capitalRequests[0] || null)
  }, [capitalRequests])

  if (loading) return <Card><CardContent className="flex min-h-40 items-center justify-center gap-3 p-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" /><span>Loading capital facilitation data from database...</span></CardContent></Card>

  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"><div className="space-y-6 p-4 sm:p-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold break-words">Capital Facilitation</h1><p className="text-gray-600 dark:text-gray-400">Track venture funding requirements, investor readiness, and capital progress.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button><Button><Plus className="mr-2 h-4 w-4" />New Request</Button></div></header>

    {error && <Alert className="flex flex-col gap-2 border-red-200 bg-red-50 dark:bg-red-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" /><div><AlertTitle>Unable to refresh venture data</AlertTitle><AlertDescription className="break-words">{error}</AlertDescription></div></div>
      <Button variant="outline" size="sm" className="w-full shrink-0 sm:w-auto" onClick={() => void refresh()}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button>
    </Alert>}

    <CapitalSummaryCards metrics={metrics} unavailable={Boolean(error)} />
    <Tabs defaultValue="capital-requests" className="space-y-6"><div className="overflow-x-auto"><TabsList className="grid min-w-[34rem] w-full grid-cols-3"><TabsTrigger value="capital-requests">Capital Requests</TabsTrigger><TabsTrigger value="investor-network">Investor Network</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList></div>
      <TabsContent value="capital-requests" className="space-y-6"><PipelineOverview stages={pipelineStages} hasRequests={capitalRequests.length > 0} /><CapitalFacilitationTable requests={capitalRequests} /><CapitalRequestsSection requests={capitalRequests} selectedRequest={selectedRequest} onSelect={setSelectedRequest} /><RequestDetails request={selectedRequest} /></TabsContent>
      <TabsContent value="investor-network"><InvestorNetwork investors={investorPartners} query={investorSearchQuery} onQueryChange={setInvestorSearchQuery} /></TabsContent>
      <TabsContent value="analytics"><AnalyticsSection fundingTimeline={fundingTimeline} investors={investorPartners} sectorDistribution={sectorDistribution} statusCounts={statusCounts} /></TabsContent>
    </Tabs>
  </div></div>
}
