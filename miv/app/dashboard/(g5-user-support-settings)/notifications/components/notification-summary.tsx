import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notificationsEn } from '../content/notifications.en'
import type { NotificationSummaryData } from '../types/notification'

interface NotificationSummaryProps {
  summary: NotificationSummaryData
}

export function NotificationSummary({ summary }: NotificationSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{notificationsEn.summary.heading}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
            <div className="text-sm text-gray-600">{notificationsEn.summary.total}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.unread}</div>
            <div className="text-sm text-gray-600">{notificationsEn.summary.unread}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.read}</div>
            <div className="text-sm text-gray-600">{notificationsEn.summary.read}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
            <div className="text-sm text-gray-600">{notificationsEn.summary.warnings}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
