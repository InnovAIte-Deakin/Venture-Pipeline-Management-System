"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { AddDealDialog } from "./dialogs/add-deal-dialog"
import { DealDetailDialog } from "./dialogs/deal-detail-dialog"
import { DealEditorDialog } from "./dialogs/deal-editor-dialog"
import { StageDealsDialog } from "./dialogs/stage-deals-dialog"
import { DealFlowDesktop } from "./desktop/deal-flow-desktop"
import { DealFlowMobile } from "./mobile/deal-flow-mobile"
import type { Deal, DealFlowState } from "../types/deal-flow.types"

export function DealFlowContent({ state }: { state: DealFlowState }) {
  if (state.loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-3" role="status" aria-live="polite">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            <span>Loading deal flow from database...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (state.error) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
        <XCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
        <AlertDescription>
          <strong>Error:</strong> {state.error}
          <Button variant="link" className="ml-2 h-auto p-0 text-red-600 underline" onClick={() => void state.actions.refreshDeals()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const viewFromStage = (deal: Deal) => {
    state.actions.setStageDealsDialog((current) => ({ ...current, open: false }))
    state.actions.handleViewDeal(deal)
  }

  const editFromStage = (deal: Deal) => {
    state.actions.setStageDealsDialog((current) => ({ ...current, open: false }))
    state.actions.handleEditDeal(deal)
  }

  const addFromStage = () => {
    state.actions.setStageDealsDialog((current) => ({ ...current, open: false }))
    state.actions.handleAddNewDeal()
  }

  const filterFromStageDialog = () => {
    if (state.dialogs.stageDeals.stage) {
      state.actions.handleStageFilter(state.dialogs.stageDeals.stage)
      state.actions.setStageDealsDialog((current) => ({ ...current, open: false }))
    }
  }

  return (
    <>
      <div className="hidden md:block">
        <DealFlowDesktop state={state} />
      </div>
      <div className="block md:hidden">
        <DealFlowMobile state={state} />
      </div>

      <DealDetailDialog deal={state.selectedDeal} open={state.dialogs.viewOpen} onOpenChange={state.actions.closeViewDialog} />
      <DealEditorDialog deal={state.selectedDeal} open={state.dialogs.editOpen} onOpenChange={state.actions.closeEditDialog} />
      <AddDealDialog open={state.dialogs.addOpen} onOpenChange={state.actions.closeAddDealDialog} />
      <StageDealsDialog
        state={state.dialogs.stageDeals}
        onOpenChange={(open) => state.actions.setStageDealsDialog((current) => ({ ...current, open }))}
        onViewDeal={viewFromStage}
        onEditDeal={editFromStage}
        onStageFilter={filterFromStageDialog}
        onAddDeal={addFromStage}
      />
    </>
  )
}
