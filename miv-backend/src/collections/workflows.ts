import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    defaultColumns: ['name', 'isActive', 'createdBy', 'createdAt'],
    useAsTitle: 'name',
  },
  access: {
    read: isAuthenticated,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'definition', type: 'json', required: true },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'createdBy', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
