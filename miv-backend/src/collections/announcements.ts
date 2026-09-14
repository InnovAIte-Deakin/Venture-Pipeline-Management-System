import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    defaultColumns: ['title', 'priority', 'isActive', 'expiresAt', 'author'],
    useAsTitle: 'title',
  },
  access: {
    read: isAuthenticated,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'textarea', required: true },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'expiresAt', type: 'date' },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
