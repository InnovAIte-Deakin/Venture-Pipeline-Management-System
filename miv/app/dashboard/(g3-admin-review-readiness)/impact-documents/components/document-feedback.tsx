import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface DocumentFeedbackProps {
  error: string
  success: string
  onDismissError: () => void
  onDismissSuccess: () => void
}

export function DocumentFeedback({ error, success, onDismissError, onDismissSuccess }: DocumentFeedbackProps) {
  return (
    <>
      {error && (
        <div className="mb-6 flex items-start rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
          <AlertCircle className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <p className="min-w-0 flex-1 break-words text-sm text-red-800 sm:text-base">{error}</p>
          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error"
            className="ml-3 rounded text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <XCircle className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-start rounded-lg border border-green-200 bg-green-50 p-4" role="status">
          <CheckCircle className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
          <p className="min-w-0 flex-1 break-words text-sm text-green-800 sm:text-base">{success}</p>
          <button
            type="button"
            onClick={onDismissSuccess}
            aria-label="Dismiss success message"
            className="ml-3 rounded text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <XCircle className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  )
}
