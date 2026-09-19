import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const FundWorkflows: CollectionConfig = {
  slug: 'fundWorkflows',
  admin: {
    defaultColumns: ['name', 'type', 'status', 'priority', 'fund', 'assignee'],
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
    { name: 'status', type: 'text', defaultValue: 'pending' },
    { name: 'priority', type: 'text', defaultValue: 'medium' },
    { name: 'description', type: 'textarea' },
    { name: 'dueDate', type: 'date' },
    { name: 'startDate', type: 'date' },
    { name: 'completedAt', type: 'date' },
    { name: 'assignee', type: 'relationship', relationTo: 'users' },
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
