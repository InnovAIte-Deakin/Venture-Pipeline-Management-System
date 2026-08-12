"use client"

import type { ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Save,
  CheckCircle,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Laptop,
  Accessibility,
  Database,
  Download,
  Upload,
} from "lucide-react"

type SaveStatus = "idle" | "saving" | "saved" | "error"

interface UserProfile {
  name: string
  email: string
  twoFactorEnabled: boolean
}

interface PasswordFields {
  current: string
  new: string
  confirm: string
}

interface NotificationSettings {
  emailAlerts: boolean
  inAppNotifications: boolean
  pushNotifications: boolean
  frequency: "instant" | "daily" | "weekly"
}

interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large" | "extra-large"
  highContrast: boolean
  reduceMotion: boolean
  screenReader: boolean
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  accentColor: string
  compactMode: boolean
  showAnimations: boolean
}

interface DataSettings {
  autoBackup: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
  dataRetention: "30" | "90" | "365" | "unlimited"
  exportFormat: "json" | "csv" | "xml"
}

interface AccountSettingsFormsProps {
  userProfile: UserProfile
  password: PasswordFields
  profileSaveStatus: SaveStatus
  passwordSaveStatus: SaveStatus
  onUserProfileChange: (profile: UserProfile) => void
  onPasswordChange: (password: PasswordFields) => void
  onProfileUpdate: () => void
  onPasswordUpdate: () => void
}

