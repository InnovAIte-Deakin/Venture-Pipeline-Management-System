"use client"

import { useEffect, useMemo, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCapitalFacilitation } from "@/hooks/use-capital-facilitation"
import { calculateMetrics, calculatePipelineStages, calculateSectorDistribution, calculateStatusCounts } from "@/lib/capital-facilitation/calculations"
import type { CapitalRequest } from "@/types/capital-facilitation"
import { AlertCircle, Download, Plus } from "lucide-react"
import { AnalyticsSection, CapitalRequestsSection, CapitalSummaryCards, InvestorNetwork, PipelineOverview, RequestDetails } from "@/components/capital-facilitation/CapitalFacilitationSections"

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
    {error && <Alert className="border-red-200 bg-red-50 dark:bg-red-950"><AlertCircle className="h-4 w-4 text-red-600" /><AlertDescription><strong>Error:</strong> {error}<Button variant="link" className="ml-2 h-auto p-0 text-red-600 underline" onClick={() => void refresh()}>Retry</Button></AlertDescription></Alert>}
    {!error && <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-semibold">Capital Facilitation</h1><p className="text-gray-600 dark:text-gray-400">Manage funding requests and investor relationships</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button><Button><Plus className="mr-2 h-4 w-4" />New Request</Button></div></header>
      <CapitalSummaryCards metrics={metrics} />
      <Tabs defaultValue="capital-requests" className="space-y-6"><div className="overflow-x-auto"><TabsList className="grid min-w-[34rem] w-full grid-cols-3"><TabsTrigger value="capital-requests">Capital Requests</TabsTrigger><TabsTrigger value="investor-network">Investor Network</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList></div>
        <TabsContent value="capital-requests" className="space-y-6"><PipelineOverview stages={pipelineStages} hasRequests={capitalRequests.length > 0} /><CapitalRequestsSection requests={capitalRequests} selectedRequest={selectedRequest} onSelect={setSelectedRequest} /><RequestDetails request={selectedRequest} /></TabsContent>
        <TabsContent value="investor-network"><InvestorNetwork investors={investorPartners} query={investorSearchQuery} onQueryChange={setInvestorSearchQuery} /></TabsContent>
        <TabsContent value="analytics"><AnalyticsSection fundingTimeline={fundingTimeline} investors={investorPartners} sectorDistribution={sectorDistribution} statusCounts={statusCounts} /></TabsContent>
      </Tabs>
    </>}
  </div></div>
}
