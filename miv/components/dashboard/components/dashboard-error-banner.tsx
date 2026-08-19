import { AlertCircle } from "lucide-react"

interface DashboardErrorBannerProps {
  message: string
}

export function DashboardErrorBanner({ message }: DashboardErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Data Loading Error</h3>
          <p className="text-sm text-red-600 mt-1">{message}</p>
        </div>
      </div>
    </div>
  )
}
