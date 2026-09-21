"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  clearAppLockRecord,
  createAppLockRecord,
  readAppLockRecord,
  saveAppLockRecord,
  verifyAppLockPin,
} from "./app-lock-storage"
import { MobileAppLockScreen } from "./mobile-app-lock-screen"
import { MobileAppLockSetup } from "./mobile-app-lock-setup"

const MOBILE_QUERY = "(max-width: 1023px)"

interface MobileAppLockContextValue {
  enabled: boolean
  requestLock: () => void
}

const MobileAppLockContext = createContext<MobileAppLockContextValue | null>(null)

export function useMobileAppLock() {
  const context = useContext(MobileAppLockContext)
  if (!context) {
    throw new Error("useMobileAppLock must be used inside MobileAppLockProvider")
  }
  return context
}

export function MobileAppLockProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [locked, setLocked] = useState(false)
  const [setupOpen, setSetupOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const configured = Boolean(readAppLockRecord(window.localStorage))

    setEnabled(configured)
    setIsMobile(mediaQuery.matches)
    setLocked(configured && mediaQuery.matches)
    setReady(true)

    const handleChange = (event: MediaQueryListEvent) => {
      const hasPin = Boolean(readAppLockRecord(window.localStorage))
      setIsMobile(event.matches)
      setEnabled(hasPin)
      setLocked(event.matches && hasPin)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const requestLock = useCallback(() => {
    const configured = Boolean(readAppLockRecord(window.localStorage))
    setEnabled(configured)
    if (configured) {
      setLocked(true)
    } else {
      setSetupOpen(true)
    }
  }, [])

  const completeSetup = useCallback(async (pin: string) => {
    const record = await createAppLockRecord(pin)
    saveAppLockRecord(window.localStorage, record)
    setEnabled(true)
    setSetupOpen(false)
    setLocked(true)
  }, [])

  const unlock = useCallback(async (pin: string) => {
    const record = readAppLockRecord(window.localStorage)
    if (!record) {
      setEnabled(false)
      setLocked(false)
      return true
    }

    const valid = await verifyAppLockPin(pin, record)
    if (valid) setLocked(false)
    return valid
  }, [])

  const reset = useCallback(() => {
    try {
      clearAppLockRecord(window.localStorage)
    } catch {
      // Signing out still protects the account if device storage is unavailable.
    }
    setEnabled(false)
  }, [])

  const value = useMemo(() => ({ enabled, requestLock }), [enabled, requestLock])

  return (
    <MobileAppLockContext.Provider value={value}>
      {!ready ? (
        <div className="min-h-screen bg-background" aria-label="Checking app lock" aria-busy="true" />
      ) : isMobile && locked ? (
        <MobileAppLockScreen onUnlock={unlock} onReset={reset} />
      ) : (
        children
      )}

      {ready && isMobile && (
        <MobileAppLockSetup
          open={setupOpen}
          onOpenChange={setSetupOpen}
          onComplete={completeSetup}
        />
      )}
    </MobileAppLockContext.Provider>
  )
}
