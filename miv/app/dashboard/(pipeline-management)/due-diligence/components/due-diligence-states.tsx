import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface LoadingStateProps {
  loading: boolean
}

interface ErrorStateProps {
  error: string | null
  onRetry: () => void
}

export function DueDiligenceLoadingState({ loading }: LoadingStateProps) {
  if (!loading) return null

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading due diligence data from database...</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function DueDiligenceErrorState({ error, onRetry }: ErrorStateProps) {
  if (!error) return null

  return (
    <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        <strong>Error:</strong> {error}
        <Button variant="link" className="p-0 h-auto text-red-600 underline ml-2" onClick={onRetry}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}
