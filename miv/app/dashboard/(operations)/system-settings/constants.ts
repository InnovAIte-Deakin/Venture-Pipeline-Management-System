import type {
  AccessibilitySettings,
  AppearanceSettings,
  DataSettings,
  HistoricalPerformance,
  NotificationSettings,
  PasswordFields,
  SystemInfo,
  SystemPerformance,
  UserProfile,
} from "./types"

export const initialUserProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  twoFactorEnabled: true,
}

export const initialPasswordFields: PasswordFields = {
  current: "",
  new: "",
  confirm: "",
}

export const initialNotificationSettings: NotificationSettings = {
  emailAlerts: true,
  inAppNotifications: true,
  pushNotifications: false,
  frequency: "daily",
}

export const initialAccessibilitySettings: AccessibilitySettings = {
  fontSize: "medium",
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
}

export const initialAppearanceSettings: AppearanceSettings = {
  theme: "system",
  accentColor: "#2563eb",
  compactMode: false,
  showAnimations: true,
}

export const initialDataSettings: DataSettings = {
  autoBackup: true,
  backupFrequency: "weekly",
  dataRetention: "365",
  exportFormat: "json",
}

export const initialSystemInfo: SystemInfo = {
  version: "2.1.0",
  buildNumber: "2024.09.19.001",
  lastUpdate: "2024-09-15",
  uptime: "7 days, 14 hours",
  userAgent: typeof window !== "undefined" ? navigator.userAgent : "Unknown",
}

export const initialSystemPerformance: SystemPerformance = {
  cpuUsage: 45,
  memoryUsage: 60,
  diskUsage: 75,
}

export const initialHistoricalPerformance: HistoricalPerformance[] = [
  { month: "Jan", cpu: 40, memory: 55 },
  { month: "Feb", cpu: 42, memory: 58 },
  { month: "Mar", cpu: 45, memory: 60 },
  { month: "Apr", cpu: 43, memory: 57 },
  { month: "May", cpu: 48, memory: 62 },
  { month: "Jun", cpu: 45, memory: 60 },
]

export const systemPerformanceChartConfig = {
  cpu: {
    label: "CPU Usage",
    color: "hsl(var(--chart-1))",
  },
  memory: {
    label: "Memory Usage",
    color: "hsl(var(--chart-3))",
  },
}
