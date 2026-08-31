import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

interface FieldErrorProps {
  id: string
  message: ReactNode
}

export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-center space-x-1 text-sm text-red-700 dark:text-red-300"
    >
      <AlertCircle aria-hidden="true" className="h-3 w-3" />
      <span>{message}</span>
    </p>
  )
}
