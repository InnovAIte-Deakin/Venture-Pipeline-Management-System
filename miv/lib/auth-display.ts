export interface DisplayUser {
  id?: string | null
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  name?: string | null
  image?: string | null
  role?: string | null
}

export function getDisplayName(user: DisplayUser | null | undefined): string {
  if (!user) return "User"
  const firstLast = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  return firstLast || user.name || user.email || "User"
}

export function getDisplayEmail(user: DisplayUser | null | undefined): string {
  return user?.email || ""
}

export function getInitials(user: DisplayUser | null | undefined): string {
  const name = getDisplayName(user)
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (parts.length > 0) {
    return parts.map((part) => part.charAt(0)).join("").toUpperCase()
  }

  return "U"
}
