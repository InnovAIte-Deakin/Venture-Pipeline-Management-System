"use client"

import { useCallback, useEffect, useState } from 'react'
import type {
  Notification,
  NotificationStatusFilter,
  NotificationTypeFilter,
} from '../types/notification'
import { filterNotifications } from '../utils/notification-utils'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<NotificationStatusFilter>('all')

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      } else {
        throw new Error('Failed to fetch notifications')
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification => notification.id === id ? { ...notification, isRead: true } : notification)
        )
      } else {
        console.error('Error marking notification as read:', response.status)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notification => !notification.isRead)
      const results = await Promise.all(
        unreadNotifications.map(async notification => {
          try {
            const response = await fetch('/api/notifications', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: notification.id, isRead: true })
            })

            if (!response.ok) {
              console.error('Error marking notification as read:', response.status)
              return null
            }

            return notification.id
          } catch (error) {
            console.error('Error marking notification as read:', error)
            return null
          }
        })
      )
      const updatedIds = new Set(results.filter((id): id is string => id !== null))

      if (updatedIds.size > 0) {
        setNotifications(prev =>
          prev.map(notification =>
            updatedIds.has(notification.id)
              ? { ...notification, isRead: true }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const filteredNotifications = filterNotifications(
    notifications,
    searchQuery,
    typeFilter,
    statusFilter
  )

  return {
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
    hasUnreadNotifications: notifications.some(notification => !notification.isRead),
  }
}
