"use client"

import { useMemo, useState } from "react"
import {
  capitalFacilitationDemoData,
  capitalFacilitationSummary,
  capitalPipelineSummary,
  fundingStageOptions,
  statusOptions,
} from "@/lib/capital-facilitation/demo-data"
import { CapitalFacilitationHeader } from "@/components/capital-facilitation/CapitalFacilitationHeader"
import { CapitalSummaryCards } from "@/components/capital-facilitation/CapitalSummaryCards"
import { CapitalFilters } from "@/components/capital-facilitation/CapitalFilters"
import { CapitalFacilitationTable } from "@/components/capital-facilitation/CapitalFacilitationTable"
import { CapitalPipeline } from "@/components/capital-facilitation/CapitalPipeline"

const ALL_STAGES = fundingStageOptions[0]
const ALL_STATUSES = statusOptions[0]

export default function CapitalFacilitation() {
  const [search, setSearch] = useState("")
  const [fundingStage, setFundingStage] = useState(ALL_STAGES)
  const [status, setStatus] = useState(ALL_STATUSES)

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase()
    return capitalFacilitationDemoData.filter((request) => {
      const matchesSearch = !query || request.ventureName.toLowerCase().includes(query)
      const matchesStage = fundingStage === ALL_STAGES || request.fundingStage === fundingStage
      const matchesStatus = status === ALL_STATUSES || request.status === status
      return matchesSearch && matchesStage && matchesStatus
    })
  }, [search, fundingStage, status])

  const resetFilters = () => {
    setSearch("")
    setFundingStage(ALL_STAGES)
    setStatus(ALL_STATUSES)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="space-y-6 p-4 sm:p-6">
        <CapitalFacilitationHeader />
        <CapitalSummaryCards cards={capitalFacilitationSummary} />
        <CapitalFilters
          search={search}
          onSearchChange={setSearch}
          fundingStage={fundingStage}
          onFundingStageChange={setFundingStage}
          status={status}
          onStatusChange={setStatus}
          fundingStageOptions={fundingStageOptions}
          statusOptions={statusOptions}
          onReset={resetFilters}
        />
        <CapitalFacilitationTable requests={filteredRequests} />
        <CapitalPipeline stages={capitalPipelineSummary} />
      </div>
    </div>
  )
}
