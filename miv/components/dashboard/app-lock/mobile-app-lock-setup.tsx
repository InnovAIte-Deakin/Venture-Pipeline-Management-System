"use client"

import { useEffect, useState } from "react"
import { LockKeyhole, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PinKeypad } from "./pin-keypad"

export function MobileAppLockSetup({
  open,
  onOpenChange,
  onComplete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (pin: string) => Promise<void>
}) {
  const [step, setStep] = useState<"create" | "confirm">("create")
  const [pin, setPin] = useState("")
  const [firstPin, setFirstPin] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) {
      setStep("create")
      setPin("")
      setFirstPin("")
      setError("")
      setSaving(false)
    }
  }, [open])

  const continueSetup = async () => {
    setError("")
    if (pin.length !== 4) {
      setError("Enter all four digits before continuing.")
      return
    }

    if (step === "create") {
      setFirstPin(pin)
      setPin("")
      setStep("confirm")
      return
    }

    if (pin !== firstPin) {
      setError("The PINs do not match. Please confirm the same PIN.")
      setPin("")
      return
    }

    setSaving(true)
    try {
      await onComplete(pin)
    } catch {
      setError("The PIN could not be saved on this device. Please try again.")
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !saving && onOpenChange(nextOpen)}>
      <DialogContent className="max-w-sm rounded-3xl border-primary/20 p-6">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole className="h-7 w-7" aria-hidden="true" />
          </div>
          <DialogTitle>{step === "create" ? "Create app PIN" : "Confirm app PIN"}</DialogTitle>
          <DialogDescription>
            {step === "create"
              ? "Choose four digits to protect the mobile dashboard on this device."
              : "Enter the same four digits again to confirm your PIN."}
          </DialogDescription>
        </DialogHeader>

        <PinKeypad value={pin} onChange={setPin} disabled={saving} />

        <div className="min-h-5 text-center text-sm text-destructive" role="alert">
          {error}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={() => void continueSetup()}
            disabled={pin.length !== 4 || saving}
            className="h-11 w-full rounded-xl"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {step === "create" ? "Continue" : "Save PIN and lock"}
          </Button>
        </DialogFooter>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          This device lock adds privacy but does not replace your account password or normal sign-in security.
        </p>
      </DialogContent>
    </Dialog>
  )
}
