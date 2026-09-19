import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrAnalyst } from '@/access/roles'
import { founderVentureScopedRead } from '@/access/scoping'

export const CapitalActivities: CollectionConfig = {
  slug: 'capitalActivities',
  admin: {
    defaultColumns: ['venture', 'type', 'amount', 'currency', 'status', 'date'],
    useAsTitle: 'type',
  },
  access: {
    read: founderVentureScopedRead('venture'),
    create: adminOrAnalyst,
    update: adminOrAnalyst,
    delete: adminOnly,
  },
  fields: [
    { name: 'venture', type: 'relationship', relationTo: 'ventures', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Grant', value: 'grant' },
        { label: 'Debt', value: 'debt' },
        { label: 'Equity', value: 'equity' },
        { label: 'Convertible Note', value: 'convertible_note' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'amount', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'date', type: 'date' },
    { name: 'investorName', type: 'text' },
    { name: 'terms', type: 'json' },
    {
      name: 'legacyPrismaId',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
