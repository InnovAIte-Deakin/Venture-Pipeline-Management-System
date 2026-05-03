import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user && req.user.role !== 'founder'),
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
