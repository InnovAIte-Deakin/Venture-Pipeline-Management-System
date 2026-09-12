import { RefreshCw } from "lucide-react"

interface DashboardLoadingStateProps {
  message: string
}

export function DashboardLoadingState({ message }: DashboardLoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
