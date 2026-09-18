"use client"

import { useState } from "react"
import { LockKeyhole, Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { PinKeypad } from "./pin-keypad"

export function MobileAppLockScreen({
  onUnlock,
  onReset,
}: {
  onUnlock: (pin: string) => Promise<boolean>
  onReset: () => void
}) {
  const { logout } = useAuth()
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [checking, setChecking] = useState(false)

  const unlock = async () => {
    if (pin.length !== 4 || checking) return

    setChecking(true)
    setError("")
    try {
      const unlocked = await onUnlock(pin)
      if (!unlocked) {
        setAttempts((current) => current + 1)
        setPin("")
        setError("Incorrect PIN. Please try again.")
      }
    } catch {
      setError("The PIN could not be checked. Please try again.")
    } finally {
      setChecking(false)
    }
  }

  const resetAndSignOut = async () => {
    if (!window.confirm("Reset the app PIN on this device and sign out?")) return
    onReset()
    await logout()
  }

  return (
    <main className="fixed inset-0 z-[100] flex min-h-dvh flex-col overflow-y-auto bg-gradient-to-b from-primary/10 via-background to-background px-6 py-8 text-foreground lg:hidden">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <div className="mb-8 text-center">
          <Logo size="lg" className="mx-auto mb-5 h-16 w-16" />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <LockKeyhole className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">App locked</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter your four-digit PIN to continue to the Venture Pipeline dashboard.
          </p>
        </div>

        <PinKeypad value={pin} onChange={setPin} disabled={checking} />

        <div className="mt-5 min-h-10 text-center">
          {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}
          {attempts > 1 && <p className="mt-1 text-xs text-muted-foreground">Failed attempts: {attempts}</p>}
        </div>

        <Button
          type="button"
          onClick={() => void unlock()}
          disabled={pin.length !== 4 || checking}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          {checking && <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />}
          Unlock app
        </Button>

        <button
          type="button"
          onClick={() => void resetAndSignOut()}
          className="mx-auto mt-5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Forgot PIN? Reset and sign out
        </button>
      </div>

      <p className="mx-auto mt-8 max-w-sm text-center text-xs leading-5 text-muted-foreground">
        Your PIN is verified on this device. Account authentication is still required to access protected data.
      </p>
    </main>
  )
}
