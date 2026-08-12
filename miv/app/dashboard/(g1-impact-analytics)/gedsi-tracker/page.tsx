"use client"

import { useGedsiData } from "./hooks/use-gedsi-data"
import { DesktopView } from "./desktop/desktop-view"
import { MobileView } from "./mobile/mobile-view"
import { useEffect, useState } from "react"

export default function Page() {
  const data = useGedsiData()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="container mx-auto p-4 md:p-6">
      {isMobile ? <MobileView data={data} /> : <DesktopView data={data} />}
    </main>
  )
}