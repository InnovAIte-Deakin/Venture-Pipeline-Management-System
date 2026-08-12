export const ROLES = {
  ADMIN: "ADMIN",
  ANALYST: "ANALYST",
  FOUNDER: "USER",
  OWNER: "OWNER",
} as const

export type AppRole = (typeof ROLES)[keyof typeof ROLES]

export type Permission =
  | "dashboard:view"
  | "founderDashboard:view"
  | "ventures:create"
  | "ventures:review"
  | "documents:review"
  | "analytics:view"
  | "capital:view"
  | "impact:view"
  | "team:manage"
  | "settings:manage"
  | "testEnvironment:view"
  | "owner:actions"

export interface AuthUserLike {
  role?: string | null
}

export interface GuardedNavItem {
  href?: string
  requiredPermissions?: Permission[]
  ownerOnly?: boolean
  children?: GuardedNavItem[]
}

const ROLE_ALIASES: Record<string, AppRole> = {
  ADMIN: ROLES.ADMIN,
  ANALYST: ROLES.ANALYST,
  GEDSI_ANALYST: ROLES.ANALYST,
  USER: ROLES.FOUNDER,
  FOUNDER: ROLES.FOUNDER,
  OWNER: ROLES.OWNER,
}

export const ROLE_LABELS: Record<AppRole, string> = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.ANALYST]: "Analyst",
  [ROLES.FOUNDER]: "Founder",
  [ROLES.OWNER]: "Owner",
}

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  [ROLES.ADMIN]: [
    "dashboard:view",
    "ventures:create",
    "ventures:review",
    "documents:review",
    "analytics:view",
    "capital:view",
    "impact:view",
    "team:manage",
  ],
  [ROLES.ANALYST]: [
    "dashboard:view",
    "ventures:review",
    "documents:review",
    "analytics:view",
    "impact:view",
  ],
  [ROLES.FOUNDER]: [
    "founderDashboard:view",
    "ventures:create",
  ],
  [ROLES.OWNER]: [
    "dashboard:view",
    "founderDashboard:view",
    "ventures:create",
    "ventures:review",
    "documents:review",
    "analytics:view",
    "capital:view",
    "impact:view",
    "team:manage",
    "settings:manage",
    "testEnvironment:view",
    "owner:actions",
  ],
}

export function normalizeRole(role?: string | null): AppRole | null {
  if (!role) return null
  return ROLE_ALIASES[role.trim().toUpperCase()] ?? null
}

export function getRoleLabel(role?: string | null): string {
  const normalizedRole = normalizeRole(role)
  return normalizedRole ? ROLE_LABELS[normalizedRole] : "User"
}

export function hasRole(user: AuthUserLike | null | undefined, roles: AppRole[]): boolean {
  const role = normalizeRole(user?.role)
  return Boolean(role && roles.includes(role))
}

export function hasPermission(
  user: AuthUserLike | null | undefined,
  permission: Permission,
): boolean {
  const role = normalizeRole(user?.role)
  return Boolean(role && ROLE_PERMISSIONS[role].includes(permission))
}

export function hasEveryPermission(
  user: AuthUserLike | null | undefined,
  permissions: Permission[] = [],
): boolean {
  return permissions.every((permission) => hasPermission(user, permission))
}

export function canAccessRoute(user: AuthUserLike | null | undefined, pathname: string): boolean {
  if (pathname.startsWith("/user-dashboard")) {
    return hasPermission(user, "founderDashboard:view")
  }

  if (pathname === "/venture-intake") {
    return hasPermission(user, "ventures:create")
  }

  if (!pathname.startsWith("/dashboard")) {
    return true
  }

  if (pathname.startsWith("/dashboard/system-settings")) {
    return hasPermission(user, "settings:manage")
  }

  if (pathname.startsWith("/dashboard/test-environment")) {
    return hasPermission(user, "testEnvironment:view")
  }

  if (pathname.startsWith("/dashboard/team-management")) {
    return hasPermission(user, "team:manage")
  }

  if (
    pathname.startsWith("/dashboard/performance-analytics") ||
    pathname.startsWith("/dashboard/ai-analysis") ||
    pathname.startsWith("/dashboard/advanced-reports") ||
    pathname.startsWith("/dashboard/custom-dashboards")
  ) {
    return hasPermission(user, "analytics:view")
  }

  if (
    pathname.startsWith("/dashboard/capital-facilitation") ||
    pathname.startsWith("/dashboard/investment-rounds") ||
    pathname.startsWith("/dashboard/fund-management") ||
    pathname.startsWith("/dashboard/exit-strategy")
  ) {
    return hasPermission(user, "capital:view")
  }

  if (
    pathname.startsWith("/dashboard/gedsi-tracker") ||
    pathname.startsWith("/dashboard/impact-reports") ||
    pathname.startsWith("/dashboard/sustainability") ||
    pathname.startsWith("/dashboard/social-impact") ||
    pathname.startsWith("/dashboard/iris-metrics")
  ) {
    return hasPermission(user, "impact:view")
  }

  if (
    pathname.startsWith("/dashboard/documents") ||
    pathname.startsWith("/dashboard/impact-documents")
  ) {
    return hasPermission(user, "documents:review")
  }

  return hasPermission(user, "dashboard:view")
}

export function filterNavItems<T extends GuardedNavItem>(
  items: T[],
  user: AuthUserLike | null | undefined,
): T[] {
  return items
    .map((item) => {
      const children = item.children ? filterNavItems(item.children, user) : undefined
      return { ...item, children }
    })
    .filter((item) => {
      if (item.ownerOnly && !hasPermission(user, "owner:actions")) return false
      if (item.requiredPermissions && !hasEveryPermission(user, item.requiredPermissions)) {
        return false
      }
      if (!item.href && item.children) return item.children.length > 0
      if (item.href && !canAccessRoute(user, item.href)) return false
      return true
    })
}
