"use client"

import { AlertCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ImpactReportsErrorProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

export function ImpactReportsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="space-y-6 p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full max-w-sm rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-44 rounded-xl bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="h-96 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-96 rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ImpactReportsError({
  message,
  onRetry,
  isRetrying = false,
}: ImpactReportsErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <div className="flex min-w-0 items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-medium">Some impact data could not be loaded</p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full shrink-0 border-amber-300 bg-white/70 sm:w-auto dark:border-amber-800 dark:bg-gray-900/60"
        onClick={onRetry}
        disabled={isRetrying}
      >
        <RefreshCw
          className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
        />
        {isRetrying ? "Retrying..." : "Try Again"}
      </Button>
    </div>
  )
}
