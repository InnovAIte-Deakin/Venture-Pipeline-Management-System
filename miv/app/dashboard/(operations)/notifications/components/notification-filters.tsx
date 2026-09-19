import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { notificationsEn } from '../content/notifications.en'
import type { NotificationStatusFilter, NotificationTypeFilter } from '../types/notification'

interface NotificationFiltersProps {
  searchQuery: string
  typeFilter: NotificationTypeFilter
  statusFilter: NotificationStatusFilter
  onSearchChange: (value: string) => void
  onTypeChange: (value: NotificationTypeFilter) => void
  onStatusChange: (value: NotificationStatusFilter) => void
}

export function NotificationFilters({
  searchQuery,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
}: NotificationFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{notificationsEn.filters.heading}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="notifications-search" className="text-sm font-medium mb-2 block">
              {notificationsEn.filters.searchLabel}
            </label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              <Input
                id="notifications-search"
                placeholder={notificationsEn.filters.searchPlaceholder}
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="notifications-type" className="text-sm font-medium mb-2 block">
              {notificationsEn.filters.typeLabel}
            </label>
            <Select
              value={typeFilter}
              onValueChange={(value) => onTypeChange(value as NotificationTypeFilter)}
            >
              <SelectTrigger id="notifications-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationsEn.filters.typeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="notifications-status" className="text-sm font-medium mb-2 block">
              {notificationsEn.filters.statusLabel}
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => onStatusChange(value as NotificationStatusFilter)}
            >
              <SelectTrigger id="notifications-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notificationsEn.filters.statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
