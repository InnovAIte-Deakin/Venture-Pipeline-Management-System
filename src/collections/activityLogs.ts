import type { CollectionConfig } from 'payload'

export const ActivityLogs: CollectionConfig = {
  slug: 'activityLogs',
  admin: { useAsTitle: 'action' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),
  },
  fields: [
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'action', type: 'text', required: true },
    { name: 'entity', type: 'text', required: true },
    { name: 'entityId', type: 'text' },
    { name: 'metadata', type: 'json' },
    { name: 'timestamp', type: 'date', defaultValue: () => new Date().toISOString() },
  ],
}
