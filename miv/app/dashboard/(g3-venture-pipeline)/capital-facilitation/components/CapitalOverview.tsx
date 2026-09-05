"use client"

import { useMemo, useState } from "react"
import { CapitalFilters } from "./CapitalFilters"
import { CapitalFacilitationTable } from "./CapitalFacilitationTable"
import { capitalVenturesDemo, fundingStageOptions, fundingStatusOptions } from "../lib/demo-data"

const ALL_STAGES = fundingStageOptions[0]
const ALL_STATUSES = fundingStatusOptions[0]

export function CapitalOverview() {
  const [search, setSearch] = useState("")
  const [fundingStage, setFundingStage] = useState(ALL_STAGES)
  const [status, setStatus] = useState(ALL_STATUSES)

  const filteredVentures = useMemo(() => {
    const query = search.trim().toLowerCase()
    return capitalVenturesDemo.filter((venture) => {
      const matchesSearch = !query || venture.ventureName.toLowerCase().includes(query)
      const matchesStage = fundingStage === ALL_STAGES || venture.fundingStage === fundingStage
      const matchesStatus = status === ALL_STATUSES || venture.status === status
      return matchesSearch && matchesStage && matchesStatus
    })
  }, [search, fundingStage, status])

  const resetFilters = () => {
    setSearch("")
    setFundingStage(ALL_STAGES)
    setStatus(ALL_STATUSES)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Venture Capital Overview</h2>
        <p className="text-sm text-muted-foreground">
          Monitor funding requirements, secured capital and fundraising progress across active ventures.
        </p>
      </div>
      <CapitalFilters
        search={search}
        onSearchChange={setSearch}
        fundingStage={fundingStage}
        onFundingStageChange={setFundingStage}
        status={status}
        onStatusChange={setStatus}
        fundingStageOptions={fundingStageOptions}
        statusOptions={fundingStatusOptions}
        onReset={resetFilters}
      />
      <CapitalFacilitationTable requests={filteredVentures} />
    </div>
  )
}
