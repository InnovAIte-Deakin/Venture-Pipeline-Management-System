import { AlertCircle, CheckCircle, RefreshCw, Save } from "lucide-react"

import type { SaveStatus } from "../../types"

interface SaveStatusContentProps {
  status: SaveStatus
  idleLabel: string
  savedLabel: string
  errorLabel: string
  savingLabel?: string
}

export function SaveStatusContent({
  status,
  idleLabel,
  savedLabel,
  errorLabel,
  savingLabel = "Saving...",
}: SaveStatusContentProps) {
  if (status === "saving") {
    return (
      <>
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        {savingLabel}
      </>
    )
  }

  if (status === "saved") {
    return (
      <>
        <CheckCircle className="h-4 w-4 mr-2" />
        {savedLabel}
      </>
    )
  }

  if (status === "error") {
    return (
      <>
        <AlertCircle className="h-4 w-4 mr-2" />
        {errorLabel}
      </>
    )
  }

  return (
    <>
      <Save className="h-4 w-4 mr-2" />
      {idleLabel}
    </>
  )
}

interface SaveStatusMessageProps {
  status: SaveStatus
  savedMessage: string
  errorMessage: string
  savingMessage?: string
}

export function SaveStatusMessage({
  status,
  savedMessage,
  errorMessage,
  savingMessage = "Saving changes...",
}: SaveStatusMessageProps) {
  if (status === "idle") {
    return null
  }

  const messageStyles = {
    saving: "text-gray-600 dark:text-gray-400",
    saved: "text-emerald-700 dark:text-emerald-300",
    error: "text-red-700 dark:text-red-300",
  }

  const Icon = status === "saved" ? CheckCircle : status === "error" ? AlertCircle : RefreshCw
  const message = status === "saved" ? savedMessage : status === "error" ? errorMessage : savingMessage

  return (
    <p className={`flex items-center gap-2 text-sm ${messageStyles[status]}`} role="status" aria-live="polite">
      <Icon className={`h-4 w-4 ${status === "saving" ? "animate-spin" : ""}`} />
      {message}
    </p>
  )
}
