"use client"

import { Search } from "lucide-react"
import {
  DOCUMENT_TYPES,
  STATUS_OPTIONS,
  type ImpactDocumentStatusFilter,
  type ImpactDocumentTypeFilter,
} from "./lib/impact-documents"

interface ImpactDocumentFiltersProps {
  searchQuery: string
  selectedType: ImpactDocumentTypeFilter
  selectedStatus: ImpactDocumentStatusFilter
  onSearchQueryChange: (value: string) => void
  onSelectedTypeChange: (value: ImpactDocumentTypeFilter) => void
  onSelectedStatusChange: (value: ImpactDocumentStatusFilter) => void
}

function formatStatusLabel(status: string): string {
  if (status === "All Status") return status
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function ImpactDocumentFilters({
  searchQuery,
  selectedType,
  selectedStatus,
  onSearchQueryChange,
  onSelectedTypeChange,
  onSelectedStatusChange,
}: ImpactDocumentFiltersProps) {
  return (
    <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8" aria-label="Document filters">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
        <div>
          <label htmlFor="impact-document-search" className="block text-sm font-medium text-gray-700 mb-1.5">
            Search documents
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="impact-document-search"
              type="search"
              placeholder="Filename, uploader, or venture"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="impact-document-type" className="block text-sm font-medium text-gray-700 mb-1.5">
            Document type
          </label>
          <select
            id="impact-document-type"
            value={selectedType}
            onChange={(event) => onSelectedTypeChange(event.target.value as ImpactDocumentTypeFilter)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="impact-document-status" className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select
            id="impact-document-status"
            value={selectedStatus}
            onChange={(event) => onSelectedStatusChange(event.target.value as ImpactDocumentStatusFilter)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
