"use client"

import { NotificationFilters } from './components/notification-filters'
import { NotificationHeader } from './components/notification-header'
import { NotificationList } from './components/notification-list'
import {
  NotificationErrorState,
  NotificationLoadingState,
} from './components/notification-states'
import { NotificationSummary } from './components/notification-summary'
import { useNotifications } from './hooks/use-notifications'
import { getNotificationSummary } from './utils/notification-utils'

export default function NotificationsPage() {
  const {
    notifications,
    filteredNotifications,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    hasUnreadNotifications,
  } = useNotifications()

  if (loading) {
    return <NotificationLoadingState />
  }

  if (error) {
    return <NotificationErrorState message={error} />
  }

  const hasActiveFilters = Boolean(searchQuery) || typeFilter !== 'all' || statusFilter !== 'all'
  const summary = getNotificationSummary(notifications)

  return (
    <div className="space-y-6">
      <NotificationHeader
        hasUnreadNotifications={hasUnreadNotifications}
        onRefresh={fetchNotifications}
        onMarkAllRead={markAllAsRead}
      />

      <NotificationFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
      />

      <NotificationList
        notifications={filteredNotifications}
        hasActiveFilters={hasActiveFilters}
        onMarkRead={markAsRead}
      />

      <NotificationSummary summary={summary} />
    </div>
  )
}
