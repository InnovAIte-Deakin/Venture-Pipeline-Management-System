import type { Access, FieldAccess, Where } from 'payload'

/**
 * RBAC scoping helpers.
 *
 * These implement the list-level "return a Where constraint" pattern (the one
 * Documents.read already uses) so founders see only their own rows rather than a
 * plain allow/deny boolean. See docs/rbac/RBAC_MATRIX.md §2/§4.
 *
 * The founder→venture link is resolved by matching the AUTHENTICATED session email
 * against `founders.email` (which is required + unique). We deliberately do NOT use a
 * `founders.user` relationship: nothing populates it, and it's client-writable, so it
 * would be both empty and forgeable. The session email is trusted and not client-set.
 *
 * Case is normalised on both sides: registration lowercases the user's email, and a
 * beforeChange hook on the founders collection lowercases `founders.email`, so the
 * (case-sensitive on Mongo) `equals` match can't silently miss.
 *
 * (This replaced the broken `founderOfVenture` from ./roles.ts, which mapped
 * `ventures.founders[].user` — an embedded array field with no `user` sub-field.)
 */

export const isStaff = (user: any): boolean =>
  user?.role === 'admin' || user?.role === 'miv_analyst'

/**
 * Venture ids the current founder is linked to, resolved via the founders collection by
 * matching the session email. Uses overrideAccess for this internal lookup (it computes
 * scope; it does not return user-facing data).
 */
export async function ventureIdsForUser(req: any): Promise<string[]> {
  const payload = req?.payload
  const email = req?.user?.email
  if (!payload || !email) return []
  const founders = await payload.find({
    collection: 'founders',
    where: { email: { equals: String(email).toLowerCase() } },
    depth: 0,
    limit: 1000,
    overrideAccess: true,
  })
  return (founders?.docs || [])
    .map((f: any) => (typeof f.venture === 'object' ? f.venture?.id : f.venture))
    .filter(Boolean)
    .map((v: any) => String(v))
}

/**
 * READ access for venture-owned collections: staff see all; a founder sees only rows
 * whose `ventureField` is one of their ventures; everyone else is denied.
 */
export const founderVentureScopedRead =
  (ventureField = 'venture'): Access =>
  async ({ req }) => {
    if (!req.user) return false
    if (isStaff(req.user)) return true
    if ((req.user as any).role !== 'founder') return false
    const ids = await ventureIdsForUser(req)
    if (ids.length === 0) return false
    return { [ventureField]: { in: ids } } as Where
  }

/**
 * READ access for the ventures collection itself: scope on the document id.
 */
export const founderOwnVenturesRead: Access = async ({ req }) => {
  if (!req.user) return false
  if (isStaff(req.user)) return true
  if ((req.user as any).role !== 'founder') return false
  const ids = await ventureIdsForUser(req)
  if (ids.length === 0) return false
  return { id: { in: ids } } as Where
}

/**
 * READ/UPDATE access scoped to the owner via a user-relationship field on the doc.
 * Staff see/act on all; owners on their own; others denied.
 */
export const ownerScoped =
  (ownerField = 'user'): Access =>
  ({ req }) => {
    if (!req.user) return false
    if (isStaff(req.user)) return true
    return { [ownerField]: { equals: req.user.id } } as Where
  }

/**
 * READ access for the users collection itself: staff see all users; any other
 * authenticated user sees only their OWN record (scoped on doc id). This keeps
 * founders from enumerating users while still allowing self-reads — required by
 * Payload's `/api/users/me` and any self-profile view.
 */
export const selfOrStaffRead: Access = ({ req }) => {
  if (!req.user) return false
  if (isStaff(req.user)) return true
  return { id: { equals: req.user.id } } as Where
}

/**
 * READ access for activity logs: staff see all; a user sees only entries they acted on.
 */
export const actorScopedRead: Access = ({ req }) => {
  if (!req.user) return false
  if (isStaff(req.user)) return true
  return { actor: { equals: req.user.id } } as Where
}

// --- Field-level helpers (must return boolean only) ---
export const fieldAdminOnly: FieldAccess = ({ req }) => (req?.user as any)?.role === 'admin'
export const fieldAdminOrAnalyst: FieldAccess = ({ req }) => isStaff(req?.user)
