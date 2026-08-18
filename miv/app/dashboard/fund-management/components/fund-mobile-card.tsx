"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Fund } from "../types/fund-management"
import { MoreVertical } from "lucide-react"

interface FundMobileCardProps {
  fund: Fund
  onView?: (fund: Fund) => void
}

export function FundMobileCard({ fund, onView }: Readonly<FundMobileCardProps>) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-700 bg-slate-900 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.45)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
          Fund overview
        </span>
        <Badge className="border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-medium text-emerald-300">
          {fund.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="rounded-[20px] border border-slate-700 bg-[#1a2333] p-3">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{fund.name}</p>
            <p className="mt-1 text-[11px] text-slate-400">{fund.vintage}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 flex-shrink-0 rounded-full border border-slate-600 bg-slate-800 p-0 text-slate-300 hover:bg-slate-700">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-600 bg-slate-800/80 p-2">
            <p className="text-[10px] text-slate-400">Size</p>
            <p className="mt-1 text-xs font-semibold text-white">{fund.size}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
            <p className="text-[10px] text-emerald-200">IRR</p>
            <p className="mt-1 text-xs font-semibold text-emerald-300">{fund.irr.toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-slate-600 bg-slate-800/80 p-2">
            <p className="text-[10px] text-slate-400">TVPI</p>
            <p className="mt-1 text-xs font-semibold text-white">{fund.tvpi.toFixed(2)}x</p>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-2">
            <p className="text-slate-400">Called</p>
            <p className="mt-1 font-medium text-white">{fund.calledCapital}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-2">
            <p className="text-slate-400">NAV</p>
            <p className="mt-1 font-medium text-white">{fund.netAssetValue}</p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="border-slate-600 bg-slate-800 text-[10px] text-slate-200">
            {fund.fundType}
          </Badge>
          <Badge variant="outline" className="border-slate-600 bg-slate-800 text-[10px] text-slate-200">
            {fund.geography}
          </Badge>
        </div>

        <Button className="h-9 w-full rounded-xl bg-sky-500 text-xs font-medium text-white hover:bg-sky-400" onClick={() => onView?.(fund)}>
          View fund details
        </Button>
      </div>
    </div>
  )
}
