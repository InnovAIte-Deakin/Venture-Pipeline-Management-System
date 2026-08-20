"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { capitalSummaryDemo } from "@/lib/capital-facilitation/demo-data"
import { CapitalFacilitationHeader } from "@/components/capital-facilitation/CapitalFacilitationHeader"
import { CapitalSummaryCards } from "@/components/capital-facilitation/CapitalSummaryCards"
import { CapitalOverview } from "@/components/capital-facilitation/CapitalOverview"
import { CapitalRequests } from "@/components/capital-facilitation/CapitalRequests"
import { CapitalInvestors } from "@/components/capital-facilitation/CapitalInvestors"
import { FundingPipeline } from "@/components/capital-facilitation/FundingPipeline"
import { DueDiligence } from "@/components/capital-facilitation/DueDiligence"
import { InvestmentReadiness } from "@/components/capital-facilitation/InvestmentReadiness"

export default function CapitalFacilitation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="space-y-6 p-4 sm:p-6">
        <CapitalFacilitationHeader />
        <CapitalSummaryCards cards={capitalSummaryDemo} />
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">Capital Requests</TabsTrigger>
              <TabsTrigger value="investors">Investors</TabsTrigger>
              <TabsTrigger value="pipeline">Funding Pipeline</TabsTrigger>
              <TabsTrigger value="due-diligence">Due Diligence</TabsTrigger>
              <TabsTrigger value="readiness">Investment Readiness</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview">
            <CapitalOverview />
          </TabsContent>
          <TabsContent value="requests">
            <CapitalRequests />
          </TabsContent>
          <TabsContent value="investors">
            <CapitalInvestors />
          </TabsContent>
          <TabsContent value="pipeline">
            <FundingPipeline />
          </TabsContent>
          <TabsContent value="due-diligence">
            <DueDiligence />
          </TabsContent>
          <TabsContent value="readiness">
            <InvestmentReadiness />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
