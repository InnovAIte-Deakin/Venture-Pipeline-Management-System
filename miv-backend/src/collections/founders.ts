import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'
import { founderVentureScopedRead } from '@/access/scoping'

export const Founders: CollectionConfig = {
  slug: 'founders',
  admin: { useAsTitle: 'fullName' },
  access: {
    // Founder sees founder rows for their own venture; staff see all (matrix §2 / A4).
    read: founderVentureScopedRead('venture'),
    // Staff-only (review finding 2): this row is the scoping key, so a founder must not be
    // able to self-create one linking themselves to an arbitrary venture. The intake route
    // creates founders via payload.create with no overrideAccess flag, so it runs privileged
    // and is unaffected — same reasoning as the field-lock comments.
    create: adminOrAnalyst,
    // Was `role !== 'founder'` — allowed the legacy `user` role. Now staff-only.
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  hooks: {
    // Normalise email to lowercase so it matches the (lowercased) session email used for
    // founder venture-scoping — Mongo `equals` is case-sensitive (review note on option b).
    beforeChange: [
      ({ data }) => {
        if (typeof data?.email === 'string') data.email = data.email.toLowerCase()
        return data
      },
    ],
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    // Kept for display only — NO LONGER decides access (see access/scoping.ts).
    { name: 'user', type: 'relationship', relationTo: 'users' },
  ],
}
