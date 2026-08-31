"use client"

import type { PortfolioCompany } from "../../types"
import { getStatusStyle } from "./statusStyles"

interface VentureCardProps {
  company: PortfolioCompany
  onClick: () => void
}

export function VentureCard({ company, onClick }: VentureCardProps) {
  const status = getStatusStyle(company.status)

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E5E4DE] rounded-xl p-3.5 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm font-medium text-[#2C2C2A]">{company.name}</div>
          <div className="text-xs text-[#5F5E5A]">{company.sector} · {company.stage}</div>
        </div>
        <span
          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          {status.label}
        </span>
      </div>
      <div className="flex gap-5 mt-2">
        <div>
          <div className="text-[11px] text-[#888780]">Impact score</div>
          <div className="text-[15px] font-medium text-[#2C2C2A]">{company.impactScore?.toFixed(0) ?? 'N/A'}</div>
        </div>
        <div>
          <div className="text-[11px] text-[#888780]">Readiness</div>
          <div className="text-[15px] font-medium text-[#2C2C2A]">{company.readinessScore?.toFixed(0) ?? 'N/A'}</div>
        </div>
      </div>
    </div>
  )
}
