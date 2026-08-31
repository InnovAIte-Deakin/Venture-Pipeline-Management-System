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
        <div className="flex items-center justify-between">
          <Label htmlFor="email-alerts">Email Alerts</Label>
          <Switch
            id="email-alerts"
            checked={notificationSettings.emailAlerts}
            onCheckedChange={(checked) =>
              onNotificationSettingsChange({ ...notificationSettings, emailAlerts: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="in-app-notifications">In-App Notifications</Label>
          <Switch
            id="in-app-notifications"
            checked={notificationSettings.inAppNotifications}
            onCheckedChange={(checked) =>
              onNotificationSettingsChange({ ...notificationSettings, inAppNotifications: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <Switch
            id="push-notifications"
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
          className="bg-teal-600 hover:bg-teal-700"
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
