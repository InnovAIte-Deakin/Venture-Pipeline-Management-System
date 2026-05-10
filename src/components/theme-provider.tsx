"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize and listen to system theme preference
  useEffect(() => {
    setMounted(true)
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleThemeChange = () => {
      // System preference is the source of truth
      setTheme("system")
    }
    
    mediaQuery.addEventListener("change", handleThemeChange)
    return () => mediaQuery.removeEventListener("change", handleThemeChange)
  }, [])

  // Apply theme based on system preference
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const effectiveTheme = systemDark ? "dark" : "light"
    
    setIsDark(effectiveTheme === "dark")

    root.classList.remove("light", "dark")
    root.classList.add(effectiveTheme)
    
    // Also sync data-theme attribute for Payload CMS and other systems
    root.setAttribute("data-theme", effectiveTheme)
  }, [mounted])

  return <ThemeContext.Provider value={{ theme, setTheme, isDark }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
