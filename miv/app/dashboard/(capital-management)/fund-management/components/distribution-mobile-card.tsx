"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Distribution } from "../types/fund-management"
import { Eye, Edit, Download } from "lucide-react"

interface DistributionMobileCardProps {
  distribution: Distribution
}

export function DistributionMobileCard({ distribution }: Readonly<DistributionMobileCardProps>) {
  const paymentRate = (distribution.lpsPaid / distribution.totalLps) * 100

  let badgeVariant: "default" | "secondary" | "outline" = "outline"
  if (distribution.status === "paid") {
    badgeVariant = "default"
  } else if (distribution.status === "processing") {
    badgeVariant = "secondary"
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-700 bg-slate-900 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.45)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
          Distribution
        </span>
        <Badge variant={badgeVariant} className="text-[10px] font-medium">
          {distribution.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="rounded-[20px] border border-slate-700 bg-[#1a2333] p-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{distribution.fundName}</p>
            <p className="mt-1 text-[11px] text-slate-400">{distribution.distributionNumber}</p>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-2">
            <p className="text-slate-400">Amount</p>
            <p className="mt-1 font-semibold text-white">{distribution.amount}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-2">
            <p className="text-slate-400">Date</p>
            <p className="mt-1 font-semibold text-white">{distribution.date}</p>
          </div>
        </div>

        <div className="mb-3 flex gap-1.5">
          <Badge variant="secondary" className="flex-1 justify-center bg-emerald-500/10 text-[10px] text-emerald-200">
            {distribution.type.replace("_", " ")}
          </Badge>
          <Badge variant="outline" className="flex-1 justify-center border-slate-600 bg-slate-800 text-[10px] text-slate-100">
            {distribution.currency}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
            <span>LP payments</span>
            <span className="font-medium text-slate-100">
              {distribution.lpsPaid}/{distribution.totalLps}
            </span>
          </div>
          <Progress value={paymentRate} className="h-2 bg-slate-700" />
        </div>

        {distribution.sourceVentures && distribution.sourceVentures.length > 0 && (
          <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-200">Source ventures</p>
            <div className="flex flex-wrap gap-1.5">
              {distribution.sourceVentures.slice(0, 2).map((venture) => (
                <Badge key={venture} variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-100">
                  {venture}
                </Badge>
              ))}
              {distribution.sourceVentures.length > 2 && (
                <Badge variant="outline" className="border-slate-600 bg-slate-800 text-[10px] text-slate-200">
                  +{distribution.sourceVentures.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {(distribution.taxReporting || distribution.k1Generated) && (
          <div className="mb-3 flex flex-wrap gap-2 text-[10px] text-slate-300">
            {distribution.taxReporting && (
              <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-1">✓ Tax reporting</span>
            )}
            {distribution.k1Generated && (
              <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-1">✓ K-1 ready</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5">
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-600 bg-slate-800 text-[10px] text-slate-100 hover:bg-slate-700">
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-600 bg-slate-800 text-[10px] text-slate-100 hover:bg-slate-700">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-600 bg-slate-800 text-[10px] text-slate-100 hover:bg-slate-700">
            <Download className="mr-1 h-3 w-3" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
