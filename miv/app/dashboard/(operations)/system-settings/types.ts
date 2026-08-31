export type SaveStatus = "idle" | "saving" | "saved" | "error"

export interface UserProfile {
  name: string
  email: string
  twoFactorEnabled: boolean
}

export interface PasswordFields {
  current: string
  new: string
  confirm: string
}

export interface NotificationSettings {
  emailAlerts: boolean
  inAppNotifications: boolean
  pushNotifications: boolean
  frequency: "instant" | "daily" | "weekly"
}

export interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large" | "extra-large"
  highContrast: boolean
  reduceMotion: boolean
  screenReader: boolean
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  accentColor: string
  compactMode: boolean
  showAnimations: boolean
}

export interface DataSettings {
  autoBackup: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
  dataRetention: "30" | "90" | "365" | "unlimited"
  exportFormat: "json" | "csv" | "xml"
}

export interface SystemInfo {
  version: string
  buildNumber: string
  lastUpdate: string
  uptime: string
  userAgent: string
}

export interface SystemPerformance {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

export interface HistoricalPerformance {
  month: string
  cpu: number
  memory: number
}
