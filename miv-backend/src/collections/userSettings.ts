import type { CollectionConfig } from 'payload'

export const UserSettings: CollectionConfig = {
  slug: 'user-settings',
  admin: { useAsTitle: 'id' },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true, // one settings doc per user
    },
    {
      name: 'notifications',
      type: 'group',
      fields: [
        { name: 'emailAlerts', type: 'checkbox', defaultValue: true },
        { name: 'inApp', type: 'checkbox', defaultValue: true },
        { name: 'push', type: 'checkbox', defaultValue: false },
        {
          name: 'frequency',
          type: 'select',
          defaultValue: 'daily',
          options: [
            { label: 'Immediate', value: 'immediate' },
            { label: 'Daily Digest', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
          ],
        },
      ],
    },
  ],
}
