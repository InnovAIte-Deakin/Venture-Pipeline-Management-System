import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date (or ISO string) as a short relative time string,
 * e.g. "Just now", "2 hours ago", "3 days ago".
 */
export function formatTimeAgo(date: Date | string): string {
  const then = typeof date === "string" ? new Date(date) : date
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000)

  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
}
