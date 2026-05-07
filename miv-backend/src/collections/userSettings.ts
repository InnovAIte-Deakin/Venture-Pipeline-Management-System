import type { CollectionConfig } from 'payload'

export const UserSettings: CollectionConfig = {
  slug: 'user-settings',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req: { user } }) => {
      if (!user) return false
      return { user: { equals: user.id } }
    },
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, defaultValue: ({ user }) => user?.id },
    { name: 'theme', type: 'select', options: [{ label: 'Dark', value: 'dark' }, { label: 'Light', value: 'light' }] },
  ],
}