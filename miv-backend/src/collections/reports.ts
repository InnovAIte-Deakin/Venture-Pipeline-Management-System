import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    defaultColumns: ['name', 'type', 'status', 'generatedAt', 'creator', 'fund'],
    useAsTitle: 'name',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'status', type: 'text', defaultValue: 'draft' },
    { name: 'description', type: 'textarea' },
    { name: 'filePath', type: 'text' },
    { name: 'fileSize', type: 'number' },
    { name: 'generatedAt', type: 'date' },
    { name: 'publishedAt', type: 'date' },
    { name: 'periodStart', type: 'date' },
    { name: 'periodEnd', type: 'date' },
    { name: 'creator', type: 'relationship', relationTo: 'users', required: true },
    { name: 'fund', type: 'relationship', relationTo: 'funds' },
    { name: 'metadata', type: 'json' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
