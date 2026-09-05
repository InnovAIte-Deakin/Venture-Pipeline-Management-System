"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CapitalCall } from "../types/fund-management"
import { Eye, Edit, Download } from "lucide-react"

interface CapitalCallMobileCardProps {
  call: CapitalCall
}

export function CapitalCallMobileCard({ call }: Readonly<CapitalCallMobileCardProps>) {
  const responseRate = (call.lpsResponded / call.totalLps) * 100

  let badgeVariant: "default" | "secondary" | "outline" = "outline"
  if (call.status === "completed") {
    badgeVariant = "default"
  } else if (call.status === "in_progress") {
    badgeVariant = "secondary"
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-700 bg-slate-900 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.45)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
          Capital call
        </span>
        <Badge variant={badgeVariant} className="text-[10px] font-medium">
          {call.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="rounded-[20px] border border-slate-700 bg-[#1a2333] p-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{call.fundName}</p>
            <p className="mt-1 text-[11px] text-slate-400">Call {call.callNumber}</p>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-2">
            <p className="text-slate-400">Amount</p>
            <p className="mt-1 font-semibold text-white">{call.amount}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-2">
            <p className="text-slate-400">Due</p>
            <p className="mt-1 font-semibold text-white">{call.dueDate}</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
            <span>LP responses</span>
            <span className="font-medium text-slate-100">
              {call.lpsResponded}/{call.totalLps}
            </span>
          </div>
          <Progress value={responseRate} className="h-2 bg-slate-700" />
        </div>

        {call.investments && call.investments.length > 0 && (
          <div className="mb-3 rounded-xl border border-sky-500/30 bg-sky-500/10 p-2">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-sky-200">Target ventures</p>
            <div className="flex flex-wrap gap-1.5">
              {call.investments.slice(0, 2).map((inv) => (
                <Badge key={inv} variant="outline" className="border-sky-500/30 bg-sky-500/10 text-[10px] text-sky-100">
                  {inv}
                </Badge>
              ))}
              {call.investments.length > 2 && (
                <Badge variant="outline" className="border-slate-600 bg-slate-800 text-[10px] text-slate-200">
                  +{call.investments.length - 2} more
                </Badge>
              )}
            </div>
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
