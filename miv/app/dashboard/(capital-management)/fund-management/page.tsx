"use client"

import React from "react"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CapitalCallsSection } from "./components/capital-calls-section"
import { DistributionsSection } from "./components/distributions-section"
import { FundsSection } from "./components/funds-section"
import { LPsSection } from "./components/lps-section"
import { OperationsSection } from "./components/operations-section"
import { OverviewCards } from "./components/overview-cards"
import { ReportsDocumentsSection } from "./components/reports-documents-section"
import { useFundManagementData } from "./hooks/useFundManagementData"

export default function FundManagementPage() {
  const {
    funds,
    limitedPartners,
    capitalCalls,
    distributions,
    operationTasks,
    documents,
    reports,
    loading,
    error,
  } = useFundManagementData()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
          <p className="text-muted-foreground">Loading fund management data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Fund Management</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Manage funds, limited partners, capital calls, and distributions
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}. Showing mock data for demonstration.</AlertDescription>
        </Alert>
      )}

      <OverviewCards
        funds={funds}
        limitedPartners={limitedPartners}
        capitalCallsCount={capitalCalls.length}
        distributionsCount={distributions.length}
      />

      <Tabs defaultValue="funds" className="w-full">
        <TabsList className="mb-4 grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:grid-cols-3 md:mb-6 lg:grid-cols-6">
          <TabsTrigger value="funds" className="text-xs sm:text-sm">
            Funds
          </TabsTrigger>
          <TabsTrigger value="lps" className="text-xs sm:text-sm">
            Limited Partners
          </TabsTrigger>
          <TabsTrigger value="capital-calls" className="text-xs sm:text-sm">
            Capital Calls
          </TabsTrigger>
          <TabsTrigger value="distributions" className="text-xs sm:text-sm">
            Distributions
          </TabsTrigger>
          <TabsTrigger value="operations" className="text-xs sm:text-sm">
            Operations
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">
            Reports & Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funds" className="space-y-4">
          <FundsSection funds={funds} loading={loading} />
        </TabsContent>

        <TabsContent value="lps" className="space-y-4">
          <LPsSection limitedPartners={limitedPartners} loading={loading} />
        </TabsContent>

        <TabsContent value="capital-calls" className="space-y-4">
          <CapitalCallsSection capitalCalls={capitalCalls} loading={loading} />
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4">
          <DistributionsSection distributions={distributions} loading={loading} />
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <OperationsSection operationTasks={operationTasks} loading={loading} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsDocumentsSection reports={reports} documents={documents} loading={loading} />
        </TabsContent>
      </Tabs>

      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Fund Management System</CardTitle>
          <CardDescription>Institutional-grade fund operations management platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {[
              "Full fund lifecycle management",
              "LP relationship management and performance tracking",
              "Capital calls and distribution processing",
              "Operations workflow and task management",
              "Comprehensive reporting and compliance documentation",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
