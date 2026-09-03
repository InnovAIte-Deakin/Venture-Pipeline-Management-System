"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  formatCurrency,
  getFundingAmount,
  getGedsiScore,
  getFoundedYear,
  getTeamSize,
  type VentureRecord,
} from "@/lib/ventures"

import { VentureActions } from "./venture-actions"
import { FoundedText, GedsiMeter, LocationText, StageBadge, StatusBadge, TeamSizeText, VentureIdentity } from "./venture-presentation"

export function VentureTable({ ventures }: { ventures: VentureRecord[] }) {
  return (
    <div className="hidden md:block">
      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">Venture</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Funding</TableHead>
              <TableHead className="w-[150px]">GEDSI Score</TableHead>
              <TableHead>Team Size</TableHead>
              <TableHead>Founded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventures.map((venture) => (
              <VentureTableRow key={venture.id} venture={venture} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function VentureTableRow({ venture }: { venture: VentureRecord }) {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <VentureIdentity venture={venture} />
      </TableCell>
      <TableCell>
        <StageBadge stage={venture.stage} />
      </TableCell>
      <TableCell>
        <StatusBadge status={venture.status} />
      </TableCell>
      <TableCell>
        <LocationText location={venture.location} />
      </TableCell>
      <TableCell className="font-medium">{formatCurrency(getFundingAmount(venture))}</TableCell>
      <TableCell>
        <GedsiMeter score={getGedsiScore(venture)} />
      </TableCell>
      <TableCell>
        <TeamSizeText teamSize={getTeamSize(venture).toString()} />
      </TableCell>
      <TableCell>
        <FoundedText foundedYear={String(getFoundedYear(venture))} />
      </TableCell>
      <TableCell>
        <VentureActions venture={venture} />
      </TableCell>
    </TableRow>
  )
}
