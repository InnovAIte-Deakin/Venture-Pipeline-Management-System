"use client"

import { Building2, Download, Target, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, type VentureSummary } from "@/lib/ventures"

export function VentureSummaryCards({ summary }: { summary: VentureSummary }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Venture statistics">
      <StatCard icon={Building2} iconClassName="text-blue-500" label="Total Ventures" value={summary.totalVentures.toString()} />
      <StatCard icon={Download} iconClassName="text-green-500" label="Total Funding" value={formatCurrency(summary.totalFunding)} />
      <StatCard icon={Users} iconClassName="text-purple-500" label="Total Team Members" value={summary.totalTeamMembers.toString()} />
      <StatCard icon={Target} iconClassName="text-orange-500" label="Avg GEDSI Score" value={`${summary.averageGedsiScore}%`} />
    </section>
  )
}

function StatCard({
  icon: Icon,
  iconClassName,
  label,
  value,
}: {
  icon: LucideIcon
  iconClassName: string
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <Icon className={`h-5 w-5 shrink-0 ${iconClassName}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="break-words text-xl font-bold sm:text-2xl">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
