import React from "react"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-24",
    md: "h-12 w-36",
    lg: "h-16 w-48",
    xl: "h-20 w-60"
  }

  return (
    <div className={`${sizeClasses[size]} ${className} shrink-0 overflow-hidden rounded-md`}>
      <Image
        src="/logo.png"
        alt="MIV Logo"
        width={240}
        height={80}
        sizes="(max-width: 768px) 96px, 144px"
        className="h-full w-full object-contain p-1"
        priority
      />
    </div>
  )
}

export default Logo 
