"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTab } from "./components/analytics-tab";
import { CapitalRequestsTab } from "./components/capital-requests-tab";
import { InvestorNetworkTab } from "./components/investor-network-tab";
import { OverviewStats } from "./components/overview-stats";
import { PageHeader } from "./components/page-header";
import { useCapitalFacilitation } from "./hooks/use-capital-facilitation";

export default function CapitalFacilitation() {
  const {
    capitalRequests,
    dealPipelineStages,
    error,
    fetchCapitalData,
    fundingTimeline,
    investorPartners,
    loading,
    selectedRequest,
    setSelectedRequest,
  } = useCapitalFacilitation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Loading capital facilitation data from database...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Error:</strong> {error}
              <Button
                variant="link"
                className="ml-2 h-auto p-0 text-red-600 underline"
                onClick={() => void fetchCapitalData()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            <PageHeader />
            <OverviewStats capitalRequests={capitalRequests} />
            <Tabs defaultValue="capital-requests" className="space-y-4 sm:space-y-6">
              <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:h-9 sm:grid-cols-3 sm:gap-0">
                <TabsTrigger value="capital-requests" className="whitespace-normal text-xs sm:whitespace-nowrap sm:text-sm">
                  Capital Requests
                </TabsTrigger>
                <TabsTrigger value="investor-network" className="whitespace-normal text-xs sm:whitespace-nowrap sm:text-sm">
                  Investor Network
                </TabsTrigger>
                <TabsTrigger value="analytics" className="whitespace-normal text-xs sm:whitespace-nowrap sm:text-sm">
                  Analytics
                </TabsTrigger>
              </TabsList>
              <CapitalRequestsTab
                capitalRequests={capitalRequests}
                dealPipelineStages={dealPipelineStages}
                selectedRequest={selectedRequest}
                onSelectRequest={setSelectedRequest}
              />
              <InvestorNetworkTab investors={investorPartners} />
              <AnalyticsTab
                capitalRequests={capitalRequests}
                fundingTimeline={fundingTimeline}
                investorPartners={investorPartners}
              />
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
