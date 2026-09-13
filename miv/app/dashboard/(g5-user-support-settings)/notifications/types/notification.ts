export type NotificationType = 'info' | 'warning' | 'success' | 'error'

export type NotificationTypeFilter = 'all' | NotificationType

export type NotificationStatusFilter = 'all' | 'read' | 'unread'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  userId: string
}

export interface NotificationSummaryData {
  total: number
  unread: number
  read: number
  warnings: number
}
