import type { ReactNode } from "react"

interface MobileTabsViewportProps {
  children: ReactNode
}

export function MobileTabsViewport({ children }: MobileTabsViewportProps) {
  return (
    <div className="overflow-x-auto md:overflow-visible">
      {children}
    </div>
  )
}
