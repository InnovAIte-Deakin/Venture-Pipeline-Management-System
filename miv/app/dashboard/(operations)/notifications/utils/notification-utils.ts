import type {
  Notification,
  NotificationStatusFilter,
  NotificationSummaryData,
  NotificationType,
  NotificationTypeFilter,
} from '../types/notification'

export function filterNotifications(
  notifications: Notification[],
  searchQuery: string,
  typeFilter: NotificationTypeFilter,
  statusFilter: NotificationStatusFilter
) {
  return notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'read' && notification.isRead) ||
                         (statusFilter === 'unread' && !notification.isRead)

    return matchesSearch && matchesType && matchesStatus
  })
}

export function getNotificationBadgeColor(type: NotificationType) {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-primary/10 text-primary'
  }
}

export function getNotificationSummary(notifications: Notification[]): NotificationSummaryData {
  return {
    total: notifications.length,
    unread: notifications.filter(notification => !notification.isRead).length,
    read: notifications.filter(notification => notification.isRead).length,
    warnings: notifications.filter(notification => notification.type === 'warning').length,
  }
}

export function formatNotificationDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString()
}
