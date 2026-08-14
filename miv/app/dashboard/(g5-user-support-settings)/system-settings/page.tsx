"use client"

import { AlertCircle, RefreshCw } from "lucide-react"

import { Tabs, TabsContent } from "@/components/ui/tabs"

import { AccessibilitySettingsForm } from "./components/forms/accessibility-settings-form"
import { AccountSettingsForms } from "./components/forms/account-settings-forms"
import { AppearanceSettingsForm } from "./components/forms/appearance-settings-form"
import { DataManagementForm } from "./components/forms/data-management-form"
import { NotificationSettingsForm } from "./components/forms/notification-settings-form"
import { SettingsPageHeader } from "./components/settings-page-header"
import { SettingsSearchCard } from "./components/settings-search-card"
import { SettingsTabsList } from "./components/settings-tabs-list"
import { SystemSettingsTab } from "./components/system-settings-tab"
import { useSystemSettings } from "./hooks/use-system-settings"

export default function SystemSettings() {
  const settings = useSystemSettings()

  if (settings.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (settings.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Loading Settings</h3>
            <p className="text-sm text-red-600 mt-1">{settings.error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6">
        <SettingsPageHeader />
        <SettingsSearchCard searchQuery={settings.searchQuery} onSearchQueryChange={settings.setSearchQuery} />

        <Tabs defaultValue="account" className="w-full">
          <SettingsTabsList />

          <TabsContent value="account" className="space-y-6">
            <AccountSettingsForms
              userProfile={settings.userProfile}
              password={settings.password}
              profileSaveStatus={settings.profileSaveStatus}
              passwordSaveStatus={settings.passwordSaveStatus}
              onUserProfileChange={settings.setUserProfile}
              onPasswordChange={settings.setPassword}
              onProfileUpdate={settings.handleProfileUpdate}
              onPasswordUpdate={settings.handlePasswordChange}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettingsForm
              appearanceSettings={settings.appearanceSettings}
              appearanceSaveStatus={settings.appearanceSaveStatus}
              onAppearanceSettingsChange={settings.setAppearanceSettings}
              onAppearanceUpdate={settings.handleAppearanceUpdate}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettingsForm
              notificationSettings={settings.notificationSettings}
              notificationSaveStatus={settings.notificationSaveStatus}
              onNotificationSettingsChange={settings.setNotificationSettings}
              onNotificationUpdate={settings.handleNotificationUpdate}
            />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <AccessibilitySettingsForm
              accessibilitySettings={settings.accessibilitySettings}
              accessibilitySaveStatus={settings.accessibilitySaveStatus}
              onAccessibilitySettingsChange={settings.setAccessibilitySettings}
              onAccessibilityUpdate={settings.handleAccessibilityUpdate}
            />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataManagementForm
              dataSettings={settings.dataSettings}
              dataSaveStatus={settings.dataSaveStatus}
              onDataSettingsChange={settings.setDataSettings}
              onDataExport={settings.handleDataExport}
              onDataImport={settings.handleDataImport}
            />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemSettingsTab
              systemInfo={settings.systemInfo}
              systemPerformance={settings.systemPerformance}
              historicalPerformance={settings.historicalPerformance}
              onRefreshPerformanceData={settings.refreshPerformanceData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
