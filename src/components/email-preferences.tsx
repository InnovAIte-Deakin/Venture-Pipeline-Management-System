/* eslint-disable react/no-unescaped-entities */
/**
 * Email Preferences Component
 * Allows users to control which email notifications they receive
 */

'use client'

import { useCallback, useEffect, useState } from 'react'

interface NotificationPreference {
  WELCOME: boolean
  VENTURE_CREATED: boolean
  VENTURE_UPDATED: boolean
  GEDSI_ALERT: boolean
  FUNDING_OPPORTUNITY: boolean
  SYSTEM_UPDATE: boolean
  REPORT_READY: boolean
  STG_REMINDER: boolean
  WEEKLY_UPDATE: boolean
}

interface EmailPreferencesProps {
  userId: string
  onSave?: (preferences: NotificationPreference) => void
}

const NOTIFICATION_LABELS: Record<keyof NotificationPreference, { label: string; description: string }> = {
  WELCOME: {
    label: 'Welcome Emails',
    description: 'Receive welcome and onboarding emails'
  },
  VENTURE_CREATED: {
    label: 'Venture Created',
    description: 'Notified when a venture is successfully created'
  },
  VENTURE_UPDATED: {
    label: 'Venture Updates',
    description: 'Receive updates when venture details change'
  },
  GEDSI_ALERT: {
    label: 'GEDSI Alerts',
    description: 'Get alerts about GEDSI score changes and issues'
  },
  FUNDING_OPPORTUNITY: {
    label: 'Funding Opportunities',
    description: 'Receive matching funding opportunity notifications'
  },
  SYSTEM_UPDATE: {
    label: 'System Updates',
    description: 'Get notified about platform updates and maintenance'
  },
  REPORT_READY: {
    label: 'Reports Ready',
    description: 'Notified when your reports are ready for download'
  },
  STG_REMINDER: {
    label: 'STG Reminders',
    description: 'Monthly reminders for your STG goals'
  },
  WEEKLY_UPDATE: {
    label: 'Weekly Summaries',
    description: 'Receive weekly summary emails of your activity'
  }
}

export function EmailPreferences({ userId, onSave }: EmailPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreference>({
    WELCOME: true,
    VENTURE_CREATED: true,
    VENTURE_UPDATED: true,
    GEDSI_ALERT: true,
    FUNDING_OPPORTUNITY: true,
    SYSTEM_UPDATE: true,
    REPORT_READY: true,
    STG_REMINDER: true,
    WEEKLY_UPDATE: true
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load preferences on mount
  useEffect(() => {
    loadPreferences()
  }, [userId])

  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/user/${userId}/preferences`)
      if (!response.ok) throw new Error('Failed to load preferences')

      const data = await response.json()
      if (data.notificationPreferences) {
        setPreferences(prev => ({ ...prev, ...data.notificationPreferences }))
      }
    } catch (err) {
      console.error('Error loading preferences:', err)
      setError('Failed to load preferences')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const handleToggle = (key: keyof NotificationPreference) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    setSuccess(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preferences',
          userId,
          preferences
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      setSuccess(true)
      onSave?.(preferences)

      // Show success message for 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving preferences:', err)
      setError(err instanceof Error ? err.message : 'Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleEnableAll = () => {
    const allEnabled = Object.keys(preferences).reduce((acc, key) => {
      acc[key as keyof NotificationPreference] = true
      return acc
    }, {} as NotificationPreference)
    setPreferences(allEnabled)
  }

  const handleDisableAll = () => {
    const allDisabled = Object.keys(preferences).reduce((acc, key) => {
      acc[key as keyof NotificationPreference] = false
      return acc
    }, {} as NotificationPreference)
    setPreferences(allDisabled)
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Email Notification Preferences</h3>
        <p className="text-gray-600 text-sm mb-4">
          Choose which email notifications you'd like to receive. You'll always receive critical system alerts.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
          Preferences saved successfully
        </div>
      )}

      <div className="space-y-3">
        {(Object.keys(preferences) as Array<keyof NotificationPreference>).map(key => (
          <label key={key} className="flex items-start space-x-3 p-3 rounded border hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences[key]}
              onChange={() => handleToggle(key)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {NOTIFICATION_LABELS[key].label}
              </div>
              <div className="text-sm text-gray-600">
                {NOTIFICATION_LABELS[key].description}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleEnableAll}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 disabled:opacity-50"
        >
          Enable All
        </button>
        <button
          onClick={handleDisableAll}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-50"
        >
          Disable All
        </button>
        <div className="flex-1" />
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
        <p className="text-sm text-gray-600">
          You can manage these settings at any time. Some notifications like account security alerts will always be sent regardless of your preferences.
        </p>
      </div>
    </div>
  )
}
