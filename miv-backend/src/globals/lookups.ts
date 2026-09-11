import type { GlobalConfig } from 'payload'
import { isAuthenticated, adminOnly } from '@/access/roles'

export const Lookups: GlobalConfig = {
  slug: 'lookups',
  access: {
    // Reference data — was public read; now auth-only. Admin-only write (unchanged).
    read: isAuthenticated,
    update: adminOnly,
  },
  fields: [
    { name: 'sectors', type: 'array', fields: [{ name: 'value', type: 'text', required: true }] },
    {
      name: 'impactAreas',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'countries',
      type: 'array',
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
      ],
    },
    {
      name: 'currencies',
      type: 'array',
      fields: [
        { name: 'code', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
      ],
    },
  ],
}
