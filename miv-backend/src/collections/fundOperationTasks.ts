import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const FundOperationTasks: CollectionConfig = {
  slug: 'fundOperationTasks',
  admin: {
    defaultColumns: ['title', 'type', 'status', 'priority', 'fund', 'assignee'],
    useAsTitle: 'title',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'type', type: 'text', defaultValue: 'operational' },
    { name: 'status', type: 'text', defaultValue: 'pending' },
    { name: 'priority', type: 'text', defaultValue: 'medium' },
    { name: 'dueDate', type: 'date' },
    { name: 'completedAt', type: 'date' },
    { name: 'assignee', type: 'relationship', relationTo: 'users' },
    { name: 'creator', type: 'relationship', relationTo: 'users', required: true },
    { name: 'fund', type: 'relationship', relationTo: 'funds' },
    { name: 'workflow', type: 'relationship', relationTo: 'fundWorkflows' },
    { name: 'tags', type: 'json' },
    { name: 'attachments', type: 'json' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
