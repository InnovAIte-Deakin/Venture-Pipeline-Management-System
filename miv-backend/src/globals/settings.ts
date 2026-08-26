import type { GlobalConfig } from 'payload'
import { isAuthenticated, adminOnly } from '@/access/roles'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    // Was public read + any-non-founder update (A8) — legacy `user` could flip
    // enableESign / enableSlack. Now auth-only read, admin-only write.
    read: isAuthenticated,
    update: adminOnly,
  },
  fields: [
    { name: 'enableSlack', type: 'checkbox', defaultValue: false },
    { name: 'enableESign', type: 'checkbox', defaultValue: false },
    {
      name: 'locales',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'English (en)', value: 'en' },
        { label: 'Khmer (km)', value: 'km' },
      ],
      defaultValue: ['en', 'km'],
    },
  ],
}
