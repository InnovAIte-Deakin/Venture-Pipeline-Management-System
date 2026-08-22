"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import {
  User,
  Bell,
  Cpu,
  HardDrive,
  MemoryStickIcon as Memory,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Search,
  Palette,
  Accessibility,
  Database,
  Download,
  Upload,
  Info,
  Shield,
  Globe,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Laptop,
  Eye,
  Type,
  Volume2,
  Wifi,
  Settings,
  HelpCircle,
  FileText,
  Clock,
  RotateCcw,
  BarChart3,
} from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// --- Interfaces ---
interface UserProfile {
  name: string
  email: string
  twoFactorEnabled: boolean
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

interface SystemInfo {
  version: string
  buildNumber: string
  lastUpdate: string
  uptime: string
  userAgent: string
}

interface SystemPerformance {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

interface HistoricalPerformance {
  month: string
  cpu: number
  memory: number
}

// --- Initial Data ---
const initialUserProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  twoFactorEnabled: true,
}

const initialNotificationSettings: NotificationSettings = {
  emailAlerts: true,
  inAppNotifications: true,
  pushNotifications: false,
  frequency: "daily",
}

const initialAccessibilitySettings: AccessibilitySettings = {
  fontSize: "medium",
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
}

const initialAppearanceSettings: AppearanceSettings = {
  theme: "system",
  accentColor: "#2563eb",
  compactMode: false,
  showAnimations: true,
}

const initialDataSettings: DataSettings = {
  autoBackup: true,
  backupFrequency: "weekly",
  dataRetention: "365",
  exportFormat: "json",
}

const initialSystemInfo: SystemInfo = {
  version: "2.1.0",
  buildNumber: "2024.09.19.001",
  lastUpdate: "2024-09-15",
  uptime: "7 days, 14 hours",
  userAgent: typeof window !== 'undefined' ? navigator.userAgent : "Unknown",
}

const initialSystemPerformance: SystemPerformance = {
  cpuUsage: 45,
  memoryUsage: 60,
  diskUsage: 75,
}

const initialHistoricalPerformance: HistoricalPerformance[] = [
  { month: "Jan", cpu: 40, memory: 55 },
  { month: "Feb", cpu: 42, memory: 58 },
  { month: "Mar", cpu: 45, memory: 60 },
  { month: "Apr", cpu: 43, memory: 57 },
  { month: "May", cpu: 48, memory: 62 },
  { month: "Jun", cpu: 45, memory: 60 },
]

const chartConfig = {
  cpu: {
    label: "CPU Usage",
    color: "hsl(var(--chart-1))", // teal
  },
  memory: {
    label: "Memory Usage",
    color: "hsl(var(--chart-3))", // blue
  },
}

export default function SystemSettings() {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile)
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" })
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings)
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(initialAccessibilitySettings)
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(initialAppearanceSettings)
  const [dataSettings, setDataSettings] = useState<DataSettings>(initialDataSettings)
  const [systemPerformance, setSystemPerformance] = useState<SystemPerformance>(initialSystemPerformance)
  const [historicalPerformance, setHistoricalPerformance] = useState<HistoricalPerformance[]>(initialHistoricalPerformance)
  const [systemInfo] = useState<SystemInfo>(initialSystemInfo)
  
  // Status states
  const [profileSaveStatus, setProfileSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [passwordSaveStatus, setPasswordSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [notificationSaveStatus, setNotificationSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [accessibilitySaveStatus, setAccessibilitySaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [appearanceSaveStatus, setAppearanceSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [dataSaveStatus, setDataSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch current user data
      const response = await fetch('/api/users/me')
      if (response.ok) {
        const userData = await response.json()
        setUserProfile({
          name: userData.name || 'Unknown User',
          email: userData.email || 'unknown@example.com',
          twoFactorEnabled: userData.twoFactorEnabled || false
        })
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    setProfileSaveStatus("saving")
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email
        })
      })

      if (response.ok) {
        setProfileSaveStatus("saved")
        setTimeout(() => setProfileSaveStatus("idle"), 2000)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setProfileSaveStatus("error")
      setTimeout(() => setProfileSaveStatus("idle"), 2000)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordSaveStatus("saving")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (password.new === password.confirm && password.new !== "") {
      setPasswordSaveStatus("saved")
      setPassword({ current: "", new: "", confirm: "" })
    } else {
      setPasswordSaveStatus("error")
    }
    setTimeout(() => setPasswordSaveStatus("idle"), 2000)
  }

  const handleNotificationUpdate = async () => {
    setNotificationSaveStatus("saving")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setNotificationSaveStatus("saved")
    setTimeout(() => setNotificationSaveStatus("idle"), 2000)
  }

  const handleAccessibilityUpdate = async () => {
    setAccessibilitySaveStatus("saving")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Apply accessibility settings to document
    document.documentElement.style.fontSize = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "20px"
    }[accessibilitySettings.fontSize]
    
    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    
    if (accessibilitySettings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
    
    setAccessibilitySaveStatus("saved")
    setTimeout(() => setAccessibilitySaveStatus("idle"), 2000)
  }

  const handleAppearanceUpdate = async () => {
    setAppearanceSaveStatus("saving")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Update theme
    setTheme(appearanceSettings.theme)
    
    // Apply appearance settings
    document.documentElement.style.setProperty("--accent-color", appearanceSettings.accentColor)
    
    if (appearanceSettings.compactMode) {
      document.documentElement.classList.add("compact-mode")
    } else {
      document.documentElement.classList.remove("compact-mode")
    }
    
    setAppearanceSaveStatus("saved")
    setTimeout(() => setAppearanceSaveStatus("idle"), 2000)
  }

  const handleDataExport = async () => {
    setDataSaveStatus("saving")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const exportData = {
      userProfile,
      notificationSettings,
      accessibilitySettings,
      appearanceSettings,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miv-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setDataSaveStatus("saved")
    setTimeout(() => setDataSaveStatus("idle"), 2000)
  }

  const handleDataImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setDataSaveStatus("saving")
    
    try {
      const text = await file.text()
      const importedData = JSON.parse(text)
      
      if (importedData.userProfile) setUserProfile(importedData.userProfile)
      if (importedData.notificationSettings) setNotificationSettings(importedData.notificationSettings)
      if (importedData.accessibilitySettings) setAccessibilitySettings(importedData.accessibilitySettings)
      if (importedData.appearanceSettings) setAppearanceSettings(importedData.appearanceSettings)
      
      setDataSaveStatus("saved")
    } catch (error) {
      console.error('Import failed:', error)
      setDataSaveStatus("error")
    }
    
    setTimeout(() => setDataSaveStatus("idle"), 2000)
    event.target.value = ''
  }

  const refreshPerformanceData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSystemPerformance({
      cpuUsage: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
      memoryUsage: Math.floor(Math.random() * (90 - 40 + 1)) + 40,
      diskUsage: Math.floor(Math.random() * (95 - 50 + 1)) + 50,
    })
    
    const newMonth = new Date().toLocaleString("en-US", { month: "short" })
    setHistoricalPerformance((prev) => [
      ...prev.slice(1),
      { month: newMonth, cpu: systemPerformance.cpuUsage, memory: systemPerformance.memoryUsage },
    ])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Loading Settings</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your application preferences and configurations</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="account" className="w-full">
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

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
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
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  />
                </div>
                <Button onClick={handleProfileUpdate} className="bg-teal-600 hover:bg-teal-700">
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
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password.new}
                    onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  />
                </div>
                <Button onClick={handlePasswordChange} className="bg-teal-600 hover:bg-teal-700">
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
                    onCheckedChange={(checked) => setUserProfile({ ...userProfile, twoFactorEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
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
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "light" })}
                        className="flex flex-col gap-2 h-20"
                      >
                        <Sun className="h-5 w-5" />
                        Light
                      </Button>
                      <Button
                        variant={appearanceSettings.theme === "dark" ? "default" : "outline"}
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "dark" })}
                        className="flex flex-col gap-2 h-20"
                      >
                        <Moon className="h-5 w-5" />
                        Dark
                      </Button>
                      <Button
                        variant={appearanceSettings.theme === "system" ? "default" : "outline"}
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "system" })}
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
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, accentColor: e.target.value })}
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
                      onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, compactMode: checked })}
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
                      onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, showAnimations: checked })}
                    />
                  </div>
                </div>
                
                <Button onClick={handleAppearanceUpdate} className="bg-teal-600 hover:bg-teal-700">
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
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
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
                      setNotificationSettings({ ...notificationSettings, emailAlerts: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                  <Switch
                    id="in-app-notifications"
                    checked={notificationSettings.inAppNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, inAppNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Notification Frequency</Label>
                  <Select
                    value={notificationSettings.frequency}
                    onValueChange={(value) =>
                      setNotificationSettings({
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
                <Button onClick={handleNotificationUpdate} className="bg-teal-600 hover:bg-teal-700">
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
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-6">
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
                        setAccessibilitySettings({
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
                      onCheckedChange={(checked) => setAccessibilitySettings({ ...accessibilitySettings, highContrast: checked })}
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
                      onCheckedChange={(checked) => setAccessibilitySettings({ ...accessibilitySettings, reduceMotion: checked })}
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
                      onCheckedChange={(checked) => setAccessibilitySettings({ ...accessibilitySettings, screenReader: checked })}
                    />
                  </div>
                </div>
                
                <Button onClick={handleAccessibilityUpdate} className="bg-teal-600 hover:bg-teal-700">
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
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-6">
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
                        onCheckedChange={(checked) => setDataSettings({ ...dataSettings, autoBackup: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select
                        value={dataSettings.backupFrequency}
                        onValueChange={(value) =>
                          setDataSettings({
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
                          setDataSettings({
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
                          setDataSettings({
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
                      <Button onClick={handleDataExport} className="w-full" variant="outline">
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
                          onChange={handleDataImport}
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
          </TabsContent>

          {/* System Information Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-medium">Version</span>
                      <Badge variant="secondary">{systemInfo.version}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-medium">Build Number</span>
                      <span className="text-sm text-gray-600">{systemInfo.buildNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-medium">Last Update</span>
                      <span className="text-sm text-gray-600">{systemInfo.lastUpdate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-medium">Uptime</span>
                      <span className="text-sm text-gray-600">{systemInfo.uptime}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Support
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Changelog
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center">
                      <Cpu className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {systemPerformance.cpuUsage}%
                      </div>
                      <p className="text-sm text-gray-600">CPU Usage</p>
                      <Progress value={systemPerformance.cpuUsage} className="h-2 mt-2" />
                      <Badge 
                        variant={systemPerformance.cpuUsage > 80 ? "destructive" : systemPerformance.cpuUsage > 60 ? "secondary" : "default"}
                        className="mt-2"
                      >
                        {systemPerformance.cpuUsage > 80 ? "High" : systemPerformance.cpuUsage > 60 ? "Medium" : "Normal"}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Memory className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {systemPerformance.memoryUsage}%
                      </div>
                      <p className="text-sm text-gray-600">Memory Usage</p>
                      <Progress value={systemPerformance.memoryUsage} className="h-2 mt-2" />
                      <Badge 
                        variant={systemPerformance.memoryUsage > 80 ? "destructive" : systemPerformance.memoryUsage > 60 ? "secondary" : "default"}
                        className="mt-2"
                      >
                        {systemPerformance.memoryUsage > 80 ? "High" : systemPerformance.memoryUsage > 60 ? "Medium" : "Normal"}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <HardDrive className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {systemPerformance.diskUsage}%
                      </div>
                      <p className="text-sm text-gray-600">Disk Usage</p>
                      <Progress value={systemPerformance.diskUsage} className="h-2 mt-2" />
                      <Badge 
                        variant={systemPerformance.diskUsage > 80 ? "destructive" : systemPerformance.diskUsage > 60 ? "secondary" : "default"}
                        className="mt-2"
                      >
                        {systemPerformance.diskUsage > 80 ? "High" : systemPerformance.diskUsage > 60 ? "Medium" : "Normal"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={refreshPerformanceData} variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical Performance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Historical Performance
                  </CardTitle>
                  <Badge variant="outline">Last 6 months</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        domain={[0, 100]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stroke="var(--color-cpu)"
                        fill="var(--color-cpu)"
                        fillOpacity={0.3}
                        name="CPU Usage"
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stroke="var(--color-memory)"
                        fill="var(--color-memory)"
                        fillOpacity={0.3}
                        name="Memory Usage"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
