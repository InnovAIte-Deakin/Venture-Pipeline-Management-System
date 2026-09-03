"use client"

import Link from "next/link"
import { AlertCircle, Building2, Plus, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function VenturesLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
        <p className="text-gray-600">Loading ventures...</p>
      </div>
    </main>
  )
}

export function VenturesError({ message, onRetry }: { message: string; onRetry: () => void }) {
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

export function EmptyVentures() {
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

export function EmptyVentureResults() {
  return (
    <div className="py-8 text-center">
      <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" aria-hidden="true" />
      <p className="text-gray-500">No ventures found matching your criteria</p>
    </div>
  )
}
