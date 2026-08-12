import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DUE_DILIGENCE_CATEGORIES,
  DUE_DILIGENCE_STAGES
} from "../constants/due-diligence.constants"
import type { UseDueDiligenceResult } from "../types/due-diligence.types"
import { ChecklistSection } from "./checklist-section"
import { DueDiligenceItemsTable } from "./desktop/due-diligence-items-table"
import { DocumentsSection } from "./documents-section"
import { InsightsSection } from "./insights-section"
import { ItemFilters } from "./item-filters"
import { MobileTabsViewport } from "./mobile/due-diligence-mobile"
import { ReportsSection } from "./reports-section"
import { TimelineSection } from "./timeline-section"
import { VentureOverviewGrid } from "./venture-overview-grid"

interface DueDiligenceTabsProps {
  state: UseDueDiligenceResult
}

export function DueDiligenceTabs({ state }: DueDiligenceTabsProps) {
  const clearEmptyFilters = () => {
    state.setSearchTerm("")
    state.setSelectedCategory("all")
    state.setSelectedStage("all")
    state.setSelectedStatus("all")
    state.setSelectedPriority("all")
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <MobileTabsViewport>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
      </MobileTabsViewport>

      <TabsContent value="overview" className="space-y-4">
        {state.viewMode === "ventures" ? (
          <VentureOverviewGrid
            venturesDDs={state.venturesDDs}
            onViewVentureDetails={state.handleViewVentureDetails}
            onStartDueDiligence={() => state.setIsNewDDDialogOpen(true)}
          />
        ) : (
          <>
            <ItemFilters
              selectedVentureForDetails={state.selectedVentureForDetails}
              searchTerm={state.searchTerm}
              setSearchTerm={state.setSearchTerm}
              selectedCategory={state.selectedCategory}
              setSelectedCategory={state.setSelectedCategory}
              selectedStage={state.selectedStage}
              setSelectedStage={state.setSelectedStage}
              selectedStatus={state.selectedStatus}
              setSelectedStatus={state.setSelectedStatus}
              selectedPriority={state.selectedPriority}
              setSelectedPriority={state.setSelectedPriority}
              sortBy={state.sortBy}
              setSortBy={state.setSortBy}
              showAdvancedFilters={state.showAdvancedFilters}
              setShowAdvancedFilters={state.setShowAdvancedFilters}
              dateRange={state.dateRange}
              setDateRange={state.setDateRange}
              categories={DUE_DILIGENCE_CATEGORIES}
              stages={DUE_DILIGENCE_STAGES}
            />

            <DueDiligenceItemsTable
              selectedVentureForDetails={state.selectedVentureForDetails}
              filteredItems={state.filteredItems}
              paginatedItems={state.paginatedItems}
              selectedItems={state.selectedItems}
              setSelectedItems={state.setSelectedItems}
              searchTerm={state.searchTerm}
              selectedCategory={state.selectedCategory}
              selectedStage={state.selectedStage}
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              startIndex={state.startIndex}
              endIndex={state.endIndex}
              onPageChange={state.handlePageChange}
              onViewItem={state.handleViewItem}
              onEditItem={state.handleEditItem}
              onCommentItem={state.handleCommentItem}
              onMoreActions={state.handleMoreActions}
              onClearEmptyFilters={clearEmptyFilters}
              onStartDueDiligence={() => state.setIsNewDDDialogOpen(true)}
            />
          </>
        )}
      </TabsContent>

      <TabsContent value="timeline" className="space-y-4">
        <TimelineSection filteredItems={state.filteredItems} />
      </TabsContent>

      <TabsContent value="checklist" className="space-y-4">
        <ChecklistSection checklistItems={state.checklistItems} />
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <DocumentsSection />
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <ReportsSection
          generatingReport={state.generatingReport}
          openReportConfig={state.openReportConfig}
        />
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <InsightsSection ventures={state.ventures} />
      </TabsContent>
    </Tabs>
  )
}
