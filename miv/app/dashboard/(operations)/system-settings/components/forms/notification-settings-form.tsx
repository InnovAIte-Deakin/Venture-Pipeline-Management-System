import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { NotificationSettings, SaveStatus } from "../../types"
import { SaveStatusContent, SaveStatusMessage } from "./save-status-content"

interface NotificationSettingsFormProps {
  notificationSettings: NotificationSettings
  notificationSaveStatus: SaveStatus
  onNotificationSettingsChange: (settings: NotificationSettings) => void
  onNotificationUpdate: () => void
}

export function NotificationSettingsForm({
  notificationSettings,
  notificationSaveStatus,
  onNotificationSettingsChange,
  onNotificationUpdate,
}: NotificationSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize how you receive alerts and updates.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="email-alerts" className="min-w-0 leading-snug">
            Email Alerts
          </Label>
          <Switch
            id="email-alerts"
            className="shrink-0"
            checked={notificationSettings.emailAlerts}
            onCheckedChange={(checked) =>
              onNotificationSettingsChange({ ...notificationSettings, emailAlerts: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="in-app-notifications" className="min-w-0 leading-snug">
            In-App Notifications
          </Label>
          <Switch
            id="in-app-notifications"
            className="shrink-0"
            checked={notificationSettings.inAppNotifications}
            onCheckedChange={(checked) =>
              onNotificationSettingsChange({ ...notificationSettings, inAppNotifications: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="push-notifications" className="min-w-0 leading-snug">
            Push Notifications
          </Label>
          <Switch
            id="push-notifications"
            className="shrink-0"
            checked={notificationSettings.pushNotifications}
            onCheckedChange={(checked) =>
              onNotificationSettingsChange({ ...notificationSettings, pushNotifications: checked })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notification-frequency">Notification Frequency</Label>
          <Select
            value={notificationSettings.frequency}
            onValueChange={(value) =>
              onNotificationSettingsChange({
                ...notificationSettings,
                frequency: value as NotificationSettings["frequency"],
              })
            }
          >
            <SelectTrigger id="notification-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onNotificationUpdate}
          disabled={notificationSaveStatus === "saving"}
          className="bg-primary hover:bg-primary"
        >
          <SaveStatusContent
            status={notificationSaveStatus}
            idleLabel="Save Preferences"
            savedLabel="Settings Saved!"
            errorLabel="Error Saving Settings"
          />
        </Button>
        <SaveStatusMessage
          status={notificationSaveStatus}
          savedMessage="Notification preferences saved successfully."
          errorMessage="Notification preferences could not be saved."
        />
      </CardContent>
    </Card>
  )
}
