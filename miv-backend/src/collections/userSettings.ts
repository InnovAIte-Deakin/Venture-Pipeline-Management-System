import type { CollectionConfig } from 'payload'
import { isAuthenticated, adminOnly } from '@/access/roles'
import { ownerScoped } from '@/access/scoping'

export const UserSettings: CollectionConfig = {
  slug: 'user-settings',
  admin: { useAsTitle: 'id' },
  access: {
    // Was any-user-reads/updates-any-user (A5) — now owner-scoped via the `user` field.
    read: ownerScoped('user'),
    create: isAuthenticated,
    update: ownerScoped('user'),
    delete: adminOnly,
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
