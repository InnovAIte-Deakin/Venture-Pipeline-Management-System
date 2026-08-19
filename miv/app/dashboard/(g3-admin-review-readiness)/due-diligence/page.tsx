"use client"

import { DueDiligenceAnalytics } from "./components/due-diligence-analytics"
import { DueDiligenceHeader } from "./components/due-diligence-header"
import { DueDiligenceLoadingState, DueDiligenceErrorState } from "./components/due-diligence-states"
import { DueDiligenceSummary } from "./components/due-diligence-summary"
import { DueDiligenceTabs } from "./components/due-diligence-tabs"
import { ItemEditDialog } from "./components/dialogs/item-edit-dialog"
import { ItemViewDialog } from "./components/dialogs/item-view-dialog"
import { NewDueDiligenceDialog } from "./components/dialogs/new-due-diligence-dialog"
import { ReportConfigDialog } from "./components/dialogs/report-config-dialog"
import { DUE_DILIGENCE_CATEGORIES } from "./constants/due-diligence.constants"
import { useDueDiligence } from "./hooks/use-due-diligence"

export default function DueDiligencePage() {
  const dueDiligence = useDueDiligence()

  return (
    <div className="space-y-6">
      <DueDiligenceLoadingState loading={dueDiligence.loading} />
      <DueDiligenceErrorState
        error={dueDiligence.error}
        onRetry={dueDiligence.fetchDueDiligenceData}
      />

      {!dueDiligence.loading && !dueDiligence.error && (
        <>
          <DueDiligenceHeader
            viewMode={dueDiligence.viewMode}
            selectedVentureForDetails={dueDiligence.selectedVentureForDetails}
            loading={dueDiligence.loading}
            filteredItemsCount={dueDiligence.filteredItems.length}
            onSetViewMode={dueDiligence.setViewMode}
            onSetSelectedVentureForDetails={dueDiligence.setSelectedVentureForDetails}
            onSetSearchTerm={dueDiligence.setSearchTerm}
            onBackToVentures={dueDiligence.handleBackToVentures}
            onNewDueDiligence={dueDiligence.handleNewDueDiligence}
          />

          <DueDiligenceSummary
            viewMode={dueDiligence.viewMode}
            venturesDDs={dueDiligence.venturesDDs}
            filteredItems={dueDiligence.filteredItems}
          />

          <DueDiligenceAnalytics
            categories={DUE_DILIGENCE_CATEGORIES}
            filteredItems={dueDiligence.filteredItems}
          />

          <DueDiligenceTabs state={dueDiligence} />

          <ReportConfigDialog
            open={dueDiligence.isReportConfigOpen}
            onOpenChange={dueDiligence.setIsReportConfigOpen}
            selectedReportType={dueDiligence.selectedReportType}
            selectedVenture={dueDiligence.selectedVenture}
            setSelectedVenture={dueDiligence.setSelectedVenture}
            reportFormat={dueDiligence.reportFormat}
            setReportFormat={dueDiligence.setReportFormat}
            reportSections={dueDiligence.reportSections}
            setReportSections={dueDiligence.setReportSections}
            onGenerateReport={dueDiligence.generateCustomReport}
          />

          <NewDueDiligenceDialog
            open={dueDiligence.isNewDDDialogOpen}
            onOpenChange={dueDiligence.setIsNewDDDialogOpen}
            categories={DUE_DILIGENCE_CATEGORIES}
          />

          <ItemViewDialog
            open={dueDiligence.isViewDialogOpen}
            onOpenChange={dueDiligence.setIsViewDialogOpen}
            selectedItem={dueDiligence.selectedItem}
            onEditItem={dueDiligence.handleEditItem}
            onCommentItem={dueDiligence.handleCommentItem}
          />

          <ItemEditDialog
            open={dueDiligence.isEditDialogOpen}
            onOpenChange={dueDiligence.setIsEditDialogOpen}
            selectedItem={dueDiligence.selectedItem}
          />
        </>
      )}
    </div>
  )
}
