"use client"

import React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Permission, hasEveryPermission, hasPermission } from "@/lib/rbac"

interface RoleGuardProps {
  user?: { role?: string | null } | null
  permissions?: Permission[]
  ownerOnly?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-amber-600" />
        <h1 className="mb-2 text-xl font-semibold text-amber-950">Access denied</h1>
        <p className="mb-4 text-sm text-amber-800">
          Your current role does not have permission to view this area.
        </p>
        <Button asChild variant="outline">
          <a href="/auth/login">Switch account</a>
        </Button>
      </div>
    </div>
  )
}

export function RoleGuard({
  user,
  permissions = [],
  ownerOnly = false,
  fallback = null,
  children,
}: RoleGuardProps) {
  // Frontend checks improve UX only; backend authorization must still enforce sensitive actions.
  const allowed =
    (!ownerOnly || hasPermission(user, "owner:actions")) &&
    hasEveryPermission(user, permissions)

  if (!allowed) return <>{fallback}</>
  return <>{children}</>
}
