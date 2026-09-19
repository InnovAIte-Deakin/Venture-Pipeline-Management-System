import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'
import { founderVentureScopedRead } from '@/access/scoping'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    defaultColumns: ['name', 'status', 'priority', 'progress', 'lead', 'venture'],
    useAsTitle: 'name',
  },
  access: {
    read: founderVentureScopedRead('venture'),
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'not_started',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'On Hold', value: 'on_hold' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
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
    { name: 'progress', type: 'number', defaultValue: 0 },
    { name: 'dueDate', type: 'date' },
    { name: 'startDate', type: 'date' },
    { name: 'completedAt', type: 'date' },
    { name: 'budget', type: 'number' },
    { name: 'tags', type: 'json' },
    { name: 'metadata', type: 'json' },
    { name: 'lead', type: 'relationship', relationTo: 'users', required: true },
    { name: 'venture', type: 'relationship', relationTo: 'ventures' },
    { name: 'members', type: 'relationship', relationTo: 'users', hasMany: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
