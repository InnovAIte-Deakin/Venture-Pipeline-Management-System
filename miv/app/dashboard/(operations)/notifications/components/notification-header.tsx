import { CheckCheck, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { notificationsEn } from '../content/notifications.en'

interface NotificationHeaderProps {
  hasUnreadNotifications: boolean
  onRefresh: () => void
  onMarkAllRead: () => void
}

export function NotificationHeader({
  hasUnreadNotifications,
  onRefresh,
  onMarkAllRead,
}: NotificationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-gray-900">{notificationsEn.header.title}</h1>
        <p className="text-gray-600">{notificationsEn.header.description}</p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        <Button className="min-h-11 w-full sm:w-auto" variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          {notificationsEn.header.refreshAction}
        </Button>
        <Button
          className="min-h-11 w-full sm:w-auto"
          variant="outline"
          onClick={onMarkAllRead}
          disabled={!hasUnreadNotifications}
        >
          <CheckCheck className="h-4 w-4 mr-2" aria-hidden="true" />
          {notificationsEn.header.markAllReadAction}
        </Button>
      </div>
    </div>
  )
}