export function AccountSettingsForms({
  userProfile,
  password,
  profileSaveStatus,
  passwordSaveStatus,
  onUserProfileChange,
  onPasswordChange,
  onProfileUpdate,
  onPasswordUpdate,
}: AccountSettingsFormsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={userProfile.name}
              onChange={(e) => onUserProfileChange({ ...userProfile, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userProfile.email}
              onChange={(e) => onUserProfileChange({ ...userProfile, email: e.target.value })}
            />
          </div>
          <Button onClick={onProfileUpdate} className="bg-teal-600 hover:bg-teal-700">
            {profileSaveStatus === "saving" ? (
              "Saving..."
            ) : profileSaveStatus === "saved" ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : profileSaveStatus === "error" ? (
              <AlertCircle className="h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {profileSaveStatus === "saved" ? "Saved!" : profileSaveStatus === "error" ? "Error" : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account security settings.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={password.current}
              onChange={(e) => onPasswordChange({ ...password, current: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password.new}
              onChange={(e) => onPasswordChange({ ...password, new: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={password.confirm}
              onChange={(e) => onPasswordChange({ ...password, confirm: e.target.value })}
            />
          </div>
          <Button onClick={onPasswordUpdate} className="bg-teal-600 hover:bg-teal-700">
            {passwordSaveStatus === "saving" ? (
              "Saving..."
            ) : passwordSaveStatus === "saved" ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : passwordSaveStatus === "error" ? (
              <AlertCircle className="h-4 w-4 mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {passwordSaveStatus === "saved"
              ? "Password Changed!"
              : passwordSaveStatus === "error"
                ? "Error Changing Password"
                : "Change Password"}
          </Button>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Label htmlFor="two-factor">Two-Factor Authentication</Label>
            <Switch
              id="two-factor"
              checked={userProfile.twoFactorEnabled}
              onCheckedChange={(checked) => onUserProfileChange({ ...userProfile, twoFactorEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

interface AppearanceSettingsFormProps {
  appearanceSettings: AppearanceSettings
  appearanceSaveStatus: SaveStatus
  onAppearanceSettingsChange: (settings: AppearanceSettings) => void
  onAppearanceUpdate: () => void
}

export function AppearanceSettingsForm({
  appearanceSettings,
  appearanceSaveStatus,
  onAppearanceSettingsChange,
  onAppearanceUpdate,
}: AppearanceSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize the appearance of your application.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={appearanceSettings.theme === "light" ? "default" : "outline"}
                onClick={() => onAppearanceSettingsChange({ ...appearanceSettings, theme: "light" })}
                className="flex flex-col gap-2 h-20"
              >
                <Sun className="h-5 w-5" />
                Light
              </Button>
              <Button
                variant={appearanceSettings.theme === "dark" ? "default" : "outline"}
                onClick={() => onAppearanceSettingsChange({ ...appearanceSettings, theme: "dark" })}
                className="flex flex-col gap-2 h-20"
              >
                <Moon className="h-5 w-5" />
                Dark
              </Button>
              <Button
                variant={appearanceSettings.theme === "system" ? "default" : "outline"}
                onClick={() => onAppearanceSettingsChange({ ...appearanceSettings, theme: "system" })}
                className="flex flex-col gap-2 h-20"
              >
                <Laptop className="h-5 w-5" />
                System
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="accent-color"
                type="color"
                value={appearanceSettings.accentColor}
                onChange={(e) => onAppearanceSettingsChange({ ...appearanceSettings, accentColor: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <span className="text-sm text-gray-600">{appearanceSettings.accentColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use smaller spacing and components</p>
            </div>
            <Switch
              id="compact-mode"
              checked={appearanceSettings.compactMode}
              onCheckedChange={(checked) => onAppearanceSettingsChange({ ...appearanceSettings, compactMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-animations">Show Animations</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable smooth transitions and animations</p>
            </div>
            <Switch
              id="show-animations"
              checked={appearanceSettings.showAnimations}
              onCheckedChange={(checked) => onAppearanceSettingsChange({ ...appearanceSettings, showAnimations: checked })}
            />
          </div>
        </div>

        <Button onClick={onAppearanceUpdate} className="bg-teal-600 hover:bg-teal-700">
          {appearanceSaveStatus === "saving" ? (
            "Saving..."
          ) : appearanceSaveStatus === "saved" ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : appearanceSaveStatus === "error" ? (
            <AlertCircle className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {appearanceSaveStatus === "saved" ? "Settings Saved!" : appearanceSaveStatus === "error" ? "Error Saving" : "Save Appearance"}
        </Button>
      </CardContent>
    </Card>
  )
}

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
        <Button onClick={onNotificationUpdate} className="bg-teal-600 hover:bg-teal-700">
          {notificationSaveStatus === "saving" ? (
            "Saving..."
          ) : notificationSaveStatus === "saved" ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : notificationSaveStatus === "error" ? (
            <AlertCircle className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {notificationSaveStatus === "saved"
            ? "Settings Saved!"
            : notificationSaveStatus === "error"
              ? "Error Saving Settings"
              : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  )
}

interface AccessibilitySettingsFormProps {
  accessibilitySettings: AccessibilitySettings
  accessibilitySaveStatus: SaveStatus
  onAccessibilitySettingsChange: (settings: AccessibilitySettings) => void
  onAccessibilityUpdate: () => void
}

export function AccessibilitySettingsForm({
  accessibilitySettings,
  accessibilitySaveStatus,
  onAccessibilitySettingsChange,
  onAccessibilityUpdate,
}: AccessibilitySettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure accessibility options to improve usability.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select
              value={accessibilitySettings.fontSize}
              onValueChange={(value) =>
                onAccessibilitySettingsChange({
                  ...accessibilitySettings,
                  fontSize: value as AccessibilitySettings["fontSize"],
                })
              }
            >
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (14px)</SelectItem>
                <SelectItem value="medium">Medium (16px)</SelectItem>
                <SelectItem value="large">Large (18px)</SelectItem>
                <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Increase contrast for better visibility</p>
            </div>
            <Switch
              id="high-contrast"
              checked={accessibilitySettings.highContrast}
              onCheckedChange={(checked) => onAccessibilitySettingsChange({ ...accessibilitySettings, highContrast: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="reduce-motion">Reduce Motion</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minimize animations and transitions</p>
            </div>
            <Switch
              id="reduce-motion"
              checked={accessibilitySettings.reduceMotion}
              onCheckedChange={(checked) => onAccessibilitySettingsChange({ ...accessibilitySettings, reduceMotion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="screen-reader">Screen Reader Optimization</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Optimize interface for screen readers</p>
            </div>
            <Switch
              id="screen-reader"
              checked={accessibilitySettings.screenReader}
              onCheckedChange={(checked) => onAccessibilitySettingsChange({ ...accessibilitySettings, screenReader: checked })}
            />
          </div>
        </div>

        <Button onClick={onAccessibilityUpdate} className="bg-teal-600 hover:bg-teal-700">
          {accessibilitySaveStatus === "saving" ? (
            "Saving..."
          ) : accessibilitySaveStatus === "saved" ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : accessibilitySaveStatus === "error" ? (
            <AlertCircle className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {accessibilitySaveStatus === "saved" ? "Settings Saved!" : accessibilitySaveStatus === "error" ? "Error Saving" : "Save Accessibility"}
        </Button>
      </CardContent>
    </Card>
  )
}

interface DataManagementFormProps {
  dataSettings: DataSettings
  dataSaveStatus: SaveStatus
  onDataSettingsChange: (settings: DataSettings) => void
  onDataExport: () => void
  onDataImport: (event: ChangeEvent<HTMLInputElement>) => void
}

export function DataManagementForm({
  dataSettings,
  dataSaveStatus,
  onDataSettingsChange,
  onDataExport,
  onDataImport,
}: DataManagementFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your data, backups, and exports.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Backup Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-backup">Auto Backup</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup your data</p>
              </div>
              <Switch
                id="auto-backup"
                checked={dataSettings.autoBackup}
                onCheckedChange={(checked) => onDataSettingsChange({ ...dataSettings, autoBackup: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select
                value={dataSettings.backupFrequency}
                onValueChange={(value) =>
                  onDataSettingsChange({
                    ...dataSettings,
                    backupFrequency: value as DataSettings["backupFrequency"],
                  })
                }
              >
                <SelectTrigger id="backup-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention</Label>
              <Select
                value={dataSettings.dataRetention}
                onValueChange={(value) =>
                  onDataSettingsChange({
                    ...dataSettings,
                    dataRetention: value as DataSettings["dataRetention"],
                  })
                }
              >
                <SelectTrigger id="data-retention">
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Export & Import</h3>

            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select
                value={dataSettings.exportFormat}
                onValueChange={(value) =>
                  onDataSettingsChange({
                    ...dataSettings,
                    exportFormat: value as DataSettings["exportFormat"],
                  })
                }
              >
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Button onClick={onDataExport} className="w-full" variant="outline">
                {dataSaveStatus === "saving" ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </>
                )}
              </Button>

              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  onChange={onDataImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Data Privacy Notice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your data is stored locally and encrypted. Exports contain sensitive information - handle with care.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
