import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst, isAuthenticated } from '@/access/roles'

export const WorkflowRuns: CollectionConfig = {
  slug: 'workflowRuns',
  admin: {
    defaultColumns: ['workflow', 'status', 'startedAt', 'finishedAt'],
    useAsTitle: 'status',
  },
  access: {
    read: isAuthenticated,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'workflow', type: 'relationship', relationTo: 'workflows', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Running', value: 'running' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'input', type: 'json' },
    { name: 'output', type: 'json' },
    { name: 'errorMessage', type: 'textarea' },
    { name: 'startedAt', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'finishedAt', type: 'date' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
