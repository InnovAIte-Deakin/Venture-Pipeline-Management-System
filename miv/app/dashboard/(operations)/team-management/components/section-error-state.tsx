import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface SectionErrorStateProps {
  message: string
  onRetry?: () => void
}

export function SectionErrorState({ message, onRetry }: SectionErrorStateProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-700 dark:bg-rose-950/30">
      <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
      <p className="mt-4 text-sm font-medium text-rose-800 dark:text-rose-200">{message}</p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} size="sm">
          Retry
        </Button>
      ) : null}
    </div>
  )
}
