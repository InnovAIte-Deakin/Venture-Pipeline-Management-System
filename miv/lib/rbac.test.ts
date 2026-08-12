import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  ROLES,
  canAccessRoute,
  filterNavItems,
  hasPermission,
  normalizeRole,
} from "./rbac"

describe("frontend RBAC", () => {
  it("normalizes supported auth roles", () => {
    assert.equal(normalizeRole("ADMIN"), ROLES.ADMIN)
    assert.equal(normalizeRole("analyst"), ROLES.ANALYST)
    assert.equal(normalizeRole("GEDSI_ANALYST"), ROLES.ANALYST)
    assert.equal(normalizeRole("user"), ROLES.FOUNDER)
    assert.equal(normalizeRole("OWNER"), ROLES.OWNER)
  })

  it("allows owner-only permissions only for Owner", () => {
    assert.equal(hasPermission({ role: "OWNER" }, "owner:actions"), true)
    assert.equal(hasPermission({ role: "ADMIN" }, "owner:actions"), false)
    assert.equal(hasPermission({ role: "ANALYST" }, "owner:actions"), false)
    assert.equal(hasPermission({ role: "USER" }, "owner:actions"), false)
  })

  it("blocks protected direct routes for roles without access", () => {
    assert.equal(canAccessRoute({ role: "OWNER" }, "/dashboard/system-settings"), true)
    assert.equal(canAccessRoute({ role: "ADMIN" }, "/dashboard/system-settings"), false)
    assert.equal(canAccessRoute({ role: "ANALYST" }, "/dashboard/team-management"), false)
    assert.equal(canAccessRoute({ role: "USER" }, "/dashboard"), false)
    assert.equal(canAccessRoute({ role: "USER" }, "/user-dashboard/documents"), true)
  })

  it("filters hidden navigation items by role", () => {
    const nav = [
      { href: "/dashboard", requiredPermissions: ["dashboard:view" as const] },
      { href: "/dashboard/system-settings", ownerOnly: true },
      { href: "/user-dashboard", requiredPermissions: ["founderDashboard:view" as const] },
    ]

    assert.deepEqual(filterNavItems(nav, { role: "ADMIN" }).map((item) => item.href), [
      "/dashboard",
    ])
    assert.deepEqual(filterNavItems(nav, { role: "OWNER" }).map((item) => item.href), [
      "/dashboard",
      "/dashboard/system-settings",
      "/user-dashboard",
    ])
    assert.deepEqual(filterNavItems(nav, { role: "USER" }).map((item) => item.href), [
      "/user-dashboard",
    ])
  })
})
