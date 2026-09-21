import { notificationsEn } from '../content/notifications.en'
import type { Notification } from '../types/notification'
import { NotificationCard } from './notification-card'
import { NotificationEmptyState } from './notification-states'

interface NotificationListProps {
  notifications: Notification[]
  hasActiveFilters: boolean
  onMarkRead: (id: string) => void
}

export function NotificationList({
  notifications,
  hasActiveFilters,
  onMarkRead,
}: NotificationListProps) {
  return (
    <div
      className="space-y-4"
      role={notifications.length > 0 ? 'list' : undefined}
      aria-label={notifications.length > 0 ? notificationsEn.listLabel : undefined}
    >
      {notifications.length === 0 ? (
        <NotificationEmptyState hasActiveFilters={hasActiveFilters} />
      ) : (
        notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))
      )}
    </div>
  )
}
