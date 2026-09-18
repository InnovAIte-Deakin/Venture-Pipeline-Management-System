"use client"

import { useEffect } from "react"
import { Delete } from "lucide-react"
import { cn } from "@/lib/utils"

const PIN_LENGTH = 4
const keypadItems = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "backspace"] as const

export function PinKeypad({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key) && value.length < PIN_LENGTH) {
        event.preventDefault()
        onChange(`${value}${event.key}`)
      } else if (event.key === "Backspace") {
        event.preventDefault()
        onChange(value.slice(0, -1))
      } else if (event.key === "Escape") {
        event.preventDefault()
        onChange("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [disabled, onChange, value])

  const handlePress = (item: (typeof keypadItems)[number]) => {
    if (disabled) return
    if (item === "clear") {
      onChange("")
    } else if (item === "backspace") {
      onChange(value.slice(0, -1))
    } else if (value.length < PIN_LENGTH) {
      onChange(`${value}${item}`)
    }
  }

  return (
    <div className="mx-auto w-full max-w-xs">
      <div
        className="mb-6 flex items-center justify-center gap-4"
        aria-label={`${value.length} of ${PIN_LENGTH} PIN digits entered`}
        aria-live="polite"
      >
        {Array.from({ length: PIN_LENGTH }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-4 w-4 rounded-full border-2 border-primary transition-colors",
              index < value.length ? "bg-primary" : "bg-background",
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3" aria-label="PIN keypad">
        {keypadItems.map((item) => {
          const isAction = item === "clear" || item === "backspace"
          return (
            <button
              key={item}
              type="button"
              disabled={disabled || (item === "backspace" && value.length === 0)}
              onClick={() => handlePress(item)}
              aria-label={item === "backspace" ? "Delete last digit" : item === "clear" ? "Clear PIN" : `Digit ${item}`}
              className={cn(
                "flex h-14 items-center justify-center rounded-2xl border border-border text-lg font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
                isAction
                  ? "bg-muted text-sm text-muted-foreground hover:bg-muted/80"
                  : "bg-card text-foreground hover:border-primary hover:bg-primary/10",
              )}
            >
              {item === "backspace" ? (
                <Delete className="h-5 w-5" aria-hidden="true" />
              ) : item === "clear" ? (
                "Clear"
              ) : (
                item
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
