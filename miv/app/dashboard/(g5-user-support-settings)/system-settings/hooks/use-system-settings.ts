"use client"

import type { ChangeEvent } from "react"
import { useEffect, useState } from "react"

import { useTheme } from "@/components/theme-provider"

import {
  initialAccessibilitySettings,
  initialAppearanceSettings,
  initialDataSettings,
  initialHistoricalPerformance,
  initialNotificationSettings,
  initialPasswordFields,
  initialSystemInfo,
  initialSystemPerformance,
  initialUserProfile,
} from "../constants"
import type {
  AccessibilitySettings,
  AppearanceSettings,
  DataSettings,
  HistoricalPerformance,
  NotificationSettings,
  PasswordFields,
  SaveStatus,
  SystemInfo,
  SystemPerformance,
  UserProfile,
} from "../types"

const resetStatusDelayMs = 2000

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useSystemSettings() {
  const { setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile)
  const [password, setPassword] = useState<PasswordFields>(initialPasswordFields)
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(initialNotificationSettings)
  const [accessibilitySettings, setAccessibilitySettings] =
    useState<AccessibilitySettings>(initialAccessibilitySettings)
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(initialAppearanceSettings)
  const [dataSettings, setDataSettings] = useState<DataSettings>(initialDataSettings)
  const [systemPerformance, setSystemPerformance] =
    useState<SystemPerformance>(initialSystemPerformance)
  const [historicalPerformance, setHistoricalPerformance] =
    useState<HistoricalPerformance[]>(initialHistoricalPerformance)
  const [systemInfo] = useState<SystemInfo>(initialSystemInfo)
  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>("idle")
  const [passwordSaveStatus, setPasswordSaveStatus] = useState<SaveStatus>("idle")
  const [notificationSaveStatus, setNotificationSaveStatus] = useState<SaveStatus>("idle")
  const [accessibilitySaveStatus, setAccessibilitySaveStatus] = useState<SaveStatus>("idle")
  const [appearanceSaveStatus, setAppearanceSaveStatus] = useState<SaveStatus>("idle")
  const [dataSaveStatus, setDataSaveStatus] = useState<SaveStatus>("idle")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/users/me")
        if (response.ok) {
          const userData = await response.json()
          setUserProfile({
            name: userData.name || "Unknown User",
            email: userData.email || "unknown@example.com",
            twoFactorEnabled: userData.twoFactorEnabled || false,
          })
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError(err instanceof Error ? err.message : "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleProfileUpdate = async () => {
    setProfileSaveStatus("saving")

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
        }),
      })

      setProfileSaveStatus(response.ok ? "saved" : "error")
    } catch {
      setProfileSaveStatus("error")
    } finally {
      setTimeout(() => setProfileSaveStatus("idle"), resetStatusDelayMs)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordSaveStatus("saving")
    await wait(1000)

    if (password.new === password.confirm && password.new !== "") {
      setPasswordSaveStatus("saved")
      setPassword(initialPasswordFields)
    } else {
      setPasswordSaveStatus("error")
    }

    setTimeout(() => setPasswordSaveStatus("idle"), resetStatusDelayMs)
  }

  const handleNotificationUpdate = async () => {
    setNotificationSaveStatus("saving")
    await wait(1000)
    setNotificationSaveStatus("saved")
    setTimeout(() => setNotificationSaveStatus("idle"), resetStatusDelayMs)
  }

  const handleAccessibilityUpdate = async () => {
    setAccessibilitySaveStatus("saving")
    await wait(1000)

    document.documentElement.style.fontSize = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "20px",
    }[accessibilitySettings.fontSize]

    document.documentElement.classList.toggle("high-contrast", accessibilitySettings.highContrast)
    document.documentElement.classList.toggle("reduce-motion", accessibilitySettings.reduceMotion)

    setAccessibilitySaveStatus("saved")
    setTimeout(() => setAccessibilitySaveStatus("idle"), resetStatusDelayMs)
  }

  const handleAppearanceUpdate = async () => {
    setAppearanceSaveStatus("saving")
    await wait(1000)

    setTheme(appearanceSettings.theme)
    document.documentElement.style.setProperty("--accent-color", appearanceSettings.accentColor)
    document.documentElement.classList.toggle("compact-mode", appearanceSettings.compactMode)

    setAppearanceSaveStatus("saved")
    setTimeout(() => setAppearanceSaveStatus("idle"), resetStatusDelayMs)
  }

  const handleDataExport = async () => {
    setDataSaveStatus("saving")
    await wait(1500)

    const exportData = {
      userProfile,
      notificationSettings,
      accessibilitySettings,
      appearanceSettings,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `miv-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    setDataSaveStatus("saved")
    setTimeout(() => setDataSaveStatus("idle"), resetStatusDelayMs)
  }

  const handleDataImport = async (event: ChangeEvent<HTMLInputElement>) => {
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
    } catch (err) {
      console.error("Import failed:", err)
      setDataSaveStatus("error")
    }

    setTimeout(() => setDataSaveStatus("idle"), resetStatusDelayMs)
    event.target.value = ""
  }

  const refreshPerformanceData = async () => {
    await wait(500)

    setSystemPerformance({
      cpuUsage: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
      memoryUsage: Math.floor(Math.random() * (90 - 40 + 1)) + 40,
      diskUsage: Math.floor(Math.random() * (95 - 50 + 1)) + 50,
    })

    const newMonth = new Date().toLocaleString("en-US", { month: "short" })
    setHistoricalPerformance((previousPerformance) => [
      ...previousPerformance.slice(1),
      { month: newMonth, cpu: systemPerformance.cpuUsage, memory: systemPerformance.memoryUsage },
    ])
  }

  return {
    searchQuery,
    setSearchQuery,
    userProfile,
    setUserProfile,
    password,
    setPassword,
    notificationSettings,
    setNotificationSettings,
    accessibilitySettings,
    setAccessibilitySettings,
    appearanceSettings,
    setAppearanceSettings,
    dataSettings,
    setDataSettings,
    systemInfo,
    systemPerformance,
    historicalPerformance,
    profileSaveStatus,
    passwordSaveStatus,
    notificationSaveStatus,
    accessibilitySaveStatus,
    appearanceSaveStatus,
    dataSaveStatus,
    loading,
    error,
    handleProfileUpdate,
    handlePasswordChange,
    handleNotificationUpdate,
    handleAccessibilityUpdate,
    handleAppearanceUpdate,
    handleDataExport,
    handleDataImport,
    refreshPerformanceData,
  }
}
