import type { CollectionConfig } from 'payload'
import { isAuthenticated, adminOnly } from '@/access/roles'
import { actorScopedRead } from '@/access/scoping'

export const ActivityLogs: CollectionConfig = {
  slug: 'activityLogs',
  admin: { useAsTitle: 'action' },
  access: {
    // Users see only their own activity; staff see all (matrix §2 / A4).
    read: actorScopedRead,
    create: isAuthenticated,
    // Append-only for everyone: no updates. Entries can be deleted only by admin, to keep
    // an erasure path for disability data that may appear in a log (team decision, review
    // round 2 — chosen over full immutability precisely because of right-to-erasure).
    update: () => false,
    delete: adminOnly,
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
    { name: 'metadata', type: 'json' },
    { name: 'timestamp', type: 'date', defaultValue: () => new Date().toISOString() },
  ],
}
