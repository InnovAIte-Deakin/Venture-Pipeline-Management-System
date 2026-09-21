import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'

export const Distributions: CollectionConfig = {
  slug: 'distributions',
  admin: {
    defaultColumns: ['distributionNumber', 'amount', 'date', 'type', 'status', 'fund'],
    useAsTitle: 'distributionNumber',
  },
  access: {
    read: adminOrAnalyst,
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'distributionNumber', type: 'text', required: true },
    { name: 'amount', type: 'number', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'status', type: 'text', defaultValue: 'pending' },
    { name: 'source', type: 'text' },
    { name: 'sourceVentures', type: 'json' },
    { name: 'taxImplications', type: 'textarea' },
    { name: 'withholding', type: 'number', defaultValue: 0 },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'exchangeRate', type: 'number', defaultValue: 1 },
    { name: 'paymentMethod', type: 'text' },
    { name: 'taxReporting', type: 'checkbox', defaultValue: false },
    { name: 'k1Generated', type: 'checkbox', defaultValue: false },
    { name: 'recordDate', type: 'date' },
    { name: 'exDate', type: 'date' },
    { name: 'lpsPaid', type: 'number', defaultValue: 0 },
    { name: 'totalLps', type: 'number', required: true },
    { name: 'fund', type: 'relationship', relationTo: 'funds', required: true },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
