import { AlertCircle, Bell, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { notificationsEn } from '../content/notifications.en'

export function NotificationLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center" role="status" aria-live="polite">
        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" aria-hidden="true" />
        <p className="text-gray-600">{notificationsEn.states.loading}</p>
      </div>
    </div>
  )
}

interface NotificationErrorStateProps {
  message: string
}

export function NotificationErrorState({ message }: NotificationErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-medium text-red-800">{notificationsEn.states.errorHeading}</h3>
          <p className="text-sm text-red-600 mt-1">{message}</p>
        </div>
      </div>
    </div>
  )
}

interface NotificationEmptyStateProps {
  hasActiveFilters: boolean
}

export function NotificationEmptyState({ hasActiveFilters }: NotificationEmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12" role="status" aria-live="polite">
        <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {notificationsEn.states.emptyHeading}
        </h3>
        <p className="text-gray-600">
          {hasActiveFilters
            ? notificationsEn.states.emptyFiltered
            : notificationsEn.states.emptyDefault}
        </p>
      </CardContent>
    </Card>
  )
}
