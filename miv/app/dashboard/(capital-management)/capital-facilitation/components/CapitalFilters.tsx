"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RotateCcw, Search } from "lucide-react"

interface CapitalFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  fundingStage: string
  onFundingStageChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  fundingStageOptions: string[]
  statusOptions: string[]
  onReset: () => void
}

export function CapitalFilters({
  search,
  onSearchChange,
  fundingStage,
  onFundingStageChange,
  status,
  onStatusChange,
  fundingStageOptions,
  statusOptions,
  onReset,
}: CapitalFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search ventures..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={fundingStage} onValueChange={onFundingStageChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Funding Stage" />
        </SelectTrigger>
        <SelectContent>
          {fundingStageOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  )
}
