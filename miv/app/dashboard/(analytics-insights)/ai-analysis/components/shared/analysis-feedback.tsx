import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { AnalysisStatus } from "../../types/ai-analysis.types"
import { getStatusClass } from "../../utils/analysis-utils"

function StatusIcon({ status }: { status: AnalysisStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "processing":
      return <RefreshCw className="h-4 w-4 animate-spin" />
    case "pending":
      return <Clock className="h-4 w-4" />
    case "failed":
      return <AlertTriangle className="h-4 w-4" />
  }
}

export function AnalysisStatusBadge({ status }: { status: AnalysisStatus }) {
  return (
    <Badge className={getStatusClass(status)}>
      <StatusIcon status={status} />
      <span className="ml-1 capitalize">{status}</span>
    </Badge>
  )
}

export function AnalysisLoadingState() {
  return (
    <Card role="status" aria-live="polite">
      <CardContent className="flex min-h-64 items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span>Loading AI analyses...</span>
      </CardContent>
    </Card>
  )
}

export function AnalysisErrorAlert({
  error,
  onRetry,
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Unable to load analyses</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{error}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export function AnalysisEmptyState({
  title,
  description,
  compact = false,
}: {
  title: string
  description: string
  compact?: boolean
}) {
  return (
    <Card>
      <CardContent
        className={`flex flex-col items-center px-6 text-center ${compact ? "py-8" : "py-12"}`}
      >
        <Brain className="mb-3 h-8 w-8 text-muted-foreground" />
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
