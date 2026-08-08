import type { CollectionConfig } from 'payload'
import { isAuthenticated, adminOnly, adminOrAnalyst } from '@/access/roles'
import { founderVentureScopedRead } from '@/access/scoping'

export const Founders: CollectionConfig = {
  slug: 'founders',
  admin: { useAsTitle: 'fullName' },
  access: {
    // Founder sees founder rows for their own venture; staff see all (matrix §2 / A4).
    read: founderVentureScopedRead('venture'),
    create: isAuthenticated,
    // Was `role !== 'founder'` — allowed the legacy `user` role. Now staff-only.
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { name: 'venture', type: 'relationship', relationTo: 'ventures' as any },
    { name: 'user', type: 'relationship', relationTo: 'users' },
  ],
}
