"use client"

import { useCallback, useMemo, useState } from "react"
import { CapitalCallsSection } from "@/components/fund-management/CapitalCallsSection"
import { DistributionsSection } from "@/components/fund-management/DistributionsSection"
import { FundDetailsDialog } from "@/components/fund-management/FundDetailsDialog"
import { FundFilters } from "@/components/fund-management/FundFilters"
import { FundManagementError } from "@/components/fund-management/FundManagementError"
import { FundManagementHeader } from "@/components/fund-management/FundManagementHeader"
import { FundManagementLoading } from "@/components/fund-management/FundManagementLoading"
import { FundSummaryCards } from "@/components/fund-management/FundSummaryCards"
import { FundsTable } from "@/components/fund-management/FundsTable"
import { LimitedPartnerDialog } from "@/components/fund-management/LimitedPartnerDialog"
import { LimitedPartnersSection } from "@/components/fund-management/LimitedPartnersSection"
import { FundDocumentsSection, FundOperationsSection, FundReportsSection } from "@/components/fund-management/SupportingSections"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFundManagement } from "@/hooks/use-fund-management"
import { calculateFundMetrics, filterFunds } from "@/lib/fund-management/calculations"
import type { Fund, LimitedPartner } from "@/types/fund-management"

export default function FundManagementPage() {
  const { funds, limitedPartners, capitalCalls, distributions, operationTasks, documents, reports, loading, error, refresh } = useFundManagement()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedVintage, setSelectedVintage] = useState("all")
  const [selectedFundType, setSelectedFundType] = useState("all")
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [selectedLimitedPartner, setSelectedLimitedPartner] = useState<LimitedPartner | null>(null)
  const [isWorkflowStatusOpen, setIsWorkflowStatusOpen] = useState(false)
  const [isLaunchFundOpen, setIsLaunchFundOpen] = useState(false)

  const metrics = useMemo(() => calculateFundMetrics(funds), [funds])
  const vintages = useMemo(() => Array.from(new Set(funds.map((fund) => fund.vintage))).filter(Boolean).sort((a, b) => b.localeCompare(a)), [funds])
  const filteredFunds = useMemo(
    () => filterFunds(funds, { searchTerm, status: selectedStatus, vintage: selectedVintage, fundType: selectedFundType }),
    [funds, searchTerm, selectedStatus, selectedVintage, selectedFundType],
  )

  const handleSelectFund = useCallback((fund: Fund) => setSelectedFund(fund), [])
  const handleSelectLimitedPartner = useCallback((partner: LimitedPartner) => setSelectedLimitedPartner(partner), [])
  const handleResetFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedStatus("all")
    setSelectedVintage("all")
    setSelectedFundType("all")
  }, [])

  if (loading && funds.length === 0) return <FundManagementLoading />
  if (error && funds.length === 0) return <FundManagementError error={error} onRetry={() => void refresh()} />

  return (
    <div className="space-y-6 pb-8">
      <FundManagementHeader loading={loading} onRefresh={() => void refresh()} capitalCalls={capitalCalls} distributions={distributions} limitedPartners={limitedPartners} funds={funds} isWorkflowStatusOpen={isWorkflowStatusOpen} setIsWorkflowStatusOpen={setIsWorkflowStatusOpen} isLaunchFundOpen={isLaunchFundOpen} setIsLaunchFundOpen={setIsLaunchFundOpen} />
      <FundSummaryCards metrics={metrics} />
      <Tabs defaultValue="funds" className="space-y-5">
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex h-auto min-w-max justify-start">
            <TabsTrigger value="funds">Funds</TabsTrigger><TabsTrigger value="capital-calls">Capital Calls</TabsTrigger><TabsTrigger value="distributions">Distributions</TabsTrigger><TabsTrigger value="limited-partners">Limited Partners</TabsTrigger><TabsTrigger value="operations">Operations</TabsTrigger><TabsTrigger value="documents">Documents</TabsTrigger><TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="funds" className="space-y-5">
          <FundFilters searchTerm={searchTerm} selectedStatus={selectedStatus} selectedVintage={selectedVintage} selectedFundType={selectedFundType} vintages={vintages} onSearchChange={setSearchTerm} onStatusChange={setSelectedStatus} onVintageChange={setSelectedVintage} onFundTypeChange={setSelectedFundType} onReset={handleResetFilters} />
          <FundsTable funds={filteredFunds} onSelectFund={handleSelectFund} />
        </TabsContent>
        <TabsContent value="capital-calls"><CapitalCallsSection capitalCalls={capitalCalls} /></TabsContent>
        <TabsContent value="distributions"><DistributionsSection distributions={distributions} /></TabsContent>
        <TabsContent value="limited-partners"><LimitedPartnersSection limitedPartners={limitedPartners} onSelectLimitedPartner={handleSelectLimitedPartner} /></TabsContent>
        <TabsContent value="operations"><FundOperationsSection tasks={operationTasks} /></TabsContent>
        <TabsContent value="documents"><FundDocumentsSection documents={documents} /></TabsContent>
        <TabsContent value="reports"><FundReportsSection reports={reports} /></TabsContent>
      </Tabs>
      <FundDetailsDialog open={selectedFund !== null} onOpenChange={(open) => !open && setSelectedFund(null)} fund={selectedFund} />
      <LimitedPartnerDialog open={selectedLimitedPartner !== null} onOpenChange={(open) => !open && setSelectedLimitedPartner(null)} limitedPartner={selectedLimitedPartner} />
    </div>
  )
}
