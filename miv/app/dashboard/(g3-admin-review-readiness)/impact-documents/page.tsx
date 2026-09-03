"use client"

import { RefreshCw } from "lucide-react"
import { DocumentFeedback } from "./components/document-feedback"
import { DocumentFilters } from "./components/document-filters"
import { DocumentList } from "./components/document-list"
import { DocumentSummaryCards } from "./components/document-summary-cards"
import { useImpactDocuments } from "./hooks/use-impact-documents"

export default function ImpactDocumentsPage() {
  const {
    filteredDocuments,
    stats,
    loading,
    error,
    success,
    pendingActions,
    filters,
    actions,
  } = useImpactDocuments()

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                Impact Documents Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                Review and manage documents uploaded by venture founders
              </p>
            </div>
            <button
              type="button"
              onClick={actions.refreshDocuments}
              disabled={loading}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </header>

        <DocumentSummaryCards stats={stats} />

        <DocumentFeedback
          error={error}
          success={success}
          onDismissError={actions.dismissError}
          onDismissSuccess={actions.dismissSuccess}
        />

        <DocumentFilters
          searchQuery={filters.searchQuery}
          selectedType={filters.selectedType}
          selectedStatus={filters.selectedStatus}
          onSearchQueryChange={filters.setSearchQuery}
          onSelectedTypeChange={filters.setSelectedType}
          onSelectedStatusChange={filters.setSelectedStatus}
        />

        <section className="overflow-hidden rounded-lg bg-white shadow-sm" aria-labelledby="impact-documents-heading">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <h2 id="impact-documents-heading" className="text-lg font-semibold text-gray-900">
              Documents ({filteredDocuments.length})
            </h2>
          </div>

          <DocumentList
            documents={filteredDocuments}
            loading={loading}
            pendingActions={pendingActions}
            onStatusUpdate={actions.updateStatus}
            onDelete={actions.deleteDocument}
            onDownload={actions.downloadDocument}
          />
        </section>
      </div>
    </div>
  )
}
