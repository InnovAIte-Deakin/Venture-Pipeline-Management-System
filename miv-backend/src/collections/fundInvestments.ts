import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const FundInvestments: CollectionConfig = {
  slug: 'fundInvestments',
  admin: {
    defaultColumns: ['fund', 'venture', 'amount', 'date', 'type', 'status'],
    useAsTitle: 'type',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'fund', type: 'relationship', relationTo: 'funds', required: true },
    { name: 'venture', type: 'relationship', relationTo: 'ventures' },
    { name: 'amount', type: 'number', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'status', type: 'text', required: true },
    { name: 'exitDate', type: 'date' },
    { name: 'exitAmount', type: 'number' },
    { name: 'exitMultiple', type: 'number' },
    { name: 'currentValue', type: 'number' },
    { name: 'notes', type: 'textarea' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
