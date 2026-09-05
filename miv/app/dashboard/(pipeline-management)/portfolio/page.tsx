"use client"

import { FOUNDER_TYPES } from "./constants"
import { useIsMobile } from "./hooks/useIsMobile"
import { usePortfolioData } from "./hooks/usePortfolioData"
import { PortfolioDashboard } from "./components/PortfolioDashboard"
import { PortfolioFilters as DesktopPortfolioFilters } from "./components/desktop/PortfolioFilters"
import { VentureCard as DesktopVentureCard } from "./components/desktop/VentureCard"
import { CompanyDetailModal as DesktopCompanyDetailModal } from "./components/desktop/CompanyDetailModal"
import { ActionDialog as DesktopActionDialog } from "./components/desktop/ActionDialog"
import { PortfolioFilters as MobilePortfolioFilters } from "./components/mobile/PortfolioFilters"
import { VentureCard as MobileVentureCard } from "./components/mobile/VentureCard"
import { CompanyDetailModal as MobileCompanyDetailModal } from "./components/mobile/CompanyDetailModal"
import { ActionDialog as MobileActionDialog } from "./components/mobile/ActionDialog"

export default function PortfolioPage() {
  const isMobile = useIsMobile()
  const {
    loading,
    error,
    isExporting,
    portfolioCompanies,
    filteredCompanies,
    totalVenturesCount,
    totalCompanies,
    avgGedsiScore,
    totalGedsiMetrics,
    totalActivities,
    searchTerm,
    selectedStageFilter,
    selectedFounderType,
    selectedCompany,
    selectedActionCompany,
    isActionDialogOpen,
    setSearchTerm,
    setSelectedStageFilter,
    setSelectedFounderType,
    fetchPortfolioCompanies,
    handleExportPortfolio,
    handleViewCompany,
    handleCloseDialog,
    handleTakeAction,
    handleCloseActionDialog,
    executeAction,
  } = usePortfolioData()

  const PortfolioFiltersView = isMobile ? MobilePortfolioFilters : DesktopPortfolioFilters
  const VentureCardView = isMobile ? MobileVentureCard : DesktopVentureCard
  const CompanyDetailModalView = isMobile ? MobileCompanyDetailModal : DesktopCompanyDetailModal
  const ActionDialogView = isMobile ? MobileActionDialog : DesktopActionDialog

  return (
    <PortfolioDashboard
      loading={loading}
      error={error}
      isExporting={isExporting}
      portfolioCompanies={portfolioCompanies}
      filteredCompanies={filteredCompanies}
      totalVenturesCount={totalVenturesCount}
      totalCompanies={totalCompanies}
      avgGedsiScore={avgGedsiScore}
      totalGedsiMetrics={totalGedsiMetrics}
      totalActivities={totalActivities}
      searchTerm={searchTerm}
      selectedStageFilter={selectedStageFilter}
      selectedFounderType={selectedFounderType}
      founderTypes={FOUNDER_TYPES}
      selectedCompany={selectedCompany}
      selectedActionCompany={selectedActionCompany}
      isActionDialogOpen={isActionDialogOpen}
      setSearchTerm={setSearchTerm}
      setSelectedStageFilter={setSelectedStageFilter}
      setSelectedFounderType={setSelectedFounderType}
      fetchPortfolioCompanies={fetchPortfolioCompanies}
      handleExportPortfolio={handleExportPortfolio}
      handleViewCompany={handleViewCompany}
      handleCloseDialog={handleCloseDialog}
      handleTakeAction={handleTakeAction}
      handleCloseActionDialog={handleCloseActionDialog}
      executeAction={executeAction}
      PortfolioFiltersView={PortfolioFiltersView}
      VentureCardView={VentureCardView}
      CompanyDetailModalView={CompanyDetailModalView}
      ActionDialogView={ActionDialogView}
    />
  )
}
