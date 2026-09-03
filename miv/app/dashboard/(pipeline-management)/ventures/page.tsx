"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, Building2, Calendar, Download, Edit, Eye, MapPin, Plus, RefreshCw, Target, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { VentureFilters } from "./VentureFilters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  asText,
  filterVentures,
  formatCurrency,
  formatLabel,
  getFundingAmount,
  getGedsiScore,
  getFoundedYear,
  getTeamSize,
  getUniqueSectors,
  getVentureDetailsPath,
  getVentureDescription,
  requestVentures,
  summarizeVentures,
  type VentureFiltersState,
  type VentureRecord,
} from "@/lib/ventures"

const defaultFilters: VentureFiltersState = {
  search: "",
  status: "all",
  stage: "all",
  sector: "all",
}

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    INTAKE: "bg-sky-100 text-sky-800",
    SCREENING: "bg-amber-100 text-amber-800",
    DUE_DILIGENCE: "bg-indigo-100 text-indigo-800",
    INVESTMENT_READY: "bg-emerald-100 text-emerald-800",
    FUNDED: "bg-green-100 text-green-800",
    EXITED: "bg-gray-100 text-gray-800",
    SEED: "bg-cyan-100 text-cyan-800",
    SERIES_A: "bg-blue-100 text-blue-800",
    SERIES_B: "bg-violet-100 text-violet-800",
    SERIES_C: "bg-purple-100 text-purple-800",
  }

  return colors[stage] || "bg-gray-100 text-gray-800"
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    ARCHIVED: "bg-slate-100 text-slate-800",
  }

  return colors[status] || "bg-gray-100 text-gray-800"
}

