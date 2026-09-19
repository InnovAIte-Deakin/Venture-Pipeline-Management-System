export const notificationsEn = {
  header: {
    title: 'Notifications',
    description: 'Manage your notifications and alerts',
    refreshAction: 'Refresh',
    markAllReadAction: 'Mark All Read',
  },
  filters: {
    heading: 'Filters',
    searchLabel: 'Search',
    searchPlaceholder: 'Search notifications...',
    typeLabel: 'Type',
    statusLabel: 'Status',
    typeOptions: [
      { value: 'all', label: 'All Types' },
      { value: 'info', label: 'Info' },
      { value: 'success', label: 'Success' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' },
    ],
    statusOptions: [
      { value: 'all', label: 'All Status' },
      { value: 'unread', label: 'Unread' },
      { value: 'read', label: 'Read' },
    ],
  },
  states: {
    loading: 'Loading notifications...',
    errorHeading: 'Error Loading Notifications',
    emptyHeading: 'No Notifications',
    emptyDefault: 'You have no notifications at this time.',
    emptyFiltered: 'No notifications match your current filters.',
  },
  card: {
    newBadge: 'New',
    markReadAction: 'Mark Read',
  },
  summary: {
    heading: 'Notification Summary',
    total: 'Total',
    unread: 'Unread',
    read: 'Read',
    warnings: 'Warnings',
  },
  listLabel: 'Notifications',
} as const
