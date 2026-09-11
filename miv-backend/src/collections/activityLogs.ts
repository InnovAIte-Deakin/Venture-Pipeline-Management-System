import type { CollectionConfig } from 'payload'
import { isAuthenticated } from '@/access/roles'
import { actorScopedRead } from '@/access/scoping'

export const ActivityLogs: CollectionConfig = {
  slug: 'activityLogs',
  admin: { useAsTitle: 'action' },
  access: {
    // Users see only their own activity; staff see all (matrix §2 / A4).
    read: actorScopedRead,
    create: isAuthenticated,
    // Fully immutable through the API — no update and no delete, admin included (team
    // decision, review round 2). An audit trail an admin can quietly edit or delete is not
    // an audit trail; the actor-forcing hook below only matters if entries can't be altered.
    // Erasure (e.g. a right-to-erasure request touching data logged in `metadata`) is a
    // documented DATABASE-LEVEL procedure, not an admin button — see docs/rbac/RBAC_MATRIX.md.
    update: () => false,
    delete: () => false,
  },
  hooks: {
    // Force the actor to the authenticated user so entries can't be attributed to
    // someone else (review finding #5). Server-initiated writes (no req.user) keep
    // whatever actor they set explicitly.
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.actor = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    // actor is forced to req.user.id by the beforeChange hook above; any client-supplied
    // value is overwritten, so it can't be forged. (create requires auth, so req.user exists.)
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'action', type: 'text', required: true },
    { name: 'entity', type: 'text', required: true },
    { name: 'entityId', type: 'text' },
    // RULE: NO personal data in `metadata`. This collection is immutable (never deleted via
    // the API), so anything logged here has no erasure route. Do not log request bodies,
    // error payloads, or anything that could carry PII / disability data. Keep it to ids,
    // enums, and counts. (Documented in docs/rbac/RBAC_MATRIX.md.)
    { name: 'metadata', type: 'json' },
    { name: 'timestamp', type: 'date', defaultValue: () => new Date().toISOString() },
  ],
}
