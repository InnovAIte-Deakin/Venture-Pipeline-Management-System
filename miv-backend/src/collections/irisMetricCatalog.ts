import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'

export const IrisMetricCatalog: CollectionConfig = {
  slug: 'irisMetricCatalog',
  admin: {
    defaultColumns: ['code', 'name', 'category', 'subcategory', 'isActive'],
    useAsTitle: 'code',
  },
  access: {
    read: isAuthenticated,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'category', type: 'text' },
    { name: 'subcategory', type: 'text' },
    { name: 'unit', type: 'text' },
    { name: 'definition', type: 'textarea' },
    { name: 'example', type: 'textarea' },
    { name: 'tags', type: 'json' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
