"use client"

import { DealFlowContent } from "./components/deal-flow-content"
import { DealFlowHeader } from "./components/deal-flow-header"
import { useDealFlow } from "./hooks/use-deal-flow"

export default function DealFlowPage() {
  const dealFlow = useDealFlow()

  return (
    <div className="space-y-6">
      {!dealFlow.loading && !dealFlow.error && (
        <DealFlowHeader
          isExporting={dealFlow.isExporting}
          onExport={() => void dealFlow.actions.handleExportPipeline()}
          onAddDeal={dealFlow.actions.handleAddNewDeal}
        />
      )}
      <DealFlowContent state={dealFlow} />
    </div>
  )
}
