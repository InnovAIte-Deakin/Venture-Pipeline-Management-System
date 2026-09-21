import type { CollectionConfig } from 'payload'
import { adminOnly, isAuthenticated } from '@/access/roles'
import { ownerScoped } from '@/access/scoping'

export const CustomDashboards: CollectionConfig = {
  slug: 'customDashboards',
  admin: {
    defaultColumns: ['name', 'category', 'isPublic', 'isFavorite', 'createdBy'],
    useAsTitle: 'name',
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: ownerScoped('createdBy'),
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'category', type: 'text', required: true },
    { name: 'widgets', type: 'json', required: true },
    { name: 'isPublic', type: 'checkbox', defaultValue: false },
    { name: 'isFavorite', type: 'checkbox', defaultValue: false },
    { name: 'viewCount', type: 'number', defaultValue: 0 },
    { name: 'tags', type: 'json' },
    { name: 'createdBy', type: 'relationship', relationTo: 'users', required: true },
    { name: 'sharedWith', type: 'relationship', relationTo: 'users', hasMany: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
