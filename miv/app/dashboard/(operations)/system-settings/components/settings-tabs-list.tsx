import { Accessibility, Bell, Database, Info, Palette, User } from "lucide-react"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsTabsList() {
  return (
    <TabsList className="flex w-full gap-1 overflow-x-auto bg-gray-100 p-1 dark:bg-gray-800 sm:grid sm:grid-cols-3 lg:grid-cols-6">
      <TabsTrigger value="account" className="min-w-24 shrink-0 flex-col gap-1 py-3 sm:min-w-0">
        <User className="h-4 w-4" />
        <span className="text-xs leading-tight">Account</span>
      </TabsTrigger>
      <TabsTrigger value="appearance" className="min-w-28 shrink-0 flex-col gap-1 py-3 sm:min-w-0">
        <Palette className="h-4 w-4" />
        <span className="text-xs leading-tight">Appearance</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="min-w-32 shrink-0 flex-col gap-1 py-3 sm:min-w-0">
        <Bell className="h-4 w-4" />
        <span className="text-xs leading-tight">Notifications</span>
      </TabsTrigger>
      <TabsTrigger value="accessibility" className="min-w-32 shrink-0 flex-col gap-1 py-3 sm:min-w-0">
        <Accessibility className="h-4 w-4" />
        <span className="text-xs leading-tight">Accessibility</span>
      </TabsTrigger>
      <TabsTrigger value="data" className="min-w-24 shrink-0 flex-col gap-1 py-3 sm:min-w-0">
        <Database className="h-4 w-4" />
        <span className="text-xs leading-tight">Data</span>
      </TabsTrigger>
      <TabsTrigger value="system" className="min-w-24 shrink-0 flex-col gap-1 py-3 sm:min-w-0">
        <Info className="h-4 w-4" />
        <span className="text-xs leading-tight">System</span>
      </TabsTrigger>
    </TabsList>
  )
}
