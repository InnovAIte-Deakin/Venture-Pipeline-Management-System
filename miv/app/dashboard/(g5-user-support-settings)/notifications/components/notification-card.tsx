import { AlertCircle, Bell, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { notificationsEn } from '../content/notifications.en'
import type { Notification, NotificationType } from '../types/notification'
import { formatNotificationDate, getNotificationBadgeColor } from '../utils/notification-utils'

interface NotificationCardProps {
  notification: Notification
  onMarkRead: (id: string) => void
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
    default:
      return <Bell className="h-5 w-5 text-blue-500" aria-hidden="true" />
  }
}

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  return (
    <Card
      role="listitem"
      className={`${!notification.isRead ? 'border-blue-200 bg-blue-50' : ''}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {notification.title}
                </h3>
                <Badge className={getNotificationBadgeColor(notification.type)}>
                  {notification.type}
                </Badge>
                {!notification.isRead && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {notificationsEn.card.newBadge}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-3">{notification.message}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                  {formatNotificationDate(notification.createdAt)}
                </div>
              </div>
            </div>
          </div>
          {!notification.isRead && (
            <div className="flex w-full items-center gap-2 sm:ml-4 sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="min-h-11"
                onClick={() => onMarkRead(notification.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                {notificationsEn.card.markReadAction}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
