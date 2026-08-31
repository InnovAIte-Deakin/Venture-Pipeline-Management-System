"use client"

interface PortfolioFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedStageFilter: string
  onStageFilterChange: (value: string) => void
  selectedFounderType: string
  onFounderTypeChange: (value: string) => void
  founderTypes: string[]
}

const stageOptions = [
  { value: "portfolio", label: "Portfolio" },
  { value: "all", label: "All ventures" },
]

const activePill = "text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#0F6E56] text-[#E1F5EE]"
const inactivePill = "text-xs px-3.5 py-1.5 rounded-full border border-[#9FE1CB] text-[#0F6E56]"

const formatFounderType = (type: string) =>
  type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

export function PortfolioFilters({
  searchTerm,
  onSearchChange,
  selectedStageFilter,
  onStageFilterChange,
  selectedFounderType,
  onFounderTypeChange,
  founderTypes,
}: PortfolioFiltersProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search ventures"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full h-9 box-border rounded-lg border border-[#E5E4DE] px-3 text-[13px] mb-3.5 bg-white text-[#2C2C2A] placeholder:text-[#888780] focus:outline-none focus:ring-1 focus:ring-[#0F6E56]"
      />

      <div className="text-[11px] font-medium text-[#888780] tracking-wide uppercase mb-2">Stage</div>
      <div className="flex flex-wrap gap-2 mb-3.5">
        {stageOptions.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStageFilterChange(opt.value)}
            className={selectedStageFilter === opt.value ? activePill : inactivePill}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="text-[11px] font-medium text-[#888780] tracking-wide uppercase mb-2">Founder Type</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onFounderTypeChange("all")}
          className={selectedFounderType === "all" ? activePill : inactivePill}
        >
          All types
        </button>
        {founderTypes.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => onFounderTypeChange(type)}
            className={selectedFounderType === type ? activePill : inactivePill}
          >
            {formatFounderType(type)}
          </button>
        ))}
      </div>
    </div>
  )
}
