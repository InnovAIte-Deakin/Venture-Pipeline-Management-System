"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFundManagementData } from "./hooks/useFundManagementData"
import { OverviewCards } from "./components/overview-cards"
import { FundsSection } from "./components/funds-section"
import { LPsSection } from "./components/lps-section"
import { CapitalCallsSection } from "./components/capital-calls-section"
import { DistributionsSection } from "./components/distributions-section"
import { OperationsSection } from "./components/operations-section"
import { ReportsDocumentsSection } from "./components/reports-documents-section"
import { AlertTriangle } from "lucide-react"

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fund management data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="md:hidden">
        <div className="min-h-screen bg-[#202833] px-2 py-2.5">
          <div className="mx-auto w-full max-w-[370px] overflow-hidden rounded-[22px] border border-slate-700 bg-[#0f1b2a] shadow-[0_18px_45px_rgba(15,23,42,0.6)]">
            <div className="border-b border-slate-700 bg-[#0d1727] px-3 py-2.5">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                  <span className="flex h-4 w-4 items-center justify-center rounded-md border border-slate-600 bg-slate-800 text-[8px] text-slate-300">☰</span>
                  <span>Dashboard</span>
                  <span className="text-slate-500">›</span>
                  <span className="font-medium text-white">Fund Management</span>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                  N
                </div>
              </div>
            </div>

            <div className="bg-[#0f1b2a] px-3 pb-2 pt-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">Fund</p>
                  <h1 className="mt-1 text-[28px] font-bold leading-none tracking-tight text-white">Fund Management</h1>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">
                  N
                </div>
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">
                Manage funds, limited partners, capital calls, and distributions
              </p>
            </div>

            <div className="bg-[#0f1b2a] px-3 pb-2">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Funds", value: funds.length },
                  { label: "LPs", value: limitedPartners.length },
                  { label: "Capital Calls", value: capitalCalls.length },
                  { label: "Distributions", value: distributions.length },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-700 bg-[#182536] p-2.5">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400">{item.label}</p>
                    <p className="mt-1.5 text-[22px] font-semibold leading-none text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f1b2a] px-3 pb-3">
              <div className="rounded-xl border border-slate-700 bg-[#182536] p-2">
                <div className="mb-2 grid grid-cols-3 gap-1.5">
                  {['Funds', 'Capital Calls', 'Distributions'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`rounded-lg px-2 py-1.5 text-[9px] font-medium ${
                        tab === 'Funds'
                          ? 'bg-[#0b1523] text-white'
                          : 'bg-transparent text-slate-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-xl border border-slate-700 bg-[#0d1728] p-2.5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Fund overview</p>
                        <p className="mt-1 truncate text-[15px] font-semibold text-white">MIV Equity Fund</p>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-medium text-emerald-300">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-2">
                        <p className="text-slate-400">Committed</p>
                        <p className="mt-1 text-base font-semibold text-white">$50M</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-2">
                        <p className="text-slate-400">Called</p>
                        <p className="mt-1 text-base font-semibold text-white">$0.9M</p>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-1.5">
                        <p className="text-[8px] text-slate-400">IRR</p>
                        <p className="mt-1 text-[11px] font-semibold text-emerald-300">18.5%</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-1.5">
                        <p className="text-[8px] text-slate-400">TVPI</p>
                        <p className="mt-1 text-[11px] font-semibold text-white">1.29x</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-1.5">
                        <p className="text-[8px] text-slate-400">DPI</p>
                        <p className="mt-1 text-[11px] font-semibold text-white">0.24x</p>
                      </div>
                    </div>

                    <button type="button" className="mt-2.5 w-full rounded-xl bg-sky-500 px-3 py-2 text-[12px] font-medium text-white">
                      View fund details
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-[#0d1728] p-2.5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Fund overview</p>
                        <p className="mt-1 truncate text-[15px] font-semibold text-white">MIV Impact Fund</p>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-medium text-emerald-300">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-2">
                        <p className="text-slate-400">Committed</p>
                        <p className="mt-1 text-base font-semibold text-white">$25M</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-2">
                        <p className="text-slate-400">Called</p>
                        <p className="mt-1 text-base font-semibold text-white">$0.1M</p>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-1.5">
                        <p className="text-[8px] text-slate-400">IRR</p>
                        <p className="mt-1 text-[11px] font-semibold text-emerald-300">15.7%</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-1.5">
                        <p className="text-[8px] text-slate-400">TVPI</p>
                        <p className="mt-1 text-[11px] font-semibold text-white">1.20x</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-1.5">
                        <p className="text-[8px] text-slate-400">DPI</p>
                        <p className="mt-1 text-[11px] font-semibold text-white">0.10x</p>
                      </div>
                    </div>

                    <button type="button" className="mt-2.5 w-full rounded-xl bg-sky-500 px-3 py-2 text-[12px] font-medium text-white">
                      View fund details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fund Management</h1>
            <p className="mt-1 text-muted-foreground">
              Manage funds, limited partners, capital calls, and distributions
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}. Showing mock data for demonstration.
              </AlertDescription>
            </Alert>
          )}

          <OverviewCards
            funds={funds}
            limitedPartners={limitedPartners}
            capitalCallsCount={capitalCalls.length}
            distributionsCount={distributions.length}
          />

          <Tabs defaultValue="funds" className="w-full">
            <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:grid-cols-3 lg:grid-cols-7">
              <TabsTrigger value="funds" className="text-xs sm:text-sm">Funds</TabsTrigger>
              <TabsTrigger value="lps" className="text-xs sm:text-sm">Limited Partners</TabsTrigger>
              <TabsTrigger value="capital-calls" className="text-xs sm:text-sm">Capital Calls</TabsTrigger>
              <TabsTrigger value="distributions" className="text-xs sm:text-sm">Distributions</TabsTrigger>
              <TabsTrigger value="operations" className="text-xs sm:text-sm">Operations</TabsTrigger>
              <TabsTrigger value="reports" className="col-span-2 text-xs sm:col-span-1 sm:text-sm lg:col-span-1">
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
              <ReportsDocumentsSection
                reports={reports}
                documents={documents}
                loading={loading}
              />
            </TabsContent>
          </Tabs>

          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-base">Fund Management System</CardTitle>
              <CardDescription>
                Institutional-grade fund operations management platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>? Full fund lifecycle management</li>
                <li>? LP relationship management and performance tracking</li>
                <li>? Capital calls and distribution processing</li>
                <li>? Operations workflow and task management</li>
                <li>? Comprehensive reporting and compliance documentation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
