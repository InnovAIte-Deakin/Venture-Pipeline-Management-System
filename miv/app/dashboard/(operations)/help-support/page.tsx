"use client"

import HelpSupportDesktopScreen from "./screens/HelpSupportDesktopScreen"
import HelpSupportMobileScreen from "./screens/HelpSupportMobileScreen"

export default function HelpSupportPage() {
  return (
    <>
      <div className="hidden lg:block">
        <HelpSupportDesktopScreen />
      </div>
      <div className="block lg:hidden">
        <HelpSupportMobileScreen />
      </div>
    </>
  )
}
