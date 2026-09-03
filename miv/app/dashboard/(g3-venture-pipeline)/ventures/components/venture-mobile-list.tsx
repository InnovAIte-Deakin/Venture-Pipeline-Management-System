"use client"

import {
  asText,
  formatCurrency,
  getFundingAmount,
  getGedsiScore,
  getFoundedYear,
  getTeamSize,
  getVentureDescription,
  type VentureRecord,
} from "@/lib/ventures"

import { VentureActions } from "./venture-actions"
import { DetailItem, GedsiMeter, StageBadge, StatusBadge, VentureIcon } from "./venture-presentation"

export function VentureMobileList({ ventures }: { ventures: VentureRecord[] }) {
  return (
    <div className="space-y-3 md:hidden">
      {ventures.map((venture) => (
        <VentureMobileItem key={venture.id} venture={venture} />
      ))}
    </div>
  )
}

function VentureMobileItem({ venture }: { venture: VentureRecord }) {
  const description = getVentureDescription(venture)

  return (
    <article className="rounded-md border p-4">
      <div className="flex min-w-0 items-start gap-3">
        <VentureIcon />
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-medium text-gray-900">{venture.name}</h3>
          <p className="text-sm text-gray-500">{asText(venture.sector)}</p>
        </div>
      </div>
      {description && <p className="mt-3 line-clamp-2 break-words text-sm text-gray-600">{description}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <StageBadge stage={venture.stage} />
        <StatusBadge status={venture.status} />
      </div>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <DetailItem label="Location" value={asText(venture.location)} />
        <DetailItem label="Funding" value={formatCurrency(getFundingAmount(venture))} />
        <DetailItem label="Team Size" value={getTeamSize(venture).toString()} />
        <DetailItem label="Founded" value={String(getFoundedYear(venture))} />
      </dl>
      <div className="mt-4">
        <GedsiMeter score={getGedsiScore(venture)} />
      </div>
      <div className="mt-4">
        <VentureActions venture={venture} compact />
      </div>
    </article>
  )
}
