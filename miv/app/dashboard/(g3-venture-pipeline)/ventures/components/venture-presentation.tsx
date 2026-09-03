"use client"

import Link from "next/link"
import { Building2, Calendar, MapPin, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  asText,
  formatLabel,
  getVentureDetailsPath,
  type VentureRecord,
} from "@/lib/ventures"

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

export function VentureIdentity({ venture }: { venture: VentureRecord }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <VentureIcon />
      <div className="min-w-0">
        <Link href={getVentureDetailsPath(venture.id)} className="font-medium text-gray-900 underline-offset-4 hover:underline">
          {venture.name}
        </Link>
        <p className="truncate text-sm text-gray-500">{asText(venture.sector)}</p>
      </div>
    </div>
  )
}

export function VentureIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
      <Building2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
    </div>
  )
}

export function StageBadge({ stage }: { stage: string | null | undefined }) {
  const value = asText(stage, "UNKNOWN")

  return <Badge className={getStageColor(value)}>{formatLabel(value)}</Badge>
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const value = asText(status, "UNKNOWN")

  return <Badge className={getStatusColor(value)}>{formatLabel(value)}</Badge>
}

export function IconText({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <Icon className="h-3 w-3 shrink-0 text-gray-400" aria-hidden="true" />
      <span className="truncate text-sm">{text}</span>
    </div>
  )
}

export function LocationText({ location }: { location: string | null | undefined }) {
  return <IconText icon={MapPin} text={asText(location)} />
}

export function TeamSizeText({ teamSize }: { teamSize: string }) {
  return <IconText icon={Users} text={teamSize} />
}

export function FoundedText({ foundedYear }: { foundedYear: string }) {
  return <IconText icon={Calendar} text={foundedYear} />
}

export function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase text-gray-500">{label}</dt>
      <dd className="break-words font-medium text-gray-900">{value}</dd>
    </div>
  )
}

export function GedsiMeter({ score }: { score: number }) {
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