export default function VenturesPage() {
  const [ventures, setVentures] = useState<VentureRecord[]>([])
  const [filters, setFilters] = useState<VentureFiltersState>(defaultFilters)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadVentures = useCallback(async ({ refresh = false } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const data = await requestVentures()
      setVentures(data.ventures)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load ventures."
      setError(message)
      setVentures([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadVentures()
  }, [loadVentures])

  const filteredVentures = useMemo(() => filterVentures(ventures, filters), [ventures, filters])
  const summary = useMemo(() => summarizeVentures(ventures), [ventures])
  const sectors = useMemo(() => getUniqueSectors(ventures), [ventures])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
          <p className="text-gray-600">Loading ventures...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">Ventures</h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">Manage and track all ventures in the pipeline</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
          <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" disabled>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => void loadVentures({ refresh: true })}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/venture-intake">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Venture
            </Link>
          </Button>
        </div>
      </header>

      {error && <VenturesError message={error} onRetry={() => void loadVentures()} />}

      {!error && ventures.length === 0 && <EmptyVentures />}

      {!error && ventures.length > 0 && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Venture statistics">
            <StatCard icon={Building2} iconClassName="text-blue-500" label="Total Ventures" value={summary.totalVentures.toString()} />
            <StatCard icon={Download} iconClassName="text-green-500" label="Total Funding" value={formatCurrency(summary.totalFunding)} />
            <StatCard icon={Users} iconClassName="text-purple-500" label="Total Team Members" value={summary.totalTeamMembers.toString()} />
            <StatCard icon={Target} iconClassName="text-orange-500" label="Avg GEDSI Score" value={`${summary.averageGedsiScore}%`} />
          </section>

          <VentureFilters
            filters={filters}
            sectors={sectors}
            resultCount={filteredVentures.length}
            totalCount={ventures.length}
            onChange={setFilters}
          />

          <Card>
            <CardHeader>
              <CardTitle>All Ventures ({filteredVentures.length})</CardTitle>
              <CardDescription>Open a venture to view detailed pipeline information</CardDescription>
            </CardHeader>
            <CardContent>
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
                      {filteredVentures.map((venture) => (
                        <VentureTableRow key={venture.id} venture={venture} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-3 md:hidden">
                {filteredVentures.map((venture) => (
                  <VentureMobileItem key={venture.id} venture={venture} />
                ))}
              </div>

              {filteredVentures.length === 0 && (
                <div className="py-8 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" aria-hidden="true" />
                  <p className="text-gray-500">No ventures found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </main>
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

function VenturesError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-medium text-red-800">Unable to load ventures</p>
              <p className="break-words text-sm text-red-600">{message}</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onRetry} className="w-full sm:w-auto">
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyVentures() {
  return (
    <Card>
      <CardContent className="p-8 text-center sm:p-12">
        <Building2 className="mx-auto mb-4 h-14 w-14 text-muted-foreground sm:h-16 sm:w-16" aria-hidden="true" />
        <h2 className="mb-2 text-lg font-semibold sm:text-xl">No Ventures Found</h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground sm:text-base">
          Start building your portfolio by adding your first venture to the pipeline.
        </p>
        <Button asChild>
          <Link href="/dashboard/venture-intake">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add First Venture
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function VentureTableRow({ venture }: { venture: VentureRecord }) {
  const stage = asText(venture.stage, "UNKNOWN")
  const status = asText(venture.status, "UNKNOWN")
  const gedsiScore = getGedsiScore(venture)

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <VentureIdentity venture={venture} />
      </TableCell>
      <TableCell>
        <Badge className={getStageColor(stage)}>{formatLabel(stage)}</Badge>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(status)}>{formatLabel(status)}</Badge>
      </TableCell>
      <TableCell>
        <IconText icon={MapPin} text={asText(venture.location)} />
      </TableCell>
      <TableCell className="font-medium">{formatCurrency(getFundingAmount(venture))}</TableCell>
      <TableCell>
        <GedsiMeter score={gedsiScore} />
      </TableCell>
      <TableCell>
        <IconText icon={Users} text={getTeamSize(venture).toString()} />
      </TableCell>
      <TableCell>
        <IconText icon={Calendar} text={String(getFoundedYear(venture))} />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon" aria-label={`View details for ${venture.name}`}>
            <Link href={getVentureDetailsPath(venture.id)}>
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label={`Edit ${venture.name}`}>
            <Link href={`${getVentureDetailsPath(venture.id)}?mode=edit`}>
              <Edit className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

function VentureMobileItem({ venture }: { venture: VentureRecord }) {
  const stage = asText(venture.stage, "UNKNOWN")
  const status = asText(venture.status, "UNKNOWN")
  const description = getVentureDescription(venture)

  return (
    <article className="rounded-md border p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <Building2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-medium text-gray-900">{venture.name}</h3>
          <p className="text-sm text-gray-500">{asText(venture.sector)}</p>
        </div>
      </div>
      {description && <p className="mt-3 line-clamp-2 break-words text-sm text-gray-600">{description}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className={getStageColor(stage)}>{formatLabel(stage)}</Badge>
        <Badge className={getStatusColor(status)}>{formatLabel(status)}</Badge>
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
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={getVentureDetailsPath(venture.id)}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            View
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`${getVentureDetailsPath(venture.id)}?mode=edit`}>
            <Edit className="h-4 w-4" aria-hidden="true" />
            Edit
          </Link>
        </Button>
      </div>
    </article>
  )
}

function VentureIdentity({ venture }: { venture: VentureRecord }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
        <Building2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <Link href={getVentureDetailsPath(venture.id)} className="font-medium text-gray-900 underline-offset-4 hover:underline">
          {venture.name}
        </Link>
        <p className="truncate text-sm text-gray-500">{asText(venture.sector)}</p>
      </div>
    </div>
  )
}

function IconText({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <Icon className="h-3 w-3 shrink-0 text-gray-400" aria-hidden="true" />
      <span className="truncate text-sm">{text}</span>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase text-gray-500">{label}</dt>
      <dd className="break-words font-medium text-gray-900">{value}</dd>
    </div>
  )
}

function GedsiMeter({ score }: { score: number }) {
  const color =
    score >= 80
      ? "[&_[data-slot=progress-indicator]]:bg-green-500"
      : score >= 60
        ? "[&_[data-slot=progress-indicator]]:bg-yellow-500"
        : "[&_[data-slot=progress-indicator]]:bg-red-500"

  return (
    <div className="flex min-w-[110px] items-center gap-2">
      <Progress value={score} className={`h-2 ${color}`} aria-label={`GEDSI score ${score}%`} />
      <span className="w-10 text-sm font-medium">{score}%</span>
    </div>
  )
}
