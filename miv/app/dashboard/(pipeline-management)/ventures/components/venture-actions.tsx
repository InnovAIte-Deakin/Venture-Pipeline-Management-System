"use client"

import Link from "next/link"
import { Edit, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getVentureDetailsPath, type VentureRecord } from "@/lib/ventures"

interface VentureActionsProps {
  venture: VentureRecord
  compact?: boolean
}

export function VentureActions({ venture, compact = false }: VentureActionsProps) {
  if (compact) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
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
    )
  }

  return (
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
  )
}
