import { Accessibility, Bell, Database, Info, Palette, User } from "lucide-react"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsTabsList() {
  return (
    <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 h-auto p-1">
      <TabsTrigger value="account" className="flex flex-col gap-1 py-3">
        <User className="h-4 w-4" />
        <span className="text-xs">Account</span>
      </TabsTrigger>
      <TabsTrigger value="appearance" className="flex flex-col gap-1 py-3">
        <Palette className="h-4 w-4" />
        <span className="text-xs">Appearance</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex flex-col gap-1 py-3">
        <Bell className="h-4 w-4" />
        <span className="text-xs">Notifications</span>
      </TabsTrigger>
      <TabsTrigger value="accessibility" className="flex flex-col gap-1 py-3">
        <Accessibility className="h-4 w-4" />
        <span className="text-xs">Accessibility</span>
      </TabsTrigger>
      <TabsTrigger value="data" className="flex flex-col gap-1 py-3">
        <Database className="h-4 w-4" />
        <span className="text-xs">Data</span>
      </TabsTrigger>
      <TabsTrigger value="system" className="flex flex-col gap-1 py-3">
        <Info className="h-4 w-4" />
        <span className="text-xs">System</span>
      </TabsTrigger>
    </TabsList>
  )
}
