import React from "react"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="/download.png"
        alt="MIV Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}

export default Logo 