import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const FundLifecyclePhases: CollectionConfig = {
  slug: 'fundLifecyclePhases',
  admin: {
    defaultColumns: ['phase', 'status', 'progress', 'fund', 'startDate'],
    useAsTitle: 'phase',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'phase', type: 'text', required: true },
    { name: 'status', type: 'text', defaultValue: 'not_started' },
    { name: 'startDate', type: 'date' },
    { name: 'completedAt', type: 'date' },
    { name: 'duration', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'progress', type: 'number', defaultValue: 0 },
    { name: 'milestones', type: 'json' },
    { name: 'fund', type: 'relationship', relationTo: 'funds', required: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
